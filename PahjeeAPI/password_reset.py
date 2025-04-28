import bcrypt
from sqlalchemy.orm import Session
from models import User
from database import SessionLocal

db = SessionLocal()

def create_user(username, email, plain_password, firstname, lastname):
    password_hash = bcrypt.hashpw(plain_password.encode('utf-8'), bcrypt.gensalt())
    user = User(
        username=username,
        email=email,
        password_hash=password_hash.decode('utf-8'),
        firstname=firstname,
        lastname=lastname,
        # other fields can be added here too
    )
    return user

# Create your 5 users
users = [
    create_user("user1", "user1@example.com", "password1", "First1", "Last1"),
    create_user("user2", "user2@example.com", "password2", "First2", "Last2"),
    create_user("user3", "user3@example.com", "password3", "First3", "Last3"),
    create_user("user4", "user4@example.com", "password4", "First4", "Last4"),
    create_user("user5", "user5@example.com", "password5", "First5", "Last5"),
]

db.add_all(users)
db.commit()

print("5 users created with hashed passwords.")
db.close()





#DELETE ALL USERS
# from sqlalchemy.orm import Session
# from models import User  # or wherever your User model is
# from database import SessionLocal  # or however you get your DB session

# db = SessionLocal()

# # Delete all users
# db.query(User).delete()
# db.commit()

# print("All users deleted.")
# db.close()





#PASSWORD RESET
# import bcrypt
# from sqlalchemy.orm import Session
# import models
# import database  # Your database.py that has SessionLocal

# # Start a session
# db = database.SessionLocal()

# # New password in plain text
# new_plain_password = "password1"

# # Generate a bcrypt hash
# new_hashed_password = bcrypt.hashpw(new_plain_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# # Fetch all users
# users = db.query(models.User).all()

# # Update each user's password
# for user in users:
#     user.password_hash = new_hashed_password

# # Commit changes
# db.commit()

# # Close session
# db.close()

# print("✅ All passwords successfully reset to hashed 'password1'.")
