# AUTH STUB — Not implemented for MVP
from fastapi import APIRouter

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login")
async def login():
    return {"detail": "Auth not implemented for MVP"}
