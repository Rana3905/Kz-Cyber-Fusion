def recommend_actions(
    detector_results: dict,
    affected_entity: dict,
    severity: str,
) -> list[str]:
    """
    Recommends automated response actions based on detector results and severity.
    """
    actions = []
    ip = affected_entity.get("ip", "")
    email = affected_entity.get("email", "")
    phone = affected_entity.get("phone", "")

    anomaly = detector_results.get("anomaly", {})
    network = detector_results.get("network", {})
    logs = detector_results.get("logs", {})
    phishing = detector_results.get("phishing", {})
    leak = detector_results.get("leak", {})

    # Block IP if suspicious login or network threat
    if ip and (anomaly.get("score", 0) > 50 or network.get("score", 0) > 50):
        actions.append(f"BLOCK IP {ip} immediately")

    # Freeze account if credential leak or suspicious login
    if email and (leak.get("score", 0) > 50 or anomaly.get("score", 0) > 50):
        actions.append(f"FREEZE account for {email}")

    # Force password reset if leak detected
    if email and leak.get("score", 0) > 40:
        actions.append(f"FORCE password reset for {email}")

    # Flag transactions if critical
    if severity in ("Critical", "High"):
        actions.append("FLAG all recent transactions for manual review")

    # Notify analyst always on high/critical
    if severity in ("Critical", "High"):
        actions.append("NOTIFY AFM fraud analyst on duty")

    # Create investigation ticket
    actions.append("CREATE investigation ticket with full evidence package")

    # Escalate on critical
    if severity == "Critical":
        actions.append("ESCALATE to AFM Financial Intelligence Unit")

    # Phone block if phishing via SMS
    if phone and phishing.get("score", 0) > 60:
        actions.append(f"REPORT phishing number {phone} to KZ telecom regulator")

    return actions
