# MarginPilot AI — REST API Documentation

Base URL: `/api/v1`  
Protocol: HTTPS / HTTP (dev)  
Authentication: HTTP Bearer JWT (`Authorization: Bearer <token>`)  
Multi-Tenancy Context: `X-Organization-ID: <org_uuid>` header or token claim.

---

## 1. Authentication & Session Management

### `POST /auth/register`
Creates a new user account and sets up their initial workspace.
- **Request Body**:
  ```json
  {
    "email": "user@company.com",
    "password": "StrongPassword123!",
    "full_name": "Alex Mercer",
    "organization_name": "Mercer Global",
    "business_type": "RETAIL"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "access_token": "eyJhbGciOi...",
    "token_type": "bearer",
    "active_organization_id": "c1f7b882-...",
    "role": "OWNER"
  }
  ```

### `POST /auth/login`
Authenticates credentials with Argon2id and returns an access token.
- **Request Body**:
  ```json
  {
    "email": "user@company.com",
    "password": "StrongPassword123!",
    "organization_id": "optional-target-org-id"
  }
  ```

### `GET /auth/me`
Retrieves authenticated user identity and all organization workspaces they have access to.

### `POST /auth/switch-org`
Switches active organization context, validates membership, and returns a new scoped JWT.
- **Request Body**:
  ```json
  {
    "organization_id": "e4a2c118-..."
  }
  ```

---

## 2. Organization Management

### `GET /organizations/`
Lists all organizations the current user belongs to.

### `POST /organizations/`
Creates an additional organization workspace. Requester becomes `OWNER`.

### `GET /organizations/{organization_id}`
Fetches organization details. Validates tenant scope.

### `PUT /organizations/{organization_id}`
Updates company settings (currency, timezone, country, business_type). Requires `OWNER` or `ADMIN`.

### `GET /organizations/{organization_id}/members`
Lists all members in the organization.

### `POST /organizations/{organization_id}/invitations`
Generates an invitation token for a teammate. Requires `OWNER` or `ADMIN`.

---

## 3. Analytics & Business Intelligence

### `GET /analytics/summary`
Calculates aggregated business metrics for the specified date range.
- **Query Parameters**:
  - `date_range`: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- **Headers**:
  - `X-Organization-ID: <uuid>` (or token claim)
- **Response**:
  ```json
  {
    "organization_id": "c1f7b882-...",
    "date_range": "30d",
    "has_data": true,
    "metrics": {
      "total_revenue": 248750.0,
      "revenue_change_pct": 12.5,
      "gross_profit": 92430.0,
      "gross_profit_change_pct": 14.2,
      "gross_margin_pct": 37.2,
      "gross_margin_change_pct": 1.8,
      "active_customers": 12850,
      "active_customers_change_pct": 8.1
    }
  }
  ```

---

## 4. System Health Endpoints

- `GET /health`: Liveness probe returning service name and environment.
- `GET /ready`: Readiness probe verifying database connection pool health.
