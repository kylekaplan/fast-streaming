"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

function generateId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type Message = {
  id: string;
  role: "user" | "AI";
  parts: string[];
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      adjustHeight();
    }
  }, [input]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const aiMsgId = generateId();
    setMessages((prev) => [
      ...prev,
      { id: generateId(), role: "user", parts: [input] },
      { id: aiMsgId, role: "AI", parts: [] },
    ]);

    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ask?question=${encodeURIComponent(
        input
      )}`
    );

    eventSource.onmessage = (event) => {
      try {
        console.log("event:", event);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, parts: [...msg.parts, event.data] }
              : msg
          )
        );
      } catch (error) {
        console.error("Error processing message:", error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiMsgId
              ? { ...msg, parts: [...msg.parts, "Error processing response"] }
              : msg
          )
        );
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === aiMsgId
            ? { ...msg, parts: [...msg.parts, "Error connecting to server"] }
            : msg
        )
      );
      eventSource.close();
      setIsLoading(false);
    };

    eventSource.addEventListener("end", () => {
      eventSource.close();
      setIsLoading(false);
    });

    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto min-h-screen pb-24">
      <div className="flex-1 space-y-4 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh] text-center space-y-4">
            <h1 className="text-3xl font-bold">Welcome to AI Chat</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
              Ask me anything and I&apos;ll do my best to answer.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-muted dark:bg-zinc-800 rounded-bl-none"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {message.parts.join(" ")}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                className="pr-12 min-h-14 max-h-40 resize-none rounded-xl"
                value={input}
                onChange={handleInputChange}
                placeholder={
                  isLoading ? "AI is thinking..." : "Send a message..."
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  type="submit"
                  size="icon"
                  variant={isLoading ? "outline" : "default"}
                  disabled={!input.trim()}
                  className="rounded-full h-8 w-8"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
