# 4. Why this solution uses ML instead of an LLM or RAG pipeline

## The core reason

GuardianSync is not primarily a language system. It is a real-time monitoring and decision-support system for industrial telemetry.

That means the most important requirements are:

- low latency
- deterministic output
- explainable scores
- no dependency on external APIs
- applicability to numeric sensor data

These requirements fit a small ML model much better than a large language model.

## Why an LLM or RAG model is not the best fit here

A large language model is excellent at:

- summarizing text
- answering questions
- reasoning over documents
- generating natural language explanations

But it is less ideal for:

- continuous real-time decision-making over structured numerical telemetry
- strict low-latency inference in a live demo
- offline or low-cost deployment
- predictable thresholded blocking logic

LLMs are also known to hallucinate or produce inconsistent outputs. In a safety-related monitoring context, this is risky.

## Why the ML approach is better for this product

### 1. Speed

The anomaly detector runs in milliseconds. That is critical for a live industrial monitoring interface.

### 2. Cost efficiency

A small scikit-learn model is inexpensive to host and run. There is no need for API credits or GPU infrastructure.

### 3. Explainability

The model outputs:

- a numeric anomaly score
- the top suspicious features
- hard-limit violations

This is much easier to explain than a black-box language model.

### 4. Privacy and reliability

The system can run locally without sending sensitive industrial telemetry to an external API.

### 5. Feasibility for hackathon execution

A small ML model is realistic to train, deploy, and demonstrate within a short timeframe. It is a strong engineering story because the solution is understandable, testable, and visually clear.

## Where LLMs can still help

LLMs can still be useful in a second layer, for example:

- generating natural-language summaries for alerts
- converting sensor anomalies into human-readable explanations
- helping a human operator understand what happened

But the actual anomaly decision should remain with the ML model.

## The product philosophy

GuardianSync uses ML as the decision engine and uses language generation only as a support layer. That balance makes the system more reliable, faster, and more suitable for operational technology use cases.
