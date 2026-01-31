from datetime import date


def test_full_crud_workflow(client):
    """Integration test for complete CRUD workflow."""
    # CREATE
    expense_data = {
        "title": "Integration Test Expense",
        "amount": 75.50,
        "category": "entertainment",
        "description": "Test description",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    assert create_response.status_code == 201
    expense_id = create_response.json()["id"]

    # READ - Get all
    list_response = client.get("/api/expenses/")
    assert list_response.status_code == 200
    assert len(list_response.json()) >= 1

    # READ - Get by ID
    get_response = client.get(f"/api/expenses/{expense_id}")
    assert get_response.status_code == 200
    assert get_response.json()["id"] == expense_id

    # UPDATE - Full update
    update_data = {
        "title": "Updated Integration Test",
        "amount": 100.00,
        "category": "shopping",
        "expense_date": str(date.today()),
    }
    update_response = client.put(f"/api/expenses/{expense_id}", json=update_data)
    assert update_response.status_code == 200
    assert update_response.json()["title"] == update_data["title"]

    # UPDATE - Partial update
    patch_data = {"amount": 125.00}
    patch_response = client.patch(f"/api/expenses/{expense_id}", json=patch_data)
    assert patch_response.status_code == 200
    assert patch_response.json()["amount"] == 125.00

    # DELETE
    delete_response = client.delete(f"/api/expenses/{expense_id}")
    assert delete_response.status_code == 204

    # Verify deletion
    get_after_delete = client.get(f"/api/expenses/{expense_id}")
    assert get_after_delete.status_code == 404


def test_dashboard_integration_with_crud(client):
    """Test that dashboard updates reflect CRUD operations."""
    # Initial state
    stats_before = client.get("/api/dashboard/stats").json()
    initial_count = stats_before["total_count"]

    # Create expense
    expense_data = {
        "title": "Dashboard Test",
        "amount": 50.00,
        "category": "food",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    # Check dashboard updated
    stats_after_create = client.get("/api/dashboard/stats").json()
    assert stats_after_create["total_count"] == initial_count + 1
    assert stats_after_create["total_expenses"] == stats_before["total_expenses"] + 50.00

    # Update expense
    client.patch(f"/api/expenses/{expense_id}", json={"amount": 75.00})

    # Check dashboard updated
    stats_after_update = client.get("/api/dashboard/stats").json()
    assert stats_after_update["total_expenses"] == stats_before["total_expenses"] + 75.00

    # Delete expense
    client.delete(f"/api/expenses/{expense_id}")

    # Check dashboard back to initial
    stats_after_delete = client.get("/api/dashboard/stats").json()
    assert stats_after_delete["total_count"] == initial_count
    assert stats_after_delete["total_expenses"] == stats_before["total_expenses"]
