import re
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.security import verify_password, hash_password, create_access_token
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.organization import Organization, BusinessType
from app.models.membership import OrganizationMembership, OrganizationRole
from app.schemas.auth import LoginRequest, RegisterRequest, Token
from app.schemas.user import UserResponse
from app.schemas.organization import OrganizationResponse, OrganizationSwitchRequest

router = APIRouter()

def slugify(text: str) -> str:
    slug = re.sub(r"[^\w\s-]", "", text.lower()).strip()
    return re.sub(r"[-\s]+", "-", slug)

@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Registers a new user account and sets up their initial organization workspace."""
    existing_user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # Create user
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        is_active=True,
        is_superadmin=False
    )
    db.add(user)
    db.flush()

    # Create initial organization
    org_name = payload.organization_name or f"{payload.full_name.split()[0]}'s Workspace"
    base_slug = slugify(org_name)
    slug = base_slug
    counter = 1
    while db.execute(select(Organization).where(Organization.slug == slug)).scalar_one_or_none():
        slug = f"{base_slug}-{counter}"
        counter += 1

    try:
        biz_type = BusinessType(payload.business_type) if payload.business_type else BusinessType.RETAIL
    except ValueError:
        biz_type = BusinessType.RETAIL

    org = Organization(
        name=org_name,
        slug=slug,
        business_type=biz_type,
        currency="USD",
        timezone="UTC",
        country="US"
    )
    db.add(org)
    db.flush()

    # Add user as OWNER of organization
    membership = OrganizationMembership(
        user_id=user.id,
        organization_id=org.id,
        role=OrganizationRole.OWNER,
        is_default=True
    )
    db.add(membership)
    db.commit()
    db.refresh(user)

    token = create_access_token(
        subject=user.id,
        organization_id=org.id,
        role=OrganizationRole.OWNER.value
    )

    return Token(
        access_token=token,
        token_type="bearer",
        active_organization_id=org.id,
        role=OrganizationRole.OWNER.value
    )

@router.post("/login", response_model=Token)
def login(
    payload: LoginRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Authenticates user credentials and issues a signed JWT token."""
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password."
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive. Contact your organization administrator."
        )

    # Get memberships
    memberships = db.execute(
        select(OrganizationMembership).where(OrganizationMembership.user_id == user.id)
    ).scalars().all()

    if not memberships and not user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User is not attached to any active organization."
        )

    # Determine active organization
    selected_org_id = None
    selected_role = OrganizationRole.STAFF.value

    if payload.organization_id:
        match = next((m for m in memberships if m.organization_id == payload.organization_id), None)
        if not match and not user.is_superadmin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized for the requested organization."
            )
        selected_org_id = payload.organization_id
        selected_role = match.role.value if match else OrganizationRole.SUPERADMIN.value
    elif memberships:
        default_m = next((m for m in memberships if m.is_default), memberships[0])
        selected_org_id = default_m.organization_id
        selected_role = default_m.role.value
    elif user.is_superadmin:
        selected_role = OrganizationRole.SUPERADMIN.value

    token = create_access_token(
        subject=user.id,
        organization_id=selected_org_id,
        role=selected_role
    )

    return Token(
        access_token=token,
        token_type="bearer",
        active_organization_id=selected_org_id,
        role=selected_role
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Returns profile information for the authenticated user and their organizations."""
    memberships = db.execute(
        select(OrganizationMembership).where(OrganizationMembership.user_id == current_user.id)
    ).scalars().all()

    orgs_response = []
    active_org_id = None

    for m in memberships:
        org = db.execute(select(Organization).where(Organization.id == m.organization_id)).scalar_one_or_none()
        if org:
            org_data = OrganizationResponse.model_validate(org)
            org_data.user_role = m.role
            orgs_response.append(org_data)
            if m.is_default and not active_org_id:
                active_org_id = m.organization_id

    if not active_org_id and orgs_response:
        active_org_id = orgs_response[0].id

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        is_active=current_user.is_active,
        is_superadmin=current_user.is_superadmin,
        created_at=current_user.created_at,
        organizations=orgs_response,
        active_organization_id=active_org_id
    )

@router.post("/switch-org", response_model=Token)
def switch_organization(
    payload: OrganizationSwitchRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> Any:
    """Switches active organization context, validating membership and issuing a new scoped JWT."""
    membership = db.execute(
        select(OrganizationMembership).where(
            OrganizationMembership.user_id == current_user.id,
            OrganizationMembership.organization_id == payload.organization_id
        )
    ).scalar_one_or_none()

    if not membership and not current_user.is_superadmin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You are not a member of the requested organization."
        )

    role_val = membership.role.value if membership else OrganizationRole.SUPERADMIN.value

    # Update default preference
    all_memberships = db.execute(
        select(OrganizationMembership).where(OrganizationMembership.user_id == current_user.id)
    ).scalars().all()
    for m in all_memberships:
        m.is_default = (m.organization_id == payload.organization_id)
    db.commit()

    token = create_access_token(
        subject=current_user.id,
        organization_id=payload.organization_id,
        role=role_val
    )

    return Token(
        access_token=token,
        token_type="bearer",
        active_organization_id=payload.organization_id,
        role=role_val
    )
