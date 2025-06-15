# routers/pictures.py

from fastapi import APIRouter, UploadFile, File, Form, Depends
from sqlalchemy.orm import Session
from database import get_db
from services import picture_service
from typing import List, Optional

router = APIRouter()

@router.post("/users/{user_id}/upload_pictures")
def upload_pictures(
    user_id: int,
    files: List[UploadFile] = File(...),
    profile_pic_filename: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    return picture_service.save_pictures(user_id, files, profile_pic_filename, db)

# @router.get("/users/{user_id}/pictures")
# def get_user_pictures(user_id: int, db: Session = Depends(get_db)):
#     return picture_service.get_user_pictures(user_id, db)

@router.get("/pictures/user/{user_id}")
def get_user_pictures(user_id: int, db: Session = Depends(get_db)):
    return picture_service.get_user_pictures(user_id, db)


@router.put("/users/{user_id}/pictures/{picture_id}/set-profile")
def set_profile_picture(user_id: int, picture_id: int, db: Session = Depends(get_db)):
    return picture_service.set_profile_picture(user_id, picture_id, db)

@router.delete("/users/{user_id}/pictures/{picture_id}")
def delete_picture(user_id: int, picture_id: int, db: Session = Depends(get_db)):
    return picture_service.delete_picture(user_id, picture_id, db)
