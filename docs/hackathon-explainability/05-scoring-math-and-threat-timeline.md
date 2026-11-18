# 5. Math behind the anomaly score, risk logic, and threat timeline

## 1. Anomaly score calculation

The model uses two signals and combines them.

### Step A: Isolation Forest score

The Isolation Forest produces a raw decision score $r$.

That raw score is transformed into a probability-like value:

$$S_{IF} = \frac{1}{1 + e^{r \cdot 4}}$$

This creates a score in the range $[0,1]$ where larger values represent stronger evidence of anomaly.

### Step B: MLP probability

The MLP classifier outputs a probability estimate:

$$S_{MLP} = P(y=1 \mid x)$$

where $y=1$ means attack-like behavior.

### Step C: Final blended score

The final score is:

$$A = 0.6 \cdot S_{IF} + 0.4 \cdot S_{MLP}$$

The implementation in [ai-engine/app/inference.py](ai-engine/app/inference.py) uses this exact structure.

### Step D: Threshold decision

The system declares suspicious behavior when:

$$A \ge 0.75$$

If the score is below 0.75, the command is treated as safe.

## 2. Hard-limit logic

Before the ML score is even computed, the system checks if a critical physical limit is exceeded.

In the code, pressure has a hard limit of 200. If a packet arrives with:

$$pressure > 200$$

then the model returns an immediate BLOCK decision with a score of 1.0.

This is a safety-first rule that protects the system against obvious hazardous behavior.

## 3. Feature deviation reasoning

The explanation layer computes a deviation score for each feature using a normal range. For each feature $f$ with lower bound $L_f$ and upper bound $U_f$:

$$m_f = \frac{L_f + U_f}{2}$$

$$d_f = \frac{|x_f - m_f|}{\frac{U_f - L_f}{2}}$$

This gives a normalized deviation from the center of the normal envelope.

A larger $d_f$ means that the feature is more unusual.

These deviations are used in [ai-engine/app/explain.py](ai-engine/app/explain.py) to explain which features most strongly contributed to the anomaly decision.

## 4. Threat timeline logic

The threat timeline is a time-series visualization of the anomaly score over time.

Each packet processed by the system updates the UI with a new score. The state update in [client/src/store/uiSlice.js](client/src/store/uiSlice.js) does the following:

- clips the new score into the range $[0,1]$
- stores it as the current threat score
- appends it to a rolling history list
- trims the list if it becomes too long

In practice, the UI maintains:

$$H_t = [s_1, s_2, \dots, s_t]$$

where $s_t$ is the anomaly score at time $t$.

The timeline shows how the threat level evolves over time, making attacks visible as spikes in the graph.

## 5. Risk handling in the backend

The backend does not rely on a separate continuous risk formula; it uses a risk policy based on:

- the command type
- the command catalog risk level
- the anomaly score
- rule-based checks for suspicious parameters

In [server/src/controllers/commandController.js](server/src/controllers/commandController.js), the logic is:

- critical command + anomaly score $\ge 0.8$ => BLOCK
- anomaly score $\ge 0.6$ => hold/pending
- suspicious rule flags => BLOCK or HOLD

This is a practical engineering balance between automated detection and human review.

## Why this is a good hackathon story

The system combines:

- mathematical scoring
- rule-based safety checks
- a live UI timeline

That makes the demo intuitive and easy to explain to a non-technical audience.
