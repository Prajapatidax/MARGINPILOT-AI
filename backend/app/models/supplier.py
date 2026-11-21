from typing import Optional
from sqlalchemy import String, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Supplier(Base):
    __tablename__ = "suppliers"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    supplier_code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avg_lead_time_days: Mapped[float] = mapped_column(Numeric(6, 2), default=7.0, nullable=False)
    on_time_delivery_rate: Mapped[float] = mapped_column(Numeric(5, 4), default=0.95, nullable=False)
    reliability_score: Mapped[float] = mapped_column(Numeric(5, 4), default=0.90, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "supplier_code", name="uq_org_supplier_code"),
    )
