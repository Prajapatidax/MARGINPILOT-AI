import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.db.base import Base
import app.models  # Ensure all models are registered
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Skip remote DB auto-sync during test suites
    if os.environ.get("TESTING") == "true":
        yield
        return

    # Ensure all tables exist in database on startup
    try:
        Base.metadata.create_all(bind=engine)
        # Ensure reset_password columns exist in users table
        with engine.connect() as conn:
            try:
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);"))
                conn.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires_at TIMESTAMPTZ;"))
                conn.commit()
            except Exception:
                pass
        print("Database tables and columns verified and initialized successfully.")
    except Exception as e:
        print(f"Warning: Database initialization notice: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Enterprise AI Business Intelligence & Decision Automation Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
    lifespan=None if os.environ.get("TESTING") == "true" else lifespan
)

# CORS Middleware with strict origin allowlist
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Mount API V1 routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", status_code=status.HTTP_200_OK, tags=["System Health"])
def root():
    """Root platform metadata and service discovery endpoint."""
    return {
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "status": "operational",
        "documentation": f"{settings.API_V1_STR}/docs",
        "health_check": f"{settings.API_V1_STR}/health"
    }

@app.get("/health", status_code=status.HTTP_200_OK, tags=["System Health"])
@app.get(f"{settings.API_V1_STR}/health", status_code=status.HTTP_200_OK, tags=["System Health"])
def health_check():
    """Liveness check for deployment orchestrators (Render, Vercel) and frontend probes."""
    return {
        "status": "ok",
        "service": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT
    }

@app.get("/ready", status_code=status.HTTP_200_OK, tags=["System Health"])
@app.get(f"{settings.API_V1_STR}/ready", status_code=status.HTTP_200_OK, tags=["System Health"])
def readiness_check():
    """Readiness probe checking database connectivity."""
    try:
        with SessionLocal() as session:
            session.execute(text("SELECT 1"))
        return {
            "status": "ready",
            "database": "connected"
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "database": "disconnected",
            "error": str(e)
        }
