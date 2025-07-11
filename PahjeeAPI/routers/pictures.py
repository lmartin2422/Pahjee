# routers/pictures.py

from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import picture_service
from typing import List, Optional
import models 

router = APIRouter()

@router.post("/users/{user_id}/upload_pictures")
def upload_pictures(
    user_id: int,
    files: List[UploadFile] = File(...),
    profile_pic_filename: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    return picture_service.save_pictures(user_id, files, profile_pic_filename, db)



@router.get("/pictures/user/{user_id}")
def get_user_pictures(user_id: int, db: Session = Depends(get_db)):
    return picture_service.get_user_pictures(user_id, db)

# Distinct endpoint for "other pictures" excluding the profile picture
@router.get("/pictures/user/{user_id}/other-pictures")
def get_other_pictures(user_id: int, db: Session = Depends(get_db)):
    # Fetch all pictures from the pictures table for the given user
    pictures = db.query(models.Picture).filter(models.Picture.user_id == user_id).all()

    # Return only the image_url of each picture (exclude the profile picture)
    return [{"image_url": pic.image_url} for pic in pictures if not pic.is_profile_pic]  # Exclude profile pic


@router.put("/users/{user_id}/pictures/{picture_id}/set-profile")
def set_profile_picture(user_id: int, picture_id: int, db: Session = Depends(get_db)):
    return picture_service.set_profile_picture(user_id, picture_id, db)

@router.delete("/users/{user_id}/pictures/{picture_id}")
def delete_picture(user_id: int, picture_id: int, db: Session = Depends(get_db)):
    return picture_service.delete_picture(user_id, picture_id, db)
