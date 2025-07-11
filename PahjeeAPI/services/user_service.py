# services/user_service.py
from sqlalchemy.orm import Session

from models import User, Favorite
from schemas import UserCreate, UserUpdate
from passlib.context import CryptContext
from typing import List
import models
from sqlalchemy import or_


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# def get_user_by_username(db: Session, username: str):
#     return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username.ilike(f"%{username}%")).all()


def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_all_users(db: Session):
    return db.query(User).all()

def register_user(db: Session, user_data: UserCreate):
    hashed_pw = pwd_context.hash(user_data.password)
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_pw,
        age=user_data.age,
        gender=user_data.gender,
        bio=user_data.bio,
        location=user_data.location,
        interests=user_data.interests
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def update_user(db: Session, user_id: int, data: UserUpdate):
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    for field, value in data.dict(exclude_unset=True).items():
        setattr(user, field, value)
    db.commit()
    db.refresh(user)
    return user

# def delete_user(db: Session, user_id: int):
#     user = get_user_by_id(db, user_id)
#     if user:
#         db.delete(user)
#         db.commit()
#         return True
#     return False

def deactivate_account(db: Session, user_id: int):
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        user.is_active = False
        db.commit()
        return True
    return False


def search_users(db: Session, filters: dict):
    query = db.query(User)
    if filters.get("age"):
        query = query.filter(User.age == filters["age"])
    if filters.get("gender"):
        query = query.filter(User.gender == filters["gender"])
    if filters.get("location"):
        query = query.filter(User.location == filters["location"])
    if filters.get("interests"):
        query = query.filter(User.interests.contains(filters["interests"]))
    return query.all()

def favorite_user(db: Session, user_id: int, favorite_user_id: int):
    favorite = Favorite(user_id=user_id, favorite_user_id=favorite_user_id)
    db.add(favorite)
    db.commit()
    db.refresh(favorite)
    return favorite

def get_favorites(db: Session, user_id: int):
    return db.query(Favorite).filter(Favorite.user_id == user_id).all()


