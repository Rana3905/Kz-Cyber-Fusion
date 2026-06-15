import json
from datetime import datetime, timezone
from pathlib import Path
from config import get_severity

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def detect(
    source_ip: str = "",
    destination_ip: str = "",
    destination_port: int = 0,
    protocol: str = "",
    bytes_transferred: int = 0,
    connection_frequency: int = 0,
    country: str = "",
) -> dict:
    suspicious_ips = _load_json("suspicious_ips.json")
    fraud_patterns = _load_json("fraud_patterns.json")

    score = 0
    reasons = []
    triggered_rules = []

    # Rule: known bad destination IP
    if destination_ip and destination_ip in suspicious_ips["known_bad_ips"]:
        score += 30
        reasons.append(f"Outbound traffic to known bad IP: {destination_ip}")
        triggered_rules.append("RULE_KNOWN_BAD_IP_DESTINATION")

    # Rule: C2 port
    if destination_port and destination_port in fraud_patterns["c2_ports"]:
        score += 25
        reasons.append(f"Destination port {destination_port} is a known C2/malware port")
        triggered_rules.append("RULE_C2_PORT")

    # Rule: suspicious outbound country
    if country and country.upper() in fraud_patterns["suspicious_outbound_countries"]:
        score += 15
        reasons.append(f"Suspicious outbound traffic destination country: {country}")
        triggered_rules.append("RULE_SUSPICIOUS_OUTBOUND_COUNTRY")

    # Rule: beaconing pattern (high-frequency small connections)
    if connection_frequency and connection_frequency >= 10:
        score += 15
        reasons.append(f"High connection frequency ({connection_frequency}) suggests beaconing behavior")
        triggered_rules.append("RULE_BEACONING_PATTERN")

    # Rule: unusual data exfiltration (large outbound transfer to suspicious host)
    if bytes_transferred >= 10000 and destination_ip in suspicious_ips["known_bad_ips"]:
        score += 10
        reasons.append(f"Large data transfer ({bytes_transferred} bytes) to suspicious destination")
        triggered_rules.append("RULE_DATA_EXFILTRATION")

    # Rule: Tor destination
    if destination_ip and destination_ip in suspicious_ips["tor_exit_nodes"]:
        score += 10
        reasons.append(f"Traffic routed through Tor exit node: {destination_ip}")
        triggered_rules.append("RULE_TOR_DESTINATION")

    score = min(score, 100)
    confidence = round(min(0.55 + score / 200, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No suspicious network activity detected"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "network",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
