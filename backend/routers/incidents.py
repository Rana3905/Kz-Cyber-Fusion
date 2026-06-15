from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from services import incident_service

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


@router.get("")
async def list_incidents(
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=100, ge=1, le=500),
    db: Session = Depends(get_db),
):
    incidents = incident_service.get_all_incidents(db, skip=skip, limit=limit)
    return {"success": True, "data": incidents, "error": None}


@router.get("/{incident_id}")
async def get_incident(incident_id: str, db: Session = Depends(get_db)):
    incident = incident_service.get_incident(db, incident_id)
    if not incident:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return {"success": True, "data": incident, "error": None}


@router.patch("/{incident_id}/status")
async def update_status(
    incident_id: str,
    status: str = Query(..., pattern="^(open|investigating|resolved)$"),
    db: Session = Depends(get_db),
):
    updated = incident_service.update_incident_status(db, incident_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return {"success": True, "data": updated, "error": None}
