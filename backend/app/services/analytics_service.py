from datetime import datetime, timedelta, timezone
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import select, func, desc, and_

from app.models.sales_order import SalesOrder, SalesOrderItem
from app.models.customer import Customer
from app.models.product import Product, ProductCategory
from app.models.inventory import InventoryTransaction

def parse_date_range(date_range: str) -> tuple[datetime, datetime, datetime, datetime]:
    """
    Parses a date range string (today, 7d, 30d, 90d, 1y) into UTC timestamps:
    current_start, current_end, previous_start, previous_end.
    """
    now = datetime.now(timezone.utc)
    days = 30
    if date_range == "today":
        days = 1
    elif date_range == "7d":
        days = 7
    elif date_range == "90d":
        days = 90
    elif date_range == "1y":
        days = 365

    current_end = now
    current_start = now - timedelta(days=days)
    previous_end = current_start
    previous_start = current_start - timedelta(days=days)

    return current_start, current_end, previous_start, previous_end

def calculate_growth_rate(current: float, previous: float) -> float:
    """Calculates period-over-period percentage growth rate."""
    if previous == 0:
        return 100.0 if current > 0 else 0.0
    return round(((current - previous) / previous) * 100, 1)

def get_sales_analytics(
    db: Session,
    org_id: str,
    date_range: str = "30d"
) -> Dict[str, Any]:
    """Computes comprehensive sales intelligence metrics and historical trends."""
    curr_start, curr_end, prev_start, prev_end = parse_date_range(date_range)

    # Current period orders
    curr_orders = db.execute(
        select(SalesOrder).where(
            SalesOrder.organization_id == org_id,
            SalesOrder.order_date >= curr_start,
            SalesOrder.order_date <= curr_end
        ).order_by(SalesOrder.order_date.asc())
    ).scalars().all()

    # Previous period orders (for period-over-period comparison)
    prev_orders = db.execute(
        select(SalesOrder).where(
            SalesOrder.organization_id == org_id,
            SalesOrder.order_date >= prev_start,
            SalesOrder.order_date < prev_end
        )
    ).scalars().all()

    curr_sales = sum(float(o.total_amount) for o in curr_orders)
    prev_sales = sum(float(o.total_amount) for o in prev_orders)
    sales_growth = calculate_growth_rate(curr_sales, prev_sales)

    curr_cogs = sum(float(o.cogs_amount) for o in curr_orders)
    curr_profit = sum(float(o.gross_profit) for o in curr_orders)
    prev_profit = sum(float(o.gross_profit) for o in prev_orders)
    profit_growth = calculate_growth_rate(curr_profit, prev_profit)

    curr_orders_count = len(curr_orders)
    aov = round(curr_sales / curr_orders_count, 2) if curr_orders_count > 0 else 0.0

    gross_margin_pct = round((curr_profit / curr_sales * 100), 1) if curr_sales > 0 else 0.0

    # Daily or Monthly time-series
    time_series_map: Dict[str, float] = {}
    for o in curr_orders:
        date_key = o.order_date.strftime("%b %d") if (curr_end - curr_start).days <= 31 else o.order_date.strftime("%b %Y")
        time_series_map[date_key] = time_series_map.get(date_key, 0.0) + float(o.total_amount)

    sales_trend = [{"date": k, "sales": round(v, 2)} for k, v in time_series_map.items()]

    # Sales by Product Category
    cat_query = (
        select(
            func.coalesce(ProductCategory.name, "Uncategorized").label("category_name"),
            func.sum(SalesOrderItem.line_total).label("category_sales")
        )
        .select_from(SalesOrderItem)
        .outerjoin(Product, SalesOrderItem.product_id == Product.id)
        .outerjoin(ProductCategory, Product.category_id == ProductCategory.id)
        .where(
            SalesOrderItem.organization_id == org_id,
            SalesOrderItem.created_at >= curr_start
        )
        .group_by(ProductCategory.name)
    )
    cat_rows = db.execute(cat_query).all()
    palette = ["#2563eb", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b"]
    sales_by_category = []
    total_cat_sales = sum(float(r.category_sales) for r in cat_rows)
    for i, r in enumerate(cat_rows):
        cat_pct = round((float(r.category_sales) / total_cat_sales * 100), 1) if total_cat_sales > 0 else 0.0
        sales_by_category.append({
            "name": r.category_name,
            "sales": float(r.category_sales),
            "percentage": cat_pct,
            "color": palette[i % len(palette)]
        })

    # Profitability Trend (Revenue vs COGS vs Gross Profit)
    profitability_trend = []
    profit_map: Dict[str, Dict[str, float]] = {}
    for o in curr_orders:
        month_label = o.order_date.strftime("%b")
        if month_label not in profit_map:
            profit_map[month_label] = {"revenue": 0.0, "cogs": 0.0, "profit": 0.0}
        profit_map[month_label]["revenue"] += float(o.total_amount)
        profit_map[month_label]["cogs"] += float(o.cogs_amount)
        profit_map[month_label]["profit"] += float(o.gross_profit)

    for m, vals in profit_map.items():
        profitability_trend.append({
            "period": m,
            "revenue": round(vals["revenue"], 2),
            "cogs": round(vals["cogs"], 2),
            "gross_profit": round(vals["profit"], 2)
        })

    return {
        "organization_id": org_id,
        "date_range": date_range,
        "total_sales": round(curr_sales, 2),
        "previous_sales": round(prev_sales, 2),
        "sales_growth_rate": sales_growth,
        "total_orders": curr_orders_count,
        "average_order_value": aov,
        "gross_profit": round(curr_profit, 2),
        "profit_growth_rate": profit_growth,
        "gross_margin_percentage": gross_margin_pct,
        "sales_trend": sales_trend,
        "sales_by_category": sales_by_category,
        "profitability_trend": profitability_trend
    }

def get_product_analytics(
    db: Session,
    org_id: str
) -> Dict[str, Any]:
    """Computes product catalog performance, margins, and sales volume."""
    prods = db.execute(
        select(Product).where(Product.organization_id == org_id)
    ).scalars().all()

    items_query = (
        select(
            Product.id,
            Product.sku,
            Product.name,
            Product.cost_price,
            Product.selling_price,
            func.sum(SalesOrderItem.quantity).label("units_sold"),
            func.sum(SalesOrderItem.line_total).label("total_revenue"),
            func.sum(SalesOrderItem.line_total - (SalesOrderItem.quantity * SalesOrderItem.unit_cost)).label("total_profit")
        )
        .join(SalesOrderItem, Product.id == SalesOrderItem.product_id)
        .where(Product.organization_id == org_id)
        .group_by(Product.id, Product.sku, Product.name, Product.cost_price, Product.selling_price)
        .order_by(desc("total_revenue"))
    )
    product_stats = db.execute(items_query).all()

    top_products = []
    low_margin_products = []
    for r in product_stats:
        rev = float(r.total_revenue)
        profit = float(r.total_profit)
        margin = round((profit / rev * 100), 1) if rev > 0 else 0.0
        item_obj = {
            "sku": r.sku,
            "name": r.name,
            "units_sold": float(r.units_sold),
            "revenue": round(rev, 2),
            "gross_profit": round(profit, 2),
            "gross_margin_pct": margin
        }
        top_products.append(item_obj)
        if margin < 20.0:
            low_margin_products.append(item_obj)

    return {
        "organization_id": org_id,
        "total_catalog_products": len(prods),
        "active_selling_products": len(product_stats),
        "top_performing_products": top_products[:10],
        "low_margin_alerts": low_margin_products
    }

def get_customer_analytics(
    db: Session,
    org_id: str
) -> Dict[str, Any]:
    """Computes customer intelligence metrics, segment distributions, and RFM scores."""
    customers = db.execute(
        select(Customer).where(Customer.organization_id == org_id)
    ).scalars().all()

    segments_query = (
        select(Customer.segment, func.count(Customer.id))
        .where(Customer.organization_id == org_id)
        .group_by(Customer.segment)
    )
    seg_counts = dict(db.execute(segments_query).all())
    total_cust = len(customers)

    palette = {"VIP": "#2563eb", "REGULAR": "#8b5cf6", "AT_RISK": "#ef4444", "NEW": "#10b981"}
    segment_distribution = []
    for seg, count in seg_counts.items():
        pct = round((count / total_cust * 100), 1) if total_cust > 0 else 0.0
        segment_distribution.append({
            "segment": seg,
            "count": count,
            "percentage": pct,
            "color": palette.get(seg, "#64748b")
        })

    # High CLV customers
    top_clv = sorted(customers, key=lambda c: float(c.clv_estimate), reverse=True)[:5]
    top_clv_list = [{
        "code": c.customer_code,
        "name": c.name,
        "segment": c.segment,
        "clv_estimate": float(c.clv_estimate),
        "churn_risk_score": float(c.churn_risk_score)
    } for c in top_clv]

    return {
        "organization_id": org_id,
        "total_customers": total_cust,
        "segment_distribution": segment_distribution,
        "top_clv_customers": top_clv_list
    }

def get_inventory_analytics(
    db: Session,
    org_id: str
) -> Dict[str, Any]:
    """Computes stock availability, reorder point thresholds, and stockout risk."""
    products = db.execute(
        select(Product).where(Product.organization_id == org_id)
    ).scalars().all()

    stockout_risks = []
    total_inventory_valuation = 0.0

    for p in products:
        # Net sum of inventory transactions
        stock_sum = db.execute(
            select(func.sum(InventoryTransaction.quantity)).where(
                InventoryTransaction.organization_id == org_id,
                InventoryTransaction.product_id == p.id
            )
        ).scalar() or 0.0

        current_stock = float(stock_sum)
        valuation = current_stock * float(p.cost_price)
        total_inventory_valuation += max(valuation, 0.0)

        # Alert if stock is below reorder point
        if current_stock <= float(p.reorder_point):
            stockout_risks.append({
                "sku": p.sku,
                "name": p.name,
                "current_stock": current_stock,
                "reorder_point": p.reorder_point,
                "safety_stock": p.safety_stock,
                "lead_time_days": p.lead_time_days,
                "severity": "CRITICAL" if current_stock <= float(p.safety_stock) else "WARNING"
            })

    return {
        "organization_id": org_id,
        "total_skus": len(products),
        "total_inventory_valuation": round(total_inventory_valuation, 2),
        "stockout_alerts_count": len(stockout_risks),
        "stockout_alerts": stockout_risks
    }
