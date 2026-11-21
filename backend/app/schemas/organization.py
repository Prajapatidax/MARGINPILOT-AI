from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, ConfigDict
from app.models.organization import BusinessType, SubscriptionPlan
from app.models.membership import OrganizationRole

class OrganizationBase(BaseModel):
    name: str
    business_type: BusinessType = BusinessType.RETAIL
    currency: str = "USD"
    timezone: str = "UTC"
    country: str = "US"
    subscription_plan: Optional[SubscriptionPlan] = SubscriptionPlan.GROWTH
    trial_ends_at: Optional[datetime] = None
    subscription_status: Optional[str] = "trialing"

class OrganizationCreate(OrganizationBase):
    slug: Optional[str] = None

class OrganizationUpdate(BaseModel):
    name: Optional[str] = None
    business_type: Optional[BusinessType] = None
    currency: Optional[str] = None
    timezone: Optional[str] = None
    country: Optional[str] = None
    subscription_plan: Optional[SubscriptionPlan] = None
    subscription_status: Optional[str] = None
    is_active: Optional[bool] = None

class OrganizationResponse(OrganizationBase):
    id: str
    slug: str
    subscription_plan: SubscriptionPlan
    trial_ends_at: Optional[datetime] = None
    subscription_status: str = "trialing"
    is_active: bool
    created_at: datetime
    updated_at: datetime
    user_role: Optional[OrganizationRole] = None

    model_config = ConfigDict(from_attributes=True)

class OrganizationSwitchRequest(BaseModel):
    organization_id: str
