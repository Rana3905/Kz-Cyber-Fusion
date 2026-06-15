from fastapi import APIRouter
from schemas.network import NetworkRequest
from services import network_service

router = APIRouter(prefix="/api/detect", tags=["detectors"])


@router.post("/network")
async def detect_network(request: NetworkRequest):
    result = network_service.run_detection(
        source_ip=request.source_ip or "",
        destination_ip=request.destination_ip or "",
        destination_port=request.destination_port or 0,
        protocol=request.protocol or "",
        bytes_transferred=request.bytes_transferred or 0,
        connection_frequency=request.connection_frequency or 0,
        country=request.country or "",
    )
    return {"success": True, "data": result, "error": None}
