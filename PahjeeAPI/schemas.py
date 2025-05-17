from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str  # Will be hashed before storing
    
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    profile_picture: Optional[str] = None
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
    profile_picture: Optional[str]
    location: Optional[str]
    bio: Optional[str]
    gender: Optional[str]
    birthdate: Optional[date]
    lookingfor: Optional[str]
    sexualorientation: Optional[str]
    professionindustry: Optional[str]
    created_at: datetime


class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None  # You might want to hash this again if it's changed
    firstname: Optional[str] = None
    lastname: Optional[str] = None
    profile_picture: Optional[str] = None
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

    class Config:
        orm_mode = True





"""
In schemas.py, create data validation schemas:
"""