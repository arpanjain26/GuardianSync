# 2. EDA and preprocessing approach

## Exploratory data analysis (EDA)

The project does not use a large enterprise dataset; instead, it uses synthetic but realistic SCADA telemetry. The EDA goal is simple: define what normal behavior looks like and which readings are likely to deviate under attack.

The implementation uses domain knowledge to define:

- normal ranges for each sensor
- hard safety thresholds for critical values
- industry-specific biases for some features such as temperature and pressure

These are configured in [ai-engine/app/utils.py](ai-engine/app/utils.py) and [ai-engine/app/simulator.py](ai-engine/app/simulator.py).

## What is being analyzed

Each feature is compared to a normal operating envelope:

- Lower and upper bounds are defined for each sensor.
- The center of that range is treated as the nominal operating point.
- The spread is used to create realistic variability.

This is the foundation for the entire anomaly detection design.

## Preprocessing steps

### 1. Feature extraction

The function [ai-engine/app/utils.py](ai-engine/app/utils.py) converts the incoming parameters into a fixed-length vector. This ensures every prediction uses the same structure.

The vector is:

$$x = [x_1, x_2, \dots, x_{14}]$$

where each $x_i$ is one of the 14 SCADA features.

### 2. Scaling

Before model training, the system uses StandardScaler from scikit-learn in [ai-engine/app/train.py](ai-engine/app/train.py).

The scaler transforms each feature using:

$$z = \frac{x - \mu}{\sigma}$$

where:

- $\mu$ is the mean of the training feature
- $\sigma$ is the standard deviation

This is important because different sensors live on different scales. Without scaling, a feature like pressure could dominate the model simply because its numeric magnitude is larger than temperature.

### 3. Label generation

Training samples are labeled:

- 0 for normal samples
- 1 for attack samples

The training matrix uses only the selected feature columns and the generated labels.

### 4. Hard-limit preprocessing

Before the ML model runs, the system checks hard safety constraints. The code in [ai-engine/app/utils.py](ai-engine/app/utils.py) defines a hard limit for pressure. If the incoming value exceeds it, the system blocks immediately.

This is a strong example of preprocessing logic that is not purely statistical. It is operationally grounded.

## Why this preprocessing is effective

The preprocessing is intentionally simple because the task is structured and explainable. The model does not need to learn from millions of raw points. Instead, it learns from a curated set of meaningful sensors and a well-defined expected range.

That makes the system:

- easy to debug
- transparent to judges and users
- fast to run
- suitable for a live demonstration

## EDA-style reasoning used in the project

The project encodes the following business understanding into the pipeline:

- attack behavior often causes extreme values or unstable oscillations
- volumetric and network-related features are strongly affected by flooding or overload attacks
- pressure spikes are critical industrial safety signals
- normal operation has bounded variability, not random extreme jumps

That reasoning is reflected in the attack generator in [ai-engine/app/attack_generator.py](ai-engine/app/attack_generator.py), which creates attack patterns such as spikes, flatlines, oscillation, overflow, and drift.
