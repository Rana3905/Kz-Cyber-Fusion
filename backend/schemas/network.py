from pydantic import BaseModel
from typing import Optional


class NetworkRequest(BaseModel):
    source_ip: Optional[str] = None
    destination_ip: Optional[str] = None
    destination_port: Optional[int] = None
    protocol: Optional[str] = None
    bytes_transferred: Optional[int] = None
    connection_frequency: Optional[int] = None
    country: Optional[str] = None
