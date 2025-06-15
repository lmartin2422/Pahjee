# routers/messages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services import message_service
from schemas import MessageCreate, MessageResponse
from typing import List

router = APIRouter(
    prefix="/messages",
    tags=["Messages"]
)

@router.post("/send", response_model=MessageResponse)
def send_message(data: MessageCreate, db: Session = Depends(get_db)):
    return message_service.send_message(db, data.sender_id, data.recipient_id, data.content)

@router.get("/{user_id}", response_model=List[MessageResponse])
def get_messages(user_id: int, db: Session = Depends(get_db)):
    return message_service.get_user_messages(db, user_id)
