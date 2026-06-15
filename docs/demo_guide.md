# Demo Guide — KZ Cyber Fusion

This guide explains how to start the system, run the SMS Blaster demo, and present each step to judges. Read this before the presentation.

---

## 1. Starting the System

### Option A — Local (Recommended for Demo)

**Terminal 1 — Backend:**
```bash

cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

You should see:
```
[KZ Cyber Fusion] Database initialized.
[KZ Cyber Fusion] Server ready. http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

**Terminal 2 — Frontend:**
```bash

cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.x.x  ready in 300ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

### Option B — Docker

```bash

cp .env.example .env
docker-compose up --build
```

Wait for both containers to show healthy:
```
kzcf_backend   | [KZ Cyber Fusion] Server ready.
kzcf_frontend  | VITE ready
```

Open **http://localhost:5173** in your browser.

---

### Pre-Demo Checklist

Before walking judges through the demo, confirm all of these:

- [ ] Backend running — visit `http://localhost:8000/health` → `{"status":"ok"}`
- [ ] Frontend running — `http://localhost:5173` loads the dashboard
- [ ] No red console errors in browser DevTools
- [ ] Overview dashboard shows stat cards (all zeros is fine before demo runs)
- [ ] Demo button is visible on the Overview page
- [ ] Browser is in full-screen mode (F11)
- [ ] Font size increased for visibility (Ctrl+Plus twice)
- [ ] Dark mode enabled if the UI supports it

---

## 2. The Demo Button

The primary demo entry point is the **"Run Kazakhstan SMS Blaster Fraud Demo"** button on the Overview Dashboard page (`/`).

When clicked, it sends `POST /api/demo/run` to the backend, which executes the full 7-step simulation and returns all results in a single response. The frontend then animates through each step with a short delay between them.

**What the button triggers:**

```
Step 1 → Phishing detection    (score 95, Critical)
Step 2 → Leak detection        (score 88, Critical)
Step 3 → Anomaly detection     (score 91, Critical)
Step 4 → Deepfake detection    (score 87, Critical)
Step 5 → Network detection     (score 80, Critical)
Step 6 → Log detection         (score 82, Critical)
Step 7 → Cyber Fusion Engine   (score 97, Critical)
         → Incident KCF-001 created
         → Evidence package generated
```

Total demo runtime: approximately 6–8 seconds of animated progression.

---

## 3. Step-by-Step Walkthrough for Judges

### Step 1 — Fake Kaspi Bank SMS Detected

**What the screen shows:**
- Phishing Shield detector card activates
- Score bar fills to 95/100 — Critical
- Reasons list appears:
  - "Message contains urgency language: 'Срочно'"
  - "Fake bank bonus offer detected: 'выиграли 50,000 тенге'"
  - "Kaspi Bank brand impersonation detected"
  - "Suspicious URL domain: kaspi-bonus.ru"
  - "Suspicious TLD: .ru used instead of .kz"

**Talking point for judges:**
> "A citizen in Almaty receives this SMS — it looks like a real Kaspi Bank message. Our AI Phishing Shield instantly detects five separate red flags: urgency language, a fake bonus offer, brand impersonation, a known phishing domain, and the wrong top-level domain. This is the SMS Blaster attack — the fake base station that was deployed in Almaty in April 2026. Score: 95 out of 100, Critical severity."

---

### Step 2 — Credentials Found in Zaimer-Style Breach

**What the screen shows:**
- Leak Sentinel detector card activates
- Score bar fills to 88/100 — Critical
- Reasons list appears:
  - "Email 'victim@example.kz' found in Zaimer.kz breach (2023)"
  - "Phone number found in KZ telecom leak (2022)"
  - "2 breach sources matched for this identity"

**Talking point for judges:**
> "Before even clicking the link, this person's email and phone were already exposed in the Zaimer.kz data breach and a KZ telecom leak. The attacker knows this — that's why they targeted this specific number. Score: 88, Critical. The Leak Sentinel checks every identity against our breach database in milliseconds."

---

### Step 3 — Suspicious Login from Russia

**What the screen shows:**
- Behavioral Anomaly Engine card activates
- Score bar fills to 91/100 — Critical
- Reasons list appears:
  - "Login from Russia — unusual for KZ-based user"
  - "IP 185.220.101.45 is a known Tor exit node"
  - "Login at 03:14 AM — abnormal login time"
  - "New unrecognized device used"
  - "Impossible travel: KZ → RU in less than 2 hours"

**Talking point for judges:**
> "The victim clicked the link and entered their credentials on the fake page. Three minutes later — 3 AM local time — someone logs into their account from Russia, using a Tor exit node, on an unrecognized device. Our Behavioral Anomaly Engine fires five rules simultaneously. This is unauthorized access. Score: 91, Critical."

---

### Step 4 — Deepfake Bank Officer Call

**What the screen shows:**
- Deepfake Guard card activates
- Score bar fills to 87/100 — Critical
- Reasons list appears:
  - "High voice inconsistency score: 0.89"
  - "Claimed identity is a bank official: 'Kaspi Bank Security Officer'"
  - "Voice pitch irregularities detected"
  - "Unnatural speech cadence pattern detected"

**Talking point for judges:**
> "The attacker calls the victim, using an AI-generated voice cloned from a real bank officer. They claim to be from Kaspi Bank security, asking the victim to 'confirm' a transaction. Our Deepfake Guard detects a voice inconsistency score of 0.89 — nearly perfect synthetic generation. The 245% surge in deepfake fraud in Kazakhstan in 2024 is exactly this pattern. Score: 87, Critical."

---

### Step 5 — C2 Network Traffic Detected

**What the screen shows:**
- Network Threat Monitor card activates
- Score bar fills to 80/100 — Critical
- Reasons list appears:
  - "Outbound traffic to known bad IP: 185.220.101.45"
  - "Destination port 4444 is a known C2 port"
  - "Suspicious outbound country: RU"
  - "High connection frequency suggests beaconing"

**Talking point for judges:**
> "Meanwhile, the victim's device — compromised during the phishing flow — starts sending traffic to a command-and-control server in Russia on port 4444. This is botnet beaconing. Our Network Monitor catches it: the same IP address that logged in abnormally is now receiving stolen data. Score: 80, Critical."

---

### Step 6 — 47 Failed Login Attempts in 3 Minutes

**What the screen shows:**
- Log Intelligence Engine card activates
- Score bar fills to 82/100 — Critical
- Reasons list appears:
  - "47 failed login attempts in 3 minutes — brute force pattern"
  - "Login attempts sourced from known bad IP: 185.220.101.45"
  - "2 privilege escalation attempts detected"
  - "Account takeover pattern matches known attack signature"

**Talking point for judges:**
> "The logs tell the final part of the story. While the deepfake call kept the victim distracted, an automated tool was running 47 login attempts per 3 minutes from the same Russian IP, trying to break into linked accounts. This is credential stuffing combined with brute force. Score: 82, Critical."

---

### Step 7 — Cyber Fusion Engine: Incident KCF-001

**What the screen shows:**
- The Cyber Fusion Engine activates — all six detector cards are now lit Critical
- A new incident card appears: **"Coordinated Financial Fraud Attack — SMS Blaster Chain"**
- Risk gauge animates to **97/100**
- Severity badge: **CRITICAL**
- Confidence: **95%**
- The AI explanation paragraph appears
- Recommended actions list populates:
  - BLOCK IP 185.220.101.45 immediately
  - FREEZE account for victim@example.kz
  - FORCE password reset for victim@example.kz
  - FLAG all recent transactions for review
  - NOTIFY AFM fraud analyst on duty
  - CREATE investigation ticket with evidence package
  - ESCALATE to AFM Financial Intelligence Unit

**Talking point for judges:**
> "This is the key innovation. Six separate detection systems just fired — independently. A normal SOC would have six separate alerts sitting in six different queues. KZ Cyber Fusion connects them all in real time. Same IP, same victim, same 18-minute window. The Cyber Fusion Engine correlates them, matches the known SMS Blaster attack pattern, and generates a single incident: risk score 97 out of 100, Critical. The analyst gets one case, one explanation, and seven specific actions — in under 10 seconds."

---

## 4. After the Main Demo

### Show the Incident Detail Page

Navigate to `/incidents/KCF-001` or click the incident card.

Point out:
- **Correlation Timeline** — the visual sequence of events from T+0 to T+18 minutes
- **Affected Entity panel** — email, phone, IP, device all linked
- **Detector Results grid** — all six scores with confidence levels

**Talking point:**
> "This is what the analyst sees — a complete intelligence case, not a pile of alerts."

---

### Show the AI SOC Assistant

Navigate to `/assistant` and ask these questions live:

1. **"Why is this incident critical?"**
   - The assistant lists all six active detectors and their scores

2. **"What happened first?"**
   - The assistant describes the phishing SMS as the initial event

3. **"What should I do next?"**
   - The assistant outputs the prioritized response action list

4. **"Is this phishing, account takeover, or coordinated fraud?"**
   - The assistant explains the SMS Blaster Financial Fraud pattern match

**Talking point:**
> "A junior analyst can ask in plain language. The AI explains the case, the evidence, and the next steps — so even a non-specialist can act on a Critical incident immediately."

---

### Show the Evidence Report

Navigate to `/evidence/KCF-001` or click the Evidence button on the incident.

Point out:
- Summary paragraph
- Risk score and confidence
- Detector results table
- Correlation timeline
- Explainability notes section

Then click **Download PDF**.

**Talking point:**
> "Every incident automatically generates an analyst-ready evidence package. This PDF contains everything needed to open an AFM investigation: the incident summary, all detector findings, the timeline, explainability notes, and recommended actions. No copy-pasting from multiple systems."

---

### Trigger a Response Action

On the Response panel, click **"Block IP"** for `185.220.101.45`.

**Talking point:**
> "The response engine simulates the defensive actions. In a production deployment, these would call real APIs: the firewall API to block the IP, the core banking API to freeze the account, the identity service to force a password reset. For the MVP, we simulate each action and log the result."

---

## 5. What Judges Will See — Summary

| What They See | What It Demonstrates |
|---|---|
| 7-step animated demo progression | Real-time detection pipeline |
| 6 detectors all firing Critical | Multi-signal threat coverage |
| Single correlated incident at 97/100 | Core innovation: correlation not just detection |
| AI explanation in plain language | Explainability for non-technical analysts |
| Prioritized response action list | Automated response readiness |
| PDF evidence report download | Production-ready output for AFM workflows |
| SOC Assistant Q&A | Analyst-assistance AI layer |
| Kazakhstan-specific attack names | Local relevance and research depth |

---

## 6. Likely Judge Questions and Answers

**Q: "Is this using real machine learning?"**
> "The MVP uses rule-based scoring — explainable by design. Every score comes from named rules that we can show and explain. The architecture is built so that each detector can be upgraded to a real ML model with zero changes to the correlation engine. We've already documented the upgrade path in the codebase."

**Q: "How is this different from a regular SIEM?"**
> "A SIEM aggregates logs. This platform correlates signals across completely different data types — SMS content, breach databases, login behavior, audio analysis, network traffic — and produces a single actionable intelligence case with a risk score and explanation. SIEMs don't connect a phishing SMS to a deepfake call to a C2 connection on the same victim identity."

**Q: "Can this handle real-time data?"**
> "The current MVP processes synchronous API calls. The backend is structured for a streaming upgrade — the fusion engine and detectors are stateless functions that can be wrapped in a Kafka consumer or Celery worker without changing their logic."

**Q: "What data does it use in production?"**
> "Phishing detection would consume real SMS gateway feeds. Leak detection would integrate with the KZ-CERT breach notification API or a threat intelligence feed. Anomaly detection would read from bank or telecom authentication logs. Network detection would sit inline with a TAP or SPAN port feed. The demo uses simulated data that exactly mirrors these production inputs."

**Q: "Is the deepfake detection real?"**
> "The deepfake module accepts a pre-computed inconsistency score from a voice or video analysis model. In production, this score would come from a real-time neural network — we've tested against open-source models like RawNet2 and Wav2Vec. For the MVP, we accept the score as input so judges can see the full correlation pipeline without requiring a GPU."

---

## 7. Timing Guide

| Segment | Duration |
|---|---|
| System introduction + problem statement | 60 seconds |
| Click demo button + watch 7 steps animate | 30 seconds |
| Explain each step (brief) | 90 seconds |
| Incident detail + timeline walkthrough | 45 seconds |
| AI SOC Assistant live Q&A | 45 seconds |
| Evidence PDF download | 20 seconds |
| Response actions demo | 20 seconds |
| Answer questions | remaining time |

**Total presentation: ~5 minutes**

---


