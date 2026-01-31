from unittest.mock import AsyncMock, patch


def test_get_exchange_rates_success(client):
    """Test successful exchange rate fetch."""
    mock_response = {
        "base": "USD",
        "date": "2024-01-01",
        "rates": {"EUR": 0.85, "GBP": 0.75, "JPY": 110.0},
    }

    with patch(
        "app.routers.exchange_rate._fetch_exchange_rates", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = mock_response
        response = client.get("/api/exchange/rates/USD")
        assert response.status_code == 200
        data = response.json()
        assert data["base"] == "USD"
        assert "rates" in data
        assert "EUR" in data["rates"]


def test_convert_currency_success(client):
    """Test successful currency conversion."""
    mock_response = {
        "base": "USD",
        "date": "2024-01-01",
        "rates": {"EUR": 0.85, "GBP": 0.75},
    }

    with patch(
        "app.routers.exchange_rate._fetch_exchange_rates", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = mock_response
        response = client.get("/api/exchange/convert?amount=100&from_currency=USD&to_currency=EUR")
        assert response.status_code == 200
        data = response.json()
        assert data["base_currency"] == "USD"
        assert data["target_currency"] == "EUR"
        assert data["amount"] == 100.0
        assert data["converted_amount"] == 85.0
        assert data["rate"] == 0.85


def test_convert_currency_same_currency(client):
    """Test converting to the same currency."""
    response = client.get("/api/exchange/convert?amount=100&from_currency=USD&to_currency=USD")
    assert response.status_code == 200
    data = response.json()
    assert data["base_currency"] == "USD"
    assert data["target_currency"] == "USD"
    assert data["rate"] == 1.0
    assert data["converted_amount"] == 100.0


def test_convert_currency_invalid_target(client):
    """Test conversion with invalid target currency."""
    mock_response = {
        "base": "USD",
        "date": "2024-01-01",
        "rates": {"EUR": 0.85},
    }

    with patch(
        "app.routers.exchange_rate._fetch_exchange_rates", new_callable=AsyncMock
    ) as mock_fetch:
        mock_fetch.return_value = mock_response
        response = client.get(
            "/api/exchange/convert?amount=100&from_currency=USD&to_currency=INVALID"
        )
        assert response.status_code == 400
        assert "not found" in response.json()["detail"].lower()


def test_convert_currency_invalid_amount(client):
    """Test conversion with invalid amount."""
    response = client.get("/api/exchange/convert?amount=-10&from_currency=USD&to_currency=EUR")
    assert response.status_code == 422  # Validation error


def test_exchange_rate_api_error(client):
    """Test handling of exchange rate API errors."""
    from unittest.mock import MagicMock

    import httpx

    with patch(
        "app.routers.exchange_rate._fetch_exchange_rates", new_callable=AsyncMock
    ) as mock_fetch:
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_response.text = "Not Found"
        mock_request = MagicMock()

        mock_fetch.side_effect = httpx.HTTPStatusError(
            "Not Found",
            request=mock_request,
            response=mock_response,
        )
        response = client.get("/api/exchange/rates/USD")
        assert response.status_code in [404, 500, 503]
