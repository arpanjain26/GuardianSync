# GuardianSync — AI Engine Explained

## What Does It Do?

The AI Engine watches every SCADA command and decides: **is this normal, or is it an attack?**

It looks at 14 sensor readings (like temperature, pressure, and network speed), runs them through two AI models, and gives back a score. If the score is high enough, the command is **blocked**.

---

## How the Model Works (Simple Version)

**Step 1 — Safety Rule Check**
Before any AI runs, we check hard physical limits. If pressure exceeds 200 PSI, it's an instant block. No model needed.

**Step 2 — Isolation Forest (main model)**
This is an unsupervised ML model trained only on normal data. It learns what "normal" looks like, so anything that doesn't fit gets flagged. Think of it like a security guard who knows every regular employee — a stranger stands out immediately.

**Step 3 — Neural Network (second opinion)**
A small neural network (2 hidden layers: 32 and 16 neurons) that was trained on labeled attack and normal data gives a second probability score.

**Step 4 — Combined Score**
The two scores are blended: 60% from the Isolation Forest + 40% from the neural network.

**Step 5 — Decision**
- Score ≥ 0.75 → **BLOCK** (anomaly detected)
- Score < 0.75 → **PASS** (looks normal)

---

## How the Model Gets Trained

1. **Data is generated synthetically** — 2,400 normal SCADA readings and 500 attack readings are generated across 4 industries (power plant, water treatment, manufacturing, chemical facility)
2. **5 attack types are simulated:** spike (sudden extreme values), flatline (sensors drop to zero), oscillation (rapid swings), overflow (command flooding), and drift (slow creep out of range)
3. **Training runs in Python** using scikit-learn. Takes about 2–5 seconds on a CPU
4. **Models are saved** to the `ai-engine/models/` folder

---

## Where Models Are Saved

| File | What It Is | Size |
|---|---|---|
| `ai-engine/models/anomaly_detector.pkl` | Main Isolation Forest model | ~2.8 MB |
| `ai-engine/models/mlp_classifier.pkl` | Neural network weights | ~31 KB |
| `ai-engine/models/scaler.pkl` | Feature normalizer | ~1 KB |
| `ai-engine/models/feature_columns.json` | List of the 14 sensor feature names | <1 KB |

To retrain, run:
```bash
python -c "from app.train import train_model; train_model()"
```

---

## The 14 Features It Looks At

Temperature, Pressure, Flow Rate, Voltage, Current, RPM, Vibration, Humidity, Power Consumption, Response Time, Packet Size, Command Frequency, Error Rate, Network Latency.

---

## Overall Accuracy

> **🎯 Overall Anomaly Detection Accuracy: 91%**

- Out of every 100 real attacks, the engine catches **91** of them
- Out of every 100 normal commands, it incorrectly blocks only **~6**
- Inference speed: **< 5 ms** per command

### Detailed Metrics

Based on the latest training run (2,400 normal samples, 500 attack samples):

- **Precision:** ~76% *(When it flags an attack, it is correct 76% of the time)*
- **Recall:** 91% *(It catches 91% of all actual attacks)*
- **False Positive Rate (FPR):** 6% *(6% of normal commands are falsely flagged as attacks)*
- **False Negative Rate (FNR):** 9% *(9% of actual attacks slip through)*

### Confusion Matrix

| | Predicted Normal (Pass) | Predicted Attack (Block) |
|---|---|---|
| **Actual Normal** | **True Negative (TN):** 2256 | **False Positive (FP):** 144 |
| **Actual Attack** | **False Negative (FN):** 45 | **True Positive (TP):** 455 |
