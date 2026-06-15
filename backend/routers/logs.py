from fastapi import APIRouter
from schemas.logs import LogsRequest
from services import log_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/logs")
async def detect_logs(request: LogsRequest):
    result = log_service.run_detection(
        user_id=request.user_id or "",
        failed_logins=request.failed_logins or 0,
        time_window_seconds=request.time_window_seconds or 0,
        privilege_escalation_attempts=request.privilege_escalation_attempts or 0,
        unusual_commands=request.unusual_commands or [],
        source_ip=request.source_ip or "",
    )
    return {"success": True, "data": result, "error": None}
