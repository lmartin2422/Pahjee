from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import User, Favorite
from schemas import FavoriteUser

router = APIRouter()

@router.get("/users/{user_id}/favorites", response_model=list[FavoriteUser])
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    favorites = db.query(User).join(Favorite, Favorite.favorite_user_id == User.id).filter(Favorite.user_id == user_id).all()
    return favorites

@router.post("/users/{user_id}/favorites/{fav_user_id}")
def add_favorite(user_id: int, fav_user_id: int, db: Session = Depends(get_db)):
    if user_id == fav_user_id:
        raise HTTPException(status_code=400, detail="You can't favorite yourself.")

    # Check if already favorited
    existing = db.query(Favorite).filter_by(user_id=user_id, favorite_user_id=fav_user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already favorited.")

    favorite = Favorite(user_id=user_id, favorite_user_id=fav_user_id)
    db.add(favorite)
    db.commit()
    return {"message": "User added to favorites."}

@router.delete("/users/{user_id}/favorites/{fav_user_id}")
def remove_favorite(user_id: int, fav_user_id: int, db: Session = Depends(get_db)):
    favorite = db.query(Favorite).filter_by(user_id=user_id, favorite_user_id=fav_user_id).first()
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found.")
    db.delete(favorite)
    db.commit()
    return {"message": "Favorite removed."}
