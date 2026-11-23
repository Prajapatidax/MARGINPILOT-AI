from typing import Optional, List
from pydantic import BaseModel, EmailStr

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    active_organization_id: Optional[str] = None
    role: Optional[str] = None
    is_verified: bool = False
    requires_verification: bool = False

class TokenPayload(BaseModel):
    sub: Optional[str] = None
    org_id: Optional[str] = None
    role: Optional[str] = None
    exp: Optional[int] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    organization_id: Optional[str] = None  # Optional: specific org to sign into

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    organization_name: Optional[str] = None  # Initial organization creation
    business_type: Optional[str] = "RETAIL"
    business_category: Optional[str] = None
    country: Optional[str] = "United States"
    currency: Optional[str] = "USD"
    reporting_currency: Optional[str] = None
    timezone: Optional[str] = "UTC"
    subscription_plan: Optional[str] = "GROWTH"

class VerifyEmailRequest(BaseModel):
    email: EmailStr
    code: str

class ResendVerificationRequest(BaseModel):
    email: EmailStr

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str

class PasswordResetResponse(BaseModel):
    status: str
    message: str
