from pydantic import BaseModel
from typing import Optional


class AnomalyRequest(BaseModel):
    user_id: Optional[str] = None
    email: Optional[str] = None
    ip_address: Optional[str] = None
    country: Optional[str] = None
    device_id: Optional[str] = None
    login_time: Optional[str] = None
    previous_country: Optional[str] = None
    previous_ip: Optional[str] = None
