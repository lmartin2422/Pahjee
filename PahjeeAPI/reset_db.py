from database import engine
from models import Base

# Drop all tables
Base.metadata.drop_all(bind=engine)
print("✅ All tables dropped.")

# Recreate tables
Base.metadata.create_all(bind=engine)
print("✅ All tables created.")
