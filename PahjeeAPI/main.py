from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
import bcrypt
import shutil
import os
from typing import List

from routers import auth, pictures, messages, favorites, users, profile_pictures, search

# from models import ProfilePicture  # Make sure this import is included


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# ✅ Serve 'static/uploads' properly
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(pictures.router)
app.include_router(messages.router)
app.include_router(favorites.router)
app.include_router(users.router)
app.include_router(profile_pictures.router)
app.include_router(search.router)



def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def read_root():
    return {"message": "Welcome to Pahjee API"}


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