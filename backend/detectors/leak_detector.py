import json
from datetime import datetime, timezone
from pathlib import Path
from config import get_severity

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def detect(email: str = "", phone: str = "", username: str = "") -> dict:
    leaked = _load_json("leaked_credentials.json")

    score = 0
    reasons = []
    triggered_rules = []
    breach_sources_matched = []

    if email and email.lower() in [e.lower() for e in leaked["emails"]]:
        score += 45
        reasons.append(f"Email '{email}' found in Zaimer.kz breach (2023)")
        triggered_rules.append("RULE_EMAIL_IN_BREACH")
        breach_sources_matched.append("Zaimer.kz breach (2023)")

    if phone and phone in leaked["phones"]:
        score += 35
        reasons.append(f"Phone number found in KZ telecom leak (2022)")
        triggered_rules.append("RULE_PHONE_IN_BREACH")
        breach_sources_matched.append("KZ telecom leak (2022)")

    if username and username.lower() in [u.lower() for u in leaked["usernames"]]:
        score += 30
        reasons.append(f"Username '{username}' found in leaked dataset")
        triggered_rules.append("RULE_USERNAME_IN_BREACH")
        breach_sources_matched.append("Online marketplace breach (2023)")

    if len(breach_sources_matched) >= 2:
        score += 10
        reasons.append(f"{len(breach_sources_matched)} breach sources matched for this identity")
        triggered_rules.append("RULE_MULTIPLE_BREACH_SOURCES")

    score = min(score, 100)
    confidence = round(min(0.55 + score / 200, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No credential leaks found for this identity"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "leak",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
