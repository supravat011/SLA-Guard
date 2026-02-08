from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Comment, Ticket, User, UserRole
from auth import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])


# Pydantic schemas (inline for now)
from pydantic import BaseModel
from datetime import datetime

class CommentCreate(BaseModel):
    ticket_id: int
    content: str
    is_internal: bool = False

class CommentResponse(BaseModel):
    id: int
    ticket_id: int
    user_id: int
    user_name: str
    content: str
    is_internal: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


def enrich_comment_response(comment: Comment) -> dict:
    """Enrich comment with user name"""
    return {
        **comment.__dict__,
        "user_name": comment.user.name if comment.user else "Unknown"
    }


@router.post("/", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
def create_comment(
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new comment on a ticket
    """
    # Check if ticket exists
    ticket = db.query(Ticket).filter(Ticket.id == comment_data.ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check access (technicians can only comment on their assigned tickets)
    if current_user.role == UserRole.TECHNICIAN and ticket.assignee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Only managers can create internal comments
    if comment_data.is_internal and current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can create internal comments"
        )
    
    # Create comment
    new_comment = Comment(
        ticket_id=comment_data.ticket_id,
        user_id=current_user.id,
        content=comment_data.content,
        is_internal=comment_data.is_internal
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    return enrich_comment_response(new_comment)


@router.get("/ticket/{ticket_id}", response_model=List[CommentResponse])
def get_ticket_comments(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all comments for a ticket
    Technicians see only public comments, Managers see all
    """
    # Check if ticket exists
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Check access
    if current_user.role == UserRole.TECHNICIAN and ticket.assignee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    # Get comments
    query = db.query(Comment).filter(Comment.ticket_id == ticket_id)
    
    # Filter internal comments for technicians
    if current_user.role == UserRole.TECHNICIAN:
        query = query.filter(Comment.is_internal == False)
    
    comments = query.order_by(Comment.created_at.asc()).all()
    
    return [enrich_comment_response(comment) for comment in comments]


@router.put("/{comment_id}", response_model=CommentResponse)
def update_comment(
    comment_id: int,
    content: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a comment (only by the author)
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Only the author can edit their comment
    if comment.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own comments"
        )
    
    comment.content = content
    db.commit()
    db.refresh(comment)
    
    return enrich_comment_response(comment)


@router.delete("/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a comment (only by the author or managers)
    """
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # Only the author or managers can delete
    if comment.user_id != current_user.id and current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied"
        )
    
    db.delete(comment)
    db.commit()
    
    return None
