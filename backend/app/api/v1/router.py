from fastapi import APIRouter
from app.api.v1.endpoints import auth, organizations, analytics, data_imports, ml

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Identity"])
api_router.include_router(organizations.router, prefix="/organizations", tags=["Organizations & Multi-Tenancy"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics & BI"])
api_router.include_router(data_imports.router, prefix="/data-imports", tags=["Data Platform & Ingestion"])
api_router.include_router(ml.router, prefix="/ml", tags=["Machine Learning & AI"])

