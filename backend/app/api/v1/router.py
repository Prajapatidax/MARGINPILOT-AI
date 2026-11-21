from fastapi import APIRouter
from app.api.v1.endpoints import auth, organizations, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Identity"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["Organizations & Multi-Tenancy"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & BI"])
