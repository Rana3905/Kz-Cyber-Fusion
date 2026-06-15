# Detector Logic Reference


This document explains how each of the six detection modules works, what rules they apply, how scores are calculated, and what real-world inputs trigger them.

All detectors follow the same output contract:

```json
{
  "score": 0-100,
  "confidence": 0.0-1.0,
  "severity": "Low | Medium | High | Critical",
  "reasons": ["human-readable explanation", "..."],
  "triggered_rules": ["RULE_NAME", "..."],
  "detector": "phishing | leak | anomaly | deepfake | network | logs",
  "timestamp": "ISO8601"
}
```

Severity thresholds: Low (0–39), Medium (40–59), High (60–79), Critical (80–100).

---

## 1. AI Phishing Shield

**File:** `backend/detectors/phishing_detector.py`  
**Endpoint:** `POST /api/detect/phishing`  
**Fusion weight:** 0.25 (highest)

### Purpose

Detects phishing attempts delivered via SMS, email, or web. Focuses on the Kazakhstan financial fraud context: fake Kaspi Bank and Halyk Bank messages, fake bonus offers, urgency language, and malicious URLs targeting `.kz` users.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `message` | string | The SMS or email body text |
| `url` | string | URL extracted from the message |
| `sender` | string | Phone number or email address of sender |
| `channel` | string | `sms`, `email`, or `web` |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_URGENCY_LANGUAGE` | Message contains urgency words in Russian ("Срочно", "немедленно", "только сегодня", "истекает") | +15 |
| `RULE_URGENCY_LANGUAGE` | Message contains urgency words in Kazakh ("тез арада", "дереу", "шұғыл") | +15 |
| `RULE_FAKE_BONUS_OFFER` | Message contains fake bonus language ("выиграли", "бонус", "подарок", "приз", "акция") | +20 |
| `RULE_FAKE_BONUS_OFFER` | Kazakh bonus words ("ұтып алдыңыз", "сыйлық", "тегін") | +20 |
| `RULE_BANK_IMPERSONATION` | Message mentions Kaspi Bank, Halyk Bank, BTA, Jusan, ForteBank | +20 |
| `RULE_KNOWN_PHISHING_DOMAIN` | URL domain matches known phishing list (kaspi-bonus.kz, halyk-promo.com, etc.) | +25 |
| `RULE_SUSPICIOUS_URL` | URL contains pattern words: bonus, promo, win, lucky, free, gift, reward, claim | +10 |
| `RULE_SUSPICIOUS_TLD` | URL uses .ru, .net, .xyz, .top, .click, .pw instead of .kz | +10 |
| `RULE_SMS_CONTAINS_URL` | Channel is SMS and message contains `http://` or `https://` | +10 |
| `RULE_ACTION_WORD` | Message contains action words ("перейдите по ссылке", "подтвердите", "введите данные") | +5 |
| `RULE_THREAT_LANGUAGE` | Message contains threat words ("заблокирован", "ограничен", "подозрительная активность") | +10 |

**Score cap:** 100. **Confidence formula:** `min(0.60 + score / 250, 0.99)`

### Score Interpretation

| Score | Meaning |
|---|---|
| 0–10 | Clean message, no phishing indicators |
| 11–39 | Low suspicion — one minor signal present |
| 40–59 | Moderate — urgency or brand mention without URL |
| 60–79 | High — multiple signals, suspicious URL present |
| 80–100 | Critical — full phishing chain: impersonation + fake offer + suspicious URL + urgency |

### Example: SMS Blaster Demo Trigger

**Input:**
```
Message: "Kaspi Bank: Вы выиграли 50,000 тенге! Срочно перейдите по ссылке: http://kaspi-bonus.ru/claim"
URL: http://kaspi-bonus.ru/claim
Channel: sms
```

**Triggered rules:** `RULE_URGENCY_LANGUAGE` (+15), `RULE_FAKE_BONUS_OFFER` (+20), `RULE_BANK_IMPERSONATION` (+20), `RULE_KNOWN_PHISHING_DOMAIN` (+25), `RULE_SUSPICIOUS_TLD` (+10), `RULE_SMS_CONTAINS_URL` (+10)

**Result:** Score 95, Severity Critical

---

## 2. Leak Sentinel

**File:** `backend/detectors/leak_detector.py`  
**Endpoint:** `POST /api/detect/leak`  
**Fusion weight:** 0.20

### Purpose

Checks whether a user's email address, phone number, or username appears in known breach datasets. In the Kazakhstan context, this primarily reflects the Zaimer.kz breach (2023), KZ telecom leak (2022), and similar exposures that placed millions of KZ residents' credentials on underground markets.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `email` | string | User's email address |
| `phone` | string | Phone number (E.164 format, e.g. +77001234567) |
| `username` | string | Account username or handle |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_EMAIL_IN_BREACH` | Email found in breach dataset | +45 |
| `RULE_PHONE_IN_BREACH` | Phone number found in breach dataset | +35 |
| `RULE_USERNAME_IN_BREACH` | Username found in breach dataset | +30 |
| `RULE_MULTIPLE_BREACH_SOURCES` | 2 or more of the above triggered | +10 |

**Score cap:** 100. **Confidence formula:** `min(0.55 + score / 200, 0.99)`

### Score Interpretation

| Score | Meaning |
|---|---|
| 0 | Identity not found in any breach dataset |
| 30–45 | Single credential type found in one breach |
| 65–80 | Two credential types found — high exposure risk |
| 90–100 | All three found across multiple breaches — critical exposure |

### Example: Zaimer Breach Match

**Input:**
```json
{ "email": "victim@example.kz", "phone": "+77001234567" }
```

**Result:** Email match (+45) + Phone match (+35) + Multiple sources (+10) = Score 88, Severity Critical

---

## 3. Behavioral Anomaly Engine

**File:** `backend/detectors/anomaly_detector.py`  
**Endpoint:** `POST /api/detect/anomaly`  
**Fusion weight:** 0.20

### Purpose

Detects unauthorized or suspicious access patterns: logins from untrusted countries, known malicious IPs, Tor exit nodes, new unrecognized devices, abnormal login times, and physically impossible travel between consecutive logins.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `email` | string | User identity |
| `ip_address` | string | IP address of the login attempt |
| `country` | string | 2-letter country code of IP origin |
| `previous_country` | string | Country of the user's last known login |
| `device_id` | string | Device identifier |
| `login_time` | string | ISO8601 timestamp of login |
| `previous_ip` | string | IP of previous login (optional) |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_SUSPICIOUS_COUNTRY` | Login from RU, CN, NG, RO, UA, BR, VN | +25 |
| `RULE_KNOWN_BAD_IP` | IP is in the known bad IPs list | +30 |
| `RULE_TOR_EXIT_NODE` | IP is a known Tor exit node | +15 |
| `RULE_NEW_DEVICE` | Device ID contains "unknown" or "new" | +15 |
| `RULE_IMPOSSIBLE_TRAVEL` | Previous country KZ, current country is suspicious, within 2-hour window | +20 |
| `RULE_ABNORMAL_LOGIN_TIME` | Login between 00:00 and 04:59 UTC | +10 |

**Score cap:** 100. **Confidence formula:** `min(0.55 + score / 220, 0.99)`

### Score Interpretation

| Score | Meaning |
|---|---|
| 0–15 | Normal login behavior |
| 16–39 | One minor anomaly (e.g. late-night login from known country) |
| 40–59 | Moderate — suspicious country or new device |
| 60–79 | High — bad IP or impossible travel |
| 80–100 | Critical — multiple strong signals: Tor exit node + impossible travel + new device |

### Example: Post-Phishing Login from Russia

**Input:**
```json
{
  "email": "victim@example.kz",
  "ip_address": "185.220.101.45",
  "country": "RU",
  "previous_country": "KZ",
  "device_id": "unknown-android-xyz",
  "login_time": "2024-06-15T03:14:00Z"
}
```

**Triggered rules:** `RULE_SUSPICIOUS_COUNTRY` (+25), `RULE_KNOWN_BAD_IP` (+30), `RULE_TOR_EXIT_NODE` (+15), `RULE_NEW_DEVICE` (+15), `RULE_IMPOSSIBLE_TRAVEL` (+20), `RULE_ABNORMAL_LOGIN_TIME` (+10) = Score 91 (capped), Severity Critical

---

## 4. Deepfake Guard

**File:** `backend/detectors/deepfake_detector.py`  
**Endpoint:** `POST /api/detect/deepfake`  
**Fusion weight:** 0.15

### Purpose

Detects synthetic media (voice or video) used to impersonate bank officers, government officials, or executives. In the Kazakhstan context, this targets the rapidly growing pattern of AI-generated voice calls following phishing events to complete social engineering of victims.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `call_id` | string | Unique call identifier |
| `media_type` | string | `voice` or `video` |
| `voice_inconsistency_score` | float | 0.0–1.0 model output for voice anomaly |
| `video_artifact_score` | float | 0.0–1.0 model output for video artifact |
| `claimed_identity` | string | Who the caller claims to be |
| `duration_seconds` | integer | Call duration |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_HIGH_VOICE_INCONSISTENCY` | Voice inconsistency score ≥ 0.85 | +45 |
| `RULE_ELEVATED_INCONSISTENCY` | Score 0.70–0.84 | +30 |
| `RULE_MODERATE_INCONSISTENCY` | Score 0.50–0.69 | +15 |
| `RULE_BANK_OFFICIAL_CLAIMED_IDENTITY` | Claimed identity contains "bank", "kaspi", "halyk", "security officer", "fraud department" | +20 |
| `RULE_SYNTHETIC_VOICE_PATTERN` | Inconsistency score ≥ 0.80 (confirms synthesis) | +15 |
| `RULE_SHORT_AUTHORITY_CALL` | Call duration < 30 seconds for a claimed authority figure | +10 |

**Score cap:** 100. **Confidence formula:** `min(0.55 + raw_score * 0.45, 0.99)`

### Score Interpretation

| Score | Meaning |
|---|---|
| 0–20 | Natural voice, no synthesis indicators |
| 21–39 | Low suspicion — minor inconsistency |
| 40–59 | Moderate — elevated inconsistency, worth reviewing |
| 60–79 | High — strong synthesis markers |
| 80–100 | Critical — confirmed synthetic voice + bank impersonation claim |

### Example: Bank Officer Deepfake Call

**Input:**
```json
{
  "media_type": "voice",
  "voice_inconsistency_score": 0.89,
  "claimed_identity": "Kaspi Bank Security Officer",
  "duration_seconds": 187
}
```

**Result:** +45 (high inconsistency) + +20 (bank official) + +15 (synthetic pattern) = Score 87, Severity Critical

---

## 5. Network Threat Monitor

**File:** `backend/detectors/network_detector.py`  
**Endpoint:** `POST /api/detect/network`  
**Fusion weight:** 0.10

### Purpose

Identifies malicious outbound network traffic from a user's device or network segment: C2 server communication, botnet beaconing, Tor usage, and data exfiltration to suspicious destinations. In the Kazakhstan context, this catches the C2 traffic observed in the 72-hour window before account takeovers.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `source_ip` | string | Origin IP of the traffic |
| `destination_ip` | string | Destination IP |
| `destination_port` | integer | Destination port number |
| `protocol` | string | TCP, UDP, etc. |
| `bytes_transferred` | integer | Total bytes in the session |
| `connection_frequency` | integer | Number of connections in the observation window |
| `country` | string | 2-letter destination country code |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_KNOWN_BAD_IP_DESTINATION` | Destination IP in bad IP list | +30 |
| `RULE_C2_PORT` | Destination port in C2 list: 4444, 8080, 8443, 1080, 6667, 31337, 9001, 9030 | +25 |
| `RULE_SUSPICIOUS_OUTBOUND_COUNTRY` | Destination country in RU, CN, NG | +15 |
| `RULE_BEACONING_PATTERN` | Connection frequency ≥ 10 in window | +15 |
| `RULE_DATA_EXFILTRATION` | bytes_transferred ≥ 10,000 to suspicious IP | +10 |
| `RULE_TOR_DESTINATION` | Destination IP is Tor exit node | +10 |

**Score cap:** 100. **Confidence formula:** `min(0.55 + score / 200, 0.99)`

### C2 Ports Reference

| Port | Associated Malware / Protocol |
|---|---|
| 4444 | Metasploit default, generic backdoor |
| 8080 | HTTP proxy C2, many RAT families |
| 8443 | HTTPS C2 (certificate bypass) |
| 1080 | SOCKS proxy |
| 6667 | IRC-based botnet C2 |
| 31337 | Elite backdoor (legacy) |
| 9001, 9030 | Tor relay ports |

### Example: C2 Beaconing Detection

**Input:**
```json
{
  "source_ip": "192.168.1.45",
  "destination_ip": "185.220.101.45",
  "destination_port": 4444,
  "bytes_transferred": 14520,
  "connection_frequency": 12,
  "country": "RU"
}
```

**Result:** +30 (bad IP) + +25 (C2 port) + +15 (RU) + +15 (beaconing) + +10 (exfil) = Score 80 (capped), Severity Critical

---

## 6. Log Intelligence Engine

**File:** `backend/detectors/log_detector.py`  
**Endpoint:** `POST /api/detect/logs`  
**Fusion weight:** 0.10

### Purpose

Analyzes authentication and system log patterns for brute-force attacks, privilege escalation attempts, and account takeover indicators. Typically the last detector to fire in a coordinated attack chain — it confirms that an active exploitation attempt is in progress.

### Input Fields

| Field | Type | Description |
|---|---|---|
| `user_id` | string | Target user or account |
| `failed_logins` | integer | Number of failed login attempts |
| `time_window_seconds` | integer | Time window the failures occurred in |
| `privilege_escalation_attempts` | integer | Number of escalation attempts |
| `unusual_commands` | string[] | List of suspicious commands found in logs |
| `source_ip` | string | IP address the attempts originated from |

### Scoring Rules

| Rule ID | Trigger Condition | Score Added |
|---|---|---|
| `RULE_FAILED_LOGIN_BURST` | failed_logins ≥ 10 within window | +20–35 (scales with count) |
| `RULE_BRUTE_FORCE_PATTERN` | Rate ≥ 10 attempts/minute | +15 |
| `RULE_PRIVILEGE_ESCALATION` | privilege_escalation_attempts ≥ 1 | +20 |
| `RULE_KNOWN_BAD_IP_SOURCE` | Source IP in bad IP list | +20 |
| `RULE_DANGEROUS_COMMANDS` | Logs contain: `sudo`, `chmod 777`, `passwd`, `useradd`, `rm -rf`, `curl \| bash` | +15 |

**Score cap:** 100. **Confidence formula:** `min(0.55 + score / 200, 0.99)`

### Score Interpretation

| Score | Meaning |
|---|---|
| 0–15 | Normal log activity |
| 16–39 | Low — occasional failed logins (user error) |
| 40–59 | Moderate — elevated failures, possible credential stuffing |
| 60–79 | High — burst pattern + bad IP source |
| 80–100 | Critical — confirmed brute force + privilege escalation + known attacker IP |

### Example: 47 Failed Logins in 3 Minutes

**Input:**
```json
{
  "user_id": "victim@example.kz",
  "failed_logins": 47,
  "time_window_seconds": 180,
  "privilege_escalation_attempts": 2,
  "source_ip": "185.220.101.45"
}
```

**Rate:** 47 / 3 min = ~15.7 attempts/minute

**Result:** +35 (burst, scaled) + +15 (brute force rate) + +20 (privilege escalation) + +20 (bad IP) = Score 82 (capped), Severity Critical

---

## Cross-Detector Notes

### Score Independence

Each detector scores independently. A high score in one detector does not affect another detector's score. Correlation happens in the Cyber Fusion Engine, not at the detector level.

### Threshold for "Active" Signal

The Cyber Fusion Engine considers a detector "active" (contributing to correlation boost) when its score exceeds **50**. This prevents low-confidence detections from inflating the final incident risk.

### Extensibility

All detectors are designed as rule-based MVP implementations. Each detector function accepts the same input shape it will receive from a real ML model replacement. Replacing a rule-based detector with an ML model requires only updating the detector file — no changes to services, routers, or the fusion engine.

---


