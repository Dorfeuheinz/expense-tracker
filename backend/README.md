# Expense Tracker API

A FastAPI-based REST API for tracking expenses with full CRUD operations, dashboard statistics, and third-party API integration.

## Features

- ✅ Full CRUD operations for expenses
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Dashboard statistics endpoint
- ✅ Third-party API integration (Exchange Rate API)
- ✅ CORS enabled for frontend integration
- ✅ Type validation with Pydantic

## Tech Stack

- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Package Manager**: uv
- **Python Version**: 3.11+

## Local Setup

### Prerequisites

- Python 3.11 or higher
- PostgreSQL database (via Podman/Docker or local installation)
- uv package manager
- Podman (recommended for PostgreSQL)

### Installation

1. **Set up PostgreSQL with Podman** (if not already running):
```bash
# Check for existing postgres containers
podman ps -a | grep postgres

# Start existing container or create new one:
podman run -d \
  --name expense_tracker_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_tracker \
  -p 5432:5432 \
  postgres:latest
```

2. **Install uv** (if not already installed):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

3. **Navigate to backend directory**:
```bash
cd backend
```

4. **Create virtual environment and install dependencies**:
```bash
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
```

5. **Set up environment variables**:
```bash
# Copy from root .env.example or create manually
cp ../.env.example .env
# Or create backend/.env with:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
# API_HOST=0.0.0.0
# API_PORT=8000
# CORS_ORIGINS=http://localhost:5173,http://localhost:3000
# EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest
```

6. **Run the application**:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

**Note**: Tables are created automatically on first startup. For production, use Alembic migrations.

## API Documentation

Once the server is running, you can access:
- Interactive API docs: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

See `.env.example` for all required environment variables:

- `DATABASE_URL`: PostgreSQL connection string
- `API_HOST`: API host (default: 0.0.0.0)
- `API_PORT`: API port (default: 8000)
- `CORS_ORIGINS`: Allowed CORS origins (comma-separated)
- `EXCHANGE_RATE_API_URL`: Exchange rate API URL (default: https://api.exchangerate-api.com/v4/latest)

## API Endpoints

### Expenses

- `POST /api/expenses/` - Create a new expense
- `GET /api/expenses/` - Get all expenses (with pagination)
- `GET /api/expenses/{id}` - Get a specific expense
- `PUT /api/expenses/{id}` - Update an expense (full update)
- `PATCH /api/expenses/{id}` - Partially update an expense
- `DELETE /api/expenses/{id}` - Delete an expense

### Dashboard

- `GET /api/dashboard/stats` - Get dashboard statistics

### Exchange Rate (Third-party API)

- `GET /api/exchange/rates/{base_currency}` - Get exchange rates for a currency
- `GET /api/exchange/convert?amount={amount}&from_currency={from}&to_currency={to}` - Convert currency

## Database Migrations

The application uses SQLAlchemy's declarative base. Tables are created automatically on startup. For production, consider using Alembic for migrations:

```bash
# Initialize Alembic (if not already done)
alembic init alembic

# Create a migration
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

## Testing

### Running Tests

```bash
# Activate virtual environment
source .venv/bin/activate

# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=term-missing

# Run specific test file
pytest tests/test_expenses.py

# Run with verbose output
pytest -v
```

### Test Coverage

The test suite includes:
- **Unit tests**: Individual function and endpoint tests
- **Integration tests**: Full CRUD workflow and dashboard integration
- **API tests**: Exchange rate API mocking and error handling

### Testing the API Manually

```bash
# Create an expense
curl -X POST "http://localhost:8000/api/expenses/" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Groceries",
    "amount": 50.00,
    "category": "food",
    "expense_date": "2024-01-15"
  }'

# Get all expenses
curl "http://localhost:8000/api/expenses/"

# Get dashboard stats
curl "http://localhost:8000/api/dashboard/stats"

# Convert currency
curl "http://localhost:8000/api/exchange/convert?amount=100&from_currency=USD&to_currency=EUR"
```

## Deployment

The application can be deployed to various platforms:

- **AWS**: Use Elastic Beanstalk, ECS, or EC2
- **Azure**: Use App Service or Container Instances
- **GCP**: Use Cloud Run or App Engine
- **Heroku**: Use Heroku Postgres and deploy the FastAPI app
- **Railway**: Deploy with Railway's PostgreSQL addon
- **Render**: Deploy with Render's PostgreSQL service

Make sure to:
1. Set all environment variables in your deployment platform
2. Use a production-grade ASGI server (e.g., Gunicorn with Uvicorn workers)
3. Configure proper CORS origins for your frontend domain
4. Use a managed PostgreSQL database

## License

MIT
