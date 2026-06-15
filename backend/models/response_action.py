from sqlalchemy import Column, String, JSON, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from database import Base


class ResponseAction(Base):
    __tablename__ = "response_actions"

    id = Column(String, primary_key=True, index=True)
    incident_id = Column(String, ForeignKey("incidents.id"), nullable=False)
    action_type = Column(String, nullable=False)
    description = Column(String, nullable=False)
    executed = Column(Boolean, default=False)
    result = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
