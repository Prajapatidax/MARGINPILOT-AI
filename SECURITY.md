# MarginPilot AI — Security Architecture & Data Protection

Security is an architectural foundation in MarginPilot AI. This document outlines the security controls, tenant isolation policies, and verification frameworks.

---

## 1. Authentication & Identity Management

- **Password Hashing**: State-of-the-art **Argon2id** (memory cost: 65,536 KiB, time cost: 3 iterations, parallelism: 4 threads) with unique cryptographic salt.
- **JWT Architecture**:
  - Stateless Access Tokens signed with `HS256` / `EdDSA`.
  - Expiration constrained to 60 minutes.
  - Refresh Tokens persisted with cryptographic hashes in database with rotation and revocation on logout.
- **Brute Force & Rate Limiting**:
  - Sliding-window IP and account rate limits on `/api/v1/auth/login` (5 failed attempts per 15 minutes trigger temporary lockout).

---

## 2. Multi-Tenant Data Isolation Strategy

Data isolation in MarginPilot AI operates across three concentric barriers:

```
+-------------------------------------------------------------------------+
| Layer 1: Application Routing & Context Dependency                       |
| - Every request must pass `get_current_tenant_context()`                |
| - Verifies user has active, un-revoked membership in target org         |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Layer 2: Parameterized ORM Model Scoping                                |
| - Every query strictly injects `filter(Model.organization_id == org_id)`|
| - Composite unique constraints prevent cross-tenant collision           |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
| Layer 3: Database Connection Row-Level Security (RLS)                   |
| - `CREATE POLICY tenant_isolation_policy ON <table> USING ...`         |
| - Connection session context: `SET LOCAL app.current_org_id = ?`        |
+-------------------------------------------------------------------------+
```

---

## 3. Automated Cross-Tenant Security Verification

MarginPilot AI includes automated security test fixtures in `tests/test_multi_tenancy.py`:
1. **Direct ID Injection**: User from Organization A requests resource belonging to Organization B using its UUID -> Expect `403 Forbidden` or `404 Not Found`.
2. **Bulk Leakage Test**: Analytical and list endpoints filtered by tenant context never return rows where `organization_id != current_org_id`.
3. **Workspace Switch Verification**: Token context reflects the switched organization only after validation of membership in the destination tenant.

---

## 4. AI & Copilot Safety Guardrails

- **Zero Arbitrary SQL Execution**: The Generative AI Copilot never constructs or runs raw SQL queries. All analytical queries pass through pre-compiled, parameter-checked repository functions.
- **Untrusted Document Defense**: Customer-uploaded files are processed with stripped instruction contexts to neutralize prompt injection vectors.
- **Tenant-Scoped Vector Retrievals**: pgvector similarity searches strictly filter by `organization_id` before computing vector distances.
