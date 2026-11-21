import io
from app.models.product import Product
from app.models.customer import Customer
from app.models.sales_order import SalesOrder, SalesOrderItem
from app.models.inventory import InventoryTransaction

def seed_sample_records(client, token):
    """Helper to seed a verified business dataset for analytical testing."""
    csv_data = (
        "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\n"
        "ORD-501,CUST-A,2026-11-15,SKU-EARBUDS,10,50.00,20.00\n"
        "ORD-502,CUST-B,2026-11-16,SKU-WATCH,5,200.00,100.00\n"
        "ORD-503,CUST-A,2026-11-17,SKU-POWERBANK,20,30.00,12.00\n"
    )
    up = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sales.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    job_id = up.json()["job_id"]
    client.post(f"/api/v1/data-imports/{job_id}/validate", headers={"Authorization": f"Bearer {token}"}, json={"mappings": up.json()["suggested_mappings"]})
    client.post(f"/api/v1/data-imports/{job_id}/commit", headers={"Authorization": f"Bearer {token}"})

def test_sales_intelligence_metrics(client):
    """Verifies that sales analytics properly calculate real AOV, margins, and totals."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "bi@company.com", "password": "Password123!", "full_name": "BI Director", "organization_name": "BI Corp"}
    )
    token = reg.json()["access_token"]
    seed_sample_records(client, token)

    # Query sales analytics
    res = client.get("/api/v1/analytics/sales?date_range=30d", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()

    # Calculations:
    # ORD-501: 10 * 50 = $500 (COGS = 200, Profit = 300)
    # ORD-502: 5 * 200 = $1,000 (COGS = 500, Profit = 500)
    # ORD-503: 20 * 30 = $600 (COGS = 240, Profit = 360)
    # Total Revenue = 500 + 1000 + 600 = $2,100.00
    # Gross Profit = 300 + 500 + 360 = $1,160.00
    # Gross Margin % = (1160 / 2100) * 100 = 55.2%
    # Total Orders = 3
    # AOV = 2100 / 3 = $700.00
    assert data["total_sales"] == 2100.0
    assert data["gross_profit"] == 1160.0
    assert data["gross_margin_percentage"] == 55.2
    assert data["total_orders"] == 3
    assert data["average_order_value"] == 700.0

def test_financial_intelligence_definitions(client):
    """Verifies financial intelligence endpoint enforces strict accounting rules."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "cfo@company.com", "password": "Password123!", "full_name": "CFO", "organization_name": "Finance Corp"}
    )
    token = reg.json()["access_token"]
    seed_sample_records(client, token)

    res = client.get("/api/v1/analytics/financial", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert "financial_summary" in data
    assert data["financial_summary"]["net_sales"] == 2100.0
    assert data["financial_summary"]["gross_profit"] == 1160.0
    assert data["financial_summary"]["cost_of_goods_sold"] == 940.0
    assert "metric_definitions" in data
    assert "audited_disclaimer" in data["metric_definitions"]

def test_product_and_customer_intelligence(client):
    """Verifies product ranking and customer intelligence endpoints."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "products@company.com", "password": "Password123!", "full_name": "Product Lead", "organization_name": "Catalog Corp"}
    )
    token = reg.json()["access_token"]
    seed_sample_records(client, token)

    # Product intelligence
    prod_res = client.get("/api/v1/analytics/products", headers={"Authorization": f"Bearer {token}"})
    assert prod_res.status_code == 200
    prod_data = prod_res.json()
    assert len(prod_data["top_performing_products"]) == 3
    # Top product by revenue should be SKU-WATCH ($1000)
    assert prod_data["top_performing_products"][0]["sku"] == "SKU-WATCH"
    assert prod_data["top_performing_products"][0]["revenue"] == 1000.0

    # Customer intelligence
    cust_res = client.get("/api/v1/analytics/customers", headers={"Authorization": f"Bearer {token}"})
    assert cust_res.status_code == 200
    cust_data = cust_res.json()
    assert cust_data["total_customers"] == 2  # CUST-A and CUST-B
