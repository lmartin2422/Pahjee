from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, models
from database import get_db
import bcrypt

router = APIRouter(
    tags=["Auth"]
)



@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        firstname=user.firstname,
        lastname=user.lastname,
        location=user.location,
        bio=user.bio,
        gender=user.gender,
        birthdate=user.birthdate,
        lookingfor=user.lookingfor,
        sexualorientation=user.sexualorientation,
        professionindustry=user.professionindustry,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or not bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "user_id": user.id, "username": user.username}
