from datetime import datetime, timezone
from typing import Optional, Dict, Any
from sqlalchemy import String, Numeric, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class AIRecommendation(Base):
    __tablename__ = "ai_recommendations"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    category: Mapped[str] = mapped_column(String(64), nullable=False, index=True)  # INVENTORY, CHURN, MARGIN, PRICING
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    impact_summary: Mapped[str] = mapped_column(String(128), nullable=False)  # "Stockout risk: 92%", "Churn risk: 78%"
    severity: Mapped[str] = mapped_column(String(16), default="HIGH", nullable=False)  # CRITICAL, HIGH, MEDIUM, LOW
    status: Mapped[str] = mapped_column(String(32), default="PENDING", nullable=False)  # PENDING, ACCEPTED, DISMISSED, COMPLETED
    action_payload: Mapped[Optional[Dict[str, Any]]] = mapped_column(JSON, nullable=True)
    expected_roi: Mapped[Optional[float]] = mapped_column(Numeric(12, 2), nullable=True)
