# routers/search.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User
from typing import Optional
from pydantic import BaseModel

from sqlalchemy import extract, func
from datetime import date

router = APIRouter()

class SearchFilters(BaseModel):
    gender: Optional[str]
    lookingfor: Optional[str]
    location: Optional[str]
    min_age: Optional[int]
    max_age: Optional[int]
    sexualorientation: Optional[str]
    professionindustry: Optional[str]


@router.post("/search")
def search_users(filters: SearchFilters, db: Session = Depends(get_db)):
    query = db.query(User)

    if filters.gender:
        query = query.filter(func.lower(User.gender) == filters.gender.lower())
    if filters.lookingfor:
        query = query.filter(func.lower(User.lookingfor) == filters.lookingfor.lower())
    if filters.location:
        query = query.filter(func.lower(User.location) == filters.location.lower())
    if filters.sexualorientation:
        query = query.filter(func.lower(User.sexualorientation) == filters.sexualorientation.lower())
    if filters.professionindustry:
        query = query.filter(func.lower(User.professionindustry) == filters.professionindustry.lower())

    # Age filter logic (as fixed earlier)
    from datetime import date
    today = date.today()
    if filters.min_age is not None:
        min_birthdate = date(today.year - filters.min_age, today.month, today.day)
        query = query.filter(User.birthdate <= min_birthdate)
    if filters.max_age is not None:
        max_birthdate = date(today.year - filters.max_age - 1, today.month, today.day)
        query = query.filter(User.birthdate >= max_birthdate)

    users = query.all()
    return users