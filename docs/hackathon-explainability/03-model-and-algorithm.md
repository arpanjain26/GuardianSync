# 3. The algorithm used and how it works

## Core model choice

GuardianSync uses a lightweight ensemble of two models:

1. Isolation Forest for unsupervised anomaly detection
2. A small MLP classifier for a supervised second opinion

This is implemented in [ai-engine/app/train.py](ai-engine/app/train.py) and [ai-engine/app/inference.py](ai-engine/app/inference.py).

## Why Isolation Forest was chosen

Isolation Forest is a strong fit for anomaly detection because it does not require a large labeled anomaly dataset. In this project, labeled attack data is available only for evaluation and for the second model, but the main detector is trained mostly on normal behavior.

This is important because in real industrial systems, anomalies are rare and often not well documented. Isolation Forest is designed to detect points that are easy to isolate, which is exactly how unusual behavior often appears.

## How Isolation Forest works

The algorithm builds many random trees. The idea is that normal points are harder to isolate because they live in dense regions, while anomalies are easier to isolate because they are isolated from the rest.

A shorter path length in these trees suggests a more unusual point.

The model returns a decision score. In the code, this score is transformed into an anomaly probability through a sigmoid-like conversion:

$$s = \frac{1}{1 + e^{r \cdot 4}}$$

where:

- $r$ is the raw decision score from Isolation Forest
- $s$ is the converted anomaly score in the range $[0,1]$

Because the raw score is negative for anomalous samples, the transformation converts larger anomaly severity into a larger value near 1.

## Why the MLP is used

The MLP classifier is a small neural network with hidden layers of 32 and 16 neurons. It is trained on the full labeled dataset and gives a probability estimate that the current sample is an attack.

The final anomaly score is a blended score:

$$A = 0.6 \cdot S_{IF} + 0.4 \cdot S_{MLP}$$

where:

- $S_{IF}$ is the Isolation Forest score
- $S_{MLP}$ is the neural-network probability score

This combination is useful because:

- Isolation Forest captures unusual structure without labeled anomalies
- the MLP gives a stronger supervised signal when attack patterns are recognizable

## Final decision rule

The final decision rule in [ai-engine/app/inference.py](ai-engine/app/inference.py) is:

- if $A \ge 0.75$, classify as suspicious and return BLOCK
- otherwise, classify as safe and return PASS

This threshold is simple and explainable for a demo. It gives a clear decision boundary and is easy to communicate to hackathon judges.

## Why this is practical

This model is feasible because:

- it runs quickly on a CPU
- it needs only a small feature vector
- it is deterministic and explainable
- it can be retrained easily with synthetic or real data

It is ideal for a rapid proof-of-concept alarm system in industrial monitoring.
