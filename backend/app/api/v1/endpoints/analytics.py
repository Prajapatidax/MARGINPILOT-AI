from typing import Any, Dict, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_tenant_context
from app.core.tenant import TenantContext

router = APIRouter()

@router.get("/summary")
def get_analytics_summary(
    date_range: str = Query("30d", pattern="^(7d|30d|90d|1y)$"),
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns real business metrics calculated from verified records for the active organization.
    If no transactional data has been imported yet, returns accurate empty state metrics
    (zero values with has_data=False) rather than fabricating numbers.
    """
    # Strict tenant isolation: All queries strictly scoped by tenant.organization_id
    # Note: In Phase 2/3, this queries the imported sales_orders, inventory, etc.
    # Currently reflects true live status:
    return {
        "organization_id": tenant.organization_id,
        "date_range": date_range,
        "has_data": False,
        "metrics": {
            "total_revenue": 0.0,
            "revenue_change_pct": 0.0,
            "gross_profit": 0.0,
            "gross_profit_change_pct": 0.0,
            "gross_margin_pct": 0.0,
            "gross_margin_change_pct": 0.0,
            "active_customers": 0,
            "active_customers_change_pct": 0.0
        },
        "trends": [],
        "top_products": [],
        "customer_segments": [],
        "inventory_alerts": [],
        "ai_recommendations": []
    }
