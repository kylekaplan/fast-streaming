import asyncio
import json
import os

import faiss
import numpy as np
from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from sentence_transformers import SentenceTransformer

sbert = SentenceTransformer("all-MiniLM-L6-v2")


async def embed_texts(texts: list[str]) -> np.ndarray:
    loop = asyncio.get_event_loop()
    # returns a (n_texts, dim) np.ndarray
    return await loop.run_in_executor(None, sbert.encode, texts)


def normalize_embs(embs: np.ndarray) -> np.ndarray:
    norms = np.linalg.norm(embs, axis=1, keepdims=True)
    return embs / np.clip(norms, 1e-8, None)


def load_json(path: str) -> list[dict]:
    with open(path, "r") as f:
        return json.load(f)


def build_faiss_index(embs: np.ndarray) -> faiss.Index:
    dim = embs.shape[1]
    # inner-product index over normalized vectors = cosine-sim search
    idx = faiss.IndexFlatIP(dim)
    idx.add(embs)
    return idx

app = FastAPI()

questions: list[dict]
embeddings: np.ndarray
index: faiss.Index


@app.on_event("startup")
async def load_embeddings_event():
    global questions, embeddings, index
    questions = load_json("api/Questions.json")
    # compute raw embeddings
    raw_embs = await embed_texts([q["question"] for q in questions])
    # normalize for cosine
    norm_embs = normalize_embs(raw_embs)
    embeddings = norm_embs
    # build FAISS index
    index = build_faiss_index(norm_embs)
    print(f"[startup] indexed {len(questions)} questions, dim={embeddings.shape[1]}")


#  get so that the frontend can use EventSource api
@app.get("/api/ask")
async def ask(request: Request):
    question = request.query_params.get("question")
    print(question)
    # embed + normalize the incoming question
    q_raw = await embed_texts([question])
    q_emb = normalize_embs(q_raw)[0:1]  # shape (1, dim)

    # find nearest question
    k = 1
    D, I = index.search(q_emb, k)
    score = float(D[0][0])
    best_idx = int(I[0][0])

    # send error if no good match
    if score < 0.7:
        async def event_stream():
            yield "data: Sorry, I'm not sure how to answer that.\n\n"
            yield "event: end\ndata: []\n\n"
        return StreamingResponse(
            event_stream(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Access-Control-Allow-Origin": "*",
            },
        )

    answer = questions[best_idx]["answer"]

    # SSE stream each word
    async def event_stream():
        for word in answer.split():
            yield f"data: {word}\n\n"
            await asyncio.sleep(0.1)
        yield "event: end\ndata: []\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.get("/api/hello")
async def hello():
    return {"message": "Hello, world!"}
