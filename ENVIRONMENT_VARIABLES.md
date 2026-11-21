# MarginPilot AI — Environment Variables Specification

This document details all environment variables across environments (Development, Staging, Production).

---

## 1. Frontend Configuration (`frontend/.env.local`)

| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | String | Yes | Base URL for FastAPI Backend Gateway | `http://localhost:8000/api/v1` |
| `NEXT_PUBLIC_APP_ENV` | String | Yes | Client runtime environment | `development` |

> [!CAUTION]
> Never place secrets, database credentials, or AI API keys in `NEXT_PUBLIC_*` variables. They are compiled into the client bundle and visible to the public.

---

## 2. Backend Configuration (`backend/.env`)

### Database & Cache
| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `DATABASE_URL` | String | Yes | Neon PostgreSQL connection string (or SQLite for local test fallback) | `postgresql+asyncpg://user:pass@ep-xyz.neon.tech/marginpilot?sslmode=require` |
| `DATABASE_URL_SYNC` | String | Yes | Synchronous DB URL for Alembic migrations and background workers | `postgresql://user:pass@ep-xyz.neon.tech/marginpilot?sslmode=require` |
| `REDIS_URL` | String | No | Redis connection URL for caching & background job broker | `redis://localhost:6379/0` |

### Security & Authentication
| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `JWT_SECRET` | String | Yes | High-entropy secret key for JWT signing | `64_char_random_hex_string` |
| `JWT_ALGORITHM` | String | Yes | Hashing algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Integer | Yes | Expiration duration for access tokens | `60` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Integer | Yes | Expiration duration for refresh tokens | `30` |
| `FRONTEND_ORIGINS` | String | Yes | Comma-separated CORS allowed origins | `http://localhost:3000,https://marginpilot.ai` |
| `ENVIRONMENT` | String | Yes | Runtime environment (development / staging / production) | `development` |

### AI & Generative Services
| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | String | No (Yes for Copilot) | Google Gemini API key for Grounded Copilot | `AIzaSy...` |
| `GEMINI_MODEL_NAME` | String | No | Gemini model variant | `gemini-1.5-pro-latest` |

### Object Storage (Private)
| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `OBJECT_STORAGE_ENDPOINT` | String | No | S3 / Cloudinary endpoint | `https://s3.us-east-1.amazonaws.com` |
| `OBJECT_STORAGE_ACCESS_KEY` | String | No | Storage access key | `AKIA...` |
| `OBJECT_STORAGE_SECRET_KEY` | String | No | Storage secret key | `...` |
| `OBJECT_STORAGE_BUCKET` | String | No | Dedicated private bucket | `marginpilot-private-docs` |

### MLOps & Experiment Tracking
| Variable | Type | Required | Description | Example |
| :--- | :--- | :--- | :--- | :--- |
| `MLFLOW_TRACKING_URI` | String | No | MLflow remote server URI | `https://mlflow.marginpilot.ai` |
| `MLFLOW_TRACKING_USERNAME` | String | No | MLflow auth username | `mlops_service` |
| `MLFLOW_TRACKING_PASSWORD` | String | No | MLflow auth password | `...` |
