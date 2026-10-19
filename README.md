# Vanik-web

Vanik marketplace web application (React frontend + Express/MongoDB backend).

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [MongoDB](https://www.mongodb.com/) running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

## Backend (`server/`)

1. Copy environment file:

   ```bash
   cp server/.env.example server/.env
   ```

2. Edit `server/.env`: set `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT` / `CORS_ORIGIN`.

3. Install and run:

   ```bash
   cd server
   npm install
   npm run dev
   ```

   API base URL defaults to `http://localhost:5000`. Health check: `GET /api/health`.

## Frontend (`frontend/`)

1. Optional: copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL` if the API is not on `http://localhost:5000`.

2. Install and run:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open [http://localhost:5173](http://localhost:5173).

Sign up and sign in call the backend when it is running. Chat messages for a bid use the API when you are logged in with a JWT and open chat with a `bidId` query (otherwise the demo still uses `localStorage`).

## Project layout

- `frontend/` — Vite + React (JSX)
- `server/` — Express, Mongoose, JWT auth, REST messages API
