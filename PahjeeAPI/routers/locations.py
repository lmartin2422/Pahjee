# routers/locations.py

from fastapi import APIRouter
from uszipcode import SearchEngine

router = APIRouter()

searcher = SearchEngine()

@router.get("/locations")
def get_locations(query: str = ""):
    if len(query) < 2:
        return []
    results = searcher.by_city(query, returns=10)
    return [f"{r.major_city}, {r.state}" for r in results if r.major_city]
