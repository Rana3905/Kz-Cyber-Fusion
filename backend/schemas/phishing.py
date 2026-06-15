from pydantic import BaseModel
from typing import Optional


class PhishingRequest(BaseModel):
    message: Optional[str] = None
    url: Optional[str] = None
    sender: Optional[str] = None
    channel: Optional[str] = "sms"  # sms | email | web


class DetectorResponse(BaseModel):
    score: int
    confidence: float
    severity: str
    reasons: list[str]
    triggered_rules: list[str]
    detector: str
    timestamp: str
