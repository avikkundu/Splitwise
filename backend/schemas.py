from pydantic import BaseModel
from typing import List, Optional

class GroupCreate(BaseModel):
    name: str
    user_ids: List[int]

class ExpenseCreate(BaseModel):
    description: str
    amount: float
    paid_by: int
    split_type: str  # 'equal' or 'percentage'
    splits: List[dict]

class BalanceEntry(BaseModel):
    user: int
    owes: int
    amount: float

