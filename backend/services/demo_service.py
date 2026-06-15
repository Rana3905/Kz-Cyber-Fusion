from sqlalchemy.orm import Session
from demo.demo_runner import run_demo
from services.incident_service import create_incident, get_incident
from services.evidence_service import get_or_create_evidence


def run_demo_scenario(db: Session) -> dict:
    """
    Runs the full SMS Blaster demo, persists the incident and evidence, returns complete result.
    """
    result = run_demo()
    incident = result.get("incident", {})

    # Persist incident to DB (upsert: delete old KCF-001 if exists, then create fresh)
    existing = get_incident(db, "KCF-001")
    if not existing:
        create_incident(db, incident)

    # Persist evidence
    get_or_create_evidence(db, "KCF-001")

    return result
