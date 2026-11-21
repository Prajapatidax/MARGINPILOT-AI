# MarginPilot AI — Changelog

All notable changes to the MarginPilot AI platform are documented in this file.

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
- **Automated Verification Suite**:
  - 8 automated tests passing in 0.79s covering authentication, profile resolution, health checks, cross-tenant isolation attack rejection (HTTP 403), and workspace switching.
- **Frontend Enterprise Application Shell**:
  - Next.js App Router setup with Tailwind CSS, Lucide React, and Recharts.
  - Enterprise dashboard matching visual design specifications: KPI cards (Revenue, Gross Profit, Gross Margin, Active Customers), Revenue Trend line chart, Customer Segments donut, Top Products, AI Recommendations, and Inventory Alerts.
  - Public marketing landing page matching UX mockups.
  - Organization Switcher and User navigation.
- **Complete Architecture & Governance Documentation**:
  - `ARCHITECTURE.md`, `DEVELOPMENT_ROADMAP.md`, `DATABASE_SCHEMA.md`, `ENVIRONMENT_VARIABLES.md`, `SECURITY.md`, `API_DOCUMENTATION.md`, `ML_ARCHITECTURE.md`, `MODEL_EVALUATION.md`, `DATA_DICTIONARY.md`, `DEPLOYMENT.md`.
