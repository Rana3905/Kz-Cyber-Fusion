from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Text
from sqlalchemy.sql import func
from database import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    summary = Column(Text, nullable=True)
    risk_score = Column(String, nullable=True)
    confidence_score = Column(String, nullable=True)
    affected_entity = Column(JSON, nullable=True)
    timeline = Column(JSON, nullable=True)
    detector_results = Column(JSON, nullable=True)
    recommended_actions = Column(JSON, nullable=True)
    explainability_notes = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
