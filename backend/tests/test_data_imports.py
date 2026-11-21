import io
import pytest
from app.models.product import Product
from app.models.customer import Customer
from app.models.sales_order import SalesOrder, SalesOrderItem
from app.models.data_import import DataImportJob

def test_csv_upload_profiling_and_mapping(client):
    """Verifies that uploaded CSV files are profiled and column mapping is suggested."""
    # 1. Register organization
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "dataops@company.com",
            "password": "Password123!",
            "full_name": "Data Analyst",
            "organization_name": "Ingestion Corp",
            "business_type": "RETAIL"
        }
    )
    token = reg.json()["access_token"]
    org_id = reg.json()["active_organization_id"]

    # 2. Prepare sample CSV content
    csv_data = (
        "order_id,customer_id,date,item_sku,qty,price,cost\n"
        "ORD-1001,CUST-001,2026-05-01,SKU-EARBUDS,2,49.99,20.00\n"
        "ORD-1002,CUST-002,2026-05-02,SKU-WATCH,1,199.99,100.00\n"
        "ORD-1003,CUST-001,2026-05-03,SKU-POWERBANK,3,29.99,12.00\n"
    )

    # 3. Upload file
    response = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sales_may.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "job_id" in data
    assert data["total_rows"] == 3
    assert len(data["columns_profile"]) == 7
    assert data["suggested_mappings"]["order_number"] == "order_id"
    assert data["suggested_mappings"]["sku"] == "item_sku"
    assert data["suggested_mappings"]["quantity"] == "qty"
    assert data["suggested_mappings"]["unit_price"] == "price"
    assert data["suggested_mappings"]["unit_cost"] == "cost"

def test_data_validation_and_commit(client):
    """
    Acceptance Criteria for Phase 2:
    A real business dataset can be uploaded, validated, mapped, imported, and queried safely.
    """
    # 1. Register
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "merchant@shop.com",
            "password": "Password123!",
            "full_name": "Shop Owner",
            "organization_name": "Premier Retail",
            "business_type": "RETAIL"
        }
    )
    token = reg.json()["access_token"]
    org_id = reg.json()["active_organization_id"]

    # Check analytics before import (should be has_data = False)
    analytics_before = client.get(
        "/api/v1/analytics/summary",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert analytics_before.status_code == 200
    assert analytics_before.json()["has_data"] is False
    assert analytics_before.json()["metrics"]["total_revenue"] == 0.0

    # 2. Upload CSV
    csv_data = (
        "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\n"
        "ORD-2001,CUST-ALICE,2026-11-01,SKU-HEADPHONES,2,100.00,40.00\n"
        "ORD-2002,CUST-BOB,2026-11-02,SKU-CHARGER,4,25.00,10.00\n"
    )

    upload_res = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("sales_data.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    assert upload_res.status_code == 200
    job_id = upload_res.json()["job_id"]
    mappings = upload_res.json()["suggested_mappings"]

    # 3. Validate Mapping
    val_res = client.post(
        f"/api/v1/data-imports/{job_id}/validate",
        headers={"Authorization": f"Bearer {token}"},
        json={"mappings": mappings}
    )
    assert val_res.status_code == 200
    val_data = val_res.json()
    assert val_data["is_valid"] is True
    assert val_data["total_rows"] == 2
    assert val_data["valid_rows"] == 2
    assert val_data["invalid_rows"] == 0

    # 4. Commit Import
    commit_res = client.post(
        f"/api/v1/data-imports/{job_id}/commit",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert commit_res.status_code == 200
    commit_data = commit_res.json()
    assert commit_data["status"] == "COMPLETED"
    assert commit_data["imported_count"] == 2

    # 5. Query Analytics Summary (Now has real data!)
    analytics_after = client.get(
        "/api/v1/analytics/summary",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert analytics_after.status_code == 200
    summary = analytics_after.json()
    assert summary["has_data"] is True
    # Order 1: 2 * 100 = 200 (Cost = 80, Profit = 120)
    # Order 2: 4 * 25 = 100 (Cost = 40, Profit = 60)
    # Total Revenue = 300, Gross Profit = 180, Gross Margin = 60.0%
    assert summary["metrics"]["total_revenue"] == 300.0
    assert summary["metrics"]["gross_profit"] == 180.0
    assert summary["metrics"]["gross_margin_pct"] == 60.0
    assert summary["metrics"]["active_customers"] == 2

def test_cross_tenant_data_isolation_on_imported_records(client):
    """
    CRITICAL ACCEPTANCE CRITERIA:
    Organization B cannot query or access records imported by Organization A.
    """
    # 1. Organization A imports records
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": "orgA@test.com", "password": "Password123!", "full_name": "Org A User", "organization_name": "Org A"}
    )
    token_a = reg_a.json()["access_token"]

    csv_data = "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\nORD-AAA,CUST-A,2026-11-01,SKU-A,1,500.00,200.00\n"
    upload_res = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token_a}"},
        files={"file": ("secret_a.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    job_id_a = upload_res.json()["job_id"]
    client.post(
        f"/api/v1/data-imports/{job_id_a}/validate",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"mappings": upload_res.json()["suggested_mappings"]}
    )
    client.post(f"/api/v1/data-imports/{job_id_a}/commit", headers={"Authorization": f"Bearer {token_a}"})

    # 2. Organization B registers
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": "orgB@test.com", "password": "Password123!", "full_name": "Org B User", "organization_name": "Org B"}
    )
    token_b = reg_b.json()["access_token"]

    # 3. Org B attempts to inspect Org A's import job
    attack_job = client.get(
        f"/api/v1/data-imports/{job_id_a}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert attack_job.status_code == 404

    # 4. Org B checks their own analytics -> Must be 0 (no data leak from Org A!)
    analytics_b = client.get("/api/v1/analytics/summary", headers={"Authorization": f"Bearer {token_b}"})
    assert analytics_b.json()["metrics"]["total_revenue"] == 0.0
    assert analytics_b.json()["has_data"] is False
