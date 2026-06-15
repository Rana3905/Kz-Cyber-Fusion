from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    risk_score = Column(Integer, nullable=False)
    severity = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    status = Column(String, default="open")

    affected_entity = Column(JSON, nullable=True)
    detector_results = Column(JSON, nullable=True)
    timeline = Column(JSON, nullable=True)
    explanation = Column(Text, nullable=True)
    recommended_actions = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
