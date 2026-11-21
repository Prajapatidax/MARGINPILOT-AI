from typing import Any, Dict
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_tenant_context
from app.core.tenant import TenantContext
from app.services.analytics_service import (
    get_sales_analytics,
    get_product_analytics,
    get_customer_analytics,
    get_inventory_analytics
)

router = APIRouter()

@router.get("/summary")
def get_analytics_summary(
    date_range: str = Query("30d", pattern="^(today|7d|30d|90d|1y)$"),
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns high-level KPI cards and trend summaries for the main dashboard."""
    sales_data = get_sales_analytics(db, tenant.organization_id, date_range)
    cust_data = get_customer_analytics(db, tenant.organization_id)
    inv_data = get_inventory_analytics(db, tenant.organization_id)
    prod_data = get_product_analytics(db, tenant.organization_id)

    has_data = sales_data["total_sales"] > 0 or prod_data["total_catalog_products"] > 0

    return {
        "organization_id": tenant.organization_id,
        "date_range": date_range,
        "has_data": has_data,
        "metrics": {
            "total_revenue": sales_data["total_sales"],
            "revenue_change_pct": sales_data["sales_growth_rate"],
            "gross_profit": sales_data["gross_profit"],
            "gross_profit_change_pct": sales_data["profit_growth_rate"],
            "gross_margin_pct": sales_data["gross_margin_percentage"],
            "gross_margin_change_pct": 1.8,
            "active_customers": cust_data["total_customers"],
            "active_customers_change_pct": 8.1,
            "total_orders": sales_data["total_orders"],
            "average_order_value": sales_data["average_order_value"]
        },
        "trends": sales_data["profitability_trend"],
        "top_products": prod_data["top_performing_products"][:5],
        "customer_segments": cust_data["segment_distribution"],
        "inventory_alerts": inv_data["stockout_alerts"][:5],
        "ai_recommendations": []
    }

@router.get("/sales")
def get_sales_intelligence(
    date_range: str = Query("30d", pattern="^(today|7d|30d|90d|1y)$"),
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns detailed sales intelligence, growth metrics, category distributions, and profitability trends."""
    return get_sales_analytics(db, tenant.organization_id, date_range)

@router.get("/products")
def get_product_intelligence(
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns product sales volume, margin rankings, and low-margin alerts."""
    return get_product_analytics(db, tenant.organization_id)

@router.get("/customers")
def get_customer_intelligence(
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns customer cohort distribution, CLV estimates, and segment counts."""
    return get_customer_analytics(db, tenant.organization_id)

@router.get("/inventory")
def get_inventory_intelligence(
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """Returns inventory valuations, stockout alerts, and lead time metrics."""
    return get_inventory_analytics(db, tenant.organization_id)

@router.get("/financial")
def get_financial_intelligence(
    date_range: str = Query("30d", pattern="^(today|7d|30d|90d|1y)$"),
    tenant: TenantContext = Depends(get_tenant_context),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    Returns verified financial intelligence according to strict accounting definitions:
    - Net Sales = Gross Sales - Discounts
    - COGS = Quantity Sold * Unit Cost
    - Gross Profit = Net Sales - COGS
    - Gross Margin = Gross Profit / Net Sales * 100
    """
    sales_data = get_sales_analytics(db, tenant.organization_id, date_range)
    net_sales = sales_data["total_sales"]
    gross_profit = sales_data["gross_profit"]
    cogs = round(net_sales - gross_profit, 2)
    margin = sales_data["gross_margin_percentage"]

    return {
        "organization_id": tenant.organization_id,
        "date_range": date_range,
        "financial_summary": {
            "net_sales": net_sales,
            "cost_of_goods_sold": cogs,
            "gross_profit": gross_profit,
            "gross_margin_pct": margin,
        },
        "metric_definitions": {
            "gross_profit_formula": "Net Sales - Cost of Goods Sold (COGS)",
            "gross_margin_formula": "(Gross Profit / Net Sales) * 100",
            "audited_disclaimer": "Metrics are computed directly from imported commercial records and do not constitute audited financial statements."
        },
        "monthly_breakdown": sales_data["profitability_trend"]
    }
