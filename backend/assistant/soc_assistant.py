"""
Rule-based SOC assistant that answers analyst questions about incidents.
Structured as keyword-matching Q&A with context injection from the incident.
"""


def answer_question(incident: dict, question: str) -> dict:
    q = question.lower().strip()

    # Try each handler in order of specificity
    handlers = [
        (_is_why_critical, _answer_why_critical),
        (_is_strongest_evidence, _answer_strongest_evidence),
        (_is_what_happened_first, _answer_what_happened_first),
        (_is_what_to_do, _answer_what_to_do),
        (_is_attack_type, _answer_attack_type),
        (_is_risk_score, _answer_risk_score),
        (_is_affected_entity, _answer_affected_entity),
        (_is_timeline, _answer_timeline),
    ]

    for check_fn, answer_fn in handlers:
        if check_fn(q):
            answer = answer_fn(incident)
            confidence = _calculate_confidence(incident)
            return {"answer": answer, "confidence": confidence}

    # Fallback general answer
    return {
        "answer": _general_answer(incident),
        "confidence": 0.70,
    }


def _is_why_critical(q: str) -> bool:
    return any(w in q for w in ["why", "critical", "severe", "high risk", "dangerous"])


def _answer_why_critical(incident: dict) -> str:
    risk = incident.get("risk_score", 0)
    severity = incident.get("severity", "Unknown")
    detectors = incident.get("detector_results", {})
    active = [d for d, r in detectors.items() if r.get("score", 0) > 50]

    parts = [
        f"This incident is marked {severity} (risk score: {risk}/100) because:"
    ]
    if len(active) >= 3:
        parts.append(
            f"• {len(active)} separate detection systems fired above the 50-point threshold simultaneously."
        )
    for d in active:
        score = detectors[d].get("score", 0)
        parts.append(f"• {d.capitalize()} detector score: {score}/100")

    corr = incident.get("correlation_metadata", {})
    if corr.get("is_coordinated"):
        patterns = corr.get("matched_patterns", [])
        if patterns:
            parts.append(f"• Matches known attack pattern: '{patterns[0]['name']}'")

    parts.append(
        "• Multiple correlated signals from the same identity/IP window confirm a coordinated attack."
    )
    return "\n".join(parts)


def _is_strongest_evidence(q: str) -> bool:
    return any(w in q for w in ["strongest", "evidence", "best", "most confident", "highest score"])


def _answer_strongest_evidence(incident: dict) -> str:
    detectors = incident.get("detector_results", {})
    if not detectors:
        return "No detector results available to assess evidence strength."

    sorted_detectors = sorted(detectors.items(), key=lambda x: x[1].get("score", 0), reverse=True)
    top = sorted_detectors[0]
    detector_name, result = top

    reasons = result.get("reasons", [])
    reason_text = "\n• ".join(reasons[:3]) if reasons else "See detector output for details."

    return (
        f"The strongest evidence comes from the {detector_name.capitalize()} detector "
        f"(score: {result.get('score', 0)}/100, confidence: {result.get('confidence', 0):.0%}).\n\n"
        f"Key reasons:\n• {reason_text}"
    )


def _is_what_happened_first(q: str) -> bool:
    return any(w in q for w in ["first", "started", "began", "initial", "timeline", "sequence"])


def _answer_what_happened_first(incident: dict) -> str:
    timeline = incident.get("timeline", [])
    if not timeline:
        return "No timeline data available for this incident."

    first = timeline[0]
    second = timeline[1] if len(timeline) > 1 else None

    answer = (
        f"The first detected event was: **{first['event']}** "
        f"(at {first['time']}, score: {first.get('score', 'N/A')})."
    )
    if second:
        answer += f"\n\nThis was followed by: **{second['event']}** at {second['time']}."

    return answer


def _is_what_to_do(q: str) -> bool:
    return any(w in q for w in ["what should", "next step", "action", "do next", "recommend", "response"])


def _answer_what_to_do(incident: dict) -> str:
    actions = incident.get("recommended_actions", [])
    if not actions:
        return "No automated response actions have been generated for this incident yet."

    action_list = "\n".join(f"{i+1}. {a}" for i, a in enumerate(actions))
    return (
        f"Recommended immediate actions for this {incident.get('severity', '')} incident:\n\n"
        + action_list
    )


def _is_attack_type(q: str) -> bool:
    return any(w in q for w in ["type", "phishing", "account takeover", "fraud", "deepfake", "coordinated"])


def _answer_attack_type(incident: dict) -> str:
    corr = incident.get("correlation_metadata", {})
    patterns = corr.get("matched_patterns", [])
    active = corr.get("active_signals", [])

    if patterns:
        pattern_names = ", ".join(p["name"] for p in patterns)
        return (
            f"This incident matches the following known attack pattern(s): {pattern_names}.\n\n"
            f"Active attack vectors detected: {', '.join(active)}.\n\n"
            "This is a coordinated, multi-vector attack — not an isolated event."
        )
    elif active:
        return (
            f"This incident involves the following attack vectors: {', '.join(active)}. "
            "No complete known pattern was matched, but multiple signals are present."
        )
    return "Attack type could not be determined — insufficient signals."


def _is_risk_score(q: str) -> bool:
    return any(w in q for w in ["score", "risk", "rating", "number"])


def _answer_risk_score(incident: dict) -> str:
    return (
        f"This incident has a risk score of {incident.get('risk_score', 0)}/100, "
        f"severity: {incident.get('severity', 'Unknown')}, "
        f"confidence: {incident.get('confidence', 0):.0%}."
    )


def _is_affected_entity(q: str) -> bool:
    return any(w in q for w in ["who", "victim", "user", "email", "phone", "ip", "entity"])


def _answer_affected_entity(incident: dict) -> str:
    entity = incident.get("affected_entity", {})
    if not entity:
        return "No entity information available."
    parts = []
    if entity.get("email"):
        parts.append(f"Email: {entity['email']}")
    if entity.get("phone"):
        parts.append(f"Phone: {entity['phone']}")
    if entity.get("ip"):
        parts.append(f"Suspicious IP: {entity['ip']}")
    if entity.get("device"):
        parts.append(f"Device: {entity['device']}")
    return "Affected entity:\n" + "\n".join(parts)


def _is_timeline(q: str) -> bool:
    return any(w in q for w in ["timeline", "when", "time", "sequence", "order"])


def _answer_timeline(incident: dict) -> str:
    timeline = incident.get("timeline", [])
    if not timeline:
        return "No timeline data available."
    lines = [f"{i+1}. [{e['time'][11:16]} UTC] {e['event']} (score: {e.get('score', 'N/A')})" for i, e in enumerate(timeline)]
    return "Incident timeline:\n" + "\n".join(lines)


def _general_answer(incident: dict) -> str:
    return (
        f"This is a {incident.get('severity', 'Unknown')}-severity incident "
        f"(risk score: {incident.get('risk_score', 0)}/100). "
        f"{incident.get('explanation', 'No detailed explanation available.')}"
    )


def _calculate_confidence(incident: dict) -> float:
    base = incident.get("confidence", 0.70)
    return round(min(base, 0.99), 2)
