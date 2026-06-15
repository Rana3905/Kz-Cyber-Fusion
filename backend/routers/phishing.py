from fastapi import APIRouter
from schemas.phishing import PhishingRequest
from services import phishing_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/phishing")
async def detect_phishing(request: PhishingRequest):
    result = phishing_service.run_detection(
        message=request.message or "",
        url=request.url or "",
        sender=request.sender or "",
        channel=request.channel or "sms",
    )
    return {"success": True, "data": result, "error": None}
