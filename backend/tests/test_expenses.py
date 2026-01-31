from datetime import date, timedelta


def test_create_expense(client):
    """Test creating a new expense."""
    expense_data = {
        "title": "Test Expense",
        "amount": 50.00,
        "category": "food",
        "description": "Test description",
        "expense_date": str(date.today()),
    }
    response = client.post("/api/expenses/", json=expense_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == expense_data["title"]
    assert data["amount"] == expense_data["amount"]
    assert data["category"] == expense_data["category"]
    assert "id" in data
    assert "created_at" in data


def test_create_expense_minimal(client):
    """Test creating expense with minimal required fields."""
    expense_data = {
        "title": "Minimal Expense",
        "amount": 25.50,
        "category": "transport",
        "expense_date": str(date.today()),
    }
    response = client.post("/api/expenses/", json=expense_data)
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == expense_data["title"]
    assert data["description"] is None


def test_create_expense_invalid_data(client):
    """Test creating expense with invalid data."""
    invalid_data = {
        "title": "",  # Empty title
        "amount": -10,  # Negative amount
        "category": "food",
        "expense_date": str(date.today()),
    }
    response = client.post("/api/expenses/", json=invalid_data)
    assert response.status_code == 422


def test_get_expenses_empty(client):
    """Test getting expenses when database is empty."""
    response = client.get("/api/expenses/")
    assert response.status_code == 200
    assert response.json() == []


def test_get_expenses_with_data(client):
    """Test getting expenses with pagination."""
    # Create multiple expenses
    for i in range(5):
        expense_data = {
            "title": f"Expense {i}",
            "amount": 10.00 * (i + 1),
            "category": "food",
            "expense_date": str(date.today()),
        }
        client.post("/api/expenses/", json=expense_data)

    response = client.get("/api/expenses/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 5


def test_get_expenses_pagination(client):
    """Test expense pagination."""
    # Create 10 expenses
    for i in range(10):
        expense_data = {
            "title": f"Expense {i}",
            "amount": 10.00,
            "category": "food",
            "expense_date": str(date.today()),
        }
        client.post("/api/expenses/", json=expense_data)

    # Test pagination
    response = client.get("/api/expenses/?skip=0&limit=5")
    assert response.status_code == 200
    assert len(response.json()) == 5

    response = client.get("/api/expenses/?skip=5&limit=5")
    assert response.status_code == 200
    assert len(response.json()) == 5


def test_get_expense_by_id(client):
    """Test getting a specific expense by ID."""
    expense_data = {
        "title": "Specific Expense",
        "amount": 75.00,
        "category": "shopping",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    response = client.get(f"/api/expenses/{expense_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == expense_id
    assert data["title"] == expense_data["title"]


def test_get_expense_not_found(client):
    """Test getting non-existent expense."""
    response = client.get("/api/expenses/99999")
    assert response.status_code == 404
    assert "not found" in response.json()["detail"].lower()


def test_update_expense_full(client):
    """Test full update of an expense."""
    expense_data = {
        "title": "Original Title",
        "amount": 50.00,
        "category": "food",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    update_data = {
        "title": "Updated Title",
        "amount": 100.00,
        "category": "entertainment",
        "expense_date": str(date.today() - timedelta(days=1)),
    }
    response = client.put(f"/api/expenses/{expense_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["amount"] == update_data["amount"]
    assert data["category"] == update_data["category"]


def test_update_expense_partial(client):
    """Test partial update of an expense."""
    expense_data = {
        "title": "Original Title",
        "amount": 50.00,
        "category": "food",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    update_data = {"title": "Updated Title"}
    response = client.patch(f"/api/expenses/{expense_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == update_data["title"]
    assert data["amount"] == expense_data["amount"]  # Unchanged


def test_update_expense_not_found(client):
    """Test updating non-existent expense."""
    update_data = {"title": "Updated Title"}
    response = client.put("/api/expenses/99999", json=update_data)
    assert response.status_code == 404


def test_delete_expense(client):
    """Test deleting an expense."""
    expense_data = {
        "title": "To Delete",
        "amount": 50.00,
        "category": "food",
        "expense_date": str(date.today()),
    }
    create_response = client.post("/api/expenses/", json=expense_data)
    expense_id = create_response.json()["id"]

    response = client.delete(f"/api/expenses/{expense_id}")
    assert response.status_code == 204

    # Verify it's deleted
    get_response = client.get(f"/api/expenses/{expense_id}")
    assert get_response.status_code == 404


def test_delete_expense_not_found(client):
    """Test deleting non-existent expense."""
    response = client.delete("/api/expenses/99999")
    assert response.status_code == 404


def test_expense_categories(client):
    """Test all expense categories are valid."""
    categories = [
        "food",
        "transport",
        "entertainment",
        "shopping",
        "bills",
        "health",
        "education",
        "other",
    ]
    for category in categories:
        expense_data = {
            "title": f"Test {category}",
            "amount": 10.00,
            "category": category,
            "expense_date": str(date.today()),
        }
        response = client.post("/api/expenses/", json=expense_data)
        assert response.status_code == 201
        assert response.json()["category"] == category
