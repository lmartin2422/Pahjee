# routers/messages.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from services import message_service
from schemas import MessageCreate, MessageResponse
from typing import List
from models import Message
from sqlalchemy import func


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


@router.get("/{sender_id}/{recipient_id}")
def get_conversation(sender_id: int, recipient_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(
        ((Message.sender_id == sender_id) & (Message.recipient_id == recipient_id)) |
        ((Message.sender_id == recipient_id) & (Message.recipient_id == sender_id))
    ).order_by(Message.sent_at).all()
    
    return messages




@router.get("/threads/{user_id}", response_model=List[MessageResponse])
def get_message_threads(user_id: int, db: Session = Depends(get_db)):
    print(f"✅ THREADS route hit for user_id = {user_id}")
    # This will get the most recent message in each conversation (sent or received by this user)
    subquery = (
        db.query(
            Message.sender_id,
            Message.recipient_id,
            func.max(Message.sent_at).label("latest")

        )
        .filter((Message.sender_id == user_id) | (Message.recipient_id == user_id))
        .group_by(Message.sender_id, Message.recipient_id)
        .subquery()
    )

    # Join to get the full message content
    threads = (
        db.query(Message)
        .join(
            subquery,
            (Message.sender_id == subquery.c.sender_id) &
            (Message.recipient_id == subquery.c.recipient_id) &
            (Message.sent_at == subquery.c.latest)
        )
        .order_by(Message.sent_at.desc())
        .all()
    )

    return threads

