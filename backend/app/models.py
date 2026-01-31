import enum

from sqlalchemy import Column, Date, DateTime, Enum, Float, Integer, String
from sqlalchemy.sql import func

from app.database import Base


class ExpenseCategory(str, enum.Enum):
    FOOD = "food"
    TRANSPORT = "transport"
    ENTERTAINMENT = "entertainment"
    SHOPPING = "shopping"
    BILLS = "bills"
    HEALTH = "health"
    EDUCATION = "education"
    OTHER = "other"


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    category = Column(Enum(ExpenseCategory), nullable=False, index=True)
    description = Column(String, nullable=True)
    expense_date = Column(Date, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
