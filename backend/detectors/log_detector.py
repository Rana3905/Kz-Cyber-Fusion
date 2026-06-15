import json
from datetime import datetime, timezone
from pathlib import Path
from config import get_severity

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def detect(
    user_id: str = "",
    failed_logins: int = 0,
    time_window_seconds: int = 0,
    privilege_escalation_attempts: int = 0,
    unusual_commands: list = None,
    source_ip: str = "",
) -> dict:
    suspicious_ips = _load_json("suspicious_ips.json")
    fraud_patterns = _load_json("fraud_patterns.json")

    score = 0
    reasons = []
    triggered_rules = []
    unusual_commands = unusual_commands or []

    burst_threshold = fraud_patterns["failed_login_burst_threshold"]

    # Rule: failed login burst
    if failed_logins >= burst_threshold:
        rate = failed_logins / max(time_window_seconds, 1) * 60  # per minute
        score += min(35, int(failed_logins / burst_threshold * 20))
        reasons.append(
            f"{failed_logins} failed login attempts in {time_window_seconds // 60} minutes — brute force pattern"
        )
        triggered_rules.append("RULE_FAILED_LOGIN_BURST")

        if rate >= 10:
            score += 15
            reasons.append(f"High-rate brute force: ~{rate:.0f} attempts/minute")
            triggered_rules.append("RULE_BRUTE_FORCE_PATTERN")

    # Rule: privilege escalation
    if privilege_escalation_attempts >= 1:
        score += 20
        reasons.append(f"{privilege_escalation_attempts} privilege escalation attempt(s) detected")
        triggered_rules.append("RULE_PRIVILEGE_ESCALATION")

    # Rule: source IP is known bad
    if source_ip and source_ip in suspicious_ips["known_bad_ips"]:
        score += 20
        reasons.append(f"Login attempts sourced from known bad IP: {source_ip}")
        triggered_rules.append("RULE_KNOWN_BAD_IP_SOURCE")

    # Rule: unusual commands
    dangerous_commands = ["sudo", "chmod 777", "passwd", "useradd", "rm -rf", "curl | bash", "wget | bash"]
    found_dangerous = [cmd for cmd in unusual_commands if any(d in cmd for d in dangerous_commands)]
    if found_dangerous:
        score += 15
        reasons.append(f"Dangerous commands detected in logs: {', '.join(found_dangerous[:3])}")
        triggered_rules.append("RULE_DANGEROUS_COMMANDS")

    score = min(score, 100)
    confidence = round(min(0.55 + score / 200, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No suspicious log activity detected"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "logs",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
