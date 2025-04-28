from fastapi import FastAPI, Depends, HTTPException
from fastapi import APIRouter, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import psycopg2

import hashlib
import models
import schemas
import database

import bcrypt


from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
import models
import schemas
import database
import bcrypt

app = FastAPI()

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create database tables
models.Base.metadata.create_all(bind=database.engine)

# CORS: Allow Angular frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ===== ROUTES =====

@app.get("/")
def read_root():
    return {"message": "Welcome to Pahjee API"}

# Get all users (optional)
@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users

# Register a new user
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if username or email already exists
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    # Hash the password
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    # Create a new user
    new_user = models.User(
        username=user.username,
        email=user.email,
        password_hash=hashed_password,
        firstname=user.firstname,
        lastname=user.lastname,
        profile_picture=user.profile_picture,
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

# Login an existing user
@app.post("/login")
def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Check password using bcrypt
    if not bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    # Success: return user ID (and optionally later a token)
    return {
        "message": "Login successful",
        "user_id": user.id,
        "username": user.username,
    }

# Update user info
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, updated_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_fields = updated_data.dict(exclude_unset=True)

    for key, value in update_fields.items():
        if key == "password" and value:
            hashed_pw = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
            setattr(user, "password_hash", hashed_pw.decode('utf-8'))
        else:
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

# Delete a user
@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return None  # No content

# ===== MAIN =====
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)



"""
When restarting the API & virtual environment, run in terminal: 

from this folder: 
Desktop\Pahjee\Pahjee\PahjeeAPI

run:
PahjeeAPI-env\Scripts\Activate.ps1

then:
uvicorn main:app --reload

if error, run:
pip install uvicorn
pip install fastapi
uvicorn main:app --reload

pip install pydantic[email]


"""