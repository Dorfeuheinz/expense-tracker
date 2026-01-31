from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import Base, engine
from app.routers import dashboard, exchange_rate, expenses


# Create database tables only when running the app (not during imports)
def create_tables():
    """Create database tables. Called on app startup."""
    try:
        # Test connection first
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        # Create tables if connection successful
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully")
    except Exception as e:
        print(f"⚠️  Warning: Could not connect to database: {e}")
        print("   The app will start, but database operations may fail.")
        print("   Make sure PostgreSQL is running and DATABASE_URL is correct.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events."""
    # Startup
    create_tables()
    yield
    # Shutdown (if needed)


app = FastAPI(
    title="Expense Tracker API",
    description="A simple expense tracking API with CRUD operations",
    version="1.0.0",
    lifespan=lifespan,
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(expenses.router, prefix="/api/expenses", tags=["expenses"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(exchange_rate.router, prefix="/api/exchange", tags=["exchange"])


@app.get("/")
async def root():
    return {"message": "Expense Tracker API", "version": "1.0.0"}


@app.get("/health")
async def health():
    return {"status": "healthy"}
