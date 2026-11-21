def test_cross_tenant_isolation_attack_prevented(client):
    """
    CRITICAL ACCEPTANCE CRITERIA:
    Organization A cannot read or modify Organization B's records.
    Users cannot bypass permissions through direct API requests.
    """
    # 1. Register User A in Organization A
    res_a = client.post(
        "/api/v1/auth/register",
        json={
            "email": "alice@company-a.com",
            "password": "PasswordA123!",
            "full_name": "Alice Smith",
            "organization_name": "Company A",
            "business_type": "RETAIL"
        }
    )
    assert res_a.status_code == 201
    token_a = res_a.json()["access_token"]
    org_a_id = res_a.json()["active_organization_id"]

    # 2. Register User B in Organization B
    res_b = client.post(
        "/api/v1/auth/register",
        json={
            "email": "bob@company-b.com",
            "password": "PasswordB123!",
            "full_name": "Bob Jones",
            "organization_name": "Company B",
            "business_type": "MANUFACTURING"
        }
    )
    assert res_b.status_code == 201
    token_b = res_b.json()["access_token"]
    org_b_id = res_b.json()["active_organization_id"]

    assert org_a_id != org_b_id

    # 3. ATTACK: Alice attempts to read Company B's organization data
    attack_read = client.get(
        f"/api/v1/organizations/{org_b_id}",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    # Must be rejected with 403 Forbidden!
    assert attack_read.status_code == 403
    assert "Access" in attack_read.json()["detail"] or "denied" in attack_read.json()["detail"]

    # 4. ATTACK: Alice attempts to spoof X-Organization-ID header to access Company B
    attack_spoof_header = client.get(
        f"/api/v1/organizations/{org_b_id}",
        headers={
            "Authorization": f"Bearer {token_a}",
            "X-Organization-ID": org_b_id
        }
    )
    assert attack_spoof_header.status_code == 403

    # 5. ATTACK: Alice attempts to list members of Company B
    attack_members = client.get(
        f"/api/v1/organizations/{org_b_id}/members",
        headers={"Authorization": f"Bearer {token_a}"}
    )
    assert attack_members.status_code == 403

    # 6. ATTACK: Alice attempts to issue an invitation into Company B
    attack_invite = client.post(
        f"/api/v1/organizations/{org_b_id}/invitations",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"email": "attacker@hack.com", "role": "ADMIN"}
    )
    assert attack_invite.status_code == 403

    # 7. ATTACK: Alice attempts to switch context to Company B
    attack_switch = client.post(
        "/api/v1/auth/switch-org",
        headers={"Authorization": f"Bearer {token_a}"},
        json={"organization_id": org_b_id}
    )
    assert attack_switch.status_code == 403

    # 8. VALID ACCESS: Bob can successfully access Company B
    bob_read = client.get(
        f"/api/v1/organizations/{org_b_id}",
        headers={"Authorization": f"Bearer {token_b}"}
    )
    assert bob_read.status_code == 200
    assert bob_read.json()["name"] == "Company B"

def test_multi_organization_switching(client):
    """
    Verifies that a user belonging to multiple organizations can seamlessly switch workspaces.
    """
    # Register user with Org 1
    res = client.post(
        "/api/v1/auth/register",
        json={
            "email": "multiorg@user.com",
            "password": "Password123!",
            "full_name": "Multi User",
            "organization_name": "Org 1"
        }
    )
    token_1 = res.json()["access_token"]
    org_1_id = res.json()["active_organization_id"]

    # Create Org 2 under same user
    res_org2 = client.post(
        "/api/v1/organizations/",
        headers={"Authorization": f"Bearer {token_1}"},
        json={"name": "Org 2", "business_type": "DISTRIBUTION"}
    )
    assert res_org2.status_code == 201
    org_2_id = res_org2.json()["id"]

    # Switch workspace to Org 2
    switch_res = client.post(
        "/api/v1/auth/switch-org",
        headers={"Authorization": f"Bearer {token_1}"},
        json={"organization_id": org_2_id}
    )
    assert switch_res.status_code == 200
    token_2 = switch_res.json()["access_token"]
    assert switch_res.json()["active_organization_id"] == org_2_id

    # Verify query with token_2 now accesses Org 2
    read_org2 = client.get(
        f"/api/v1/organizations/{org_2_id}",
        headers={"Authorization": f"Bearer {token_2}"}
    )
    assert read_org2.status_code == 200
    assert read_org2.json()["name"] == "Org 2"
