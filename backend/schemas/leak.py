from pydantic import BaseModel
from typing import Optional


class LeakRequest(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    username: Optional[str] = None
