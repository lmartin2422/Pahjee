from pydantic import BaseModel, EmailStr # type: ignore 
from typing import Optional
from datetime import date
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  # Will be hashed before storing
    
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    birthdate: Optional[date] = None
    lookingfor: Optional[str] = None
    sexualorientation: Optional[str] = None
    professionindustry: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    location: Optional[str]
    bio: Optional[str]
    gender: Optional[str]
    birthdate: Optional[date]
    lookingfor: Optional[str]
    sexualorientation: Optional[str]
    professionindustry: Optional[str]
    created_at: datetime


    class Config:
        from_attributes = True



class UserUpdate(BaseModel):
    # username: Optional[str] = None
    # email: Optional[EmailStr] = None
    # password: Optional[str] = None  # You might want to hash this again if it's changed
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    birthdate: Optional[date] = None
    lookingfor: Optional[str] = None
    sexualorientation: Optional[str] = None
    professionindustry: Optional[str] = None


class LoginRequest(BaseModel):
    username: str
    password: str


class PictureBase(BaseModel):
    image_url: str
    is_profile_picture: bool = False

class PictureCreate(PictureBase):
    pass

class Picture(PictureBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class MessageCreate(BaseModel):
    sender_id: int
    recipient_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True

class FavoriteCreate(BaseModel):
    user_id: int
    favorite_user_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    favorite_user_id: int

    class Config:
        from_attributes = True  # instead of orm_mode = True






"""
In schemas.py, create data validation schemas:
"""