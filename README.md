# Fast Streaming Chat

This project uses Next.js for the frontend and FastAPI for the backend (located in the api folder in the root directory).

## Installation and Setup

Follow these steps to set up the project locally:

1. **Install Node.js dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

2. **Environment Variables**
   - Create a new file called `.env.local` in the project root
   - Add the following variables to this file:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:8000
     ```

3. **Python Backend Setup**
   - Create and activate a virtual environment
     ```bash
     python -m venv venv
     
     source venv/bin/activate
     ```
   - Install Python dependencies
     ```bash
     pip install -r requirements.txt
     ```

## Running in Development Mode

Run the development server with:

```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

This will start both the Next.js frontend and FastAPI backend concurrently.

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8000](http://localhost:8000)
- API Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)

## Deployment

This project requires a split deployment approach:

### Backend Deployment

1. Deploy the FastAPI backend to a Python-friendly service like Render or Railway
2. Use these settings:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn api.index:app --host 0.0.0.0 --port $PORT`

### Frontend Deployment (Vercel)
1. Deploy the Next.js frontend to Vercel
2. Set environment variables on Vercel:
   - `NEXT_PUBLIC_API_URL`: URL to your backend API

