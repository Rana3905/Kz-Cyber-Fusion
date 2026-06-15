from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import demo_service

router = APIRouter(prefix="/api/demo", tags=["demo"])


@router.post("/run")
async def run_demo(db: Session = Depends(get_db)):
    result = demo_service.run_demo_scenario(db)
    return {"success": True, "data": result, "error": None}
