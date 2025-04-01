from fastapi import FastAPI
from pydantic import BaseModel


app = FastAPI()


# Define a Pydantic model for user data validation
class User(BaseModel):
    username: str
    email: str
    password: str


@app.get("/")
def read_root():
    return {"message": "Welcome to Pahjee API"}


# POST request for user registration
@app.post("/register")
async def register_user(user: User):
    return {
        "message": "User registered successfully!",
        "user": user.dict()  # Returns the sent data as a response
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)






























"""
When restarting the API & virtual environment, run in terminal: 

from this folder: 
Desktop\Pahjee\Pahjee\PahjeeAPI

run:
PahjeeAPI-env\Scripts\Activate.ps1

then:
uvicorn main:app --reload

if error, run:
pip install uvicorn
pip install fastapi
uvicorn main:app --reload

"""