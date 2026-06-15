import uuid
from datetime import datetime, timezone


def build_evidence_package(incident: dict) -> dict:
    """
    Builds a structured evidence package from a correlated incident.
    """
    evidence_id = f"EVD-{str(uuid.uuid4())[:8].upper()}"

    detectors = incident.get("detector_results", {})

    explainability_notes = _build_explainability_notes(incident, detectors)

    return {
        "id": evidence_id,
        "incident_id": incident.get("id", "UNKNOWN"),
        "summary": incident.get("explanation", "No explanation available."),
        "risk_score": f"{incident.get('risk_score', 0)}/100",
        "confidence_score": f"{incident.get('confidence', 0):.0%}",
        "affected_entity": incident.get("affected_entity", {}),
        "timeline": incident.get("timeline", []),
        "detector_results": detectors,
        "recommended_actions": incident.get("recommended_actions", []),
        "explainability_notes": explainability_notes,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }


def _build_explainability_notes(incident: dict, detectors: dict) -> list[str]:
    notes = []

    risk = incident.get("risk_score", 0)
    severity = incident.get("severity", "Unknown")
    notes.append(f"Incident risk score {risk}/100 indicates {severity}-level threat.")

    active_detectors = [d for d, r in detectors.items() if r.get("score", 0) > 50]
    if active_detectors:
        notes.append(
            f"{len(active_detectors)} of 6 detectors fired above threshold: "
            f"{', '.join(active_detectors)}."
        )

    corr = incident.get("correlation_metadata", {})
    if corr.get("is_coordinated"):
        patterns = corr.get("matched_patterns", [])
        for p in patterns:
            notes.append(
                f"Attack pattern matched: '{p['name']}' "
                f"(signals: {', '.join(p['matched_signals'])}, boost: +{p['risk_boost']})."
            )

    if corr.get("ip_convergence"):
        notes.append(
            "The same suspicious IP address appears across multiple detection signals — "
            "strong indicator of a coordinated attack from a single threat actor."
        )

    # Add top reason from each active detector
    for detector_name in active_detectors:
        result = detectors.get(detector_name, {})
        reasons = result.get("reasons", [])
        if reasons:
            notes.append(f"{detector_name.capitalize()} detector key finding: {reasons[0]}")

    return notes
