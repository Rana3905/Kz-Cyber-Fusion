from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from database import get_db
from schemas.response import ResponseRequest
from services import response_service

router = APIRouter(prefix="/api/response", tags=["response"])


@router.post("/trigger")
async def trigger_response(request: ResponseRequest, db: Session = Depends(get_db)):
    result = response_service.trigger_action(
        db,
        incident_id=request.incident_id,
        action_type=request.action_type,
        target=request.target or "",
    )
    return {"success": True, "data": result, "error": None}


@router.get("/actions/{incident_id}")
async def get_actions(incident_id: str, db: Session = Depends(get_db)):
    actions = response_service.get_actions_for_incident(db, incident_id)
    return {"success": True, "data": actions, "error": None}
