from fastapi import APIRouter
from schemas.leak import LeakRequest
from services import leak_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/leak")
async def detect_leak(request: LeakRequest):
    result = leak_service.run_detection(
        email=request.email or "",
        phone=request.phone or "",
        username=request.username or "",
    )
    return {"success": True, "data": result, "error": None}
