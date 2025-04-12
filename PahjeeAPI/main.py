from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from pydantic import BaseModel
from sqlalchemy.orm import Session

import hashlib
import models
import schemas
import database

import bcrypt



app = FastAPI()

# Initialize the database
models.Base.metadata.create_all(bind=database.engine)


# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Allows Angular to call the FASTAPI backend w/o CORS errors
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Angular default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# GET request
@app.get("/")
def read_root():
    return {"message": "Welcome to Pahjee API"}

@app.get("/users", response_model=list[schemas.UserResponse])
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


# POST request for login
@app.post("/login")
def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if user and bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        return {"message": "Login successful", "user_id": user.id}
    raise HTTPException(status_code=401, detail="Invalid credentials")


# POST request for user registration
@app.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Hash the password
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()

    # Check if user already exists
    existing_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    # Create a new User instance
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


# PUT request
@app.put("/users/{user_id}", response_model=schemas.UserResponse)
def update_user(user_id: int, updated_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Loop through fields and update only if provided
    update_fields = updated_data.dict(exclude_unset=True)
    
    for key, value in update_fields.items():
        if key == "password" and value:
            hashed_pw = bcrypt.hashpw(value.encode('utf-8'), bcrypt.gensalt())
            setattr(user, key, hashed_pw.decode('utf-8'))
        else:
            setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


# DELETE request
@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return None  # 204 = No Content, so no response body




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