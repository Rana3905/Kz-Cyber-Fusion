from fastapi import APIRouter
from schemas.deepfake import DeepfakeRequest
from services import deepfake_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/deepfake")
async def detect_deepfake(request: DeepfakeRequest):
    result = deepfake_service.run_detection(
        call_id=request.call_id or "",
        media_type=request.media_type or "voice",
        voice_inconsistency_score=request.voice_inconsistency_score or 0.0,
        video_artifact_score=request.video_artifact_score or 0.0,
        claimed_identity=request.claimed_identity or "",
        duration_seconds=request.duration_seconds or 0,
    )
    return {"success": True, "data": result, "error": None}
