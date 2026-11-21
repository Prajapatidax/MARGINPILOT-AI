import io
import pytest

def seed_ml_test_dataset(client, token):
    """Seed customer and transaction data for ML training."""
    csv_data = (
        "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\n"
        "ORD-901,CUST-ALPHA,2026-11-01,SKU-EARBUDS,10,50.00,20.00\n"
        "ORD-902,CUST-BETA,2026-11-05,SKU-WATCH,5,200.00,100.00\n"
        "ORD-903,CUST-GAMMA,2026-08-10,SKU-POWERBANK,1,30.00,12.00\n"
        "ORD-904,CUST-ALPHA,2026-11-18,SKU-EARBUDS,8,50.00,20.00\n"
        "ORD-905,CUST-DELTA,2026-11-19,SKU-EXPENSIVE,1,3500.00,3400.00\n"
    )
    up = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("ml_data.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
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

def test_ml_model_training_and_retrieval(client):
    """Verifies real ML training pipeline executes, computes metrics, and registers models."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "mladmin@company.com", "password": "Password123!", "full_name": "ML Engineer", "organization_name": "ML Corp"}
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]
    seed_ml_test_dataset(client, token)

    # 1. Trigger all models training
    train_res = client.post(
        "/api/v1/ml/train",
        headers={"Authorization": f"Bearer {token}"},
        json={"model_family": "all"}
    )
    assert train_res.status_code == 200
    train_data = train_res.json()
    assert train_data["status"] == "SUCCESS"
    assert "churn" in train_data
    assert "demand" in train_data
    assert "anomaly" in train_data

    # 2. Fetch registered models
    models_res = client.get("/api/v1/ml/models", headers={"Authorization": f"Bearer {token}"})
    assert models_res.status_code == 200
    models = models_res.json()
    model_names = [m["model_name"] for m in models]
    assert "customer_churn" in model_names
    assert "demand_forecast" in model_names
    assert "anomaly_detection" in model_names

    # Check metrics
    churn_model = next(m for m in models if m["model_name"] == "customer_churn")
    assert "accuracy" in churn_model["metrics"]
    assert churn_model["metrics"]["accuracy"] > 0.0

def test_churn_predictions_with_explainability(client):
    """Verifies customer churn predictions generate risk categories and explainable factors."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "churn_lead@company.com", "password": "Password123!", "full_name": "Churn Lead", "organization_name": "Retention Corp"}
    )
    token = reg.json()["access_token"]
    seed_ml_test_dataset(client, token)

    client.post(
        "/api/v1/ml/train",
        headers={"Authorization": f"Bearer {token}"},
        json={"model_family": "churn"}
    )

    preds_res = client.get("/api/v1/ml/predictions/churn", headers={"Authorization": f"Bearer {token}"})
    assert preds_res.status_code == 200
    preds = preds_res.json()
    assert len(preds) > 0
    first = preds[0]
    assert "churn_probability" in first
    assert "risk_category" in first
    assert "top_risk_factors" in first
    assert "recommended_action" in first

def test_demand_forecasting_horizons(client):
    """Verifies multi-horizon SKU demand forecasts (7d, 30d, 90d) and confidence intervals."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "forecaster@company.com", "password": "Password123!", "full_name": "Forecaster", "organization_name": "Supply Corp"}
    )
    token = reg.json()["access_token"]
    seed_ml_test_dataset(client, token)

    client.post(
        "/api/v1/ml/train",
        headers={"Authorization": f"Bearer {token}"},
        json={"model_family": "demand"}
    )

    demand_res = client.get("/api/v1/ml/predictions/demand", headers={"Authorization": f"Bearer {token}"})
    assert demand_res.status_code == 200
    demands = demand_res.json()
    assert len(demands) > 0
    first = demands[0]
    assert "forecast_7d" in first
    assert "forecast_30d" in first
    assert "forecast_90d" in first
    assert first["forecast_30d"] > first["forecast_7d"]
    assert "confidence_lower_30d" in first
    assert "confidence_upper_30d" in first

def test_anomaly_detection_and_status_update(client):
    """Verifies statistical anomalies are detected and can be updated through investigation lifecycle."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "risk@company.com", "password": "Password123!", "full_name": "Risk Officer", "organization_name": "Audit Corp"}
    )
    token = reg.json()["access_token"]
    seed_ml_test_dataset(client, token)

    client.post(
        "/api/v1/ml/train",
        headers={"Authorization": f"Bearer {token}"},
        json={"model_family": "anomaly"}
    )

    anom_res = client.get("/api/v1/ml/anomalies", headers={"Authorization": f"Bearer {token}"})
    assert anom_res.status_code == 200
    anomalies = anom_res.json()
    assert len(anomalies) > 0

    first_anom = anomalies[0]
    anom_id = first_anom["id"]
    assert first_anom["status"] == "OPEN"

    # Update status to INVESTIGATING
    patch_res = client.patch(
        f"/api/v1/ml/anomalies/{anom_id}",
        headers={"Authorization": f"Bearer {token}"},
        json={"status": "INVESTIGATING"}
    )
    assert patch_res.status_code == 200
    assert patch_res.json()["new_status"] == "INVESTIGATING"

def test_ml_cross_tenant_isolation(client):
    """Verifies Organization B cannot access Organization A's ML models, predictions, or anomalies."""
    # Org A
    reg_a = client.post(
        "/api/v1/auth/register",
        json={"email": "tenant_a_ml@company.com", "password": "Password123!", "full_name": "Org A ML", "organization_name": "Org A"}
    )
    token_a = reg_a.json()["access_token"]
    seed_ml_test_dataset(client, token_a)
    client.post("/api/v1/ml/train", headers={"Authorization": f"Bearer {token_a}"}, json={"model_family": "all"})

    # Org B
    reg_b = client.post(
        "/api/v1/auth/register",
        json={"email": "tenant_b_ml@company.com", "password": "Password123!", "full_name": "Org B ML", "organization_name": "Org B"}
    )
    token_b = reg_b.json()["access_token"]

    # Org B queries models before training -> should be 0
    models_b = client.get("/api/v1/ml/models", headers={"Authorization": f"Bearer {token_b}"}).json()
    assert len(models_b) == 0

    # Org B queries predictions -> should be 0
    churn_b = client.get("/api/v1/ml/predictions/churn", headers={"Authorization": f"Bearer {token_b}"}).json()
    assert len(churn_b) == 0

    anom_b = client.get("/api/v1/ml/anomalies", headers={"Authorization": f"Bearer {token_b}"}).json()
    assert len(anom_b) == 0
