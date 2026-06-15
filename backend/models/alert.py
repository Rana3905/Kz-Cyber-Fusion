from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=True)
    detector = Column(String, nullable=False)
    score = Column(Integer, nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    reasons = Column(JSON, nullable=True)
    triggered_rules = Column(JSON, nullable=True)
    raw_input = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
