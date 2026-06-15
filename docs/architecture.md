# System Architecture

**KZ Cyber Fusion | AFM AI Hackathon 2026 | Track 2: AI Shield**

---

## System Overview

KZ Cyber Fusion is a two-tier web application: a React frontend that renders the SOC dashboard, and a FastAPI backend that runs all detection, correlation, and evidence generation logic. They communicate exclusively over a REST API.

```
┌─────────────────────────────────────────────────────────────────┐
│                        ANALYST BROWSER                          │
│                                                                 │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │              React 18 + TypeScript + Vite               │   │
│   │                  (port 5173)                            │   │
│   │                                                         │   │
│   │  Overview │ Detectors │ Incidents │ Assistant │ Evidence│   │
│   └──────────────────────────┬──────────────────────────────┘   │
└──────────────────────────────┼──────────────────────────────────┘
                               │ HTTP REST (JSON)
                               │ Base URL: http://localhost:8000
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Backend                             │
│                       (port 8000)                               │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐     │
│  │ (thin)   │  │ (logic)  │  │  (6 mod) │  │   Engine     │     │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘     │
│                                    │               │            │
│                    ┌───────────────┴───────────────┘            │
│                    ▼                                            │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              SQLite Database (SQLAlchemy)               │    │
│  │     incidents │ alerts │ evidence │ response_actions    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow: From Input to Incident

```
INPUT (SMS text / login event / network log / media file)
    │
    ▼
┌─────────────────────────────────────┐
│         Detection Layer             │
│                                     │
│  phishing_detector  →  score 0-100  │
│  leak_detector      →  score 0-100  │
│  anomaly_detector   →  score 0-100  │
│  deepfake_detector  →  score 0-100  │
│  network_detector   →  score 0-100  │
│  log_detector       →  score 0-100  │
└──────────────────┬──────────────────┘
                   │  6 × {score, confidence, reasons, rules}
                   ▼
┌─────────────────────────────────────┐
│         Cyber Fusion Engine         │
│                                     │
│  risk_scorer     → weighted score   │
│  correlator      → pattern match    │
│  explainer       → natural language │
│  timeline_builder→ chronology       │
│  incident_builder→ unified object   │
└──────────────────┬──────────────────┘
                   │  1 × Incident {id, risk_score, severity, ...}
                   ▼
┌─────────────────────────────────────┐
│       Response + Evidence           │
│                                     │
│  response_recommender → actions[]   │
│  soc_assistant        → Q&A         │
│  package_builder      → evidence    │
│  pdf_exporter         → PDF bytes   │
└──────────────────┬──────────────────┘
                   │
                   ▼
          SQLite (persisted)
                   │
                   ▼
          REST API response
                   │
                   ▼
          React Dashboard
```

---

## Backend Module Roles

### `main.py`
FastAPI application entry point. Registers all 13 routers, configures CORS for `localhost:5173`, attaches the global exception handler that ensures every error returns the standard `{success, data, error}` envelope, and calls `init_db()` on startup.

### `config.py`
All environment-driven configuration via `pydantic_settings`. Contains detector fusion weights, severity thresholds, and CORS origins. Both the backend logic and any future configuration UI read from this single source.

### `database.py`
SQLAlchemy engine and session setup. `init_db()` creates all tables from model definitions. `get_db()` is a FastAPI dependency injected into every router that needs database access.

### `routers/` (13 files)
**Thin routers only.** Each router file contains one or two endpoint functions. The function receives the HTTP request, extracts the payload, calls the corresponding service function, and wraps the result in `{success, data, error}`. No business logic lives here.

### `services/` (12 files)
**Business logic layer.** Services orchestrate calls to detectors, the fusion engine, and the database. They validate inputs, call the right detector/fusion module, and return results to the router.

### `detectors/` (6 files)
**Pure detection logic.** Each detector implements a single `detect()` function. It takes domain-specific inputs, applies rule-based scoring, and returns the standard detector response dict. No database access, no HTTP — pure computation.

### `fusion/` (5 files)
**Correlation and intelligence layer.** Takes all six detector outputs and produces a single correlated incident. The five files map to five distinct responsibilities: scoring, correlation, explanation, timeline, and incident assembly.

### `assistant/` (2 files)
**SOC Q&A and response logic.** `soc_assistant.py` handles natural-language questions about incidents using keyword matching and structured context injection. `response_recommender.py` generates the ordered list of defensive actions.

### `evidence/` (2 files)
**Report generation.** `package_builder.py` assembles the evidence dict. `pdf_exporter.py` renders it as a professional A4 PDF using ReportLab — no external dependencies.

### `demo/` (2 files)
**Demo scenario execution.** `sms_blaster_scenario.py` loads the hardcoded scenario from `data/demo_scenario.json`. `demo_runner.py` orchestrates all six detectors and the fusion engine in sequence, overriding computed scores with the scenario's expected values to guarantee a consistent demo story.

### `data/` (7 JSON files)
Static rule data used by detectors: phishing keywords in Russian and Kazakh, known phishing URLs, suspicious IPs, Tor exit nodes, leaked credential samples, C2 ports, and the full SMS Blaster demo scenario.

### `models/` (5 files)
SQLAlchemy ORM models. Each model maps to a database table: `incidents`, `alerts`, `evidence`, `detector_results`, `response_actions`.

### `schemas/` (11 files)
Pydantic request/response schemas. Defines the shape of every API request body and every service return value.

---

## Frontend Module Roles

### `src/pages/`
Six page components mapped to React Router routes:
- `/` — Overview dashboard with live stats and alert feed
- `/detectors` — Individual detector input forms and results
- `/incidents` — Incident list with filtering and sorting
- `/incidents/:id` — Full incident detail with timeline and correlation
- `/assistant` — AI SOC assistant chat interface
- `/evidence/:id` — Evidence report viewer with PDF download
- `/response` — Automated response action panel

### `src/components/`
Organized into six subfolders matching the domain areas: `layout`, `dashboard`, `detectors`, `incidents`, `assistant`, `response`, `evidence`, `demo`, `shared`.

### `src/api/`
One file per backend resource. Each file exports typed async functions that call the corresponding API endpoint. All functions use the base URL from `VITE_API_URL`.

### `src/store/`
Zustand stores for global state: `incidentStore`, `alertStore`, `demoStore`, `assistantStore`.

### `src/types/`
TypeScript type definitions matching the backend API contract exactly.

---

## API Communication Contract

All API responses follow the envelope format:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}
```

Base URL: `http://localhost:8000` (configurable via `VITE_API_URL`)

Frontend never makes requests directly to detectors during the demo — it calls `POST /api/demo/run` which returns the complete step-by-step simulation in a single response. Individual detector endpoints exist for the manual input forms in the Detectors page.

---

## Deployment Architecture

### Local Development
```
Terminal 1: cd backend && uvicorn main:app --reload --port 8000
Terminal 2: cd frontend && npm run dev --port 5173
```

### Docker Compose
```
docker-compose up --build
```
- Backend container: `kzcf_backend` on port 8000
- Frontend container: `kzcf_frontend` on port 5173
- Network: `kzcf_network` (bridge)
- Frontend `depends_on` backend with `service_healthy` condition
- Backend health check: `GET /health` every 10 seconds

### Production (Planned Post-MVP)
- Backend: Railway or Render (FastAPI + SQLite → PostgreSQL)
- Frontend: Vercel (static build from `npm run build`)
- Shared secrets via environment variables, not committed to git

---

## Security Notes (MVP)

- Authentication is stubbed (`backend/auth/`) — not implemented for MVP
- CORS is open for `localhost:5173` and `localhost:3000`
- No API keys or secrets required for MVP operation
- SQLite database file excluded from git via `.gitignore`
- All demo data is static and contains no real personal information

---

*KZ Cyber Fusion | AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24*
