# GuardianSync Architecture

## System Overview

GuardianSync is a three-tier, real-time cybersecurity simulation platform for industrial command traffic:

1. **Client** (React SPA, port 5173) — operator and admin dashboard
2. **Server** (Express API + Socket.io, port 5000) — workflow orchestration, auth, simulation
3. **AI Engine** (FastAPI, port 8000) — anomaly detection and explainability

```
React SPA (Vite, :5173)
  | REST + Socket.io
  v
Express API (Node, :5000) ---- MongoDB (localhost:27017/guardiansync)
  |
  v
FastAPI AI Engine (:8000)
```

---

## Core Responsibilities

### Client
- Authenticated dashboard with role-based controls (admin / operator)
- Real-time event stream rendering (packets, alerts, approvals)
- Industry map visualization (React Flow) and command console
- Google OAuth SSO login and email OTP (2FA) support
- Threat timeline charts (Recharts) and animated transitions (Framer Motion, GSAP)

### Server
- JWT auth, RBAC, and Zod request validation
- Command scoring, rule evaluation, and approval workflow
- SCADA simulator and background jobs (configurable interval)
- Socket.io broadcasting to industry-scoped rooms
- Email OTP delivery via Nodemailer (real SMTP)
- Google OAuth token verification via google-auth-library
- Forensic log export (JSON) and alert stats

### AI Engine
- Hard-limit rule checks before ML scoring (e.g., pressure > 200 PSI → instant block)
- IsolationForest anomaly detection (250 trees, trained on normal data only)
- MLP neural network ensemble (32→16 hidden layers, supervised)
- Weighted ensemble: 60% IsolationForest + 40% MLP
- Explainability generation — flags specific sensor readings with values and normal ranges
- Simulation endpoint — generates normal or attack SCADA readings on demand

---

## Data Flows

### Command Submission
1. Client submits a command to `POST /api/commands`
2. Server validates payload (Zod) and checks kill switch state
3. Server calls AI Engine `POST /predict`
4. Rule engine evaluates parameter rules and command catalog risk
5. Decision outcomes:
   - `approved` — safe commands, low anomaly score
   - `pending` — score ≥ 0.6 or maintenance window active (requires human approval)
   - `blocked` — score ≥ 0.75 or hard-limit violation or unknown command
6. Command is logged to MongoDB, alert created when blocked or pending
7. Socket.io emits `command:result` and optionally `alert:new` events

### SCADA Simulation
1. Simulator generates packets every `SCADA_SIM_INTERVAL` ms (default 3000ms)
2. Packet emitted immediately as `packet:new`
3. AI Engine scores packet and returns anomaly details
4. Enriched packet emitted as `packet:analyzed`
5. Critical anomalies generate `alert:new` events

### AI Fallback Behavior
If the AI Engine is unavailable after retries, the server returns a PASS result with low confidence (0.5) and a warning explanation to keep the demo running while signaling need for manual review.

---

## AI Decision Logic

```
Incoming Command Parameters
        │
        ▼
Hard-Limit Rule Check ──── violation ────► BLOCK (score = 1.0)
        │
      no violation
        │
        ▼
IsolationForest score (sigmoid normalized to 0–1)
        │
        ▼
MLP ensemble blend (60% IF + 40% MLP)
        │
        ▼
Final anomaly_score
        │
     ≥ 0.75 ─────────────────────────────► BLOCK
        │
      < 0.75 ─────────────────────────────► PASS
```

**Score thresholds (server-side policy on top of AI score):**
- score ≥ 0.6 → `pending` (human approval required)
- score ≥ 0.8 AND critical risk → `blocked`
- Unknown command (not in catalog) by non-admin → `blocked`

---

## Real-Time Events (Socket.io)

Events emitted by the server to connected clients:

| Event | Trigger |
|---|---|
| `packet:new` | New SCADA packet generated |
| `packet:analyzed` | AI-enriched packet ready |
| `command:result` | Command submitted and decided |
| `command:approved` | Pending command manually approved |
| `command:rejected` | Pending command manually rejected |
| `alert:new` | New anomaly alert created |
| `alerts:summary` | Alert count summary broadcast |
| `approval:new` | New pending command for admin review |
| `killswitch:changed` | Kill switch toggled |
| `maintenance:changed` | Maintenance window toggled |
| `industry:changed` | Active industry changed |
| `commands:expired` | Pending commands auto-expired |

Client subscribes to these events and updates Redux state accordingly.

---

## Configuration

**Server env vars** (loaded from repo root `.env`):

| Variable | Default | Purpose |
|---|---|---|
| `PORT` | `5000` | Express server port |
| `MONGODB_URI` | `mongodb://localhost:27017/guardiansync` | MongoDB connection |
| `JWT_SECRET` | — | JWT signing secret |
| `JWT_EXPIRES_IN` | `24h` | Token TTL |
| `AI_ENGINE_URL` | `http://localhost:8000` | FastAPI AI Engine base URL |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed client origin |
| `GOOGLE_CLIENT_ID` | — | Google OAuth client ID (backend verification) |
| `SMTP_USER` | — | Gmail address for OTP emails |
| `SMTP_PASS` | — | Gmail App Password |
| `SCADA_SIM_INTERVAL` | `3000` | Simulation tick interval (ms) |
| `SCADA_AUTO_START` | `true` | Auto-start simulator in dev |
| `SCADA_DEFAULT_INDUSTRY` | `power_plant` | Default industry on startup |

**AI Engine env vars:**

| Variable | Default | Purpose |
|---|---|---|
| `AI_CORS_ORIGINS` | `http://localhost:5173` | Allowed origins for AI API |