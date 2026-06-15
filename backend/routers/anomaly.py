from fastapi import APIRouter
from schemas.anomaly import AnomalyRequest
from services import anomaly_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/anomaly")
async def detect_anomaly(request: AnomalyRequest):
    result = anomaly_service.run_detection(
        email=request.email or "",
        ip_address=request.ip_address or "",
        country=request.country or "",
        previous_country=request.previous_country or "",
        device_id=request.device_id or "",
        login_time=request.login_time or "",
        previous_ip=request.previous_ip or "",
    )
    return {"success": True, "data": result, "error": None}
