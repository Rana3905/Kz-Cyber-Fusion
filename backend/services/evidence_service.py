import uuid
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from models.evidence import Evidence
from evidence.package_builder import build_evidence_package
from evidence.pdf_exporter import generate_pdf
from services.incident_service import get_incident


def get_or_create_evidence(db: Session, incident_id: str) -> dict | None:
    # Check if evidence already exists
    existing = db.query(Evidence).filter(Evidence.incident_id == incident_id).first()
    if existing:
        return _serialize(existing)

    # Load incident and build package
    incident = get_incident(db, incident_id)
    if not incident:
        return None

    package = build_evidence_package(incident)
    return _save_evidence(db, package)


def get_evidence_by_id(db: Session, evidence_id: str) -> dict | None:
    ev = db.query(Evidence).filter(Evidence.id == evidence_id).first()
    if not ev:
        return None
    return _serialize(ev)


def get_pdf_bytes(db: Session, incident_id: str) -> bytes | None:
    incident = get_incident(db, incident_id)
    if not incident:
        return None
    package = build_evidence_package(incident)
    return generate_pdf(package)


def _save_evidence(db: Session, package: dict) -> dict:
    db_ev = Evidence(
        id=package["id"],
        incident_id=package["incident_id"],
        summary=package.get("summary"),
        risk_score=package.get("risk_score"),
        confidence_score=package.get("confidence_score"),
        affected_entity=package.get("affected_entity"),
        timeline=package.get("timeline"),
        detector_results=package.get("detector_results"),
        recommended_actions=package.get("recommended_actions"),
        explainability_notes=package.get("explainability_notes"),
    )
    db.add(db_ev)
    db.commit()
    db.refresh(db_ev)
    return _serialize(db_ev)


def _serialize(ev: Evidence) -> dict:
    created_at = ev.created_at
    created_at_str = created_at.isoformat() if hasattr(created_at, "isoformat") else str(created_at)
    return {
        "id": ev.id,
        "incident_id": ev.incident_id,
        "summary": ev.summary,
        "risk_score": ev.risk_score,
        "confidence_score": ev.confidence_score,
        "affected_entity": ev.affected_entity,
        "timeline": ev.timeline,
        "detector_results": ev.detector_results,
        "recommended_actions": ev.recommended_actions,
        "explainability_notes": ev.explainability_notes,
        "created_at": created_at_str,
    }
