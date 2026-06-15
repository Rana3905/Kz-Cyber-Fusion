from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from schemas.assistant import AssistantRequest
from services import assistant_service

router = APIRouter(prefix="/api/assistant", tags=["assistant"])


@router.post("/ask")
async def ask_assistant(request: AssistantRequest, db: Session = Depends(get_db)):
    result = assistant_service.ask(db, request.incident_id, request.question)
    return {"success": True, "data": result, "error": None}
