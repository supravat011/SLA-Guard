from pydantic import BaseModel, EmailStr
from typing import Optional
from models import TicketPriority


class UserTicketCreate(BaseModel):
    """Simplified schema for users raising tickets"""
    title: str
    description: Optional[str] = None
    priority: TicketPriority


class TicketAssign(BaseModel):
    """Schema for assigning tickets"""
    assignee_id: int


class TicketEscalate(BaseModel):
    """Schema for escalating tickets"""
    reason: str
    senior_technician_id: Optional[int] = None  # If None, auto-assign to available senior


class TicketUpdateProgress(BaseModel):
    """Schema for technicians updating ticket progress"""
    notes: str
    status: Optional[str] = None  # OPEN, IN_PROGRESS, RESOLVED
