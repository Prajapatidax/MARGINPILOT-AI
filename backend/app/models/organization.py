import enum
from datetime import datetime
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Boolean, Enum, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

if TYPE_CHECKING:
    from app.models.membership import OrganizationMembership
    from app.models.invitation import OrganizationInvitation

class BusinessType(str, enum.Enum):
    RETAIL = "RETAIL"
    MANUFACTURING = "MANUFACTURING"
    WHOLESALE = "WHOLESALE"
    DISTRIBUTION = "DISTRIBUTION"

class SubscriptionPlan(str, enum.Enum):
    TRIAL = "TRIAL"
    STARTER = "STARTER"
    GROWTH = "GROWTH"
    ENTERPRISE = "ENTERPRISE"

class Organization(Base):
    __tablename__ = "organizations"

    name: Mapped[str] = mapped_column(String(255), nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    business_type: Mapped[BusinessType] = mapped_column(
        Enum(BusinessType, native_enum=False),
        default=BusinessType.RETAIL,
        nullable=False
    )
    currency: Mapped[str] = mapped_column(String(10), default="USD", nullable=False)
    timezone: Mapped[str] = mapped_column(String(64), default="UTC", nullable=False)
    country: Mapped[str] = mapped_column(String(64), default="US", nullable=False)
    subscription_plan: Mapped[SubscriptionPlan] = mapped_column(
        Enum(SubscriptionPlan, native_enum=False),
        default=SubscriptionPlan.GROWTH,
        nullable=False
    )
    trial_ends_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    subscription_status: Mapped[str] = mapped_column(String(32), default="trialing", nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    # Relationships
    memberships: Mapped[List["OrganizationMembership"]] = relationship(
        "OrganizationMembership",
        back_populates="organization",
        cascade="all, delete-orphan"
    )
    invitations: Mapped[List["OrganizationInvitation"]] = relationship(
        "OrganizationInvitation",
        back_populates="organization",
        cascade="all, delete-orphan"
    )
