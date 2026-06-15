from config import settings, get_severity


def calculate_fusion_score(
    phishing_score: int = 0,
    leak_score: int = 0,
    anomaly_score: int = 0,
    deepfake_score: int = 0,
    network_score: int = 0,
    log_score: int = 0,
) -> dict:
    """
    Weighted fusion score using the official weights from the spec.
    Returns final risk score, severity, and confidence.
    """
    weighted = (
        phishing_score * settings.WEIGHT_PHISHING
        + leak_score * settings.WEIGHT_LEAK
        + anomaly_score * settings.WEIGHT_ANOMALY
        + deepfake_score * settings.WEIGHT_DEEPFAKE
        + network_score * settings.WEIGHT_NETWORK
        + log_score * settings.WEIGHT_LOGS
    )

    # Count how many detectors fired above 50
    active_detectors = sum(
        1 for s in [phishing_score, leak_score, anomaly_score, deepfake_score, network_score, log_score]
        if s > 50
    )

    # Correlation boost: more correlated signals = higher confidence in attack chain
    correlation_boost = 0
    if active_detectors >= 5:
        correlation_boost = 5
    elif active_detectors >= 4:
        correlation_boost = 3
    elif active_detectors >= 3:
        correlation_boost = 2

    final_score = min(int(weighted) + correlation_boost, 100)
    confidence = round(min(0.60 + active_detectors * 0.06, 0.99), 2)

    return {
        "risk_score": final_score,
        "severity": get_severity(final_score),
        "confidence": confidence,
        "active_detectors": active_detectors,
        "correlation_boost": correlation_boost,
        "weighted_base": round(weighted, 1),
    }
