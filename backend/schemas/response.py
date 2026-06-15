from pydantic import BaseModel
from typing import Optional


class ResponseRequest(BaseModel):
    incident_id: str
    action_type: str  # block_ip | freeze_account | force_password_reset | flag_transaction | notify_analyst | create_ticket | escalate
    target: Optional[str] = None


class ResponseActionResult(BaseModel):
    id: str
    incident_id: str
    action_type: str
    description: str
    executed: bool
    result: Optional[dict] = None
    created_at: str
