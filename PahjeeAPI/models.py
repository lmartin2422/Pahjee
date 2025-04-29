from sqlalchemy import Column, Integer, Text, String, Date, TIMESTAMP, func
from sqlalchemy.ext.declarative import declarative_base
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








# from sqlalchemy import Column, Integer, String
# from database import Base

# class User(Base):
#     __tablename__ ="users"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String, unique=True, nullable=False)
#     email = Column(String, unique=True, nullable=False)
#     password_hash = Column(String, nullable=False)


    """
    In models.py, define the User table:
    """