from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
from typing import List

router = APIRouter()

@router.post("/favorites")
def favorite_user(fav: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Favorite).filter_by(user_id=fav.user_id, favorite_user_id=fav.favorite_user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already favorited")
    new_fav = models.Favorite(**fav.dict())
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav


@router.get("/favorites/{user_id}", response_model=List[schemas.FavoriteResponse])
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Favorite).filter_by(user_id=user_id).all()
