import json
from pathlib import Path

DATA_DIR = Path(__file__).parent.parent / "data"


def _load_json(filename: str) -> dict:
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


def correlate(detector_results: dict, affected_entity: dict) -> dict:
    """
    Correlates detector results against known fraud patterns.
    Returns correlation metadata including matched patterns and signal count.
    """
    fraud_patterns = _load_json("fraud_patterns.json")

    active_signals = [
        detector for detector, result in detector_results.items()
        if result.get("score", 0) > 50
    ]

    matched_patterns = []
    max_risk_boost = 0

    for pattern in fraud_patterns["coordinated_fraud_chains"]:
        pattern_signals = set(pattern["steps"])
        signal_map = {
            "phishing_sms": "phishing",
            "credential_leak": "leak",
            "suspicious_login": "anomaly",
            "deepfake_call": "deepfake",
            "account_takeover": "logs",
            "failed_login_burst": "logs",
        }
        mapped_pattern_signals = {signal_map.get(s, s) for s in pattern_signals}
        overlap = mapped_pattern_signals & set(active_signals)

        if len(overlap) >= pattern["min_signals"]:
            matched_patterns.append({
                "name": pattern["name"],
                "matched_signals": list(overlap),
                "risk_boost": pattern["base_risk_boost"],
            })
            max_risk_boost = max(max_risk_boost, pattern["base_risk_boost"])

    # Identity convergence: check if same IP appears in multiple detectors
    ip = affected_entity.get("ip", "")
    ip_convergence = False
    if ip:
        ip_mentions = sum(
            1 for result in detector_results.values()
            if ip in str(result.get("reasons", ""))
        )
        ip_convergence = ip_mentions >= 2

    return {
        "active_signals": active_signals,
        "signal_count": len(active_signals),
        "matched_patterns": matched_patterns,
        "pattern_count": len(matched_patterns),
        "max_risk_boost": max_risk_boost,
        "ip_convergence": ip_convergence,
        "is_coordinated": len(matched_patterns) > 0,
    }
