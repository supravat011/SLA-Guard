"""
Activity log endpoints for viewing ticket history
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import ActivityLog, Ticket, User
from auth import get_current_user
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/tickets", tags=["Activity Logs"])


class ActivityLogResponse(BaseModel):
    id: int
    ticket_id: int
    user_id: int | None
    user_name: str | None
    action: str
    details: str | None
    created_at: datetime
    
    class Config:
        from_attributes = True


def enrich_activity_log(log: ActivityLog) -> dict:
    """Enrich activity log with user name"""
    return {
        **log.__dict__,
        "user_name": log.user.name if log.user else "System",
        "created_at": log.timestamp
    }


@router.get("/{ticket_id}/activity", response_model=List[ActivityLogResponse])
def get_ticket_activity_logs(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all activity logs for a ticket
    """
    # Check if ticket exists
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Get activity logs
    logs = db.query(ActivityLog).filter(
        ActivityLog.ticket_id == ticket_id
    ).order_by(ActivityLog.timestamp.desc()).all()
    
    return [enrich_activity_log(log) for log in logs]
