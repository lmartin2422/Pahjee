from sqlalchemy import ( Column, DateTime, Integer, String, Text, Boolean, Date, TIMESTAMP, ForeignKey)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import ARRAY  # Add the ARRAY import


from datetime import datetime  # Add this import at the top

from database import Base


Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)

    firstname = Column(String, nullable=True)
    lastname = Column(String, nullable=True)
    location = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    birthdate = Column(Date, nullable=True)
    lookingfor = Column(String, nullable=True)
    sexualorientation = Column(String, nullable=True)


    professionindustry = Column(String, nullable=True)  # Make sure it's a String here

    created_at = Column(TIMESTAMP, default=datetime.utcnow)

    # Relationships
    pictures = relationship("Picture", back_populates="user", cascade="all, delete")
    sent_messages = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id", cascade="all, delete")
    received_messages = relationship("Message", back_populates="recipient", foreign_keys="Message.recipient_id", cascade="all, delete")
    search_preferences = relationship("SearchPreference", back_populates="user", cascade="all, delete")

    favorites_sent = relationship("Favorite", foreign_keys="[Favorite.user_id]", back_populates="user")
    favorites_received = relationship("Favorite", foreign_keys="[Favorite.favorite_user_id]", back_populates="favorite_user")

    profile_picture = relationship("ProfilePicture", back_populates="user", uselist=False)

    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"


class Favorite(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    favorite_user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(TIMESTAMP, server_default=func.now())

    # RELATIONSHIPS
    user = relationship("User", foreign_keys=[user_id], back_populates="favorites_sent")
    favorite_user = relationship("User", foreign_keys=[favorite_user_id], back_populates="favorites_received")

    def __repr__(self):
        return f"<Favorite(id={self.id}, user_id={self.user_id}, favorite_user_id={self.favorite_user_id})>"


class Picture(Base):
    __tablename__ = "pictures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    image_url = Column(String, nullable=False)
    is_profile_pic = Column(Boolean, default=False)

    user = relationship("User", back_populates="pictures")

    def __repr__(self):
        return f"<Picture(id={self.id}, user_id={self.user_id}, image_url='{self.image_url}', is_profile_pic={self.is_profile_pic})>"


class Message(Base):
    __tablename__ = "messages"



    id = Column(Integer, primary_key=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id"))
    recipient_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)
    sent_at = Column(DateTime, default=datetime.utcnow)
    is_read = Column(Boolean, default=False)
    deleted_by_sender = Column(Boolean, default=False)
    deleted_by_recipient = Column(Boolean, default=False)
    
    sender = relationship("User", back_populates="sent_messages", foreign_keys=[sender_id])
    recipient = relationship("User", back_populates="received_messages", foreign_keys=[recipient_id])

    def __repr__(self):
        return f"<Message(id={self.id}, sender_id={self.sender_id}, recipient_id={self.recipient_id})>"


class SearchPreference(Base):
    __tablename__ = "search_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    preferred_gender = Column(String, nullable=True)
    preferred_location = Column(String, nullable=True)
    min_age = Column(Integer, nullable=True)
    max_age = Column(Integer, nullable=True)

    user = relationship("User", back_populates="search_preferences")

    def __repr__(self):
        return (f"<SearchPreference(id={self.id}, user_id={self.user_id}, "
                f"preferred_gender='{self.preferred_gender}', preferred_location='{self.preferred_location}', "
                f"min_age={self.min_age}, max_age={self.max_age})>")
    

class ProfilePicture(Base):
    __tablename__ = "profile_pictures"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(String, nullable=False)

    user = relationship("User", back_populates="profile_picture")