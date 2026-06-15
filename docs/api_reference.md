# API Reference

**KZ Cyber Fusion | AFM AI Hackathon 2026 | Track 2: AI Shield**

Base URL: `http://localhost:8000`

All responses use the envelope format:
```json
{ "success": true, "data": { ... }, "error": null }
```
On error: `{ "success": false, "data": null, "error": "message" }`

Interactive docs available at: `http://localhost:8000/docs`

---

## Health

### `GET /health`

Returns server status. Used by Docker healthcheck.

**Response:**
```json
{ "success": true, "data": { "status": "ok" }, "error": null }
```

---

## Detection Endpoints

All six detectors return the same shape:

```json
{
  "success": true,
  "data": {
    "score": 95,
    "confidence": 0.97,
    "severity": "Critical",
    "reasons": ["string", "..."],
    "triggered_rules": ["RULE_NAME", "..."],
    "detector": "phishing",
    "timestamp": "2024-06-15T03:14:00+00:00"
  },
  "error": null
}
```

---

### `POST /api/detect/phishing`

Detects phishing in an SMS or email message.

**Request body:**
```json
{
  "message": "Kaspi Bank: Вы выиграли 50,000 тенге! Срочно: http://kaspi-bonus.ru/claim",
  "url": "http://kaspi-bonus.ru/claim",
  "sender": "+77089999999",
  "channel": "sms"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `message` | string | No | Full SMS or email body |
| `url` | string | No | URL extracted from the message |
| `sender` | string | No | Sender phone or email |
| `channel` | string | No | `sms` (default), `email`, `web` |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/phishing \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Kaspi Bank: Вы выиграли 50,000 тенге! Срочно: http://kaspi-bonus.ru/claim",
    "url": "http://kaspi-bonus.ru/claim",
    "channel": "sms"
  }'
```

---

### `POST /api/detect/leak`

Checks credentials against known breach datasets.

**Request body:**
```json
{
  "email": "victim@example.kz",
  "phone": "+77001234567",
  "username": "victim_user"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | No | User email address |
| `phone` | string | No | Phone in E.164 format |
| `username` | string | No | Account username |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/leak \
  -H "Content-Type: application/json" \
  -d '{ "email": "victim@example.kz", "phone": "+77001234567" }'
```

---

### `POST /api/detect/anomaly`

Detects suspicious login behavior and impossible travel.

**Request body:**
```json
{
  "email": "victim@example.kz",
  "ip_address": "185.220.101.45",
  "country": "RU",
  "previous_country": "KZ",
  "device_id": "unknown-android-xyz",
  "login_time": "2024-06-15T03:14:00Z",
  "previous_ip": "77.60.10.5"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | string | No | User identity |
| `ip_address` | string | No | IP of current login |
| `country` | string | No | 2-letter country code of IP |
| `previous_country` | string | No | Country of last known login |
| `device_id` | string | No | Device identifier |
| `login_time` | string | No | ISO8601 timestamp |
| `previous_ip` | string | No | IP of previous login |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/anomaly \
  -H "Content-Type: application/json" \
  -d '{
    "ip_address": "185.220.101.45",
    "country": "RU",
    "previous_country": "KZ",
    "login_time": "2024-06-15T03:14:00Z"
  }'
```

---

### `POST /api/detect/deepfake`

Detects synthetic voice or video in a recorded call.

**Request body:**
```json
{
  "call_id": "CALL-20240615-001",
  "media_type": "voice",
  "voice_inconsistency_score": 0.89,
  "video_artifact_score": 0.0,
  "claimed_identity": "Kaspi Bank Security Officer",
  "duration_seconds": 187
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `call_id` | string | No | Unique call reference |
| `media_type` | string | No | `voice` (default) or `video` |
| `voice_inconsistency_score` | float | No | 0.0–1.0 from voice analysis model |
| `video_artifact_score` | float | No | 0.0–1.0 from video analysis model |
| `claimed_identity` | string | No | Who the caller claims to be |
| `duration_seconds` | integer | No | Call duration |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/deepfake \
  -H "Content-Type: application/json" \
  -d '{
    "media_type": "voice",
    "voice_inconsistency_score": 0.89,
    "claimed_identity": "Kaspi Bank Security Officer"
  }'
```

---

### `POST /api/detect/network`

Detects C2 communication, beaconing, and suspicious outbound traffic.

**Request body:**
```json
{
  "source_ip": "192.168.1.45",
  "destination_ip": "185.220.101.45",
  "destination_port": 4444,
  "protocol": "TCP",
  "bytes_transferred": 14520,
  "connection_frequency": 12,
  "country": "RU"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `source_ip` | string | No | Origin IP |
| `destination_ip` | string | No | Destination IP |
| `destination_port` | integer | No | Destination port |
| `protocol` | string | No | TCP, UDP, etc. |
| `bytes_transferred` | integer | No | Total bytes |
| `connection_frequency` | integer | No | Connection count in window |
| `country` | string | No | Destination country code |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/network \
  -H "Content-Type: application/json" \
  -d '{
    "destination_ip": "185.220.101.45",
    "destination_port": 4444,
    "connection_frequency": 12,
    "country": "RU"
  }'
```

---

### `POST /api/detect/logs`

Analyzes authentication logs for brute-force and privilege escalation.

**Request body:**
```json
{
  "user_id": "victim@example.kz",
  "failed_logins": 47,
  "time_window_seconds": 180,
  "privilege_escalation_attempts": 2,
  "unusual_commands": ["sudo passwd root"],
  "source_ip": "185.220.101.45"
}
```

| Field | Type | Required | Description |
|---|---|---|---|
| `user_id` | string | No | Target user or account |
| `failed_logins` | integer | No | Number of failed attempts |
| `time_window_seconds` | integer | No | Observation window |
| `privilege_escalation_attempts` | integer | No | Escalation attempt count |
| `unusual_commands` | string[] | No | Suspicious commands from logs |
| `source_ip` | string | No | Source IP of the attempts |

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/detect/logs \
  -H "Content-Type: application/json" \
  -d '{
    "failed_logins": 47,
    "time_window_seconds": 180,
    "source_ip": "185.220.101.45"
  }'
```

---

## Fusion Endpoint

### `POST /api/fusion/correlate`

Correlates multiple detector scores into a single incident. Persists the incident to the database.

**Request body:**
```json
{
  "email": "victim@example.kz",
  "phone": "+77001234567",
  "ip_address": "185.220.101.45",
  "device_id": "unknown-android-xyz",
  "phishing_score": 95,
  "leak_score": 88,
  "anomaly_score": 91,
  "deepfake_score": 87,
  "network_score": 80,
  "log_score": 82,
  "detector_results": null
}
```

Pass individual scores **or** pass `detector_results` as the full dict of detector outputs. If `detector_results` is provided, it takes precedence.

**Response `data` shape:** Full incident object (see Incident shape below).

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/fusion/correlate \
  -H "Content-Type: application/json" \
  -d '{
    "email": "victim@example.kz",
    "ip_address": "185.220.101.45",
    "phishing_score": 95,
    "leak_score": 88,
    "anomaly_score": 91,
    "deepfake_score": 87,
    "network_score": 80,
    "log_score": 82
  }'
```

---

## Incident Endpoints

### Incident Object Shape

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
  "detector_results": { "phishing": { ... }, "leak": { ... }, ... },
  "timeline": [
    {
      "time": "2024-06-15T03:14:00+00:00",
      "event": "Phishing SMS / Email Detected",
      "detector": "phishing",
      "score": 95,
      "severity": "Critical",
      "reasons": ["..."]
    }
  ],
  "explanation": "A coordinated critical-severity ...",
  "recommended_actions": [
    "BLOCK IP 185.220.101.45 immediately",
    "FREEZE account for victim@example.kz",
    "..."
  ],
  "created_at": "2024-06-15T03:32:00+00:00"
}
```

---

### `GET /api/incidents`

Returns all incidents, ordered by creation date descending.

**Query parameters:**
| Param | Type | Default | Description |
|---|---|---|---|
| `skip` | integer | 0 | Pagination offset |
| `limit` | integer | 100 | Max results (max 500) |

**Example curl:**
```bash
curl http://localhost:8000/api/incidents
curl "http://localhost:8000/api/incidents?skip=0&limit=10"
```

---

### `GET /api/incidents/{incident_id}`

Returns a single incident by ID.

**Example curl:**
```bash
curl http://localhost:8000/api/incidents/KCF-001
```

**404 if not found:**
```json
{ "success": false, "data": null, "error": "Incident 'KCF-XYZ' not found" }
```

---

### `PATCH /api/incidents/{incident_id}/status`

Updates the status of an incident.

**Query parameter:** `status` — one of `open`, `investigating`, `resolved`

**Example curl:**
```bash
curl -X PATCH "http://localhost:8000/api/incidents/KCF-001/status?status=investigating"
```

---

## Assistant Endpoint

### `POST /api/assistant/ask`

Asks the AI SOC Assistant a question about a specific incident.

**Request body:**
```json
{
  "incident_id": "KCF-001",
  "question": "Why is this incident critical?"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "answer": "This incident is marked Critical (risk score: 97/100) because: ...",
    "confidence": 0.95
  },
  "error": null
}
```

**Suggested questions the assistant handles well:**
- "Why is this incident critical?"
- "What is the strongest evidence?"
- "What happened first?"
- "What should I do next?"
- "Is this phishing, account takeover, or coordinated fraud?"
- "What is the risk score?"
- "Who is the victim?"
- "Show me the timeline"

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/assistant/ask \
  -H "Content-Type: application/json" \
  -d '{ "incident_id": "KCF-001", "question": "What happened first?" }'
```

---

## Response Endpoints

### `POST /api/response/trigger`

Triggers a simulated defensive response action for an incident.

**Request body:**
```json
{
  "incident_id": "KCF-001",
  "action_type": "block_ip",
  "target": "185.220.101.45"
}
```

| `action_type` value | Description |
|---|---|
| `block_ip` | Block IP at firewall level |
| `freeze_account` | Freeze user account |
| `force_password_reset` | Force password reset |
| `flag_transaction` | Flag transactions for review |
| `notify_analyst` | Alert on-duty analyst |
| `create_ticket` | Create investigation ticket |
| `escalate` | Escalate to AFM FIU |

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "ACT-A1B2C3D4",
    "incident_id": "KCF-001",
    "action_type": "block_ip",
    "description": "Block suspicious IP address at firewall level — Target: 185.220.101.45",
    "executed": true,
    "result": {
      "status": "success",
      "message": "IP 185.220.101.45 added to firewall blocklist",
      "firewall_rule_id": "FW-X9Y8Z7"
    },
    "created_at": "2024-06-15T03:35:00+00:00"
  },
  "error": null
}
```

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/response/trigger \
  -H "Content-Type: application/json" \
  -d '{ "incident_id": "KCF-001", "action_type": "freeze_account", "target": "victim@example.kz" }'
```

---

### `GET /api/response/actions/{incident_id}`

Returns all response actions triggered for an incident.

**Example curl:**
```bash
curl http://localhost:8000/api/response/actions/KCF-001
```

---

## Evidence Endpoints

### `GET /api/evidence/{incident_id}`

Returns the structured evidence package for an incident. Creates and persists it on first call.

**Response `data` shape:**
```json
{
  "id": "EVD-AB647790",
  "incident_id": "KCF-001",
  "summary": "A coordinated critical-severity ...",
  "risk_score": "97/100",
  "confidence_score": "95%",
  "affected_entity": { ... },
  "timeline": [ ... ],
  "detector_results": { ... },
  "recommended_actions": [ ... ],
  "explainability_notes": [
    "Incident risk score 97/100 indicates Critical-level threat.",
    "6 of 6 detectors fired above threshold: phishing, leak, anomaly, deepfake, network, logs.",
    "..."
  ],
  "created_at": "2024-06-15T03:32:00+00:00"
}
```

**Example curl:**
```bash
curl http://localhost:8000/api/evidence/KCF-001
```

---

### `GET /api/evidence/{incident_id}/pdf`

Downloads the evidence package as a formatted A4 PDF report.

**Response:** Binary PDF file with `Content-Disposition: attachment; filename=evidence-KCF-001.pdf`

**Example curl:**
```bash
curl -o evidence-KCF-001.pdf http://localhost:8000/api/evidence/KCF-001/pdf
```

---

## Demo Endpoint

### `POST /api/demo/run`

Runs the full Kazakhstan SMS Blaster fraud simulation end-to-end. This is the main demo button endpoint.

**Request body:** None required (empty body `{}` is fine).

**Response:**
```json
{
  "success": true,
  "data": {
    "scenario": "Kazakhstan SMS Blaster Financial Fraud",
    "steps": [
      {
        "step": 1,
        "label": "Fake Kaspi Bonus SMS Detected",
        "detector": "phishing",
        "result": { "score": 95, "severity": "Critical", "reasons": ["..."], ... }
      },
      {
        "step": 2,
        "label": "Credentials Found in Zaimer-Style Breach",
        "detector": "leak",
        "result": { "score": 88, ... }
      },
      { "step": 3, "detector": "anomaly", "result": { "score": 91, ... } },
      { "step": 4, "detector": "deepfake", "result": { "score": 87, ... } },
      { "step": 5, "detector": "network", "result": { "score": 80, ... } },
      { "step": 6, "detector": "logs", "result": { "score": 82, ... } },
      {
        "step": 7,
        "label": "Cyber Fusion Engine: Critical Incident Generated",
        "detector": "fusion",
        "result": {
          "id": "KCF-001",
          "risk_score": 97,
          "severity": "Critical",
          "confidence": 0.95,
          ...
        },
        "evidence_id": "EVD-AB647790"
      }
    ],
    "incident": { ... },
    "evidence": { ... },
    "completed_at": "2024-06-15T03:32:05+00:00"
  },
  "error": null
}
```

**Example curl:**
```bash
curl -X POST http://localhost:8000/api/demo/run \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Guaranteed demo scores:**

| Step | Detector | Score | Severity |
|---|---|---|---|
| 1 | Phishing | 95 | Critical |
| 2 | Leak | 88 | Critical |
| 3 | Anomaly | 91 | Critical |
| 4 | Deepfake | 87 | Critical |
| 5 | Network | 80 | Critical |
| 6 | Logs | 82 | Critical |
| 7 | **Fusion** | **97** | **Critical** |

---

*KZ Cyber Fusion | AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24*
