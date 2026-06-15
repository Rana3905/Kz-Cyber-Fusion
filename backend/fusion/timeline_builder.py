from datetime import datetime, timezone, timedelta


def build_timeline(detector_results: dict, base_time: str = None) -> list[dict]:
    """
    Builds a chronological timeline of events from detector results.
    """
    if base_time:
        try:
            base_dt = datetime.fromisoformat(base_time.replace("Z", "+00:00"))
        except ValueError:
            base_dt = datetime.now(timezone.utc)
    else:
        base_dt = datetime.now(timezone.utc)

    events = []
    offset_minutes = 0

    detector_order = [
        ("phishing", "Phishing SMS / Email Detected"),
        ("leak", "Credential Breach Match Found"),
        ("anomaly", "Suspicious Login Detected"),
        ("deepfake", "Deepfake Call Detected"),
        ("network", "Suspicious Network Traffic Observed"),
        ("logs", "Log Anomaly Detected"),
    ]

    for detector_key, label in detector_order:
        result = detector_results.get(detector_key, {})
        if result and result.get("score", 0) > 0:
            event_time = base_dt + timedelta(minutes=offset_minutes)
            events.append({
                "time": event_time.isoformat(),
                "event": label,
                "detector": detector_key,
                "score": result.get("score", 0),
                "severity": result.get("severity", "Low"),
                "reasons": result.get("reasons", []),
            })
            offset_minutes += 3

    # Add the fusion event at the end
    if events:
        fusion_time = base_dt + timedelta(minutes=offset_minutes)
        events.append({
            "time": fusion_time.isoformat(),
            "event": "Cyber Fusion Engine: Incident Correlated",
            "detector": "fusion",
            "score": 100,
            "severity": "Critical",
            "reasons": ["All signals correlated into a unified incident"],
        })

    return events
