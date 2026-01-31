from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter()


def _get_expense_or_404(expense_id: int, db: Session) -> models.Expense:
    """Helper function to get expense or raise 404."""
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    if expense is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Expense with id {expense_id} not found",
        )
    return expense


@router.post(
    "/",
    response_model=schemas.ExpenseResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_expense(
    expense: schemas.ExpenseCreate,
    db: Session = Depends(get_db),
) -> schemas.ExpenseResponse:
    """Create a new expense."""
    db_expense = models.Expense(**expense.model_dump())
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.get("/", response_model=list[schemas.ExpenseResponse])
def get_expenses(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db),
) -> list[schemas.ExpenseResponse]:
    """Get all expenses with pagination."""
    expenses = (
        db.query(models.Expense)
        .order_by(models.Expense.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return expenses


@router.get("/{expense_id}", response_model=schemas.ExpenseResponse)
def get_expense(
    expense_id: int,
    db: Session = Depends(get_db),
) -> schemas.ExpenseResponse:
    """Get a specific expense by ID."""
    return _get_expense_or_404(expense_id, db)


@router.put("/{expense_id}", response_model=schemas.ExpenseResponse)
def update_expense(
    expense_id: int,
    expense: schemas.ExpenseUpdate,
    db: Session = Depends(get_db),
) -> schemas.ExpenseResponse:
    """Update an existing expense (full update)."""
    db_expense = _get_expense_or_404(expense_id, db)

    update_data = expense.model_dump(exclude_unset=True)
    if not update_data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No fields provided for update",
        )

    for field, value in update_data.items():
        setattr(db_expense, field, value)

    db.commit()
    db.refresh(db_expense)
    return db_expense


@router.patch("/{expense_id}", response_model=schemas.ExpenseResponse)
def patch_expense(
    expense_id: int,
    expense: schemas.ExpenseUpdate,
    db: Session = Depends(get_db),
) -> schemas.ExpenseResponse:
    """Partially update an existing expense."""
    return update_expense(expense_id, expense, db)


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
) -> None:
    """Delete an expense."""
    db_expense = _get_expense_or_404(expense_id, db)
    db.delete(db_expense)
    db.commit()
    return None
