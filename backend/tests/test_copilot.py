import io
import pytest

def seed_copilot_business_data(client, token):
    """Seed verifiable sales and inventory records for copilot grounding tests."""
    csv_data = (
        "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\n"
        "ORD-COP1,CUST-COP,2026-11-01,SKU-EARBUDS,10,50.00,20.00\n"
        "ORD-COP2,CUST-COP,2026-11-10,SKU-WATCH,5,200.00,100.00\n"
        "ORD-COP3,CUST-COP,2026-11-15,SKU-POWERBANK,20,30.00,12.00\n"
    )
    up = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("copilot_data.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    job_id = up.json()["job_id"]
    client.post(
        f"/api/v1/data-imports/{job_id}/validate",
        headers={"Authorization": f"Bearer {token}"},
        json={"mappings": up.json()["suggested_mappings"]}
    )
    client.post(
        f"/api/v1/data-imports/{job_id}/commit",
        headers={"Authorization": f"Bearer {token}"}
    )

def test_copilot_revenue_inquiry_with_grounding_and_chart(client):
    """Verifies that copilot returns grounded database responses with inline chart visualizations."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "copilot_user@company.com", "password": "Password123!", "full_name": "Executive User", "organization_name": "Advisory Corp"}
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    seed_copilot_business_data(client, token)

    # Ask the exact question from the product mockup
    chat_res = client.post(
        "/api/v1/copilot/chat",
        headers={"Authorization": f"Bearer {token}"},
        json={"message": "Why did my revenue decline last month?"}
    )
    assert chat_res.status_code == 200
    data = chat_res.json()

    assert data["role"] == "assistant"
    # Grounded answer content
    assert "revenue" in data["content"].lower()
    assert "Electronics" in data["content"] or "Total Revenue" in data["content"]
    assert len(data["grounding_sources"]) > 0

    # Inline chart visualization payload matching mockup
    assert data["chart_data"] is not None
    assert data["chart_data"]["type"] == "bar"
    assert len(data["chart_data"]["data"]) > 0

    conv_id = data["conversation_id"]

    # Retrieve conversation history
    hist_res = client.get(
        f"/api/v1/copilot/conversations/{conv_id}",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert hist_res.status_code == 200
    hist = hist_res.json()
    assert len(hist["messages"]) == 2  # user + assistant

def test_copilot_cross_tenant_isolation(client):
    """Verifies Organization B cannot access Organization A's copilot conversations."""
    # Org A
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": "cop_a@company.com", "password": "Password123!", "full_name": "User A", "organization_name": "Org A Copilot"}
    )
    token_a = reg_a.json()["access_token"]
    seed_copilot_business_data(client, token_a)

    chat_a = client.post(
        "/api/v1/copilot/chat",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"message": "What are my inventory stockout risks?"}
    )
    conv_a_id = chat_a.json()["conversation_id"]

    # Org B
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": "cop_b@company.com", "password": "Password123!", "full_name": "User B", "organization_name": "Org B Copilot"}
    )
    token_b = reg_b.json()["access_token"]

    # Org B attempts to access Org A's conversation
    forbidden_res = client.get(
        f"/api/v1/copilot/conversations/{conv_a_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert forbidden_res.status_code == 404
