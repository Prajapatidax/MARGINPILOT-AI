# MarginPilot AI — Changelog

All notable changes to the MarginPilot AI platform are documented in this file.

---

## [0.2.0] — 2026-11-21 (Phase 2: Data Platform & Intelligent Ingestion)

### Added
- **Canonical Master & Transactional Models**:
  - `Customer`: Customer entity with segmentation, CLV estimate, and churn risk score tracking.
  - `Product` & `ProductCategory`: SKUs, pricing, lead times, safety stocks, and reorder points.
  - `Supplier`: Supplier code, average lead times, and reliability scoring.
  - `Warehouse`: Multi-warehouse capacity and location tracking.
  - `SalesOrder` & `SalesOrderItem`: Full transactional ledger with line-level quantities, costs, prices, discounts, COGS, and gross profit.
  - `InventoryTransaction`: Stock adjustments, purchase receipts, and inventory movements.
  - `DataImportJob`: Full audit log of uploads, row counts, validation errors, and mapping configurations.
- **Data Ingestion Engine**:
  - [app/services/data_profiler.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/services/data_profiler.py): Automated statistical profiling calculating null percentages, cardinality, and sample distributions across CSV, XLSX, and JSON files.
  - [app/services/column_mapper.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/services/column_mapper.py): Fuzzy alias and heuristic matching engine recommending canonical field associations.
  - [app/services/data_validator.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/services/data_validator.py): Pre-import validation engine detecting negative values, missing required fields, invalid date formats, and duplicate records.
  - [app/services/data_importer.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/services/data_importer.py): Idempotent transactional database committer with automatic customer and product resolution.
- **REST Endpoints for Ingestion**:
  - `POST /api/v1/data-imports/upload`: Multi-part file ingestion and automated schema profiling.
  - `POST /api/v1/data-imports/{job_id}/validate`: Pre-commit validation reporting.
  - `POST /api/v1/data-imports/{job_id}/commit`: Atomic transaction execution.
  - `GET /api/v1/data-imports/`: Historical import job audit ledger.
- **Live Analytics Calculations**:
  - Updated [app/api/v1/endpoints/analytics.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/api/v1/endpoints/analytics.py) to calculate live metrics (Total Revenue, Gross Profit, Gross Margin %, Active Customers, Top Products, and Customer Segments) from persisted records with verified organization isolation.
- **Frontend Data Management Suite**:
  - [frontend/app/(dashboard)/data-management/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/data-management/page.tsx): 4-step wizard matching UI mockups with drag-and-drop file upload, intelligent column mapping dropdowns with match confidence badges, validation report preview table, and recent import history ledger.
- **Automated Verification**:
  - 11 unit and integration tests passing in 1.33s verifying CSV upload, schema profiling, validation, database commit, and cross-tenant data isolation.

---

## [0.1.0] — 2026-11-21 (Phase 1: Project Foundation & Multi-Tenant Core)

### Added
- **Multi-Tenant Relational Foundation**:
  - Implemented Organization, User, OrganizationMembership, OrganizationInvitation, and AuditLog models.
  - Multi-tenant tenant isolation context with active role verification (`OWNER`, `ADMIN`, `MANAGER`, `ANALYST`, `STAFF`).
  - Seamless workspace switching without re-authenticating.
- **Authentication & Security Engine**:
  - Argon2id cryptographic password hashing with custom work parameters.
  - Signed JWT token generation and validation with tenant context encapsulation.
- **Frontend Enterprise Application Shell**:
  - Next.js App Router setup with Tailwind CSS, Lucide React, and Recharts.
  - Enterprise dashboard matching visual design specifications.
