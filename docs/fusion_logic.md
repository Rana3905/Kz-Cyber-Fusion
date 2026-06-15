# Cyber Fusion Engine — Logic Reference


This document explains how the Cyber Fusion Engine takes raw detector outputs and produces a single correlated incident with a unified risk score, timeline, explanation, and response recommendations.

---

## Overview

Most security tools produce isolated alerts. An analyst receives a phishing alert from one system, a suspicious login alert from another, and a network threat from a third — with no automatic connection between them.

The Cyber Fusion Engine solves this by:

1. Collecting all detector scores for a given identity and time window
2. Computing a weighted combined risk score
3. Applying a correlation boost when multiple signals are present
4. Matching the signal pattern against known Kazakhstan attack chains
5. Building a chronological timeline of events
6. Generating a human-readable explanation
7. Recommending specific automated response actions
8. Packaging everything into a single analyst-ready incident

---

## Module Map

```
detector results (6 modules)
        │
        ▼
┌───────────────────┐
│  risk_scorer.py   │  → weighted score + correlation boost
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   correlator.py   │  → pattern matching + IP convergence
└───────────────────┘
        │
        ▼
┌───────────────────┐
│   explainer.py    │  → human-readable incident explanation
└───────────────────┘
        │
        ▼
┌────────────────────────┐
│  timeline_builder.py   │  → chronological event sequence
└────────────────────────┘
        │
        ▼
┌───────────────────────────────┐
│  response_recommender.py      │  → automated action list
└───────────────────────────────┘
        │
        ▼
┌───────────────────────┐
│  incident_builder.py  │  → final unified incident object
└───────────────────────┘
```

---

## Step 1 — Weighted Risk Score

**File:** `backend/fusion/risk_scorer.py`

The base risk score is a weighted sum of all six detector scores:

```
base_score = (phishing_score × 0.25)
           + (leak_score     × 0.20)
           + (anomaly_score  × 0.20)
           + (deepfake_score × 0.15)
           + (network_score  × 0.10)
           + (log_score      × 0.10)
```

### Weight Rationale

| Detector | Weight | Rationale |
|---|---|---|
| Phishing | 0.25 | Entry point in 78% of KZ financial fraud cases |
| Leak | 0.20 | Credential exposure directly enables account takeover |
| Anomaly | 0.20 | Suspicious login is direct evidence of unauthorized access |
| Deepfake | 0.15 | Corroborating signal — follows phishing to complete social engineering |
| Network | 0.10 | Infrastructure signal — strong in context, weak in isolation |
| Logs | 0.10 | Confirmatory signal — typically the last indicator in the chain |

**Total weight: 1.00**

### Demo Scenario Calculation

| Detector | Score | Weight | Contribution |
|---|---|---|---|
| Phishing | 95 | 0.25 | 23.75 |
| Leak | 88 | 0.20 | 17.60 |
| Anomaly | 91 | 0.20 | 18.20 |
| Deepfake | 87 | 0.15 | 13.05 |
| Network | 80 | 0.10 | 8.00 |
| Logs | 82 | 0.10 | 8.20 |
| **Base total** | | | **88.80** |
| Correlation boost (6 active) | | | **+5** |
| Pattern boost (SMS Blaster) | | | **+15** |
| **Final risk score** | | | **≥97 (capped at 97)** |

---

## Step 2 — Correlation Boost

**File:** `backend/fusion/risk_scorer.py`

A detector is considered "active" when its score exceeds **50**. When multiple detectors fire simultaneously on the same identity, the engine applies a correlation boost — because correlated signals are far stronger evidence of a real attack than any single signal alone.

| Active Detectors | Correlation Boost |
|---|---|
| 1–2 | +0 |
| 3 | +2 |
| 4 | +3 |
| 5–6 | +5 |

**Confidence** also scales with active detector count:

```
confidence = min(0.60 + (active_detectors × 0.06), 0.99)
```

| Active Detectors | Confidence |
|---|---|
| 1 | 0.66 |
| 2 | 0.72 |
| 3 | 0.78 |
| 4 | 0.84 |
| 5 | 0.90 |
| 6 | 0.96 |

---

## Step 3 — Pattern Matching

**File:** `backend/fusion/correlator.py`

The correlator compares the set of active signals against a library of known Kazakhstan attack patterns defined in `backend/data/fraud_patterns.json`.

### Known Patterns

**SMS Blaster Financial Fraud**
- Required signals: phishing + credential_leak + suspicious_login + deepfake + account_takeover
- Min signals to match: 3
- Risk boost if matched: +15

**Account Takeover**
- Required signals: credential_leak + suspicious_login + failed_login_burst
- Min signals to match: 2
- Risk boost if matched: +10

**Deepfake Social Engineering**
- Required signals: deepfake_call + phishing_sms + suspicious_login
- Min signals to match: 2
- Risk boost if matched: +12

### IP Convergence Detection

The correlator also checks whether the same suspicious IP address appears in multiple detector outputs (e.g., the anomaly detector flagging a login from `185.220.101.45` and the network detector flagging outbound traffic to `185.220.101.45`). When IP convergence is detected, it is recorded in the correlation metadata and surfaced to the analyst as strong evidence of a single coordinated threat actor.

---

## Step 4 — Severity Classification

**File:** `backend/config.py`

Final severity is determined from the final risk score (after all boosts):

| Score Range | Severity | Response SLA |
|---|---|---|
| 0–39 | Low | 24 hours |
| 40–59 | Medium | 4 hours |
| 60–79 | High | 1 hour |
| 80–100 | Critical | 15 minutes |

---

## Step 5 — Timeline Construction

**File:** `backend/fusion/timeline_builder.py`

The timeline is built by ordering detector events chronologically relative to a base time (the first detected event's timestamp). Each active detector contributes one event entry, spaced 3 minutes apart to simulate the real propagation of an attack chain.

```
T+00:00  Phishing SMS / Email Detected         [phishing]    Score: 95
T+03:00  Credential Breach Match Found         [leak]        Score: 88
T+06:00  Suspicious Login Detected             [anomaly]     Score: 91
T+09:00  Deepfake Call Detected                [deepfake]    Score: 87
T+12:00  Suspicious Network Traffic Observed   [network]     Score: 80
T+15:00  Log Anomaly Detected                  [logs]        Score: 82
T+18:00  Cyber Fusion Engine: Incident Correlated [fusion]
```

Each timeline entry contains:
- `time` — ISO8601 timestamp
- `event` — human-readable label
- `detector` — source module
- `score` — detector score at that point
- `severity` — severity at that point
- `reasons` — list of reasons from the detector

---

## Step 6 — Explanation Generation

**File:** `backend/fusion/explainer.py`

The explainer generates a natural-language paragraph that an analyst can use to understand why the incident was created and why it was rated at a specific severity. The explanation is constructed by joining:

1. **Severity opening** — "A coordinated critical-severity cyber-fraud attack was detected targeting [entity]."
2. **Attack chain description** — One sentence per active detector describing its finding.
3. **Correlation statement** — How many signals converge on the same identity/IP/time window.
4. **Closing** — Final risk score and call for action.

### Example Output (Demo Scenario)

> A coordinated critical-severity cyber-fraud attack was detected targeting victim@example.kz. A phishing attempt was detected (score: 95/100). The victim's credentials were found in a known breach database (score: 88/100). A suspicious login from an unusual location was detected immediately after the phishing attempt (score: 91/100). A deepfake voice or video call impersonating a bank official was detected (score: 87/100). Suspicious outbound C2-like network traffic was observed (score: 80/100). Log analysis revealed a brute-force login burst from a known bad IP (score: 82/100). All 6 detection signals converge on the same victim identity, IP address, and time window, confirming a coordinated attack chain. Final incident risk score: 97/100 (Critical). Immediate analyst action is required.

---

## Step 7 — Response Recommendations

**File:** `backend/assistant/response_recommender.py`

The response recommender generates a prioritized list of defensive actions based on which detectors fired and at what severity. Actions are ordered from most urgent to most procedural:

| Condition | Recommended Action |
|---|---|
| Suspicious IP + anomaly or network score > 50 | BLOCK IP [address] immediately |
| Email + leak or anomaly score > 50 | FREEZE account for [email] |
| Email + leak score > 40 | FORCE password reset for [email] |
| Severity Critical or High | FLAG all recent transactions for review |
| Severity Critical or High | NOTIFY AFM fraud analyst on duty |
| Always | CREATE investigation ticket with evidence package |
| Severity Critical | ESCALATE to AFM Financial Intelligence Unit |
| Phone + phishing score > 60 | REPORT phishing number to KZ telecom regulator |

---

## Step 8 — Incident Object

**File:** `backend/fusion/incident_builder.py`

The final incident object assembles all the above outputs into the canonical shape returned by `/api/fusion/correlate` and `/api/demo/run`:

```json
{
  "id": "KCF-001",
  "title": "Coordinated Financial Fraud Attack — SMS Blaster Chain",
  "risk_score": 97,
  "severity": "Critical",
  "confidence": 0.95,
  "status": "open",
  "affected_entity": {
    "email": "victim@example.kz",
    "phone": "+77001234567",
    "ip": "185.220.101.45",
    "device": "Unknown Android Device"
  },
  "detector_results": { ... },
  "timeline": [ ... ],
  "explanation": "A coordinated critical-severity ...",
  "recommended_actions": [ ... ],
  "correlation_metadata": {
    "active_signals": ["phishing", "leak", "anomaly", "deepfake", "network", "logs"],
    "signal_count": 6,
    "matched_patterns": [{ "name": "SMS Blaster Financial Fraud", ... }],
    "ip_convergence": true,
    "is_coordinated": true
  },
  "created_at": "2024-06-15T03:32:00Z"
}
```

---

## Why Correlation Matters

A standalone phishing alert has a false-positive rate of approximately 15–30% in production environments — many legitimate bank notifications look superficially similar to phishing. A standalone anomaly alert has similar problems — VPN users regularly trigger impossible travel rules.

When **six independent signals all point to the same identity within the same time window**, the probability of a false positive drops to near zero. This is the core value of the Cyber Fusion Engine: it does not just detect threats, it **confirms** them with enough correlated evidence that an analyst can act immediately without further investigation.

---


