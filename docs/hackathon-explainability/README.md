# GuardianSync Explainability Pack

This folder collects a hackathon-ready explanation of the GuardianSync AI engine, the data pipeline, the anomaly model, and the product logic.

## What this pack covers

1. Where the data comes from and how it flows through the system
2. How exploratory data analysis and preprocessing are handled
3. What algorithm is used and how it works mathematically
4. Why a lightweight ML model is a better fit than an LLM or RAG pipeline for this use case
5. How the anomaly score, risk handling, and threat timeline are calculated
6. Why a virtual environment is used and why this approach is practical for a hackathon

## Key source files

- [ai-engine/app/simulator.py](ai-engine/app/simulator.py)
- [ai-engine/app/attack_generator.py](ai-engine/app/attack_generator.py)
- [ai-engine/app/train.py](ai-engine/app/train.py)
- [ai-engine/app/inference.py](ai-engine/app/inference.py)
- [ai-engine/app/utils.py](ai-engine/app/utils.py)
- [ai-engine/app/explain.py](ai-engine/app/explain.py)
- [server/src/services/packetBroker.js](server/src/services/packetBroker.js)
- [server/src/controllers/commandController.js](server/src/controllers/commandController.js)
- [client/src/hooks/useSocket.js](client/src/hooks/useSocket.js)
- [client/src/store/uiSlice.js](client/src/store/uiSlice.js)

## Recommended reading order

- [01-data-and-pipeline.md](01-data-and-pipeline.md)
- [02-eda-and-preprocessing.md](02-eda-and-preprocessing.md)
- [03-model-and-algorithm.md](03-model-and-algorithm.md)
- [04-why-ml-over-llm-rag.md](04-why-ml-over-llm-rag.md)
- [05-scoring-math-and-threat-timeline.md](05-scoring-math-and-threat-timeline.md)
- [06-venv-and-hackathon-justification.md](06-venv-and-hackathon-justification.md)
