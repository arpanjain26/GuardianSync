# GuardianSync

AI-assisted SCADA cybersecurity simulation platform for real-time command analysis, anomaly detection, and operational oversight.

## Overview

GuardianSync simulates industrial command traffic, scores it with an AI engine, and routes risky actions through policy rules and human approval. The system combines a React dashboard, a Node/Express API with Socket.io, and a FastAPI-based anomaly detector backed by MongoDB audit logs.

## Key Capabilities

- Real-time packet stream with AI-enriched telemetry
- Command console with rule-based blocking and approval workflows
- Kill switch and maintenance window controls
- Multi-industry templates with live node graph updates
- Forensic vault for alerts and command history
- **[NEW]** Multi-factor Authentication (OTP) with real SMTP email delivery
- **[NEW]** Single Sign-On (SSO) with Google OAuth

## Architecture

```
React SPA (Vite, :5173)
  | REST + Socket.io
  v
Express API (Node, :5000) ---- MongoDB (localhost:27017/guardiansync)
  |
  v
FastAPI AI Engine (:8000)
```

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.10+
- MongoDB running locally on mongodb://localhost:27017
- Gmail account with App Password (for SMTP)
- Google Cloud Console project (for OAuth Client ID)

### Install

```bash
npm run install:all
cd ai-engine && pip install -r requirements.txt
```

### Seed Demo Data (Optional)

```bash
npm run dev:server
node scripts/seed-mock-data.js
```

The seed script creates an admin user (admin / admin123) if it does not exist.

### Train the Model (Optional)

```bash
cd ai-engine
python -c "from app.train import train_model; train_model()"
```

### Start Services

```bash
# AI Engine
npm run dev:ai

# Server
npm run dev:server

# Client
npm run dev:client
```

Open http://localhost:5173

## Configuration

Server environment variables are loaded from `.env` at the repo root.
Client environment variables are loaded from `client/.env`.

| Variable | Location | Purpose |
| --- | --- | --- |
| `PORT` | root | Express server port (5000) |
| `MONGODB_URI` | root | Mongo connection string |
| `JWT_SECRET` | root | JWT signing key |
| `JWT_EXPIRES_IN` | root | Token TTL (e.g., `24h`) |
| `AI_ENGINE_URL` | root | FastAPI base URL |
| `CORS_ORIGIN` | root | Allowed origin (e.g., `http://localhost:5173`) |
| `GOOGLE_CLIENT_ID` | root | Google OAuth Client ID for token verification |
| `SMTP_USER` | root | Gmail address for sending OTP emails |
| `SMTP_PASS` | root | Gmail App Password for SMTP authentication |
| `VITE_GOOGLE_CLIENT_ID` | client | Google OAuth Client ID for frontend Google button |

## Authentication Flow

GuardianSync features enhanced, production-grade security for operations:
- **Two-Factor Authentication (2FA)**: Login requires a 6-digit OTP sent to the user's registered email via `nodemailer` using real SMTP delivery.
- **Google OAuth**: Users can bypass OTP by signing in securely using their Google Workspace accounts via the Google Identity Services popup (`@react-oauth/google`). Tokens are securely verified on the backend via the `google-auth-library`.

## AI Behavior Notes

- The AI engine enforces hard limit checks before model scoring.
- If the AI engine is unavailable, the server falls back to PASS with a low confidence and logs the reason for manual review.

## Tech Stack (Current)

**Frontend**: React 18.2, Vite 5.0, Tailwind CSS 3.4, Redux Toolkit 2.0, React Router 6.21, Radix UI, React Flow 11.10, Recharts 2.10, Framer Motion 10.16, GSAP 3.15, Socket.io-client 4.7, `@react-oauth/google`, `lucide-react`

**Backend**: Node.js, Express 4.18, Socket.io 4.7, MongoDB + Mongoose 8.0, JWT 9.0, Zod 3.22, Helmet 7.1, CORS 2.8, express-rate-limit 7.1, Axios 1.6, fast-xml-parser 4.4, Morgan 1.10, `nodemailer`, `google-auth-library`

**AI Engine**: Python 3.10+, FastAPI 0.104, Uvicorn 0.24, scikit-learn 1.3, pandas 2.1, NumPy 1.26, joblib 1.3, Pydantic 2.5, python-dotenv 1.0, httpx 0.25

## Documentation

See the `docs` folder for architecture, API contracts, demo flow, technology overview, and the hackathon pitch.

## Disclaimer

GuardianSync is a simulation-first platform intended for demos and architecture validation. Production deployment would require rigorous security review, operational safety validation, and compliance hardening.