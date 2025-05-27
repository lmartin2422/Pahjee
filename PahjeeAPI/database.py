from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Database URL (Update with your actual database details)
DATABASE_URL = "postgresql://postgres:Giftcards1@localhost:5432/pahjeedb"


# Create the SQLAlchemy engine
engine = create_engine(DATABASE_URL)

# Session for database transactions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency that will be used in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
