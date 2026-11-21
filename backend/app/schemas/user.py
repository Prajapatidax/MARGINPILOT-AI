from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, ConfigDict
from app.schemas.organization import OrganizationResponse

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    is_active: bool
    is_superadmin: bool
    created_at: datetime
    organizations: List[OrganizationResponse] = []
    active_organization_id: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
