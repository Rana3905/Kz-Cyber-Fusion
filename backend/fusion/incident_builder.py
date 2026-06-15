import uuid
from datetime import datetime, timezone
from fusion.risk_scorer import calculate_fusion_score
from fusion.correlator import correlate
from fusion.explainer import generate_explanation
from fusion.timeline_builder import build_timeline
from assistant.response_recommender import recommend_actions


def build_incident(
    detector_results: dict,
    affected_entity: dict,
    incident_id: str = None,
) -> dict:
    """
    Master builder: takes all detector results and produces a complete incident object.
    """
    phishing_r = detector_results.get("phishing", {})
    leak_r = detector_results.get("leak", {})
    anomaly_r = detector_results.get("anomaly", {})
    deepfake_r = detector_results.get("deepfake", {})
    network_r = detector_results.get("network", {})
    logs_r = detector_results.get("logs", {})

    scoring = calculate_fusion_score(
        phishing_score=phishing_r.get("score", 0),
        leak_score=leak_r.get("score", 0),
        anomaly_score=anomaly_r.get("score", 0),
        deepfake_score=deepfake_r.get("score", 0),
        network_score=network_r.get("score", 0),
        log_score=logs_r.get("score", 0),
    )

    correlation = correlate(detector_results, affected_entity)

    # Apply pattern risk boost
    final_risk = min(scoring["risk_score"] + correlation["max_risk_boost"], 100)

    from config import get_severity
    final_severity = get_severity(final_risk)

    explanation = generate_explanation(
        detector_results=detector_results,
        affected_entity=affected_entity,
        risk_score=final_risk,
        severity=final_severity,
        active_detectors=scoring["active_detectors"],
    )

    timeline = build_timeline(detector_results)
    recommended_actions = recommend_actions(detector_results, affected_entity, final_severity)

    iid = incident_id or f"KCF-{str(uuid.uuid4())[:6].upper()}"

    # Build incident title based on detected patterns
    if correlation["matched_patterns"]:
        title = f"Coordinated Financial Fraud Attack — {correlation['matched_patterns'][0]['name']}"
    elif scoring["active_detectors"] >= 3:
        title = f"Multi-Signal Cyber Threat — {final_severity} Risk Incident"
    else:
        title = f"Cyber Security Incident — {final_severity} Risk"

    return {
        "id": iid,
        "title": title,
        "risk_score": final_risk,
        "severity": final_severity,
        "confidence": scoring["confidence"],
        "status": "open",
        "affected_entity": affected_entity,
        "detector_results": detector_results,
        "timeline": timeline,
        "explanation": explanation,
        "recommended_actions": recommended_actions,
        "correlation_metadata": correlation,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
