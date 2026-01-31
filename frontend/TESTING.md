# Testing Guide

## Running Tests

### Frontend Tests (Bun)

```bash
cd frontend

# Run all tests
bun test

# Run tests in watch mode
bun test --watch

# Run specific test file
bun test src/api/__tests__/expenses.test.ts

# Run tests with coverage
bun test --coverage
```

### Backend Tests (Pytest)

```bash
cd backend
source .venv/bin/activate

# Run all tests
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_expenses.py

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test
pytest tests/test_expenses.py::test_create_expense
```

## Test Coverage

### Backend
- ✅ **26 tests** covering:
  - All CRUD operations (create, read, update, delete)
  - Dashboard statistics
  - Exchange rate API integration
  - Error handling
  - Integration workflows
- ✅ **91% code coverage**

### Frontend
- ✅ **API Tests**:
  - `expenses.test.ts` - All expense API functions
  - `dashboard.test.ts` - Dashboard API
  - `exchange.test.ts` - Exchange rate API
- ✅ **Component Tests**:
  - `ExpenseList.test.tsx` - Expense list component
  - `ExpenseForm.test.tsx` - Expense form component
  - `Dashboard.test.tsx` - Dashboard component

## Test Structure

### Frontend Test Files
```
frontend/src/
├── api/__tests__/
│   ├── expenses.test.ts      # Expense API tests
│   ├── dashboard.test.ts     # Dashboard API tests
│   └── exchange.test.ts      # Exchange API tests
└── components/__tests__/
    ├── ExpenseList.test.tsx   # Expense list component tests
    ├── ExpenseForm.test.tsx   # Expense form component tests
    └── Dashboard.test.tsx     # Dashboard component tests
```

### Backend Test Files
```
backend/tests/
├── test_expenses.py          # Expense CRUD tests
├── test_dashboard.py         # Dashboard statistics tests
├── test_exchange_rate.py     # Exchange rate API tests
└── test_integration.py       # Integration tests
```

## Writing New Tests

### Frontend (Bun Test)

```typescript
import { describe, it, expect, mock } from 'bun:test';

describe('MyComponent', () => {
  it('should do something', () => {
    // Test implementation
    expect(true).toBe(true);
  });
});
```

### Backend (Pytest)

```python
def test_my_function(client):
    response = client.get('/api/endpoint')
    assert response.status_code == 200
```

## Troubleshooting

### Frontend Tests
- **DOM errors**: Make sure `happy-dom` is installed and setup-bun.ts is configured
- **Mock errors**: Ensure mocks are set up before importing components
- **Import errors**: Check that all dependencies are installed

### Backend Tests
- **Database errors**: Tests use in-memory SQLite, no PostgreSQL needed
- **Import errors**: Make sure virtual environment is activated
- **Module errors**: Run `uv pip install -e .` to install package
