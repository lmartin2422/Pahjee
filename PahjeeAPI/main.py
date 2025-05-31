from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
import bcrypt
import shutil
import os
from typing import List

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# -------------------- AUTH --------------------
@app.get("/")
def read_root():
    return {"message": "Welcome to Pahjee API"}


@app.post("/register", response_model=schemas.UserResponse)
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

@app.post("/login")
def login_user(request: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == request.username).first()
    if not user or not bcrypt.checkpw(request.password.encode('utf-8'), user.password_hash.encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {"message": "Login successful", "user_id": user.id, "username": user.username}



# -------------------- PICTURES --------------------
@app.post("/upload-picture/{user_id}")
def upload_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    upload_dir = "uploaded_pictures"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    picture = models.Picture(user_id=user_id, image_url=file_path)
    db.add(picture)
    db.commit()
    db.refresh(picture)

    return {"message": "Picture uploaded successfully", "image_url": picture.image_url}

@app.put("/pictures/{picture_id}/set-profile")
def set_profile_picture(picture_id: int, db: Session = Depends(get_db)):
    picture = db.query(models.Picture).filter(models.Picture.id == picture_id).first()
    if not picture:
        raise HTTPException(status_code=404, detail="Picture not found")

    db.query(models.Picture).filter(models.Picture.user_id == picture.user_id).update({"is_profile_picture": False})
    picture.is_profile_picture = True
    db.commit()
    return {"message": "Profile picture set successfully"}



# -------------------- MESSAGES --------------------
@app.post("/messages/send")
def send_message(message: schemas.MessageCreate, db: Session = Depends(get_db)):
    new_message = models.Message(**message.dict())
    db.add(new_message)
    db.commit()
    db.refresh(new_message)
    return new_message

@app.get("/messages/{user_id}", response_model=List[schemas.MessageResponse])
def get_messages(user_id: int, db: Session = Depends(get_db)):
    messages = db.query(models.Message).filter(models.Message.recipient_id == user_id).all()
    return messages



# -------------------- FAVORITES --------------------
@app.post("/favorites")
def favorite_user(fav: schemas.FavoriteCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Favorite).filter_by(user_id=fav.user_id, favorite_user_id=fav.favorite_user_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already favorited")
    new_fav = models.Favorite(**fav.dict())
    db.add(new_fav)
    db.commit()
    db.refresh(new_fav)
    return new_fav

@app.get("/favorites/{user_id}", response_model=List[schemas.FavoriteResponse])
def get_favorites(user_id: int, db: Session = Depends(get_db)):
    return db.query(models.Favorite).filter(models.Favorite.user_id == user_id).all()



# -------------------- UPDATE PROFILE --------------------
@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}")
def update_user(user_id: int, updated_data: schemas.UserUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = updated_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return {"message": "User updated successfully"}



# -------------------- SEARCH FILTER --------------------
@app.get("/search", response_model=List[schemas.UserResponse])
def search_users(location: str = None, gender: str = None, lookingfor: str = None, db: Session = Depends(get_db)):
    query = db.query(models.User)

    if location:
        query = query.filter(models.User.location.ilike(f"%{location}%"))
    if gender:
        query = query.filter(models.User.gender == gender)
    if lookingfor:
        query = query.filter(models.User.lookingfor == lookingfor)

    return query.all()


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