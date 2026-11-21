from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sales_order import SalesOrder

class Customer(Base):
    __tablename__ = "customers"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True, index=True)
    phone: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    segment: Mapped[str] = mapped_column(String(64), default="NEW", nullable=False)
    clv_estimate: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    churn_risk_score: Mapped[float] = mapped_column(Numeric(5, 4), default=0.0, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "customer_code", name="uq_org_customer_code"),
    )

    sales_orders: Mapped[List["SalesOrder"]] = relationship("SalesOrder", back_populates="customer", cascade="all, delete-orphan")
