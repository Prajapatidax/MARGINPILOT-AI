from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, desc

from app.db.session import get_db
from app.api.deps import get_tenant_context, require_roles
from app.core.tenant import TenantContext
from app.models.membership import OrganizationRole
from app.models.recommendation import AIRecommendation
from app.schemas.recommendation import (
    AIRecommendationResponse,
    UpdateRecommendationStatusRequest
)
from app.services.simulation_service import sync_organization_recommendations

router = APIRouter()

@router.get("", response_model=List[AIRecommendationResponse])
def get_recommendations(
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(get_tenant_context)
):
    """Retrieve active AI business recommendations for the organization."""
    recs = sync_organization_recommendations(db, tenant.organization_id)
    return recs

@router.patch("/{recommendation_id}/status", response_model=AIRecommendationResponse)
def update_recommendation_status(
    recommendation_id: str,
    request: UpdateRecommendationStatusRequest,
    db: Session = Depends(get_db),
    tenant: TenantContext = Depends(require_roles([
        OrganizationRole.OWNER,
        OrganizationRole.ADMIN,
        OrganizationRole.MANAGER
    ]))
):
    """Updates recommendation status (ACCEPTED, DISMISSED, COMPLETED)."""
    rec = db.execute(
        select(AIRecommendation).where(
            AIRecommendation.id == recommendation_id,
            AIRecommendation.organization_id == tenant.organization_id
        )
    ).scalar_one_or_none()

    if not rec:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Recommendation not found")

    new_status = request.status.upper()
    valid = ["PENDING", "ACCEPTED", "DISMISSED", "COMPLETED"]
    if new_status not in valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status. Allowed: {', '.join(valid)}"
        )

    rec.status = new_status
    db.commit()
    db.refresh(rec)
    return rec
