from pydantic import BaseModel
from typing import Optional


class FusionRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    ip_address: Optional[str] = None
    device_id: Optional[str] = None
    phishing_score: Optional[int] = None
    leak_score: Optional[int] = None
    anomaly_score: Optional[int] = None
    deepfake_score: Optional[int] = None
    network_score: Optional[int] = None
    log_score: Optional[int] = None
    detector_results: Optional[dict] = None
