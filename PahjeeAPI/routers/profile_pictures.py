from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import shutil
import os
from database import get_db
from models import ProfilePicture, User
from schemas import ProfilePicture as ProfilePictureSchema

router = APIRouter()

UPLOAD_DIR = "static/profile_pics"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/profile-picture/upload", response_model=ProfilePictureSchema)
def upload_profile_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    filename = f"{user_id}_{file.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/profile_pics/{filename}"

    # Remove old profile picture if it exists
    existing_pic = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    if existing_pic:
        existing_pic.image_url = image_url
    else:
        new_pic = ProfilePicture(user_id=user_id, image_url=image_url)
        db.add(new_pic)

    db.commit()

    return db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()


@router.delete("/profile-picture/{user_id}")
def delete_profile_picture(user_id: int, db: Session = Depends(get_db)):
    pic = db.query(ProfilePicture).filter(ProfilePicture.user_id == user_id).first()
    if not pic:
        raise HTTPException(status_code=404, detail="Profile picture not found")

    db.delete(pic)
    db.commit()
    return {"message": "Profile picture deleted"}

