from datetime import date, datetime

from pydantic import BaseModel, Field

from app.models import ExpenseCategory


class ExpenseBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    amount: float = Field(..., gt=0)
    category: ExpenseCategory
    description: str | None = Field(None, max_length=1000)
    expense_date: date


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseUpdate(BaseModel):
    title: str | None = Field(None, min_length=1, max_length=200)
    amount: float | None = Field(None, gt=0)
    category: ExpenseCategory | None = None
    description: str | None = Field(None, max_length=1000)
    expense_date: date | None = None


class ExpenseResponse(ExpenseBase):
    id: int
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {"from_attributes": True}


class MonthlyTrend(BaseModel):
    year: int
    month: int
    total: float
    count: int


class DashboardStats(BaseModel):
    total_expenses: float
    category_breakdown: dict[str, float]
    monthly_trends: list[MonthlyTrend]
    average_expense: float
    total_count: int
