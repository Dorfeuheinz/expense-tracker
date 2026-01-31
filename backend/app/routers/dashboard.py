from datetime import date, timedelta

from fastapi import APIRouter, Depends
from sqlalchemy import extract, func
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()


@router.get("/stats", response_model=schemas.DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(get_db),
) -> schemas.DashboardStats:
    """Get dashboard statistics including totals, category breakdown, and monthly trends."""

    # Total expenses
    total_result = db.query(func.sum(models.Expense.amount)).scalar()
    total_expenses = float(total_result) if total_result is not None else 0.0

    # Total count
    total_count: int = db.query(func.count(models.Expense.id)).scalar() or 0

    # Average expense
    avg_result = db.query(func.avg(models.Expense.amount)).scalar()
    average_expense = float(avg_result) if avg_result is not None else 0.0

    # Category breakdown
    category_results = (
        db.query(
            models.Expense.category,
            func.sum(models.Expense.amount).label("total"),
        )
        .group_by(models.Expense.category)
        .all()
    )

    category_breakdown: dict[str, float] = {
        category.value: float(total) if total is not None else 0.0
        for category, total in category_results
    }

    # Monthly trends (last 6 months)
    six_months_ago: date = date.today() - timedelta(days=180)
    monthly_results = (
        db.query(
            extract("year", models.Expense.expense_date).label("year"),
            extract("month", models.Expense.expense_date).label("month"),
            func.sum(models.Expense.amount).label("total"),
            func.count(models.Expense.id).label("count"),
        )
        .filter(
            models.Expense.expense_date >= six_months_ago,
        )
        .group_by(
            extract("year", models.Expense.expense_date),
            extract("month", models.Expense.expense_date),
        )
        .order_by(
            extract("year", models.Expense.expense_date),
            extract("month", models.Expense.expense_date),
        )
        .all()
    )

    monthly_trends: list[schemas.MonthlyTrend] = [
        schemas.MonthlyTrend(
            year=int(year),
            month=int(month),
            total=float(total) if total is not None else 0.0,
            count=int(count),
        )
        for year, month, total, count in monthly_results
    ]

    return schemas.DashboardStats(
        total_expenses=total_expenses,
        category_breakdown=category_breakdown,
        monthly_trends=monthly_trends,
        average_expense=average_expense,
        total_count=total_count,
    )
