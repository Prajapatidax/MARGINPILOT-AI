# MarginPilot AI — Machine Learning Architecture Specification

## 1. Overview & Architectural Principles

MarginPilot AI integrates production-grade machine learning pipelines built to deliver predictive intelligence from real tabular and time-series business data.

### Core Principles
1. **Zero Mock Predictions**: Predictions originate strictly from trained, serialized ML artifacts registered in MLflow.
2. **Strict Tenant Feature Isolation**: Datasets are partitioned by `organization_id` during feature extraction. Models are trained either per-organization or on anonymized cross-tenant benchmarks with tenant-level conditioning.
3. **Reproducibility**: Every model run records random seed, dataset commit hash, training parameters, and evaluation metrics.
4. **Explainability**: Black-box models must be accompanied by TreeSHAP or attribution scores to explain top contributing drivers.

---

## 2. Supervised & Unsupervised Model Topology

```
+-------------------------------------------------------------------------------+
|                                ML PIPELINE RUNNER                             |
|                                                                               |
|  +--------------------+  +--------------------+  +-------------------------+  |
|  |  Customer Churn    |  |  Demand Forecast   |  |   Anomaly Detection     |  |
|  |  XGBoost Classifier|  |  LightGBM & LSTM   |  |   Isolation Forest &    |  |
|  |  Metric: F1 & ROC  |  |  Metric: MAPE & WAPE| |   Deep Autoencoder      |  |
|  +--------------------+  +--------------------+  +-------------------------+  |
|            |                       |                          |               |
|            +-----------------------+--------------------------+               |
|                                    |                                          |
|                                    v                                          |
|                         +---------------------+                               |
|                         |   MLflow Registry   |                               |
|                         | Weights & Run Logs  |                               |
|                         +----------+----------+                               |
|                                    |                                          |
|                                    v                                          |
|                         +---------------------+                               |
|                         | Inference Service   |                               |
|                         | Scored & Persisted  |                               |
|                         +---------------------+                               |
+-------------------------------------------------------------------------------+
```

---

## 3. Model Specifications

### Module A: Customer Churn Classification
- **Algorithm**: `XGBClassifier` with Bayesian hyperparameter optimization.
- **Baseline**: `RandomForestClassifier` and Dummy Majority Baseline.
- **Features**: Recency (days since last transaction), Frequency (orders per 90d), Monetary (total spend), Return frequency, Average Order Value (AOV) trend slope.
- **Explainability**: TreeSHAP values calculating top 3 risk factors per at-risk customer.

### Module B: Demand Forecasting
- **Algorithm**: `LGBMRegressor` with multi-horizon sequence mapping (7, 30, 90 days) alongside PyTorch LSTM.
- **Features**: Lag sales (t-1, t-7, t-14, t-30), 7-day rolling mean/std, day-of-week, month, holiday flags, unit price, stock availability flags.
- **Evaluation**: MAPE, RMSE, and WAPE compared against Seasonal Naive baseline.

### Module C: Transactional & Margin Anomaly Detection
- **Algorithm**: `IsolationForest` (contamination=0.03) and PyTorch Reconstruction Autoencoder.
- **Target**: Operating expense spikes, unit margin degradations, sudden volume anomalies.
