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

    # Relationships
    pictures = relationship("Picture", back_populates="user", cascade="all, delete")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys='Message.sender_id', cascade="all, delete")
    received_messages = relationship("Message", back_populates="recipient", foreign_keys='Message.recipient_id', cascade="all, delete")
    favorites = relationship("Favorite", back_populates="user", cascade="all, delete")
    favorited_by = relationship("Favorite", back_populates="favorite_user", foreign_keys='Favorite.favorite_user_id')



class Picture(Base):
    __tablename__ = "pictures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    is_profile_picture = Column(Boolean, default=False)

    user = relationship("User", back_populates="pictures")

# In your existing User model:
# 

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    recipient_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    content = Column(Text, nullable=False)
    timestamp = Column(TIMESTAMP, server_default=func.now())

    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="received_messages", foreign_keys=[recipient_id])


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    favorite_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    user = relationship("User", back_populates="favorites", foreign_keys=[user_id])
    favorite_user = relationship("User", back_populates="favorited_by", foreign_keys=[favorite_user_id])




class SearchPreference(Base):
    __tablename__ = "search_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    preferred_gender = Column(String, nullable=True)
    preferred_location = Column(String, nullable=True)
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)

    user = relationship("User", backref="search_preferences")






"""
In models.py, define the User table:
"""