from pydantic import BaseModel
from typing import Optional


class IncidentResponse(BaseModel):
    id: str
    title: str
    risk_score: int
    severity: str
    confidence: float
    status: str
    affected_entity: Optional[dict] = None
    detector_results: Optional[dict] = None
    timeline: Optional[list] = None
    explanation: Optional[str] = None
    recommended_actions: Optional[list[str]] = None
    created_at: str
