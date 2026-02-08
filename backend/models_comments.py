from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class Comment(Base):
    """Comment model for ticket discussions"""
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    is_internal = Column(Integer, default=0)  # 0=public, 1=internal (manager only)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="comments")
    user = relationship("User", back_populates="comments")


# Update existing models to add relationships
def add_comment_relationships():
    """
    Add this to existing models:
    
    In Ticket model:
        comments = relationship("Comment", back_populates="ticket", cascade="all, delete-orphan")
    
    In User model:
        comments = relationship("Comment", back_populates="user")
    """
    pass
