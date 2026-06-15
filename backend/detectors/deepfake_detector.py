from datetime import datetime, timezone
from config import get_severity


def detect(
    call_id: str = "",
    media_type: str = "voice",
    voice_inconsistency_score: float = 0.0,
    video_artifact_score: float = 0.0,
    claimed_identity: str = "",
    duration_seconds: int = 0,
) -> dict:
    score = 0
    reasons = []
    triggered_rules = []

    # Determine main inconsistency score based on media type
    raw_score = voice_inconsistency_score if media_type == "voice" else video_artifact_score

    # Rule: high inconsistency score
    if raw_score >= 0.85:
        score += 45
        reasons.append(f"High {'voice' if media_type == 'voice' else 'video'} inconsistency score: {raw_score:.2f}")
        triggered_rules.append("RULE_HIGH_VOICE_INCONSISTENCY" if media_type == "voice" else "RULE_HIGH_VIDEO_ARTIFACT")
    elif raw_score >= 0.70:
        score += 30
        reasons.append(f"Elevated {'voice' if media_type == 'voice' else 'video'} inconsistency score: {raw_score:.2f}")
        triggered_rules.append("RULE_ELEVATED_INCONSISTENCY")
    elif raw_score >= 0.50:
        score += 15
        reasons.append(f"Moderate inconsistency score: {raw_score:.2f}")
        triggered_rules.append("RULE_MODERATE_INCONSISTENCY")

    # Rule: bank official claimed identity
    bank_identities = ["bank", "kaspi", "halyk", "security officer", "fraud department", "support"]
    if claimed_identity and any(term in claimed_identity.lower() for term in bank_identities):
        score += 20
        reasons.append(f"Claimed identity is a bank official: '{claimed_identity}' — common deepfake impersonation target")
        triggered_rules.append("RULE_BANK_OFFICIAL_CLAIMED_IDENTITY")

    # Rule: synthetic voice/video pattern (score threshold heuristic)
    if raw_score >= 0.80:
        score += 15
        reasons.append(f"Synthetic {'voice' if media_type == 'voice' else 'video'} pattern detected based on model output")
        triggered_rules.append("RULE_SYNTHETIC_VOICE_PATTERN" if media_type == "voice" else "RULE_SYNTHETIC_VIDEO_PATTERN")

    # Rule: suspiciously short call for claimed authority
    if duration_seconds and duration_seconds < 30:
        score += 10
        reasons.append("Unusually short call duration for claimed authority figure")
        triggered_rules.append("RULE_SHORT_AUTHORITY_CALL")

    score = min(score, 100)
    confidence = round(min(0.55 + raw_score * 0.45, 0.99), 2)

    return {
        "score": score,
        "confidence": confidence,
        "severity": get_severity(score),
        "reasons": reasons if reasons else ["No deepfake indicators detected in this media"],
        "triggered_rules": list(set(triggered_rules)),
        "detector": "deepfake",
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
