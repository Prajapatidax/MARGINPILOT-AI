# MarginPilot AI — Model Evaluation & Governance Standards

This document establishes the evaluation thresholds, baseline comparison benchmarks, and governance promotion criteria for machine learning and deep learning models in MarginPilot AI.

---

## 1. Model Promotion Criteria

A newly trained candidate model (`Challenger`) is only promoted to `Production` in the MLflow Model Registry if it beats the active `Champion` model across designated validation splits:

| Model Family | Primary Metric | Minimum Required Gate | Baseline Comparison Target |
| :--- | :--- | :--- | :--- |
| **Customer Churn** | F1-Score (Macro) | $\ge 0.82$ | Random Forest Baseline ($\ge +5\%$ gain) |
| **Customer Churn** | ROC-AUC | $\ge 0.88$ | Logistic Regression Baseline |
| **Demand Forecasting** | MAPE | $\le 12.0\%$ | Seasonal Naive Baseline ($\ge 20\%$ lower error) |
| **Demand Forecasting** | WAPE | $\le 10.5\%$ | Moving Average Baseline |
| **Anomaly Detection** | F1-Score / Precision | $\ge 0.85$ | IQR / Z-Score Statistical Thresholds |

---

## 2. Model Governance Lifecycle

```
[Development] --> [Automated Validation] --> [Staging] --> [Shadow Inference] --> [Production]
      |                       |                                                        |
      +--- Fails Gate --------+------------------- Automated Alert --------------------+
```

1. **Development**: Training triggered via background worker. Parameters and artifacts logged to MLflow.
2. **Automated Validation**: Model evaluated against out-of-time test splits (strictly preventing temporal data leakage).
3. **Staging**: Candidate artifact verified for inference latency (< 50ms) and schema contract compliance.
4. **Production**: Artifact marked as active version in `ml_model_versions` table and exposed to the frontend ML Model Center.
