import os
from typing import List, Union
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl, field_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "MarginPilot AI"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Security
    JWT_SECRET: str = "marginpilot_super_secret_jwt_signing_key_change_in_production_38472938472"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours for dev convenience
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Database (Neon PostgreSQL with SQLite local fallback)
    # Neon Connection string format:
    # postgresql://user:password@ep-xyz.us-east-2.aws.neon.tech/neondb?sslmode=require
    DATABASE_URL: str = "sqlite:///./marginpilot.db"

    @property
    def sqlalchemy_database_url(self) -> str:
        if os.environ.get("TESTING") == "true":
            return "sqlite:///:memory:"
        url = self.DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    # CORS
    FRONTEND_ORIGINS: str = "http://localhost:3000,http://127.0.0.1:3000"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGINS.split(",") if origin.strip()]

    # Upstash Redis
    # Standard TLS URL: rediss://default:password@xyz.upstash.io:6379
    REDIS_URL: str = ""
    UPSTASH_REDIS_REST_URL: str = ""
    UPSTASH_REDIS_REST_TOKEN: str = ""

    # Neon Document Storage (S3-compatible)
    NEON_STORAGE_ENDPOINT: str = ""
    NEON_STORAGE_ACCESS_KEY: str = ""
    NEON_STORAGE_SECRET_KEY: str = ""
    NEON_STORAGE_BUCKET: str = "marginpilot-docs"
    NEON_STORAGE_REGION: str = "us-east-1"

    # AI & Services
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Google SMTP Email Verification
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    SMTP_FROM_EMAIL: str = ""
    SMTP_FROM_NAME: str = "MarginPilot AI"
    EMAIL_VERIFICATION_ENABLED: bool = True


    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()
