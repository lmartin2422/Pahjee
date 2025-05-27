from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session
import shutil
import uuid
import os

import models
import schemas
import database
from models import Picture, User

from dependencies import get_current_user  # adjust based on your setup

router = APIRouter()

UPLOAD_DIR = "uploads/"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/users/{user_id}/upload-picture", response_model=schemas.Picture)
def upload_picture(user_id: int, file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid image format")

    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    image_url = f"/static/{filename}"  # or full URL if using a domain

    new_pic = models.Picture(user_id=user_id, image_url=image_url)
    db.add(new_pic)
    db.commit()
    db.refresh(new_pic)

    return new_pic
