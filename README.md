# KZ Cyber Fusion

### AI Shield Intelligence Platform — Detect. Correlate. Explain. Respond.

> **AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24**

---

## One-Line Description

KZ Cyber Fusion is an AI-powered cybersecurity intelligence platform that detects phishing, credential leaks, unauthorized access, behavioral anomalies, deepfake fraud, network threats, and suspicious logs — then correlates all signals into one explainable cyber-fraud incident for analysts.

---

## The Problem

Modern cyberattacks do not happen as isolated events.

A victim receives a fake Kaspi Bank SMS. Their credentials were already in the Zaimer.kz data breach. An attacker logs in from a suspicious Russian IP at 3 AM. A deepfake bank officer calls to "confirm" a transaction. The victim's device starts beaconing to a C2 server. Forty-seven failed login attempts hit the account in three minutes.

**Most security tools detect these events separately. Analysts must manually connect them.**

In 2024, Kazakhstan registered 68,100 cybersecurity incidents — a 97% year-on-year increase. The average time between phishing delivery and account compromise is 11 minutes. No analyst can manually correlate six signals across six systems in 11 minutes.

KZ Cyber Fusion solves this by connecting all signals into one unified incident with a risk score, timeline, AI explanation, and response recommendations — in under 10 seconds.

---

## Core Innovation

Most teams build detectors. **This project builds a cyber-intelligence correlation platform.**

```
Phishing SMS  ──┐
Credential leak ├──► Cyber Fusion Engine ──► 1 Incident · 1 Score · 1 Explanation · 1 Response
Suspicious login│                            Risk: 97/100 · Severity: CRITICAL
Deepfake call  ─┤
C2 traffic     ─┤
Log anomaly ────┘
```

---

## Hackathon Alignment — Track 2: AI Shield

| AI Shield Requirement | KZ Cyber Fusion Module |
|---|---|
| Phishing detection | AI Phishing Shield |
| Unauthorized access detection | Behavioral Anomaly Engine |
| Data leak monitoring | Leak Sentinel |
| Behavioral anomaly detection | Behavioral Anomaly Engine |
| Network threat monitoring | Network Threat Monitor |
| Log analysis | Log Intelligence Engine |
| AI response assistant | AI SOC Assistant |
| Automated cybersecurity response | Automated Response Engine |
| Explainability | Explainer + Evidence Package |
| Real-time detection | Fusion Engine + Live Alert Feed |

---

## Quick Start

### Prerequisites

- Python 3.11+
- Node.js 20+
- npm 9+

---

### Run the Backend

```bash

cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend is ready at:
- API: `http://localhost:8000`
- Interactive docs: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/health`

---

### Run the Frontend

```bash

cd frontend
npm install
npm run dev
```

Frontend is ready at: `http://localhost:5173`

---

### Run with Docker

```bash

cp .env.example .env
docker-compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |

To stop: `docker-compose down`

---

## Demo Instructions

### The Main Demo

1. Open `http://localhost:5173` in your browser
2. You are on the **Overview Dashboard**
3. Click the button: **"Run Kazakhstan SMS Blaster Fraud Demo"**
4. Watch 7 steps animate in sequence:
   - Step 1: Fake Kaspi Bank SMS → Phishing score **95/100 Critical**
   - Step 2: Zaimer breach match → Leak score **88/100 Critical**
   - Step 3: Login from Russia/Tor → Anomaly score **91/100 Critical**
   - Step 4: Deepfake bank call → Deepfake score **87/100 Critical**
   - Step 5: C2 outbound traffic → Network score **80/100 Critical**
   - Step 6: 47 failed logins / 3 min → Log score **82/100 Critical**
   - Step 7: **Cyber Fusion Engine → Incident KCF-001 → Risk 97/100 CRITICAL**
5. Click the generated incident to see the full detail, timeline, and AI explanation
6. Open the **AI SOC Assistant** tab and ask: *"Why is this incident critical?"*
7. Click **Download Evidence PDF** to see the analyst report

### Manual API Demo

```bash

# Run the full demo via API
curl -X POST http://localhost:8000/api/demo/run -H "Content-Type: application/json" -d '{}'

# Ask the AI assistant
curl -X POST http://localhost:8000/api/assistant/ask \
  -H "Content-Type: application/json" \
  -d '{ "incident_id": "KCF-001", "question": "What should I do next?" }'

# Download the evidence PDF
curl -o evidence.pdf http://localhost:8000/api/evidence/KCF-001/pdf
```

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend framework | React | 18 |
| Frontend language | TypeScript | 5 |
| Frontend build tool | Vite | 5 |
| Frontend styling | Tailwind CSS | 3 |
| Frontend charts | Recharts | 2 |
| Frontend state | Zustand | 4 |
| Frontend routing | React Router | v6 |
| Backend framework | FastAPI | 0.111 |
| Backend language | Python | 3.11 |
| Backend ORM | SQLAlchemy | 2.0 |
| Backend validation | Pydantic | v2 |
| Database | SQLite | — |
| PDF generation | ReportLab | 4.1 |
| Containerization | Docker + Compose | — |
| CI-ready testing | pytest | — |

---

## Project Structure

```
kz-cyber-fusion/
│
├── README.md                        ← You are here
├── .env.example                     ← Copy to .env before running
├── .gitignore
├── docker-compose.yml               ← One-command startup
│
├── shared/
│   └── constants/
│       ├── severity_levels.json     ← Severity thresholds + colors
│       └── detector_weights.json    ← Fusion formula weights
│
├── docs/
│   ├── architecture.md              ← System design + data flow
│   ├── demo_guide.md                ← How to run the demo + judge talking points
│   ├── api_reference.md             ← All 14 endpoints with curl examples
│   ├── detector_logic.md            ← How each detector scores
│   ├── fusion_logic.md              ← How correlation works
│   └── kazakhstan_cases.md          ← Real KZ threats that inspired the system
│
├── backend/                         ← FastAPI + Python 3.11
│   ├── main.py                      ← App entry point, router registration
│   ├── config.py                    ← Settings + severity helpers
│   ├── database.py                  ← SQLAlchemy engine + session
│   ├── requirements.txt
│   ├── Dockerfile
│   │
│   ├── detectors/                   ← 6 rule-based detection modules
│   │   ├── phishing_detector.py
│   │   ├── leak_detector.py
│   │   ├── anomaly_detector.py
│   │   ├── deepfake_detector.py
│   │   ├── network_detector.py
│   │   └── log_detector.py
│   │
│   ├── fusion/                      ← Cyber Fusion Engine
│   │   ├── risk_scorer.py           ← Weighted formula + correlation boost
│   │   ├── correlator.py            ← Pattern matching + IP convergence
│   │   ├── explainer.py             ← Natural language generation
│   │   ├── timeline_builder.py      ← Chronological event sequence
│   │   └── incident_builder.py      ← Final incident assembly
│   │
│   ├── assistant/
│   │   ├── soc_assistant.py         ← Q&A logic for analyst questions
│   │   └── response_recommender.py  ← Defensive action generation
│   │
│   ├── evidence/
│   │   ├── package_builder.py       ← Structured evidence dict
│   │   └── pdf_exporter.py          ← ReportLab A4 PDF report
│   │
│   ├── demo/
│   │   ├── sms_blaster_scenario.py  ← Scenario loader
│   │   └── demo_runner.py           ← End-to-end simulation
│   │
│   ├── routers/                     ← 13 thin FastAPI routers
│   ├── services/                    ← 12 business logic services
│   ├── models/                      ← 5 SQLAlchemy ORM models
│   ├── schemas/                     ← 11 Pydantic request/response schemas
│   ├── data/                        ← 7 JSON rule/mock data files
│   ├── auth/                        ← Auth stubs (not implemented for MVP)
│   └── tests/                       ← 58 pytest tests, all passing
│
└── frontend/                        ← React 18 + TypeScript + Vite
    ├── src/
    │   ├── pages/                   ← 7 page components
    │   ├── components/              ← 35+ UI components
    │   ├── api/                     ← Typed API client functions
    │   ├── store/                   ← Zustand global state
    │   ├── types/                   ← TypeScript type definitions
    │   └── utils/                   ← Risk calculator, formatters, demo data
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── Dockerfile
```

---

## Kazakhstan Cases That Inspired This System

| Case | Year | Scale | Maps To |
|---|---|---|---|
| SMS Blaster / Fake base station attack in Almaty & Astana | 2026 | 50,000+ SMS per deployment | AI Phishing Shield |
| KZ-CERT incident surge | 2023–2024 | 34,500 → 68,100 incidents (+97%) | All detectors |
| Zaimer.kz data leak | 2023 | 2.1–3.4 million user records | Leak Sentinel |
| Deepfake voice fraud surge | 2024 | +245% cases YoY | Deepfake Guard |
| Anti-Fraud Center financial fraud | 2024 | 90,100 cases, 21.7B KZT loss | Fusion Engine |
| Botnet / C2 activity in KZ networks | 2024 | 13,620 incidents | Network Monitor + Log Engine |

Full case details: [`docs/kazakhstan_cases.md`](docs/kazakhstan_cases.md)

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | Server health check |
| POST | `/api/detect/phishing` | Detect phishing in SMS or email |
| POST | `/api/detect/leak` | Check credentials against breach data |
| POST | `/api/detect/anomaly` | Detect suspicious login behavior |
| POST | `/api/detect/deepfake` | Detect synthetic voice or video |
| POST | `/api/detect/network` | Detect C2 / suspicious network traffic |
| POST | `/api/detect/logs` | Analyze authentication logs |
| POST | `/api/fusion/correlate` | Correlate all signals into one incident |
| GET | `/api/incidents` | List all incidents |
| GET | `/api/incidents/{id}` | Get incident by ID |
| POST | `/api/assistant/ask` | Ask SOC assistant about an incident |
| POST | `/api/response/trigger` | Trigger a defensive response action |
| GET | `/api/evidence/{id}` | Get evidence package for incident |
| GET | `/api/evidence/{id}/pdf` | Download evidence PDF |
| POST | `/api/demo/run` | **Run the full SMS Blaster demo** |

Full documentation with curl examples: [`docs/api_reference.md`](docs/api_reference.md)

---

## Running Tests

```bash

cd backend
python -m pytest tests/ -v
```

Expected output: **58 passed**

Tests cover: phishing detector, leak detector, anomaly detector, risk scorer, correlator, and full demo runner — including verification that demo scores match the exact spec (phishing 95, leak 88, anomaly 91, deepfake 87, network 80, logs 82, fusion 97).

---

## Documentation

| Document | Contents |
|---|---|
| [`docs/architecture.md`](docs/architecture.md) | System design, data flow, module roles |
| [`docs/demo_guide.md`](docs/demo_guide.md) | How to run the demo, judge talking points, Q&A prep |
| [`docs/api_reference.md`](docs/api_reference.md) | All 14 endpoints, request/response shapes, curl examples |
| [`docs/detector_logic.md`](docs/detector_logic.md) | How each detector scores, what rules trigger, examples |
| [`docs/fusion_logic.md`](docs/fusion_logic.md) | Weighted formula, correlation boost, timeline, explanation |
| [`docs/kazakhstan_cases.md`](docs/kazakhstan_cases.md) | Real KZ threat cases that inspired each detector |

---

## Roadmap — After MVP

| Feature | Status |
|---|---|
| Rule-based detectors (6 modules) | ✅ MVP |
| Cyber Fusion Engine | ✅ MVP |
| AI SOC Assistant (rule-based Q&A) | ✅ MVP |
| Evidence PDF export | ✅ MVP |
| SMS Blaster demo scenario | ✅ MVP |
| Auth / login system | ⏳ Post-MVP |
| Real multilingual phishing ML classifier | ⏳ Post-MVP |
| Real deepfake audio/video neural model | ⏳ Post-MVP |
| Real SIEM integration (Elastic/Splunk) | ⏳ Post-MVP |
| Real darknet credential monitoring | ⏳ Post-MVP |
| Real KZ bank fraud API integration | ⏳ Post-MVP |
| Graph-based fraud network analysis | ⏳ Post-MVP |
| Streaming real-time event ingestion | ⏳ Post-MVP |
| Interactive geographic alert map | ⏳ Post-MVP |

---


## License

All rights reserved by the team.

---

*KZ Cyber Fusion | AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24*
*"Not just a detector. An intelligence platform."*
