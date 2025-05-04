# Fast Streaming Chat

This project uses Next.js for the frontend and FastAPI for the backend with a streaming response system.

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

The frontend can be deployed on Vercel, and the backend can be deployed on services like Render, Railway, or other Python-friendly hosting platforms.

For the backend deployment, make sure to:
- Set the host to `0.0.0.0` and use the provided port variable
- Update the `NEXT_PUBLIC_API_URL` in your frontend deployment to point to your backend URL
