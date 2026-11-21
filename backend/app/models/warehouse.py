from typing import Optional
from sqlalchemy import String, Numeric, ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Warehouse(Base):
    __tablename__ = "warehouses"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    code: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    capacity: Mapped[float] = mapped_column(Numeric(12, 2), default=10000.0, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "code", name="uq_org_warehouse_code"),
    )
