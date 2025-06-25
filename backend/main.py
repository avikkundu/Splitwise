from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import schemas

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend dev server (React)
origins = [
    "http://localhost:3000",  # Your frontend origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,           # If you're using cookies/auth headers
    allow_methods=["*"],              # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],              # Allow all headers (especially for preflight)
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/groups")
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(name=group.name)
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    for uid in group.user_ids:
        db_user_group = models.UserGroup(user_id=uid, group_id=db_group.id)
        db.add(db_user_group)
    db.commit()
    return {"id": db_group.id, "name": db_group.name}

@app.get("/groups/{group_id}")
def get_group(group_id: int, db: Session = Depends(get_db)):
    group = db.query(models.Group).filter(models.Group.id == group_id).first()
    if not group:
        raise HTTPException(status_code=404, detail="Group not found")
    users = [ug.user_id for ug in group.users]
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    total = sum(e.amount for e in expenses)
    return {"name": group.name, "users": users, "total_expenses": total}

@app.post("/groups/{group_id}/expenses")
def add_expense(group_id: int, expense: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    db_exp = models.Expense(description=expense.description, amount=expense.amount,
                            paid_by=expense.paid_by, group_id=group_id, split_type=expense.split_type)
    db.add(db_exp)
    db.commit()
    db.refresh(db_exp)

    if expense.split_type == 'equal':
        share = expense.amount / len(expense.splits)
        for split in expense.splits:
            db_split = models.Split(expense_id=db_exp.id, user_id=split['user_id'], amount=round(share, 2))
            db.add(db_split)
    elif expense.split_type == 'percentage':
        for split in expense.splits:
            amt = expense.amount * (split['percentage'] / 100)
            db_split = models.Split(expense_id=db_exp.id, user_id=split['user_id'], amount=round(amt, 2))
            db.add(db_split)
    db.commit()
    return {"expense_id": db_exp.id}

@app.get("/groups/{group_id}/balances")
def get_group_balances(group_id: int, db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).filter(models.Expense.group_id == group_id).all()
    balance = {}

    for expense in expenses:
        paid_by = expense.paid_by
        for split in expense.splits:
            uid = split.user_id
            if uid == paid_by:
                continue
            balance[(uid, paid_by)] = balance.get((uid, paid_by), 0) + split.amount

    result = [
        {"user": u, "owes": o, "amount": round(amt, 2)} for (u, o), amt in balance.items()
    ]
    return result

@app.get("/users/{user_id}/balances")
def get_user_balances(user_id: int, db: Session = Depends(get_db)):
    splits = db.query(models.Split).join(models.Expense).filter(
        (models.Split.user_id == user_id) | (models.Expense.paid_by == user_id)
    ).all()
    balance = {}
    for split in splits:
        paid_by = split.expense.paid_by
        owed_by = split.user_id
        amt = split.amount
        if owed_by == paid_by:
            continue
        if user_id == owed_by:
            balance[(owed_by, paid_by)] = balance.get((owed_by, paid_by), 0) + amt
        elif user_id == paid_by:
            balance[(owed_by, paid_by)] = balance.get((owed_by, paid_by), 0) - amt

    result = [
        {"user": u, "owes": o, "amount": round(amt, 2)} for (u, o), amt in balance.items() if amt > 0
    ]
    return result