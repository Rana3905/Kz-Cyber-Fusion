import json
from datetime import datetime, timezone
from pathlib import Path
from config import get_severity

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def detect(
    email: str = "",
    ip_address: str = "",
    country: str = "",
    previous_country: str = "",
    device_id: str = "",
    login_time: str = "",
    previous_ip: str = "",
) -> dict:
    suspicious_ips = _load_json("suspicious_ips.json")
    fraud_patterns = _load_json("fraud_patterns.json")

    score = 0
    reasons = []
    triggered_rules = []

    # Rule: suspicious country
    if country and country.upper() in suspicious_ips["suspicious_countries"]:
        score += 25
        reasons.append(f"Login from {country} — unusual for KZ-based user")
        triggered_rules.append("RULE_SUSPICIOUS_COUNTRY")

    # Rule: known bad IP
    if ip_address and ip_address in suspicious_ips["known_bad_ips"]:
        score += 30
        reasons.append(f"IP {ip_address} is a known Tor exit node / bad IP")
        triggered_rules.append("RULE_KNOWN_BAD_IP")

    # Rule: Tor exit node
    if ip_address and ip_address in suspicious_ips["tor_exit_nodes"]:
        score += 15
        reasons.append(f"IP {ip_address} is listed as a Tor exit node")
        if "RULE_KNOWN_BAD_IP" not in triggered_rules:
            triggered_rules.append("RULE_TOR_EXIT_NODE")

    # Rule: new device
    if device_id and ("unknown" in device_id.lower() or "new" in device_id.lower()):
        score += 15
        reasons.append("New unrecognized device used for login")
        triggered_rules.append("RULE_NEW_DEVICE")

    # Rule: impossible travel
    if previous_country and country and previous_country != country:
        hours_threshold = fraud_patterns["impossible_travel_hours"]
        if previous_country == "KZ" and country in suspicious_ips["suspicious_countries"]:
            score += 20
            reasons.append(
                f"Impossible travel: {previous_country} → {country} in less than {hours_threshold} hours"
            )
            triggered_rules.append("RULE_IMPOSSIBLE_TRAVEL")

    # Rule: abnormal login time (between 00:00 and 05:00 UTC)
    if login_time:
        try:
            dt = datetime.fromisoformat(login_time.replace("Z", "+00:00"))
            if dt.hour < 5:
                score += 10
                reasons.append(f"Login at {dt.strftime('%H:%M')} UTC — abnormal login time")
                triggered_rules.append("RULE_ABNORMAL_LOGIN_TIME")
        except ValueError:
            pass

    score = min(score, 100)
    confidence = round(min(0.55 + score / 220, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No behavioral anomalies detected"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "anomaly",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
