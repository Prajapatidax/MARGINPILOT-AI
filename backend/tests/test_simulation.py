import io
import pytest

def test_simulator_price_reduction_elasticity(client):
    """Verifies counterfactual price elasticity simulation calculates expected revenue & margin impact."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "sim_user@company.com", "password": "Password123!", "full_name": "Planner", "organization_name": "Scenario Corp"}
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]

    # Run price reduction simulation matching the mockup (-10% price change)
    sim_res = client.post(
        "/api/v1/simulator/run",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "scenario_type": "PRICING",
            "parameter_change_percentage": -10.0,
            "elasticity_coefficient": 1.6
        }
    )
    assert sim_res.status_code == 200
    data = sim_res.json()

    assert data["scenario_type"] == "PRICING"
    assert data["parameter_change_pct"] == -10.0
    # Expected impact values match the mockup numbers: Revenue ~ +8.5%, Profit ~ +6.2%, Margin ~ 38.1%
    assert data["expected_revenue_change_pct"] > 0.0
    assert data["expected_profit_change_pct"] > 0.0
    assert data["expected_gross_margin_pct"] > 0.0
    assert data["projected_stockout_risk_pct"] > 70.0  # volume surge increases stockout risk
    assert len(data["curve"]) == 5

def test_ai_recommendations_lifecycle(client):
    """Verifies AI recommendations generation, retrieval, and status updates."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "rec_lead@company.com", "password": "Password123!", "full_name": "Operations Lead", "organization_name": "Action Corp"}
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]

    # Fetch recommendations
    recs_res = client.get(
        "/api/v1/recommendations",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert recs_res.status_code == 200
    recs = recs_res.json()
    assert len(recs) == 3

    titles = [r["title"] for r in recs]
    assert "Reorder 2 products" in titles
    assert "Contact at-risk customers" in titles
    assert "Review product margins" in titles

    # Accept recommendation
    first_id = recs[0]["id"]
    patch_res = client.patch(
        f"/api/v1/recommendations/{first_id}/status",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "ACCEPTED"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "ACCEPTED"
