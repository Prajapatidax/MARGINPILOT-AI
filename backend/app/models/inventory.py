from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import String, Numeric, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    product_id: Mapped[str] = mapped_column(String(36), ForeignKey("products.id", ondelete="CASCADE"), nullable=False, index=True)
    warehouse_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("warehouses.id", ondelete="SET NULL"), nullable=True, index=True)
    transaction_type: Mapped[str] = mapped_column(String(32), nullable=False)  # PURCHASE_RECEIPT, SALE_ISSUE, ADJUSTMENT, RETURN, TRANSFER
    quantity: Mapped[float] = mapped_column(Numeric(12, 4), nullable=False)
    unit_cost: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    reference_id: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    transaction_date: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
