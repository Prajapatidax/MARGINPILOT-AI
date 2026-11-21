# MarginPilot AI — Canonical Data Dictionary

This document defines canonical entities, business fields, and statistical validation rules across the unified data foundation.

---

## 1. Master Data Entities

### `Customer`
- `customer_code`: Unique tenant identifier for the customer.
- `segment`: RFM-derived cluster (`VIP`, `Regular`, `At-Risk`, `New`).
- `clv_estimate`: Discounted projected 12-month net profit contribution.
- `churn_risk_score`: 0.0 to 1.0 probability of churn within the configured inactivity window.

### `Product`
- `sku`: Stock Keeping Unit unique within the organization.
- `cost_price`: Standard unit acquisition or manufacturing cost.
- `selling_price`: Base catalog unit price.
- `reorder_point`: Calculated inventory threshold triggering reorder suggestions.
- `safety_stock`: Minimum buffer inventory mitigating lead-time demand spikes.

---

## 2. Transactional & Financial Metrics Layer

### Net Sales
$$\text{Net Sales} = \sum (\text{Gross Line Total} - \text{Line Discounts} - \text{Returns})$$

### Cost of Goods Sold (COGS)
$$\text{COGS} = \sum (\text{Quantity Sold} \times \text{Unit Cost Price})$$

### Gross Profit & Margin
$$\text{Gross Profit} = \text{Net Sales} - \text{COGS}$$
$$\text{Gross Margin \%} = \frac{\text{Gross Profit}}{\text{Net Sales}} \times 100$$

> [!IMPORTANT]
> MarginPilot AI never calculates Net Profit unless verified operating expenses, payroll, and tax deductions are fully imported and reconciled.
