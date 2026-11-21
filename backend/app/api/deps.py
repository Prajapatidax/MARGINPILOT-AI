from typing import Generator, Optional, List
from fastapi import Depends, HTTPException, status, Header
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import select
import jwt

from app.core.config import settings
from app.core.security import decode_token
from app.core.tenant import TenantContext
from app.db.session import get_db
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import OrganizationMembership, OrganizationRole

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    """Extracts and verifies the authenticated user from the Bearer JWT token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or session has expired.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        user_id: Optional[str] = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except (jwt.PyJWTError, Exception):
        raise credentials_exception

    user = db.execute(select(User).where(User.id == user_id)).scalar_one_or_none()
    if user is None:
        raise credentials_exception
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is deactivated."
        )
    return user

def get_tenant_context(
    x_organization_id: Optional[str] = Header(None, alias="X-Organization-ID"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    token: str = Depends(oauth2_scheme)
) -> TenantContext:
    """
    Enforces strict multi-tenant isolation.
    Validates that the current user has an active membership in the target organization.
    Prioritizes:
    1. Explicit 'X-Organization-ID' request header.
    2. 'org_id' claim encoded in the JWT token.
    3. User's default or first active organization membership.
    """
    target_org_id = x_organization_id
    if not target_org_id:
        try:
            payload = decode_token(token)
            target_org_id = payload.get("org_id")
        except Exception:
            pass

    # Query user memberships
    memberships = db.execute(
        select(OrganizationMembership).where(OrganizationMembership.user_id == current_user.id)
    ).scalars().all()

    if not memberships:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not belong to any organization. Please create or accept an organization invite."
        )

    # If target_org_id is provided, verify membership
    active_membership: Optional[OrganizationMembership] = None
    if target_org_id:
        active_membership = next((m for m in memberships if m.organization_id == target_org_id), None)
        if not active_membership and not current_user.is_superadmin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied: You are not authorized to access organization '{target_org_id}'."
            )
    else:
        # Fallback to default membership or the first one
        active_membership = next((m for m in memberships if m.is_default), memberships[0])

    # If superadmin accessing an org they are not explicitly member of:
    if not active_membership and current_user.is_superadmin and target_org_id:
        org = db.execute(select(Organization).where(Organization.id == target_org_id)).scalar_one_or_none()
        if not org:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Organization not found.")
        return TenantContext(
            user_id=current_user.id,
            organization_id=target_org_id,
            role=OrganizationRole.SUPERADMIN,
            is_superadmin=True
        )

    return TenantContext(
        user_id=current_user.id,
        organization_id=active_membership.organization_id,
        role=active_membership.role,
        is_superadmin=current_user.is_superadmin
    )

def require_roles(allowed_roles: List[OrganizationRole]):
    """Role-Based Access Control dependency factory."""
    def role_checker(tenant: TenantContext = Depends(get_tenant_context)) -> TenantContext:
        if tenant.is_superadmin:
            return tenant
        if tenant.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Operation requires one of the following roles: {[r.value for r in allowed_roles]}. Your role: {tenant.role.value}"
            )
        return tenant
    return role_checker
