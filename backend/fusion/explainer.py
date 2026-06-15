def generate_explanation(
    detector_results: dict,
    affected_entity: dict,
    risk_score: int,
    severity: str,
    active_detectors: int,
) -> str:
    """
    Generates a human-readable explanation for a correlated cyber-fraud incident.
    """
    parts = []
    entity_desc = _describe_entity(affected_entity)

    parts.append(
        f"A coordinated {severity.lower()}-severity cyber-fraud attack was detected"
        f"{' targeting ' + entity_desc if entity_desc else ''}."
    )

    chain_description = _describe_attack_chain(detector_results)
    if chain_description:
        parts.append(chain_description)

    # Correlation statement
    if active_detectors >= 5:
        parts.append(
            f"All {active_detectors} detection signals converge on the same victim identity, "
            "IP address, and time window, confirming a coordinated attack chain."
        )
    elif active_detectors >= 3:
        parts.append(
            f"{active_detectors} correlated detection signals point to the same victim and time window, "
            "indicating a coordinated attack."
        )

    parts.append(
        f"Final incident risk score: {risk_score}/100 ({severity}). "
        "Immediate analyst action is required."
    )

    return " ".join(parts)


def _describe_entity(entity: dict) -> str:
    if not entity:
        return ""
    parts = []
    if entity.get("email"):
        parts.append(entity["email"])
    if entity.get("phone"):
        parts.append(entity["phone"])
    return " / ".join(parts) if parts else ""


def _describe_attack_chain(detector_results: dict) -> str:
    chain_parts = []

    phishing = detector_results.get("phishing", {})
    if phishing.get("score", 0) > 50:
        chain_parts.append(
            f"A phishing attempt was detected (score: {phishing['score']}/100)."
        )

    leak = detector_results.get("leak", {})
    if leak.get("score", 0) > 50:
        chain_parts.append(
            f"The victim's credentials were found in a known breach database (score: {leak['score']}/100)."
        )

    anomaly = detector_results.get("anomaly", {})
    if anomaly.get("score", 0) > 50:
        chain_parts.append(
            f"A suspicious login from an unusual location was detected immediately after the phishing attempt (score: {anomaly['score']}/100)."
        )

    deepfake = detector_results.get("deepfake", {})
    if deepfake.get("score", 0) > 50:
        chain_parts.append(
            f"A deepfake voice or video call impersonating a bank official was detected (score: {deepfake['score']}/100)."
        )

    network = detector_results.get("network", {})
    if network.get("score", 0) > 50:
        chain_parts.append(
            f"Suspicious outbound C2-like network traffic was observed (score: {network['score']}/100)."
        )

    logs = detector_results.get("logs", {})
    if logs.get("score", 0) > 50:
        chain_parts.append(
            f"Log analysis revealed a brute-force login burst from a known bad IP (score: {logs['score']}/100)."
        )

    return " ".join(chain_parts)
