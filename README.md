# Expense Tracker Application

A full-stack web application for tracking expenses with complete CRUD operations, data visualization, and third-party API integration.

## 🚀 Features

- ✅ **Full CRUD Operations**: Create, Read, Update, and Delete expenses through both UI and REST APIs
- ✅ **Data Visualization**: Interactive dashboard with charts showing category breakdown and monthly trends
- ✅ **Third-Party API Integration**: Currency converter using Exchange Rate API
- ✅ **Modern Tech Stack**: FastAPI (Python) backend with React (TypeScript) frontend
- ✅ **PostgreSQL Database**: Robust data persistence
- ✅ **Responsive Design**: Beautiful, mobile-friendly UI

## 📁 Project Structure

```
socialbooster/
├── backend/          # FastAPI backend application
│   ├── app/
│   │   ├── main.py   # FastAPI application entry point
│   │   ├── models.py # Database models
│   │   ├── schemas.py # Pydantic schemas
│   │   ├── database.py # Database configuration
│   │   ├── config.py # Application settings
│   │   └── routers/  # API route handlers
│   ├── pyproject.toml # Python dependencies
│   └── README.md     # Backend setup instructions
│
├── frontend/         # React frontend application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── api/       # API client functions
│   │   ├── types.ts   # TypeScript types
│   │   └── App.tsx    # Main app component
│   ├── package.json  # Node.js dependencies
│   └── README.md     # Frontend setup instructions
│
└── README.md         # This file
```

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Package Manager**: uv
- **Python**: 3.11+

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Package Manager**: Bun
- **Linter/Formatter**: Biome
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Routing**: React Router
- **State Management**: TanStack Query

## 📋 Prerequisites

- Python 3.11 or higher
- Bun (JavaScript runtime and package manager)
- PostgreSQL database (via Podman/Docker or local installation)
- uv package manager (for Python)
- Podman (for containerized PostgreSQL)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd socialbooster
```

### 2. Set Up PostgreSQL with Podman

```bash
# Check if PostgreSQL container already exists
podman ps -a | grep postgres

# If you have an existing postgres container, start it:
# podman start <container_name>

# Or create a new PostgreSQL container:
podman run -d \
  --name expense_tracker_postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=expense_tracker \
  -p 5432:5432 \
  postgres:latest

# Wait a few seconds for PostgreSQL to start, then verify:
podman ps | grep expense_tracker_postgres
```

### 3. Set Up Environment Variables

```bash
# Copy .env.example to .env
cp .env.example .env

# The default .env is configured for Podman PostgreSQL
# Edit if needed:
# DATABASE_URL=postgresql://postgres:postgres@localhost:5432/expense_tracker
```

### 4. Set Up Backend

```bash
# Navigate to backend directory
cd backend

# Install uv (if not already installed)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Create virtual environment and install dependencies
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .

# Copy environment variables (if not done in root)
cp ../.env.example .env
# Or manually set DATABASE_URL in backend/.env

# Run database migrations (tables are created automatically on first run)
# The application will create tables on startup

# Run the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs`

### 5. Set Up Frontend

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install Bun if not already installed
curl -fsSL https://bun.sh/install | bash

# Install dependencies
bun install

# Set up environment variables (optional, defaults to http://localhost:8000)
cp ../.env.example .env
# Or create frontend/.env with: VITE_API_URL=http://localhost:8000

# Start the development server
bun run dev
```

The frontend will be available at `http://localhost:5173`

### 6. Run Tests

**Backend Tests:**
```bash
cd backend
source .venv/bin/activate
pytest
# With coverage:
pytest --cov=app --cov-report=html
```

**Frontend Tests:**
```bash
cd frontend
bun test
# With UI:
bun run test:ui
# With coverage:
bun run test:coverage
```

### 7. Formatting and Linting

**Frontend (Biome):**
```bash
cd frontend
# Check formatting and linting
bun run check
# Auto-fix issues
bun run check:fix
# Format code
bun run format
# Lint only
bun run lint
```

**Backend (Ruff):**
```bash
cd backend
source .venv/bin/activate
# Lint
ruff check .
# Format
ruff format .
```

## 🧪 Testing the Application

### UI Flow to Test CRUD (Step-by-Step)

1. **Create Expense**:
   - Open the application at `http://localhost:5173`
   - Click the "Add Expense" button
   - Fill in the form:
     - Title: e.g., "Groceries"
     - Amount: e.g., 50.00
     - Category: Select from dropdown (e.g., "Food")
     - Date: Select a date
     - Description: (Optional) Add a description
   - Click "Create Expense"
   - Verify the expense appears in the expenses list

2. **View Expenses**:
   - The home page displays all expenses in a table
   - Each expense shows: Title, Amount, Category, Date, Description
   - Expenses are sorted by creation date

3. **Update Expense**:
   - Click the "Edit" button on any expense row
   - Modify any fields (e.g., change amount or category)
   - Click "Update Expense"
   - Verify the changes are reflected in the expenses list

4. **Delete Expense**:
   - Click the "Delete" button on any expense row
   - Confirm the deletion in the popup
   - Verify the expense is removed from the list

### Report/Visualization Page

1. Navigate to "Dashboard" from the top navigation bar
2. View the statistics cards:
   - **Total Expenses**: Sum of all expense amounts
   - **Total Count**: Number of expenses
   - **Average Expense**: Average amount per expense
3. View the **Category Breakdown** pie chart showing distribution by category
4. View the **Monthly Trends** bar chart showing expenses over the last 6 months
5. Add, update, or delete expenses, then click "Refresh Data" to see the dashboard update

### Third-Party API Feature Path

1. Navigate to "Currency Converter" from the top navigation bar
2. This page demonstrates third-party API integration (Exchange Rate API)
3. Enter an amount (e.g., 100)
4. Select "From Currency" (e.g., USD)
5. Select "To Currency" (e.g., EUR)
6. Click "Convert"
7. View the conversion result showing:
   - Original amount and currency
   - Converted amount and currency
   - Current exchange rate
8. Try different currency pairs to see real-time exchange rates

## 📡 API Endpoints

### Expenses
- `POST /api/expenses/` - Create a new expense
- `GET /api/expenses/` - Get all expenses (with pagination: ?skip=0&limit=100)
- `GET /api/expenses/{id}` - Get a specific expense
- `PUT /api/expenses/{id}` - Update an expense (full update)
- `PATCH /api/expenses/{id}` - Partially update an expense
- `DELETE /api/expenses/{id}` - Delete an expense

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Exchange Rate (Third-Party API)
- `GET /api/exchange/rates/{base_currency}` - Get exchange rates for a currency
- `GET /api/exchange/convert?amount={amount}&from_currency={from}&to_currency={to}` - Convert currency

## 🗄️ Database Schema

### Expense Table
- `id`: Integer (Primary Key)
- `title`: String (Required, max 200 chars)
- `amount`: Float (Required, > 0)
- `category`: Enum (food, transport, entertainment, shopping, bills, health, education, other)
- `description`: String (Optional, max 1000 chars)
- `expense_date`: Date (Required)
- `created_at`: DateTime (Auto-generated)
- `updated_at`: DateTime (Auto-updated)

## 🔧 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:password@localhost:5432/expense_tracker
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## 🚀 Deployment

### Backend Deployment

The backend can be deployed to:
- **AWS**: Elastic Beanstalk, ECS, or EC2
- **Azure**: App Service or Container Instances
- **GCP**: Cloud Run or App Engine
- **Heroku**: Heroku Postgres + FastAPI app
- **Railway**: Railway PostgreSQL + FastAPI
- **Render**: Render PostgreSQL + Web Service

**Production considerations:**
- Use environment variables for all configuration
- Set up a managed PostgreSQL database
- Configure CORS to allow your frontend domain
- Use a production ASGI server (Gunicorn with Uvicorn workers)

### Frontend Deployment

The frontend can be deployed to:
- **Vercel**: Connect GitHub repo for automatic deployment
- **Netlify**: Drag & drop `dist` folder or connect GitHub
- **AWS S3 + CloudFront**: Upload build and serve via CDN
- **Azure Static Web Apps**: Deploy via GitHub Actions
- **GitHub Pages**: Deploy `dist` folder

**Production considerations:**
- Build the project: `npm run build`
- Set `VITE_API_URL` to your production backend URL
- Ensure backend CORS allows your frontend domain

## 📝 Database Migrations

The application creates tables automatically on startup. For production, consider using Alembic:

```bash
cd backend
alembic init alembic
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🐛 Troubleshooting

### Backend Issues
- **Database connection error**: Check `DATABASE_URL` in `.env`
- **Port already in use**: Change `API_PORT` in `.env` or stop the process using port 8000
- **CORS errors**: Add your frontend URL to `CORS_ORIGINS` in `.env`

### Frontend Issues
- **API connection error**: Check `VITE_API_URL` in `.env` and ensure backend is running
- **Build errors**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📄 License

MIT

## 👤 Author

Built as a demo application showcasing full-stack development with FastAPI and React.

---

**Note**: This application is built to demonstrate CRUD operations, data visualization, and third-party API integration as specified in the task requirements.
