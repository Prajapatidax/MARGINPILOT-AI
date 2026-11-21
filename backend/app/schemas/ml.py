from datetime import datetime
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, ConfigDict
from app.models.ml_models import ModelStatus, DriftStatus

class MLModelVersionResponse(BaseModel):
    id: str
    organization_id: Optional[str] = None
    model_name: str
    version: str
    model_type: str
    status: str
    metrics: Optional[Dict[str, Any]] = None
    parameters: Optional[Dict[str, Any]] = None
    feature_names: Optional[List[str]] = None
    prediction_count: int
    drift_status: str
    last_trained_at: datetime

    model_config = ConfigDict(from_attributes=True)

class TrainModelRequest(BaseModel):
    model_family: str = "all"  # churn, demand, anomaly, segmentation, or all
    parameters: Optional[Dict[str, Any]] = None

class ChurnPredictionResponse(BaseModel):
    customer_id: str
    customer_code: str
    customer_name: str
    churn_probability: float
    risk_category: str  # LOW, MEDIUM, HIGH, CRITICAL
    confidence_score: float
    top_risk_factors: List[str]
    recommended_action: str

class DemandForecastResponse(BaseModel):
    product_id: str
    sku: str
    product_name: str
    horizon_days: int
    predicted_demand_units: float
    confidence_interval_lower: float
    confidence_interval_upper: float
    mape_accuracy: float

class AnomalyResponse(BaseModel):
    id: str
    entity_type: str
    entity_id: Optional[str] = None
    severity: str
    detected_value: float
    expected_range: Optional[Dict[str, Any]] = None
    explanation: str
    status: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UpdateAnomalyStatusRequest(BaseModel):
    status: str  # INVESTIGATING, RESOLVED, FALSE_POSITIVE
