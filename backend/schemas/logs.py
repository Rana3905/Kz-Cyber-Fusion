from pydantic import BaseModel
from typing import Optional


class LogsRequest(BaseModel):
    user_id: Optional[str] = None
    failed_logins: Optional[int] = None
    time_window_seconds: Optional[int] = None
    privilege_escalation_attempts: Optional[int] = None
    unusual_commands: Optional[list[str]] = None
    source_ip: Optional[str] = None
