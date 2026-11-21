import io
import torch
import numpy as np
from app.ml.deep_learning.lstm_forecaster import LSTMDemandForecaster
from app.ml.deep_learning.autoencoder_anomaly import DeepAnomalyAutoencoder

def test_pytorch_lstm_forecaster_architecture():
    """Verifies PyTorch LSTM forecaster forward pass, dimension transforms, and output bounds."""
    batch_size = 4
    seq_len = 5
    input_dim = 4

    model = LSTMDemandForecaster(input_dim=input_dim, hidden_dim=16, num_layers=2)
    x = torch.randn(batch_size, seq_len, input_dim)
    out = model(x)

    # Output should be (batch_size, 3) for [7d, 30d, 90d]
    assert out.shape == (batch_size, 3)
    # Demand predictions are ReLU bounded (>= 0)
    assert torch.all(out >= 0.0)

def test_pytorch_autoencoder_reconstruction():
    """Verifies Deep Autoencoder compresses through bottleneck and computes reconstruction error."""
    batch_size = 8
    input_dim = 4
    latent_dim = 2

    autoencoder = DeepAnomalyAutoencoder(input_dim=input_dim, latent_dim=latent_dim)
    x = torch.randn(batch_size, input_dim)
    reconstructed = autoencoder(x)

    assert reconstructed.shape == (batch_size, input_dim)
    errors = autoencoder.compute_reconstruction_error(x)
    assert len(errors) == batch_size
    assert np.all(errors >= 0.0)

def test_deep_learning_api_training_and_benchmarks(client):
    """Verifies end-to-end PyTorch deep learning training and model benchmark endpoints."""
    reg = client.post(
        "/api/v1/auth/register",
        json={"email": "dl_lead@company.com", "password": "Password123!", "full_name": "DL Engineer", "organization_name": "Deep Learning Corp"}
    )
    assert reg.status_code == 201
    token = reg.json()["access_token"]

    # Seed data
    csv_data = (
        "order_number,customer_code,transaction_date,sku,quantity,unit_price,unit_cost\n"
        "ORD-DL1,CUST-DL,2026-11-01,SKU-EARBUDS,10,50.00,20.00\n"
        "ORD-DL2,CUST-DL,2026-11-05,SKU-WATCH,5,200.00,100.00\n"
    )
    up = client.post(
        "/api/v1/data-imports/upload",
        headers={"Authorization": f"Bearer {token}"},
        files={"file": ("dl_data.csv", io.BytesIO(csv_data.encode("utf-8")), "text/csv")},
        data={"target_entity": "sales"}
    )
    job_id = up.json()["job_id"]
    client.post(f"/api/v1/data-imports/{job_id}/validate", headers={"Authorization": f"Bearer {token}"}, json={"mappings": up.json()["suggested_mappings"]})
    client.post(f"/api/v1/data-imports/{job_id}/commit", headers={"Authorization": f"Bearer {token}"})

    # Trigger PyTorch Deep Learning training
    dl_train_res = client.post(
        "/api/v1/ml/train/deep-learning",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert dl_train_res.status_code == 200
    res_data = dl_train_res.json()
    assert res_data["status"] == "SUCCESS"
    assert "lstm_demand_forecast" in res_data
    assert "deep_autoencoder_anomaly" in res_data

    # Query comparative benchmarks
    bench_res = client.get(
        "/api/v1/ml/benchmarks",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert bench_res.status_code == 200
    benchmarks = bench_res.json()
    assert "forecasting" in benchmarks
    assert "anomaly_detection" in benchmarks
    assert "winner" in benchmarks["forecasting"]
