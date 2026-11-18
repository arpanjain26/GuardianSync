# GuardianSync — Hackathon Pitch

## The Problem

Industrial control systems (power plants, water treatment, manufacturing) are prime targets for cyberattacks. Operators often have no real-time visibility into whether a command is malicious, and when something goes wrong, there's no audit trail. When every command can have physical consequences, detection must be fast, explainable, and human-centered.

## The Solution

GuardianSync is an AI-assisted SCADA security platform that evaluates every industrial command in real time, explains the risk in plain English, and routes high-impact actions through human approval. It combines rule-based safety controls, machine learning anomaly detection, and a live operations dashboard.

## How It Works

1. An operator submits a command through the dashboard (or the built-in simulator generates one)
2. The AI Engine scores it using an IsolationForest + neural network ensemble (**91% detection accuracy**)
3. Policy rules and risk thresholds decide: approve, hold for review, or block
4. Blocked commands trigger alerts with a plain-English explanation of what went wrong
5. All decisions are logged to MongoDB for forensic audit

## Key Differentiators

- **Real-time AI scoring** — every command is analyzed in < 5 ms
- **Explainable decisions** — operators see exactly which sensor readings triggered a block
- **Human-in-the-loop** — medium-risk commands wait for admin approval, not just auto-blocked
- **Safety-first hard rules** — physical limit violations (e.g., pressure > 200 PSI) are blocked before ML even runs
- **Kill switch** — instant halt of all operations in one click
- **Maintenance windows** — controlled exception periods with auto-expiry
- **Multi-industry** — works across power plants, water treatment, manufacturing, and chemical facilities
- **Full audit trail** — forensic vault with export, alert stats, and command history
- **Enterprise auth** — Google OAuth SSO + email OTP 2FA, both production-grade

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Redux Toolkit, React Flow, Recharts, Framer Motion, GSAP, Socket.io
- **Backend**: Node.js, Express, Socket.io, MongoDB, Mongoose, JWT, Zod, Nodemailer, google-auth-library
- **AI Engine**: Python, FastAPI, scikit-learn (IsolationForest + MLP), pandas, NumPy, joblib

## AI Engine at a Glance

- **Overall accuracy: 91%** anomaly detection rate
- Models: IsolationForest (unsupervised) + MLP classifier (supervised), ensembled 60/40
- Trained on 2,900 synthetic SCADA samples across 5 attack categories
- Inference time: < 5 ms per command
- Saved as `.pkl` files in `ai-engine/models/`, reload on startup automatically

## Demo Story

1. Sign in as admin (or use Google OAuth)
2. Start the SCADA simulator — watch the live packet feed
3. Submit a safe command → see PASS with low anomaly score
4. Send `OVERRIDE_SAFETY` → watch it get blocked, alert fires, explanation shows flagged sensors
5. Open the approval queue — approve or reject a pending command
6. Hit the kill switch — everything halts, UI indicators update live
7. Open the forensic vault — filter by blocked, export the audit log

## Roadmap

- Production hardening (TLS, secrets management, container deployment)
- Compliance validation (IEC 62443, NERC CIP)
- Integration with real telemetry sources (Modbus, DNP3, OPC-UA)
- Online model retraining as new attack patterns emerge
- Expanded policy engine with custom rule authoring