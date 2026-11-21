# MarginPilot AI
### Enterprise AI Business Intelligence & Decision Automation Platform

MarginPilot AI is a production-oriented, multi-tenant SaaS platform that helps retail, manufacturing, wholesale, and distribution businesses understand operations, forecast demand, detect anomalies, simulate strategic decisions, and optimize profitability using verified business data.

![MarginPilot AI Platform UI Preview](file:///C:/Users/Hp/.gemini/antigravity/brain/e5f70261-25d6-481d-b743-dc797d5fa487/.user_uploaded/media_1795241390084_3bc0483e.jpg)

---

## Key Pillars

- **Real Data Foundation**: Canonical business data schema supporting Retail, Manufacturing, Wholesale, and Distribution without artificial data or mock metrics.
- **Trained Machine Learning & Deep Learning**: Scikit-Learn, XGBoost, LightGBM, and PyTorch models for Demand Forecasting, Churn Risk, CLV, Customer Segmentation, and Reconstruction Anomalies.
- **Grounded AI Copilot**: Google Gemini API integration with server-side tool calling and RAG via `pgvector`. Every answer using business numbers is backed by validated database queries.
- **Enterprise Multi-Tenancy**: Organization-level data isolation, Row-Level Security, Argon2id encryption, RBAC, and automated cross-tenant security verification.
- **Modern Clean UI**: Next.js App Router, Tailwind CSS, TanStack Query, Recharts, and Lucide icons following light-first enterprise design principles.

---

## Technology Stack

- **Frontend**: Next.js (App Router), React, TypeScript, Tailwind CSS, Recharts, TanStack Query, React Hook Form, Zod, Lucide React.
- **Backend**: Python 3.12+, FastAPI, Pydantic v2, SQLAlchemy 2.x, Alembic, Argon2id, PyJWT.
- **Databases**: Neon PostgreSQL (with `pgvector`), Redis for caching & job coordination, SQLite for lightweight zero-dependency local testing.
- **Machine Learning**: Scikit-learn, XGBoost, LightGBM, PyTorch (LSTM & Autoencoders), SHAP, MLflow.
- **AI & RAG**: Google Gemini API, Sentence Transformers, pgvector.

---

## Repository Structure

```
MARGINPILOT-AI/
├── frontend/                  # Next.js 14/15 App Router Frontend
│   ├── app/                   # App routes (Auth, Dashboard, Intelligence, Settings)
│   ├── components/            # Reusable UI & layout components
│   └── lib/                   # API clients, Auth context, utilities
├── backend/                   # FastAPI Backend Services
│   ├── app/
│   │   ├── api/v1/            # REST API endpoints & route handlers
│   │   ├── core/              # Config, Security, Multi-tenant context
│   │   ├── db/                # SQLAlchemy session, base model, seeds
│   │   ├── models/            # Canonical business database models
│   │   ├── schemas/           # Pydantic v2 request/response schemas
│   │   └── services/          # Business logic & repository services
│   ├── alembic/               # Database migrations
│   └── tests/                 # Pytest unit & cross-tenant security tests
├── ml_engine/                 # Trainable ML & Deep Learning pipelines
├── docs/                      # Complete specifications & documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── DEVELOPMENT_ROADMAP.md
│   ├── SECURITY.md
│   └── ENVIRONMENT_VARIABLES.md
└── README.md
```

---

## Phase 1 Execution Status

- [x] Multi-tenant architectural blueprint & canonical database design
- [x] Backend FastAPI application with Argon2id auth & JWT tokens
- [x] Organization management, role-based access control, and workspace switching
- [x] Automated tenant isolation tests (preventing cross-organization data leakage)
- [x] Next.js frontend shell with enterprise navigation matching UX mockups

---

## Local Setup & Development

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
pytest
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the application.
