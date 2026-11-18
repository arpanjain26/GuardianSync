# GuardianSync Technology Overview

This document summarizes the technologies used across the frontend, backend, and AI engine.

---

## Frontend (client)

### Core Framework and Tooling
- **React 18.2** — SPA architecture for pages, layouts, and dashboard panels
- **Vite 5.0** — Development server and production bundling

### Styling and UI
- **Tailwind CSS 3.4** — Utility-first styling for layouts and components
- **PostCSS + Autoprefixer** — CSS processing and vendor prefixing
- **Radix UI** — Accessible primitives for dialogs, dropdowns, tooltips, and switches
- **class-variance-authority, clsx, tailwind-merge** — Conditional class composition
- **Lucide React** — SVG icon set across the UI

### State, Routing, Auth, and Real-Time
- **Redux Toolkit 2.0 + React Redux 9.0** — Global state for alerts, commands, map data, UI
- **React Router 6.21** — Authenticated and public routing
- **Socket.io client 4.7** — Live packet stream and real-time event updates
- **@react-oauth/google** — Google OAuth SSO login button and token flow

### Visualization and Motion
- **React Flow 11.10** — Industry map graphs with live node status updates
- **Recharts 2.10** — Threat timeline and summary charts
- **Framer Motion 10.16 + GSAP 3.15** — UI transitions and attention-cue animations

---

## Backend (server)

### Runtime and HTTP
- **Node.js** — JavaScript runtime
- **Express 4.18** — REST API for auth, commands, alerts, map data, and forensic logs
- **Socket.io 4.7** — Real-time event delivery and industry-scoped rooms

### Data and Persistence
- **MongoDB** — Primary data store for users, commands, alerts, and industries
- **Mongoose 8.0** — ODM schemas and database access layer

### Security, Auth, and Validation
- **jsonwebtoken 9.0** — JWT-based auth tokens for API protection and RBAC
- **google-auth-library** — Secure backend verification of Google OAuth ID tokens
- **nodemailer** — SMTP email delivery for 2FA OTP codes (real Gmail SMTP)
- **bcryptjs 2.4** — Password hashing
- **Zod 3.22** — Runtime request validation for command and auth payloads
- **Helmet 7.1** — HTTP security headers
- **CORS 2.8** — Cross-origin control
- **express-rate-limit 7.1** — Request throttling to prevent brute-force

### Integration and Utilities
- **Axios 1.6** — Server-to-AI engine HTTP calls with retries and timeout handling
- **fast-xml-parser 4.4** — SVG/XML parsing for industry blueprint uploads
- **Morgan 1.10** — HTTP request logging in development

### Development and Testing
- **nodemon 3.0** — Auto-reload during development
- **Jest 29.7** — Unit testing for server utilities

---

## AI Engine (ai-engine)

### API and Runtime
- **Python 3.10+** — Core runtime
- **FastAPI 0.104** — REST API with automatic OpenAPI docs (`/docs`)
- **Uvicorn 0.24** — ASGI server
- **Pydantic 2.5** — Request/response schema validation

### Machine Learning
- **scikit-learn 1.3**
  - `IsolationForest` — Primary unsupervised anomaly detector (250 trees, contamination=0.12)
  - `MLPClassifier` — Supervised neural network ensemble (hidden layers: 32, 16)
  - `StandardScaler` — Feature normalization (fit on normal data only)
- **pandas 2.1** — Dataset assembly and CSV I/O
- **NumPy 1.26** — Numeric operations, sigmoid transformation
- **joblib 1.3** — Model serialization (`.pkl` files)

### Configuration
- **python-dotenv 1.0** — `.env` environment variable loading
- **httpx 0.25** — Async-capable HTTP client

---

## Saved Model Artifacts

| File | Path | Purpose |
|---|---|---|
| `anomaly_detector.pkl` | `ai-engine/models/` | IsolationForest model (~2.8 MB) |
| `mlp_classifier.pkl` | `ai-engine/models/` | MLP neural network (~31 KB) |
| `scaler.pkl` | `ai-engine/models/` | StandardScaler parameters (~1 KB) |
| `feature_columns.json` | `ai-engine/models/` | Ordered list of 14 feature names |
| `training_dataset.csv` | `ai-engine/data/` | Full labeled training data (~300 KB) |
| `normal_stream.csv` | `ai-engine/data/` | Normal-only samples (~248 KB) |
| `attack_stream.csv` | `ai-engine/data/` | Attack-only samples (~52 KB) |

---

## System Integration Summary

The client submits commands to the Express server, which validates them, calls the FastAPI AI engine for anomaly scoring, applies policy rules, and persists the decision to MongoDB. Results and alerts are broadcast via Socket.io in real time to keep the dashboard synchronized.

Authentication supports two flows:
1. **Username + password → OTP email** (nodemailer SMTP → user's inbox → dashboard)
2. **Google OAuth SSO** (Google Identity Services popup → backend token verification → JWT issued)