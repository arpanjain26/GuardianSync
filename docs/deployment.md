# Deployment Guide

GuardianSync is deployed as three services:

1. **Client**: React/Vite on Vercel.
2. **Server**: Express and Socket.IO on a persistent Node host such as Render, Railway, or Fly.io.
3. **AI engine**: FastAPI on a persistent Python host such as Render, Railway, or Fly.io.

Vercel is suitable for the client, but its serverless functions are not suitable for this server because Socket.IO connections, the SCADA interval, and background jobs require a persistent process.

## Repository Layout

- `GuardianSync-client`: contents of `client/`
- `GuardianSync-server`: contents of `server/`
- `GuardianSync-ai`: contents of `ai-engine/`

Only `.env.example` files are committed. Never commit `.env`, client `.env`, database credentials, OAuth secrets, SMTP credentials, model artifacts, `node_modules`, or build output.

## Deployment Order

### 1. Deploy AI

Create a Python service from `GuardianSync-ai`.

- Build: `pip install -r requirements.txt`
- Start: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`
- Environment: `AI_CORS_ORIGINS` with the final client and server URLs.

The service trains the detector at startup if model artifacts are not present.

### 2. Deploy Server

Create a Node service from `GuardianSync-server`.

- Build: `npm install`
- Start: `npm start`
- Health check: `/api/health`

Set the variables from `server/.env.example`. Use the cloud MongoDB URI, the deployed AI URL, the deployed client URL as `CORS_ORIGIN`, a new `JWT_SECRET`, and the real OAuth/SMTP values.

The server URL must support WebSockets because the client uses Socket.IO for live packets and alerts.

### 3. Deploy Client on Vercel

Import `GuardianSync-client` into Vercel. The included `vercel.json` preserves React Router routes.

- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`

Set these Vercel environment variables:

- `VITE_API_URL=https://<server-domain>/api`
- `VITE_SOCKET_URL=https://<server-domain>`
- `VITE_GOOGLE_CLIENT_ID=<Google client ID>`

After the client URL is known, update the server `CORS_ORIGIN` and AI `AI_CORS_ORIGINS` values if necessary, then redeploy those services.

## MongoDB Atlas

Add the deployment server's outbound access to the Atlas Network Access allowlist. For an initial deployment, `0.0.0.0/0` works but should be restricted later. Store the URI only in the server provider's secret environment settings.

## Verification

1. Open `<server-domain>/api/health`.
2. Open `<ai-domain>/health` and confirm `model_loaded` is `true`.
3. Open the Vercel client and verify login, live packet updates, alerts, and command approval.
4. Confirm browser WebSocket traffic connects to the server domain.
