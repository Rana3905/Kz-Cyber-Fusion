from sqlalchemy.orm import Session
from services.incident_service import get_incident
from assistant.soc_assistant import answer_question


def ask(db: Session, incident_id: str, question: str) -> dict:
    incident = get_incident(db, incident_id)
    if not incident:
        return {
            "answer": f"Incident '{incident_id}' not found. Please verify the incident ID.",
            "confidence": 0.0,
        }
    return answer_question(incident, question)
