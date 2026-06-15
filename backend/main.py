from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from config import settings
from database import init_db

from auth.router import router as auth_router
from routers.phishing import router as phishing_router
from routers.leak import router as leak_router
from routers.anomaly import router as anomaly_router
from routers.deepfake import router as deepfake_router
from routers.network import router as network_router
from routers.logs import router as logs_router
from routers.fusion import router as fusion_router
from routers.incidents import router as incidents_router
from routers.assistant import router as assistant_router
from routers.response import router as response_router
from routers.evidence import router as evidence_router
from routers.demo import router as demo_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print(f"[KZ Cyber Fusion] Database initialized.")
    print(f"[KZ Cyber Fusion] Server ready. http://localhost:8000/docs")
    yield
    print("[KZ Cyber Fusion] Shutting down.")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "KZ Cyber Fusion — AI-Powered Cybersecurity Intelligence Platform. "
        "AFM AI Hackathon 2026 | Track 2: AI Shield | Almaty, June 24."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS — open for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global exception handler — always return envelope format
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"success": False, "data": None, "error": str(exc)},
    )


# Register all routers
app.include_router(auth_router)
app.include_router(phishing_router)
app.include_router(leak_router)
app.include_router(anomaly_router)
app.include_router(deepfake_router)
app.include_router(network_router)
app.include_router(logs_router)
app.include_router(fusion_router)
app.include_router(incidents_router)
app.include_router(assistant_router)
app.include_router(response_router)
app.include_router(evidence_router)
app.include_router(demo_router)


@app.get("/", tags=["health"])
async def root():
    return {
        "success": True,
        "data": {
            "name": settings.APP_NAME,
            "version": settings.APP_VERSION,
            "status": "operational",
            "docs": "/docs",
            "demo_endpoint": "POST /api/demo/run",
        },
        "error": None,
    }


@app.get("/health", tags=["health"])
async def health():
    return {"success": True, "data": {"status": "ok"}, "error": None}
