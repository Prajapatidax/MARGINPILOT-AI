# MarginPilot AI — Changelog

All notable changes to the MarginPilot AI platform are documented in this file.

---

## [0.3.0] — 2026-11-21 (Phase 3: Business Intelligence & Analytics Engine)

### Added
- **Analytics & BI Service Layer**:
  - [app/services/analytics_service.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/app/services/analytics_service.py):
    - Real database aggregations for Total Sales, AOV, Gross Profit, and Gross Margin %.
    - Period-over-period delta growth calculations.
    - Sales by Category breakdown via SQL joins.
    - Continuous revenue velocity time-series trends.
    - Product profitability rankings and low-margin warnings.
    - Customer segment counts and high CLV account rankings.
    - Inventory valuation calculations and stockout alerts based on reorder points.
- **REST Analytics Endpoints**:
  - `GET /api/v1/analytics/summary`: Real-time aggregated metrics for executive overview.
  - `GET /api/v1/analytics/sales`: Detailed sales intelligence with date-range filters (`today`, `7d`, `30d`, `90d`, `1y`).
  - `GET /api/v1/analytics/products`: Product sales volume, revenues, and margin alerts.
  - `GET /api/v1/analytics/customers`: Customer cohort distributions and CLV estimates.
  - `GET /api/v1/analytics/inventory`: Stockout alerts and stock valuations.
  - `GET /api/v1/analytics/financial`: Audited accounting formulas (Net Sales, COGS, Gross Profit, Margin %).
- **Frontend Analytics Pages**:
  - [frontend/app/(dashboard)/sales/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/sales/page.tsx): Advanced Analytics interface with Sales by Category donut chart, Profitability Trend bars, and area chart matching UI mockups.
  - [frontend/app/(dashboard)/customers/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/customers/page.tsx): Customer segment distribution and top account ledger.
  - [frontend/app/(dashboard)/inventory/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/inventory/page.tsx): Inventory reorder alerts and stockout warnings table.
  - [frontend/app/(dashboard)/financial/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/financial/page.tsx): Financial summary metrics and methodology definitions.
- **Automated Verification**:
  - 14 automated tests passing in 1.83s in [backend/tests/test_analytics.py](file:///d:/Buildlaunchs/MARGINPILOT-AI/backend/tests/test_analytics.py).

---

## [0.2.0] — 2026-11-21 (Phase 2: Data Platform & Intelligent Ingestion)
- Canonical relational models (Customer, Product, ProductCategory, Supplier, Warehouse, SalesOrder, SalesOrderItem, InventoryTransaction, DataImportJob).
- Automated statistical profiler, fuzzy column-mapping engine, and pre-commit validation suite.
- 4-step Data Import wizard in frontend.

---

## [0.1.0] — 2026-11-21 (Phase 1: Project Foundation & Multi-Tenant Core)
- Organization workspace isolation, Argon2id auth, and Next.js frontend shell.
