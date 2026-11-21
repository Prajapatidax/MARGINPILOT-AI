from dataclasses import dataclass
from typing import Optional
from app.models.membership import OrganizationRole

@dataclass
class TenantContext:
    """Holds validated organization and membership information for the current request."""
    user_id: str
    organization_id: str
    role: OrganizationRole
    is_superadmin: bool = False

    def can_manage_members(self) -> bool:
        return self.is_superadmin or self.role in [OrganizationRole.OWNER, OrganizationRole.ADMIN]

    def can_manage_settings(self) -> bool:
        return self.is_superadmin or self.role in [OrganizationRole.OWNER, OrganizationRole.ADMIN]

    def can_write_business_data(self) -> bool:
        return self.is_superadmin or self.role in [
            OrganizationRole.OWNER,
            OrganizationRole.ADMIN,
            OrganizationRole.MANAGER
        ]

    def can_view_analytics(self) -> bool:
        return True  # All members have read-only visibility into their assigned organization
