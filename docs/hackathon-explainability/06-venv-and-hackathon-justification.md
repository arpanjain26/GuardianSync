# 6. Why a virtual environment is used and why this approach is suitable for a hackathon

## What a virtual environment is

A virtual environment, often called a `.venv`, is an isolated Python environment for a project.

It keeps project dependencies separate from:

- the system Python installation
- other projects on the machine
- conflicting package versions

## Why it is useful

In a hackathon project, dependency control matters because:

- different teams may use different versions of the same library
- a small change in a package version can break a project unexpectedly
- reproducibility is important when presenting the demo

A `.venv` prevents these issues by creating a controlled environment where the project’s dependencies are locked and predictable.

## Why it matters for GuardianSync

The AI engine depends on packages such as:

- FastAPI
- Uvicorn
- scikit-learn
- pandas
- numpy
- joblib

Using a `.venv` makes the project easier to:

- install consistently
- run on another machine
- present without dependency surprises

## Why this project is feasible for a hackathon

GuardianSync is feasible because it is built around a simple and powerful concept:

- generate realistic industrial telemetry
- train a small anomaly detector
- show that it can block suspicious actions in real time

That makes it a strong hackathon project because it combines:

- AI engineering
- backend integration
- real-time UI experience
- explainable decision-making

## Why the chosen approach is strong

The system is lightweight, visual, and easy to understand. Judges can immediately see:

- normal traffic
- suspicious spikes
- blocked events
- a live threat timeline

This is much more compelling than showing a long, abstract model training process without a visible product experience.

## Final hackathon narrative

A strong one-line pitch for the project is:

> GuardianSync uses a lightweight machine-learning anomaly detector to protect industrial control systems from suspicious commands in real time, while keeping the logic transparent, explainable, and fast enough for live demos.

That message is strong because it is concrete, technical, and easy to communicate.
