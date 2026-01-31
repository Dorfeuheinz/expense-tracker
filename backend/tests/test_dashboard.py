from datetime import date, timedelta


def test_dashboard_stats_empty(client):
    """Test dashboard stats with no expenses."""
    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_expenses"] == 0.0
    assert data["total_count"] == 0
    assert data["average_expense"] == 0.0
    assert data["category_breakdown"] == {}
    assert data["monthly_trends"] == []


def test_dashboard_stats_with_expenses(client):
    """Test dashboard stats with expenses."""
    # Create expenses in different categories
    expenses = [
        {"title": "Food 1", "amount": 50.00, "category": "food", "expense_date": str(date.today())},
        {"title": "Food 2", "amount": 30.00, "category": "food", "expense_date": str(date.today())},
        {
            "title": "Transport",
            "amount": 20.00,
            "category": "transport",
            "expense_date": str(date.today()),
        },
        {
            "title": "Shopping",
            "amount": 100.00,
            "category": "shopping",
            "expense_date": str(date.today()),
        },
    ]

    for expense in expenses:
        client.post("/api/expenses/", json=expense)

    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()

    assert data["total_expenses"] == 200.00
    assert data["total_count"] == 4
    assert data["average_expense"] == 50.00
    assert data["category_breakdown"]["food"] == 80.00
    assert data["category_breakdown"]["transport"] == 20.00
    assert data["category_breakdown"]["shopping"] == 100.00


def test_dashboard_monthly_trends(client):
    """Test monthly trends calculation."""
    today = date.today()
    # Create expenses in different months
    expenses = [
        {"title": "Expense 1", "amount": 50.00, "category": "food", "expense_date": str(today)},
        {
            "title": "Expense 2",
            "amount": 30.00,
            "category": "food",
            "expense_date": str(today - timedelta(days=30)),
        },
        {
            "title": "Expense 3",
            "amount": 20.00,
            "category": "food",
            "expense_date": str(today - timedelta(days=60)),
        },
    ]

    for expense in expenses:
        client.post("/api/expenses/", json=expense)

    response = client.get("/api/dashboard/stats")
    assert response.status_code == 200
    data = response.json()

    assert len(data["monthly_trends"]) > 0
    # Verify monthly trends have correct structure
    for trend in data["monthly_trends"]:
        assert "year" in trend
        assert "month" in trend
        assert "total" in trend
        assert "count" in trend
        assert isinstance(trend["year"], int)
        assert isinstance(trend["month"], int)
        assert isinstance(trend["total"], float)
        assert isinstance(trend["count"], int)


def test_dashboard_reflects_changes(client):
    """Test that dashboard reflects CRUD changes."""
    # Create expense
    expense_data = {
        "title": "Test Expense",
        "amount": 100.00,
        "category": "food",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    # Check initial stats
    response = client.get("/api/dashboard/stats")
    assert response.json()["total_expenses"] == 100.00
    assert response.json()["total_count"] == 1

    # Update expense
    update_data = {"amount": 150.00}
    client.patch(f"/api/expenses/{expense_id}", json=update_data)

    # Check updated stats
    response = client.get("/api/dashboard/stats")
    assert response.json()["total_expenses"] == 150.00
    assert response.json()["total_count"] == 1

    # Delete expense
    client.delete(f"/api/expenses/{expense_id}")

    # Check stats after deletion
    response = client.get("/api/dashboard/stats")
    assert response.json()["total_expenses"] == 0.0
    assert response.json()["total_count"] == 0
