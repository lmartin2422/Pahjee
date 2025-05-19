from sqlalchemy import Column, Integer, Text, String, Date, TIMESTAMP, Boolean, ForeignKey, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(Text, unique=True, nullable=False)
    email = Column(Text, unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
   
    firstname = Column(String, nullable=True)
    lastname = Column(String, nullable=True)
    profile_picture = Column(String, nullable=True)
    location = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    birthdate = Column(Date, nullable=True)
    lookingfor = Column(String, nullable=True)
    sexualorientation = Column(String, nullable=True)
    professionindustry = Column(String, nullable=True)
    created_at = Column(TIMESTAMP, server_default=func.now())


class Picture(Base):
    __tablename__ = "pictures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    is_profile_picture = Column(Boolean, default=False)

    user = relationship("User", back_populates="pictures")

# In your existing User model:
pictures = relationship("Picture", back_populates="user", cascade="all, delete")










"""
In models.py, define the User table:
"""