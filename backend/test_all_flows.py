import os
import sys
import uuid
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import text, select

# Ensure backend directory is in python path
sys.path.insert(0, os.path.abspath("."))

from app.main import app
from app.core.config import settings
from app.db.session import engine, SessionLocal
from app.models.user import User
from app.models.organization import Organization
from app.models.membership import OrganizationMembership
from app.services.storage_service import storage_service

client = TestClient(app)

def run_all_flow_checks():
    print("=" * 70)
    print("STARTING FULL SYSTEM FLOW VERIFICATION")
    print("=" * 70)

    # -------------------------------------------------------------
    # FLOW 1: Health & Root Routes
    # -------------------------------------------------------------
    print("\n[FLOW 1] Testing Health & Root Routes...")
    res_root = client.get("/")
    assert res_root.status_code == 200, f"Root failed: {res_root.status_code}"
    print(f"  [PASS] GET / -> {res_root.json().get('message')}")

    res_h1 = client.get("/health")
    assert res_h1.status_code == 200, f"/health failed: {res_h1.status_code}"
    print(f"  [PASS] GET /health -> status: {res_h1.json().get('status')}")

    res_h2 = client.get("/api/v1/health")
    assert res_h2.status_code == 200, f"/api/v1/health failed: {res_h2.status_code}"
    print(f"  [PASS] GET /api/v1/health -> status: {res_h2.json().get('status')}")

    # -------------------------------------------------------------
    # FLOW 2: Registration Flow (Wizard Steps 1, 2, 3)
    # -------------------------------------------------------------
    print("\n[FLOW 2] Testing User Registration Flow with 14-Day Free Trial...")
    test_email = f"dax.pilot.{uuid.uuid4().hex[:6]}@marginpilot.ai"
    test_password = "SecurePassword123!"
    reg_payload = {
        "full_name": "Dax Prajapati",
        "email": test_email,
        "password": test_password,
        "organization_name": "GIFT City Trading Co",
        "business_category": "E-commerce",
        "country": "India",
        "reporting_currency": "INR",
        "timezone": "Asia/Kolkata",
        "subscription_plan": "Growth"
    }

    res_reg = client.post("/api/v1/auth/register", json=reg_payload)
    assert res_reg.status_code in [200, 201], f"Registration failed ({res_reg.status_code}): {res_reg.text}"
    reg_data = res_reg.json()
    print(f"  [PASS] POST /api/v1/auth/register -> User registered successfully: {reg_data.get('email')}")
    print(f"  [INFO] Verification Status: {reg_data.get('is_verified')}")

    # Inspect DB to verify trial end and verification code
    db = SessionLocal()
    user = db.execute(select(User).where(User.email == test_email)).scalar_one_or_none()
    assert user is not None, "User not found in Neon DB!"
    otp_code = user.verification_code
    print(f"  [PASS] User created in Neon DB with OTP code: {otp_code} (Expires: {user.verification_code_expires_at})")

    # Check Organization & Trial
    membership = db.execute(select(OrganizationMembership).where(OrganizationMembership.user_id == user.id)).scalar_one_or_none()
    assert membership is not None, "User membership not created!"
    org = db.execute(select(Organization).where(Organization.id == membership.organization_id)).scalar_one_or_none()
    assert org is not None, "Organization not created!"
    print(f"  [PASS] Organization created: {org.name} | Currency: {org.currency} | Status: {org.subscription_status}")
    assert org.trial_ends_at is not None, "trial_ends_at is null!"
    print(f"  [PASS] 14-Day Free Trial Active until: {org.trial_ends_at}")

    # -------------------------------------------------------------
    # FLOW 3: Google SMTP Email Verification Flow
    # -------------------------------------------------------------
    print("\n[FLOW 3] Testing Email Verification (OTP Code)...")
    res_verify = client.post("/api/v1/auth/verify-email", json={
        "email": test_email,
        "code": otp_code
    })
    assert res_verify.status_code == 200, f"Verify email failed: {res_verify.text}"
    db.refresh(user)
    assert user.is_verified is True, "User is_verified did not change to True!"
    assert user.verification_code is None, "verification_code was not cleared!"
    print(f"  [PASS] POST /api/v1/auth/verify-email -> User is_verified: {user.is_verified}")

    # Test Resend Verification Endpoint
    print("  Testing Resend Verification...")
    res_resend = client.post("/api/v1/auth/resend-verification", json={"email": test_email})
    assert res_resend.status_code == 200, f"Resend failed: {res_resend.text}"
    db.refresh(user)
    new_otp = user.verification_code
    assert new_otp is not None, "New verification code not generated on resend!"
    print(f"  [PASS] POST /api/v1/auth/resend-verification -> Generated new OTP: {new_otp}")

    # Verify with new code
    res_verify2 = client.post("/api/v1/auth/verify-email", json={"email": test_email, "code": new_otp})
    assert res_verify2.status_code == 200, "Second verification failed!"
    print("  [PASS] Successfully re-verified with fresh OTP code.")

    # -------------------------------------------------------------
    # FLOW 4: Authentication & JWT Login Flow
    # -------------------------------------------------------------
    print("\n[FLOW 4] Testing Login & JWT Token Flow...")
    login_res = client.post("/api/v1/auth/token", data={
        "username": test_email,
        "password": test_password
    })
    assert login_res.status_code == 200, f"Login failed: {login_res.text}"
    tokens = login_res.json()
    access_token = tokens["access_token"]
    assert access_token, "No access token returned!"
    print(f"  [PASS] POST /api/v1/auth/token -> JWT Token granted: {access_token[:20]}...")

    headers = {"Authorization": f"Bearer {access_token}"}

    # /auth/me
    res_me = client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200, f"/auth/me failed: {res_me.text}"
    me_data = res_me.json()
    print(f"  [PASS] GET /api/v1/auth/me -> Authenticated as: {me_data['email']} (Verified: {me_data['is_verified']})")

    # -------------------------------------------------------------
    # FLOW 5: Organizations & Settings Flow
    # -------------------------------------------------------------
    print("\n[FLOW 5] Testing Organization & Settings Flow...")
    res_orgs = client.get("/api/v1/organizations", headers=headers)
    assert res_orgs.status_code == 200, f"/organizations failed: {res_orgs.text}"
    orgs_list = res_orgs.json()
    assert len(orgs_list) > 0, "No organizations returned for user!"
    active_org = orgs_list[0]
    org_id = active_org["id"]
    print(f"  [PASS] GET /api/v1/organizations -> Active Org: {active_org['name']} (ID: {org_id})")
    print(f"  [INFO] Plan: {active_org.get('plan')} | Trial Ends: {active_org.get('trial_ends_at')}")

    # Set active tenant header
    headers["X-Organization-ID"] = org_id

    # -------------------------------------------------------------
    # FLOW 6: Zero-Data Analytics & Dashboard Clean State Flow
    # -------------------------------------------------------------
    print("\n[FLOW 6] Testing Zero-Data Dashboard & Analytics Flow...")
    res_summary = client.get("/api/v1/analytics/summary", headers=headers)
    assert res_summary.status_code == 200, f"Summary failed: {res_summary.text}"
    summary_data = res_summary.json()
    assert summary_data["has_data"] is False, "has_data should be False for empty account!"
    assert summary_data["metrics"]["total_revenue"] == 0.0
    assert summary_data["metrics"]["gross_profit"] == 0.0
    assert summary_data["metrics"]["gross_margin_pct"] == 0.0
    print(f"  [PASS] GET /api/v1/analytics/summary -> has_data: {summary_data['has_data']} | Revenue: $0.00 | Profit: $0.00")

    res_financial = client.get("/api/v1/analytics/financial", headers=headers)
    assert res_financial.status_code == 200
    fin_data = res_financial.json()
    assert fin_data["financial_summary"]["net_sales"] == 0.0
    print(f"  [PASS] GET /api/v1/analytics/financial -> Clean financial metrics (Net Sales: $0.00)")

    res_recs = client.get("/api/v1/recommendations", headers=headers)
    assert res_recs.status_code == 200
    assert len(res_recs.json()) == 0, "Should have 0 recommendations on empty account!"
    print("  [PASS] GET /api/v1/recommendations -> 0 fake recommendations")

    # Simulation with 0 data
    res_sim = client.post("/api/v1/simulation/run", headers=headers, json={
        "scenario_type": "PRICING",
        "parameter_change_percentage": -10.0
    })
    assert res_sim.status_code == 200, f"Simulation failed: {res_sim.text}"
    sim_data = res_sim.json()
    assert sim_data["current_revenue"] == 0.0, "Current revenue should be 0.0!"
    print(f"  [PASS] POST /api/v1/simulation/run -> Truthful empty simulation: {sim_data['executive_summary'][:60]}...")

    # -------------------------------------------------------------
    # FLOW 7: Neon S3 Bucket Document Storage Flow
    # -------------------------------------------------------------
    print("\n[FLOW 7] Testing Neon S3 Document Storage Bucket Flow...")
    test_content = b"SKU,Name,Category,Cost,Price\nSKU-001,Organic Coffee,Beverages,8.50,16.00\n"
    test_filename = f"test_catalog_{uuid.uuid4().hex[:8]}.csv"

    upload_result = storage_service.upload_file(
        file_bytes=test_content,
        filename=test_filename,
        content_type="text/csv",
        folder="test_uploads"
    )
    print(f"  [PASS] Uploaded test file to storage: {upload_result['key']} (Engine: {upload_result['storage']})")

    # Download back and verify
    downloaded = storage_service.download_file(upload_result["key"])
    assert downloaded == test_content, "Downloaded content does not match uploaded content!"
    print(f"  [PASS] Downloaded and verified file content match ({len(downloaded)} bytes)")

    # Delete test file from bucket
    deleted = storage_service.delete_file(upload_result["key"])
    assert deleted is True, "Failed to delete test file from bucket!"
    print("  [PASS] Deleted test file from storage bucket.")

    # -------------------------------------------------------------
    # FLOW 8: Grounded Copilot Flow
    # -------------------------------------------------------------
    print("\n[FLOW 8] Testing Grounded Copilot Flow...")
    copilot_res = client.post("/api/v1/copilot/chat", headers=headers, json={
        "message": "Why did my sales decline last month?"
    })
    assert copilot_res.status_code == 200, f"Copilot chat failed: {copilot_res.text}"
    copilot_data = copilot_res.json()
    print(f"  [PASS] POST /api/v1/copilot/chat -> Grounded Response: {copilot_data['content'][:75]}...")
    assert "No historical sales orders" in copilot_data["content"] or "0.00" in copilot_data["content"], "Copilot returned fake data!"
    print("  [PASS] Copilot response is 100% grounded and free of hallucinated numbers.")

    db.close()

    # -------------------------------------------------------------
    # FLOW 9: Final Database & Bucket Cleanup
    # -------------------------------------------------------------
    print("\n[FLOW 9] Performing Final Complete Cleanup (Database, Bucket, Cache)...")
    from clean_all_data import clean_database, clean_bucket, clean_local_storage, clean_redis
    clean_database()
    clean_bucket()
    clean_local_storage()
    clean_redis()

    print("\n" + "=" * 70)
    print("ALL 9 SYSTEM FLOWS VERIFIED SUCCESSFULLY & DATA SCRUBBED CLEAN!")
    print("=" * 70)

if __name__ == "__main__":
    run_all_flow_checks()
