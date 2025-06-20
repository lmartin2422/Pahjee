# routers/search.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from typing import Optional
from pydantic import BaseModel

router = APIRouter()

class SearchFilters(BaseModel):
    gender: Optional[str]
    lookingfor: Optional[str]
    location: Optional[str]
    min_age: Optional[int]
    max_age: Optional[int]

@router.post("/search")
def search_users(filters: SearchFilters, db: Session = Depends(get_db)):
    query = db.query(User)

    if filters.gender:
        query = query.filter(User.gender == filters.gender)
    if filters.lookingfor:
        query = query.filter(User.lookingfor == filters.lookingfor)
    if filters.location:
        query = query.filter(User.location == filters.location)
    if filters.min_age is not None:
        query = query.filter(User.age >= filters.min_age)
    if filters.max_age is not None:
        query = query.filter(User.age <= filters.max_age)

    users = query.all()
    return users
