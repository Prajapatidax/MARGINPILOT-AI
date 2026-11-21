from app.core.security import verify_password

def test_user_registration(client):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "owner@acmecorp.com",
            "password": "StrongPassword123!",
            "full_name": "Jane Doe",
            "organization_name": "Acme Corp",
            "business_type": "RETAIL"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["role"] == "OWNER"
    assert data["active_organization_id"] is not None

def test_duplicate_user_registration_rejected(client):
    payload = {
        "email": "unique@example.com",
        "password": "Password123!",
        "full_name": "Test User",
        "organization_name": "Unique Org"
    }
    res1 = client.post("/api/v1/auth/register", json=payload)
    assert res1.status_code == 201

    res2 = client.post("/api/v1/auth/register", json=payload)
    assert res2.status_code == 400
    assert "already exists" in res2.json()["detail"]

def test_login_successful_and_failed(client):
    # Register first
    client.post(
        "/api/v1/auth/register",
        json={
            "email": "login@test.com",
            "password": "CorrectPassword123",
            "full_name": "Login Tester"
        }
    )

    # Failed login
    bad_login = client.post(
        "/api/v1/auth/login",
        json={"email": "login@test.com", "password": "WrongPassword"}
    )
    assert bad_login.status_code == 401

    # Successful login
    good_login = client.post(
        "/api/v1/auth/login",
        json={"email": "login@test.com", "password": "CorrectPassword123"}
    )
    assert good_login.status_code == 200
    assert "access_token" in good_login.json()

def test_current_user_profile(client):
    reg = client.post(
        "/api/v1/auth/register",
        json={
            "email": "profile@test.com",
            "password": "Password123",
            "full_name": "Profile User",
            "organization_name": "Profile Corp"
        }
    )
    token = reg.json()["access_token"]

    res = client.get("/api/v1/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    data = res.json()
    assert data["email"] == "profile@test.com"
    assert len(data["organizations"]) == 1
    assert data["organizations"][0]["name"] == "Profile Corp"
    assert data["organizations"][0]["user_role"] == "OWNER"
