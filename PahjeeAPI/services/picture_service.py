from sqlalchemy.orm import Session
from fastapi import UploadFile
from models import Picture
import os
from datetime import datetime
import re

UPLOAD_FOLDER = "static/uploads"

def secure_filename(filename: str) -> str:
    return re.sub(r'[^a-zA-Z0-9_.-]', '_', filename)

def save_pictures(user_id: int, files: list[UploadFile], profile_pic_filename: str | None, db: Session):
    saved_pictures = []

    for file in files:
        timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S%f")
        safe_name = secure_filename(file.filename)
        filename = f"{user_id}_{timestamp}_{safe_name}"
        file_path = os.path.join(UPLOAD_FOLDER, filename)

        os.makedirs(UPLOAD_FOLDER, exist_ok=True)

        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())

        # Save as relative path, not full URL
        relative_url = f"/static/uploads/{filename}"

        new_pic = Picture(
            user_id=user_id,
            image_url=relative_url,  # ✅ relative URL
            is_profile_pic=(filename == profile_pic_filename)
        )
        db.add(new_pic)
        saved_pictures.append(new_pic)

    db.commit()
    return saved_pictures

def get_user_pictures(user_id: int, db: Session):
    return db.query(Picture).filter(Picture.user_id == user_id).all()


def set_profile_picture(user_id: int, picture_id: int, db: Session):
    db.query(Picture).filter(Picture.user_id == user_id).update({"is_profile_pic": False})
    picture = db.query(Picture).filter_by(id=picture_id, user_id=user_id).first()
    if picture:
        picture.is_profile_pic = True
        db.commit()
        db.refresh(picture)
    return picture

def delete_picture(user_id: int, picture_id: int, db: Session):
    picture = db.query(Picture).filter_by(id=picture_id, user_id=user_id).first()
    if picture:
        file_path = picture.image_url.lstrip("/")  # Remove leading slash to match actual path
        if os.path.exists(file_path):
            os.remove(file_path)

        db.delete(picture)
        db.commit()
        return {"message": "Picture deleted"}
    return {"error": "Picture not found"}
