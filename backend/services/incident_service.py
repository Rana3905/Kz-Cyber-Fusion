import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from models.incident import Incident


def create_incident(db: Session, incident_data: dict) -> dict:
    incident_id = incident_data.get("id") or f"KCF-{str(uuid.uuid4())[:6].upper()}"
    created_at = incident_data.get("created_at", datetime.now(timezone.utc).isoformat())

    db_incident = Incident(
        id=incident_id,
        title=incident_data.get("title", "Untitled Incident"),
        risk_score=incident_data.get("risk_score", 0),
        severity=incident_data.get("severity", "Low"),
        confidence=incident_data.get("confidence", 0.0),
        status=incident_data.get("status", "open"),
        affected_entity=incident_data.get("affected_entity"),
        detector_results=incident_data.get("detector_results"),
        timeline=incident_data.get("timeline"),
        explanation=incident_data.get("explanation"),
        recommended_actions=incident_data.get("recommended_actions"),
        created_at=datetime.fromisoformat(created_at.replace("Z", "+00:00")),
    )
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return _serialize(db_incident)


def get_incident(db: Session, incident_id: str) -> dict | None:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None
    return _serialize(incident)


def get_all_incidents(db: Session, skip: int = 0, limit: int = 100) -> list[dict]:
    incidents = (
        db.query(Incident)
        .order_by(Incident.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [_serialize(i) for i in incidents]


def update_incident_status(db: Session, incident_id: str, status: str) -> dict | None:
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        return None
    incident.status = status
    db.commit()
    db.refresh(incident)
    return _serialize(incident)


def _serialize(incident: Incident) -> dict:
    created_at = incident.created_at
    if hasattr(created_at, "isoformat"):
        created_at_str = created_at.isoformat()
    else:
        created_at_str = str(created_at)

    return {
        "id": incident.id,
        "title": incident.title,
        "risk_score": incident.risk_score,
        "severity": incident.severity,
        "confidence": incident.confidence,
        "status": incident.status,
        "affected_entity": incident.affected_entity,
        "detector_results": incident.detector_results,
        "timeline": incident.timeline,
        "explanation": incident.explanation,
        "recommended_actions": incident.recommended_actions,
        "created_at": created_at_str,
    }
