from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.fusion import FusionRequest
from services import fusion_service, incident_service

router = APIRouter(prefix="/api/fusion", tags=["fusion"])


@router.post("/correlate")
async def correlate(request: FusionRequest, db: Session = Depends(get_db)):
    detector_results = request.detector_results or {}

    # Build from individual scores if full detector_results not provided
    if not detector_results:
        def _make(detector: str, score: int):
            from config import get_severity
            from datetime import datetime, timezone
            return {
                "score": score,
                "confidence": round(min(0.6 + score / 250, 0.99), 2),
                "severity": get_severity(score),
                "reasons": [f"Score provided: {score}"],
                "triggered_rules": [],
                "detector": detector,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }

        detector_results = {
            "phishing": _make("phishing", request.phishing_score or 0),
            "leak": _make("leak", request.leak_score or 0),
            "anomaly": _make("anomaly", request.anomaly_score or 0),
            "deepfake": _make("deepfake", request.deepfake_score or 0),
            "network": _make("network", request.network_score or 0),
            "logs": _make("logs", request.log_score or 0),
        }

    affected_entity = {
        "email": request.email,
        "phone": request.phone,
        "ip": request.ip_address,
        "device": request.device_id,
    }

    incident = fusion_service.run_correlation(
        detector_results=detector_results,
        affected_entity=affected_entity,
    )

    # Persist to DB
    incident_service.create_incident(db, incident)

    return {"success": True, "data": incident, "error": None}
