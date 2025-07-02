# routers/search.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from database import get_db
from models import User
from typing import List, Optional
from pydantic import BaseModel
from sqlalchemy import extract, func
from datetime import date
from uszipcode import SearchEngine



searcher = SearchEngine()  # fast mode
router = APIRouter()

class SearchFilters(BaseModel):
    gender: Optional[List[str]] = None
    lookingfor: Optional[List[str]] = None
    location: Optional[List[str]] = None
    sexualorientation: Optional[List[str]] = None
    professionindustry: Optional[List[str]] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None



@router.get("/locations")
def get_locations(query: str = ""):
    if len(query) < 2:
        return []
    results = searcher.by_city(query, returns=10)
    return [f"{r.major_city}, {r.state}" for r in results if r.major_city]


@router.post("/search")
def search_users(filters: SearchFilters, db: Session = Depends(get_db)):
    query = db.query(User)

    if filters.gender:
        query = query.filter(func.lower(User.gender).in_([g.lower() for g in filters.gender]))

    if filters.lookingfor:
        query = query.filter(func.lower(User.lookingfor).in_([l.lower() for l in filters.lookingfor]))

    if filters.location:
        query = query.filter(func.lower(User.location).in_([l.lower() for l in filters.location]))

    if filters.sexualorientation:
        query = query.filter(func.lower(User.sexualorientation).in_([s.lower() for s in filters.sexualorientation]))

    if filters.professionindustry:
        query = query.filter(func.lower(User.professionindustry).in_([p.lower() for p in filters.professionindustry]))

    today = date.today()

    if filters.min_age is not None:
        min_birthdate = today.replace(year=today.year - filters.min_age)
        query = query.filter(User.birthdate <= min_birthdate)

    if filters.max_age is not None:
        max_birthdate = today.replace(year=today.year - filters.max_age)
        query = query.filter(User.birthdate >= max_birthdate)

    return query.all()