from pydantic import BaseModel
from typing import Optional


class EvidenceResponse(BaseModel):
    id: str
    incident_id: str
    summary: Optional[str] = None
    risk_score: Optional[str] = None
    confidence_score: Optional[str] = None
    affected_entity: Optional[dict] = None
    timeline: Optional[list] = None
    detector_results: Optional[dict] = None
    recommended_actions: Optional[list[str]] = None
    explainability_notes: Optional[list[str]] = None
    created_at: str
