# routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services import user_service
from schemas import UserCreate, UserUpdate, UserResponse, UserSearch, FavoriteResponse, SearchFilters
from typing import List
import models, schemas
from datetime import date, timedelta
from sqlalchemy import and_
from models import User, ProfilePicture
from fastapi import HTTPException


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.post("/", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    return user_service.register_user(db, user)

@router.get("/", response_model=List[UserResponse])
def get_all_users(db: Session = Depends(get_db)):
    return user_service.get_all_users(db)

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    user = user_service.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/public/{user_id}")
def get_public_user_info(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": user.id,
        "firstname": user.firstname,
        "username": user.username
    }


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, data: UserUpdate, db: Session = Depends(get_db)):
    updated = user_service.update_user(db, user_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="User not found")
    return updated

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    if not user_service.delete_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}

@router.post("/search", response_model=List[schemas.UserResponse])
def search_users(filters: schemas.SearchFilters, db: Session = Depends(get_db)):
    query = db.query(models.User)

    if filters.location:
        query = query.filter(models.User.location.ilike(f"%{filters.location}%"))
    if filters.gender:
        query = query.filter(models.User.gender == filters.gender)
    if filters.lookingfor:
        query = query.filter(models.User.lookingfor == filters.lookingfor)
    if filters.min_age:
        max_birthdate = date.today() - timedelta(days=filters.min_age * 365)
        query = query.filter(models.User.birthdate <= max_birthdate)
    if filters.max_age:
        min_birthdate = date.today() - timedelta(days=filters.max_age * 365)
        query = query.filter(models.User.birthdate >= min_birthdate)

    return query.all()


@router.post("/{user_id}/favorites/{favorited_user_id}")
def add_favorite(user_id: int, favorited_user_id: int, db: Session = Depends(get_db)):
    existing = db.query(models.Favorite).filter_by(user_id=user_id, favorited_user_id=favorited_user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already in favorites")
    
    new_fav = models.Favorite(user_id=user_id, favorited_user_id=favorited_user_id)
    db.add(new_fav)
    db.commit()
    return {"message": "Favorite added"}

@router.get("/{user_id}/favorites", response_model=List[UserResponse])
def get_user_favorites(user_id: int, db: Session = Depends(get_db)):
    favs = db.query(models.Favorite).filter_by(user_id=user_id).all()
    user_ids = [fav.favorited_user_id for fav in favs]
    return db.query(models.User).filter(models.User.id.in_(user_ids)).all()

@router.delete("/{user_id}/favorites/{favorited_user_id}")
def remove_favorite(user_id: int, favorited_user_id: int, db: Session = Depends(get_db)):
    fav = db.query(models.Favorite).filter_by(user_id=user_id, favorited_user_id=favorited_user_id).first()
    if not fav:
        raise HTTPException(status_code=404, detail="Favorite not found")
    
    db.delete(fav)
    db.commit()
    return {"message": "Favorite removed"}


@router.post("/users/search")
def search_users(filters: SearchFilters):
    # your filtering logic here
    ...


@router.get("/by-username/{username}", response_model=List[schemas.UserResponse])
def get_user_by_username_route(username: str, db: Session = Depends(get_db), current_user_id: int = None):
    users = user_service.get_user_by_username(db, username)
    if users:
        if current_user_id:
            users = [user for user in users if user.id != current_user_id]
        return users
    raise HTTPException(status_code=404, detail="No users found")




@router.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # 👇 Fetch the profile picture and attach to user
    profile_pic = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    user_dict = user.__dict__.copy()
    user_dict["profile_picture"] = (
        profile_pic.image_url if profile_pic else None
    )

    return user_dict
