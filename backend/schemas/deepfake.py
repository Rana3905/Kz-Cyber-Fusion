from pydantic import BaseModel
from typing import Optional


class DeepfakeRequest(BaseModel):
    call_id: Optional[str] = None
    media_type: Optional[str] = "voice"  # voice | video
    voice_inconsistency_score: Optional[float] = None
    video_artifact_score: Optional[float] = None
    claimed_identity: Optional[str] = None
    duration_seconds: Optional[int] = None
