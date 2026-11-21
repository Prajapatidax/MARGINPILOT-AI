from datetime import datetime, timezone
from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Numeric, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.customer import Customer
    from app.models.product import Product

class SalesOrder(Base):
    __tablename__ = "sales_orders"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    customer_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True, index=True)
    order_number: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    order_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    status: Mapped[str] = mapped_column(String(32), default="DELIVERED", nullable=False)
    subtotal: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    discount_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    total_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    cogs_amount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    gross_profit: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "order_number", name="uq_org_sales_order_number"),
    )

    customer: Mapped[Optional["Customer"]] = relationship("Customer", back_populates="sales_orders")
    items: Mapped[List["SalesOrderItem"]] = relationship("SalesOrderItem", back_populates="sales_order", cascade="all, delete-orphan")

class SalesOrderItem(Base):
    __tablename__ = "sales_order_items"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    sales_order_id: Mapped[str] = mapped_column(String(36), ForeignKey("sales_orders.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("products.id", ondelete="SET NULL"), nullable=True, index=True)
    quantity: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    unit_cost: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    unit_price: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    discount: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    line_total: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)

    sales_order: Mapped["SalesOrder"] = relationship("SalesOrder", back_populates="items")
    product: Mapped[Optional["Product"]] = relationship("Product", back_populates="sales_order_items")
