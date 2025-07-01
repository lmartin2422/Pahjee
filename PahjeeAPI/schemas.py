from pydantic import BaseModel, EmailStr # type: ignore 
from typing import Optional, List  # ✅ Add List here
from datetime import date, datetime


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
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    gender: Optional[str] = None
    birthdate: Optional[date] = None
    lookingfor: Optional[str] = None
    sexualorientation: Optional[str] = None
    professionindustry: Optional[str] = None


class UserSearch(BaseModel):
    location: Optional[str] = None
    gender: Optional[str] = None
    lookingfor: Optional[str] = None
    sexualorientation: Optional[str] = None
    min_age: Optional[int] = None
    max_age: Optional[int] = None


class SearchFilters(BaseModel):
    gender: Optional[List[str]] = []
    lookingfor: Optional[List[str]] = []
    location: Optional[List[str]] = []
    sexualorientation: Optional[List[str]] = []
    professionindustry: Optional[List[str]] = []
    min_age: Optional[int] = None
    max_age: Optional[int] = None


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


class ProfilePictureBase(BaseModel):
    image_url: str

class ProfilePictureCreate(ProfilePictureBase):
    user_id: int

class ProfilePicture(ProfilePictureBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True



class MessageCreate(BaseModel):
    sender_id: int
    recipient_id: int
    content: str


class MessageResponse(BaseModel):
    id: int
    sender_id: int
    recipient_id: int
    content: str
    sent_at: datetime

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



class FavoriteUser(BaseModel):
    id: int
    username: str

    class Config:
        from_attributes = True  # Pydantic v2







"""
In schemas.py, create data validation schemas:
"""