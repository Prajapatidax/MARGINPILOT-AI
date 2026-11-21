# MarginPilot AI — Changelog

All notable changes to the MarginPilot AI platform are documented in this file.

---

## [0.8.0] — 2026-11-21 (Phase 8: Production Hardening, Settings & Super Admin Platform)
### Added
- **Settings Screen**: Organization configuration (Company Name, Business Type, Currency, Timezone) and office preview matching mockup.
- **Admin Panel**: Super Admin overview telemetry (Total Orgs 248, Active Users 24.8K, System Uptime 99.9%, Recent Activity audit log).
- **Backend Super Admin Endpoint**: `GET /api/v1/organizations/admin/overview`.
- **Full Verification**: 26/26 automated tests passing in 6.22s, 20/20 Next.js static pages generated.

---

## [0.7.0] — 2026-11-21 (Phase 7: What-If Decision Simulator & AI Recommendations)
### Added
- **What-If Scenario Simulator**: Price elasticity simulation (-10% price reduction with revenue +8.5%, profit +6.2%, margin 38.1%, stockout risk 92%), demand shift and COGS inflation modeling.
- **AI Recommendations Engine**: Automatic operational signals synchronization for Reorder Products, Contact At-Risk Customers, and Review Margins with status update lifecycle.
- **Reports Console**: Executive reports for Business Performance, Sales, Inventory, and Financial Statements with JSON/CSV export.
- **REST Endpoints**: `POST /api/v1/simulator/run`, `GET /api/v1/recommendations`, `PATCH /api/v1/recommendations/{id}/status`.

---

## [0.6.0] — 2026-11-21 (Phase 6: Gemini AI Business Copilot & Grounded RAG)
### Added
- **Grounded Copilot Engine**: Google Gemini API integration with strict database-grounded tool execution (`get_sales_analytics`, `get_inventory_analytics`, `get_customer_analytics`, `get_anomalies`).
- **Interactive UI**: [frontend/app/(dashboard)/copilot/page.tsx](file:///d:/Buildlaunchs/MARGINPILOT-AI/frontend/app/(dashboard)/copilot/page.tsx) with conversation thread, inline Recharts bar chart visualization, and database source attributions.
- **REST Endpoints**: `POST /api/v1/copilot/chat`, `GET /api/v1/copilot/conversations`, `GET /api/v1/copilot/conversations/{id}`.

---

## [0.5.0] — 2026-11-21 (Phase 5: Deep Learning Engine with PyTorch)
### Added
- **PyTorch 2.15.0+cpu**: Native CPU deep learning execution.
- **Multi-Horizon LSTM Forecaster**: 2-layer recurrent network predicting 7d, 30d, and 90d demand horizons.
- **Deep Symmetric Autoencoder**: Bottleneck compression network calculating reconstruction error for unsupervised transaction surveillance.
- **Model Benchmark Matrix**: Comparative evaluations pitting Classical ML against Deep Learning.

---

## [0.4.0] — 2026-11-21 (Phase 4: ML Platform & Classical ML Models)
### Added
- **Classical ML Models**: Customer Segmentation (RFM K-Means), Churn Classification (Random Forest), Demand Forecasting (HistGradientBoostingRegressor), and Anomaly Detection (Isolation Forest).
- **ML Model Center UI**: Model performance area chart, active production cards, and retrain triggers.
- **Dedicated Forecasting & Anomaly Surveillance Pages**: SKU demand horizons and investigation lifecycle.


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
