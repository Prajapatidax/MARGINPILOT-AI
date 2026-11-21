from typing import Optional, List, TYPE_CHECKING
from sqlalchemy import String, Numeric, Integer, Boolean, ForeignKey, UniqueConstraint, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.sales_order import SalesOrderItem

class ProductCategory(Base):
    __tablename__ = "product_categories"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(128), nullable=False)
    code: Mapped[str] = mapped_column(String(64), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    __table_args__ = (
        UniqueConstraint("organization_id", "code", name="uq_org_category_code"),
    )

    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")

class Product(Base):
    __tablename__ = "products"

    organization_id: Mapped[str] = mapped_column(String(36), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    category_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("product_categories.id", ondelete="SET NULL"), nullable=True, index=True)
    sku: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cost_price: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    selling_price: Mapped[float] = mapped_column(Numeric(14, 2), default=0.0, nullable=False)
    reorder_point: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    safety_stock: Mapped[int] = mapped_column(Integer, default=5, nullable=False)
    lead_time_days: Mapped[int] = mapped_column(Integer, default=7, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    __table_args__ = (
        UniqueConstraint("organization_id", "sku", name="uq_org_product_sku"),
    )

    category: Mapped[Optional["ProductCategory"]] = relationship("ProductCategory", back_populates="products")
    sales_order_items: Mapped[List["SalesOrderItem"]] = relationship("SalesOrderItem", back_populates="product")
