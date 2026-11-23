import re
import random
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.core.config import settings
from app.core.security import verify_password, hash_password, create_access_token
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.organization import Organization, BusinessType, SubscriptionPlan
from app.models.membership import OrganizationMembership, OrganizationRole
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    Token,
    VerifyEmailRequest,
    ResendVerificationRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    PasswordResetResponse,
)
from app.schemas.user import UserResponse
from app.schemas.organization import OrganizationResponse, OrganizationSwitchRequest
from app.services.email_service import email_service

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

    # Generate 6-digit Google SMTP verification code
    verification_code = f"{random.randint(100000, 999999)}"
    code_expires = datetime.now(timezone.utc) + timedelta(minutes=15)

    # Create user
    user = User(
        email=payload.email,
        hashed_password=hash_password(payload.password),
        full_name=payload.full_name,
        is_active=True,
        is_superadmin=False,
        is_verified=False,
        verification_code=verification_code,
        verification_code_expires_at=code_expires
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

    biz_str = payload.business_category or payload.business_type or "RETAIL"
    try:
        biz_type = BusinessType(biz_str.upper())
    except (ValueError, KeyError):
        biz_type = BusinessType.RETAIL

    try:
        plan_enum = SubscriptionPlan(payload.subscription_plan) if payload.subscription_plan else SubscriptionPlan.GROWTH
    except ValueError:
        plan_enum = SubscriptionPlan.GROWTH

    trial_end = datetime.now(timezone.utc) + timedelta(days=14)

    org = Organization(
        name=org_name,
        slug=slug,
        business_type=biz_type,
        currency=payload.reporting_currency or payload.currency or "USD",
        timezone=payload.timezone or "UTC",
        country=payload.country or "United States",
        subscription_plan=plan_enum,
        trial_ends_at=trial_end,
        subscription_status="trialing",
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

    # Send verification email via Google SMTP
    email_service.send_verification_email(user.email, user.full_name, verification_code)

    token = create_access_token(
        subject=user.id,
        organization_id=org.id,
        role=OrganizationRole.OWNER.value
    )

    return Token(
        access_token=token,
        token_type="bearer",
        active_organization_id=org.id,
        role=OrganizationRole.OWNER.value,
        is_verified=False,
        requires_verification=True
    )

@router.post("/verify-email")
def verify_email(
    payload: VerifyEmailRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Verifies user email with the 6-digit Google SMTP OTP code."""
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account with this email does not exist."
        )
    if user.is_verified:
        return {"status": "already_verified", "message": "Email is already verified."}

    if not user.verification_code or user.verification_code.strip() != payload.code.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid 6-digit verification code. Please check your inbox or request a new code."
        )

    if user.verification_code_expires_at and user.verification_code_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Verification code has expired. Please request a new code."
        )

    user.is_verified = True
    user.verification_code = None
    user.verification_code_expires_at = None
    db.commit()
    return {"status": "verified", "message": "Email address verified successfully!"}

@router.post("/resend-verification")
def resend_verification(
    payload: ResendVerificationRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Resends a fresh 6-digit verification code to the user's email."""
    user = db.execute(select(User).where(User.email == payload.email)).scalar_one_or_none()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found."
        )
    if user.is_verified:
        return {"status": "already_verified", "message": "Email is already verified."}

    new_code = f"{random.randint(100000, 999999)}"
    user.verification_code = new_code
    user.verification_code_expires_at = datetime.now(timezone.utc) + timedelta(minutes=15)
    db.commit()

    email_service.send_verification_email(user.email, user.full_name, new_code)
    return {"status": "sent", "message": "A new verification code has been dispatched to your email."}

@router.post("/forgot-password", response_model=PasswordResetResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Session = Depends(get_db)
) -> Any:
    """
    Sends a secure password reset link to the specified email address.
    If the account is not registered, returns HTTP 404 Account not found.
    """
    email_clean = payload.email.strip().lower()
    user = db.execute(select(User).where(User.email == email_clean)).scalar_one_or_none()
    
    # Requirement: If user is not already registered, return Account not found
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found. Please verify your email address or create an account."
        )

    # Generate secure 32-byte cryptographic token
    reset_token = secrets.token_urlsafe(32)
    user.reset_password_token = reset_token
    user.reset_password_expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)
    db.commit()

    # Determine frontend application URL
    frontend_base = settings.cors_origins[0] if settings.cors_origins else "http://localhost:3000"
    reset_link = f"{frontend_base}/reset-password?token={reset_token}&email={user.email}"

    # Dispatch email via Google SMTP
    success, msg = email_service.send_password_reset_email(
        to_email=user.email,
        recipient_name=user.full_name,
        reset_link=reset_link
    )

    return PasswordResetResponse(
        status="sent",
        message="A password reset link has been dispatched to your email address."
    )

@router.get("/verify-reset-token")
def verify_reset_token(
    token: str,
    email: str,
    db: Session = Depends(get_db)
) -> Any:
    """Validates that a password reset token is valid and unexpired."""
    email_clean = email.strip().lower()
    user = db.execute(select(User).where(User.email == email_clean)).scalar_one_or_none()
    
    if not user or not user.reset_password_token or user.reset_password_token != token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired password reset link. Please request a new one."
        )

    if user.reset_password_expires_at and user.reset_password_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset link has expired. Please request a new one."
        )

    return {"status": "valid", "email": user.email, "full_name": user.full_name}

@router.post("/reset-password", response_model=PasswordResetResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Session = Depends(get_db)
) -> Any:
    """Resets the user's password using the verified reset token."""
    email_clean = payload.email.strip().lower()
    user = db.execute(select(User).where(User.email == email_clean)).scalar_one_or_none()
    
    if not user or not user.reset_password_token or user.reset_password_token != payload.token.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset token. Please request a fresh reset link."
        )

    if user.reset_password_expires_at and user.reset_password_expires_at < datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password reset link has expired. Please request a new reset link."
        )

    if len(payload.new_password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters long."
        )

    # Hash new password using Argon2id and invalidate token
    user.hashed_password = hash_password(payload.new_password)
    user.reset_password_token = None
    user.reset_password_expires_at = None
    db.commit()

    return PasswordResetResponse(
        status="success",
        message="Your password has been reset successfully. You can now log in with your new password."
    )

@router.post("/login", response_model=Token)
@router.post("/token", response_model=Token)
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
        is_verified=bool(current_user.is_verified),
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
