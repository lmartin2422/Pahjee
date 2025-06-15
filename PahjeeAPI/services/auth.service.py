# services/auth_service.py
from sqlalchemy.orm import Session
from models import User
from passlib.context import CryptContext
from fastapi import HTTPException
from starlette.status import HTTP_401_UNAUTHORIZED

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def authenticate_user(db: Session, username: str, password: str):
    user = db.query(User).filter(User.username == username).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user
