# GuardianSync AI Engine

FastAPI anomaly detection and SCADA simulation service.

## Deploy on Render

Create a Python **Web Service** using this `ai-engine` directory as the root.
The included `render.yaml` provides the deployment settings:

- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Health check: `/health`
- Python runtime: `3.11.9`

Set `AI_CORS_ORIGINS` in Render to the deployed client and server URLs, separated by commas. The service trains the bundled detector on startup when model artifacts are absent.

After deployment, verify:

```text
https://<ai-service>.onrender.com/
https://<ai-service>.onrender.com/health
```

Set the backend's `AI_ENGINE_URL` to the service base URL only:

```text
https://<ai-service>.onrender.com
```

Do not append `/api`, `/predict`, or `/health` to `AI_ENGINE_URL`.