from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from database import get_db
from services import evidence_service

router = APIRouter(prefix="/api/evidence", tags=["evidence"])


@router.get("/{incident_id}")
async def get_evidence(incident_id: str, db: Session = Depends(get_db)):
    evidence = evidence_service.get_or_create_evidence(db, incident_id)
    if not evidence:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return {"success": True, "data": evidence, "error": None}


@router.get("/{incident_id}/pdf")
async def download_evidence_pdf(incident_id: str, db: Session = Depends(get_db)):
    pdf_bytes = evidence_service.get_pdf_bytes(db, incident_id)
    if not pdf_bytes:
        raise HTTPException(status_code=404, detail=f"Incident '{incident_id}' not found")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=evidence-{incident_id}.pdf"
        },
    )
