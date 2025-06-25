# services/message_service.py
from sqlalchemy.orm import Session
from models import Message
from schemas import MessageCreate

def send_message(db: Session, sender_id: int, recipient_id: int, content: str):
    message = Message(
        sender_id=sender_id,
        recipient_id=recipient_id,
        content=content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message

def get_user_messages(db: Session, user_id: int):
    return db.query(Message).filter(
        (Message.sender_id == user_id) | (Message.recipient_id == user_id)
    ).order_by(Message.sent_at.desc()).all()


def get_conversation(db: Session, sender_id: int, recipient_id: int):
    return message_service.get_conversation(db, sender_id, recipient_id)


