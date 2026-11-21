from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, ConfigDict
from app.models.membership import OrganizationRole
from app.models.invitation import InvitationStatus

class MembershipResponse(BaseModel):
    id: str
    user_id: str
    user_email: str
    user_name: str
    organization_id: str
    organization_name: str
    role: OrganizationRole
    is_default: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class InviteMemberRequest(BaseModel):
    email: EmailStr
    role: OrganizationRole = OrganizationRole.STAFF

class InvitationResponse(BaseModel):
    id: str
    organization_id: str
    email: str
    role: OrganizationRole
    token: str
    status: InvitationStatus
    expires_at: datetime
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
