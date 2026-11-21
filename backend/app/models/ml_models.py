import enum
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List
from sqlalchemy import String, Integer, Numeric, DateTime, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class ModelStatus(str, enum.Enum):
    DEVELOPMENT = "DEVELOPMENT"
    EVALUATION = "EVALUATION"
    STAGING = "STAGING"
    PRODUCTION = "PRODUCTION"
    ARCHIVED = "ARCHIVED"

class DriftStatus(str, enum.Enum):
    STABLE = "STABLE"
    MONITORING = "MONITORING"
    DRIFT_DETECTED = "DRIFT_DETECTED"

class MLModelVersion(Base):
    __tablename__ = "ml_model_versions"

    organization_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True, index=True)
    model_name: Mapped[str] = mapped_column(String(128), nullable=False, index=True)  # customer_churn, demand_forecast, anomaly_detection, customer_segmentation
    version: Mapped[str] = mapped_column(String(32), nullable=False)  # 1.2.0, 2.0.0
    model_type: Mapped[str] = mapped_column(String(64), nullable=False)  # XGBOOST, KMEANS, ISOLATION_FOREST, RANDOM_FOREST
    status: Mapped[str] = mapped_column(String(32), default=ModelStatus.PRODUCTION.value, nullable=False)
    
    metrics: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)  # {"accuracy": 0.914, "f1": 0.902, "mape": 0.087}
    parameters: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    feature_names: Mapped[Optional[List[str]]] = mapped_column(JSON, nullable=True)
    artifact_uri: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    
    prediction_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    drift_status: Mapped[str] = mapped_column(String(32), default=DriftStatus.STABLE.value, nullable=False)
    last_trained_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)

    predictions: Mapped[List["MLPrediction"]] = relationship("MLPrediction", back_populates="model_version", cascade="all, delete-orphan")

class MLPrediction(Base):
    __tablename__ = "ml_predictions"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    model_version_id: Mapped[str] = mapped_column(String(36), ForeignKey("ml_model_versions.id", ondelete="CASCADE"), nullable=False, index=True)
    target_entity_type: Mapped[str] = mapped_column(String(64), nullable=False)  # CUSTOMER, PRODUCT, ORDER
    target_entity_id: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    
    predicted_value: Mapped[Dict[str, Any]] = mapped_column(JSON, nullable=False)
    confidence_score: Mapped[float] = mapped_column(Numeric(5, 4), default=0.90, nullable=False)
    explainability: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)  # feature attributions

    model_version: Mapped["MLModelVersion"] = relationship("MLModelVersion", back_populates="predictions")

class Anomaly(Base):
    __tablename__ = "anomalies"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    entity_type: Mapped[str] = mapped_column(String(64), nullable=False)  # TRANSACTION, EXPENSE, MARGIN, INVENTORY
    entity_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    severity: Mapped[str] = mapped_column(String(16), default="MEDIUM", nullable=False)  # LOW, MEDIUM, HIGH, CRITICAL
    detected_value: Mapped[float] = mapped_column(Numeric(14, 2), nullable=False)
    expected_range: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(32), default="OPEN", nullable=False)  # OPEN, INVESTIGATING, RESOLVED, FALSE_POSITIVE
