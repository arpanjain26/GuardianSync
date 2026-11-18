# Demo Flow — Product Walkthrough

**Total estimated time: ~5–6 minutes**

---

## 1) Login (30s)

- Open `http://localhost:5173`
- Sign in as admin using **username/password + OTP email** OR click **Continue with Google**
- Explain: production-grade 2FA and SSO out of the box

---

## 2) Normal Operations (45s)

- Start the SCADA simulator from the control panel (select industry: `power_plant`)
- Point out the **live packet feed** — packets arrive every 3 seconds, each scored by the AI
- Show healthy node statuses on the **industry map**
- Note the baseline threat level and packet anomaly scores (all low, near 0)

---

## 3) Safe Command (30s)

- Use the command console to run `CHECK_STATUS` on `turbine-01`
- Result: **PASS** — anomaly score ~0.08, confidence ~0.92
- Show the real-time update in the feed and the green status pulse on the map
- Point out the explanation: "All sensor readings within normal operating parameters"

---

## 4) Attack Scenario (60s)

- Send `OVERRIDE_SAFETY` with default parameters — or switch the simulator to **attack mode**
- AI scores it: anomaly score ~0.96 → **BLOCK**
- Highlight:
  - The red alert card firing in the alert panel
  - The explanation listing which specific sensors triggered it (e.g., Command Frequency, Error Rate)
  - Node status changing to `warning` on the map
  - Threat timeline chart spiking
- Key message: **91% detection accuracy, < 5 ms per command**

---

## 5) Human-in-the-Loop Approval (30s)

- Switch to the **Approval Queue** panel
- Show a `pending` command (anomaly score 0.60–0.74)
- Explain: medium-risk commands aren't auto-blocked — they wait for admin review
- Approve or reject and watch the live update propagate instantly via Socket.io

---

## 6) Kill Switch (30s)

- Activate the **kill switch** from the control panel
- Show: all new commands are immediately rejected, UI indicators turn red
- Explain: instant operational halt for emergency situations
- Deactivate to resume simulation

---

## 7) Maintenance Window (30s)

- Enable **maintenance mode** with a 5-minute window
- Show: maintenance-mode commands flow through, others are held
- Window auto-expires and normal policy resumes

---

## 8) Industry Switch (20s)

- Switch between `water_treatment`, `manufacturing`, `chemical_facility`
- Each has its own machines, commands, and normal operating baselines
- Rooms and Socket.io events are industry-scoped — no cross-contamination

---

## 9) Forensic Vault (30s)

- Open the **Forensic Vault**
- Filter by `blocked` status
- Point out: rule flags, AI confidence scores, timestamps, full command parameters
- Click **Export** — downloads a JSON audit log
- Key message: complete traceability from command to decision to alert

---

## 10) Closing (30s)

GuardianSync demonstrates:
- Real-time AI detection with **91% accuracy**
- Plain-English explainability — operators know *why* a command was blocked
- Human-in-the-loop safety — nothing is fully autonomous
- Complete audit trail — every decision is logged and exportable
- Enterprise auth — Google SSO + email OTP ready on day one

> Ready for pilot hardening: containerization, compliance review, and real telemetry integration are on the roadmap.