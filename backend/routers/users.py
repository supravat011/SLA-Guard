from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from database import get_db
from models import User, UserRole, Ticket, TicketStatus, TicketPriority
from schemas import UserResponse, TicketResponse
from auth import get_current_user
from services.sla_engine import (
    get_sla_limit_for_priority,
    calculate_elapsed_hours,
    calculate_risk_percentage,
    determine_risk_level
)
from services.escalation import create_activity_log

router = APIRouter(prefix="/users", tags=["users"])


# Schema for user ticket creation
class UserTicketCreate(BaseModel):
    title: str
    description: str = ""
    priority: str = "MEDIUM"


def enrich_ticket_response(ticket: Ticket) -> dict:
    """Enrich ticket with calculated fields"""
    elapsed_hours = calculate_elapsed_hours(ticket.created_at)
    risk_percentage = calculate_risk_percentage(elapsed_hours, ticket.sla_limit_hours)
    
    return {
        **ticket.__dict__,
        "time_elapsed_hours": elapsed_hours,
        "risk_percentage": risk_percentage,
        "assignee_name": ticket.assignee.name if ticket.assignee else "Unassigned",
        "creator_name": ticket.creator.name if ticket.creator else "Unknown"
    }


@router.get("", response_model=List[UserResponse])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all users (for managers to see technicians, etc.)
    """
    print(f"DEBUG [get_all_users]: User {current_user.email} (ID: {current_user.id}, Role: {current_user.role})")
    
    # Manual role check with better debugging
    if current_user.role != UserRole.MANAGER:
        print(f"DEBUG [get_all_users]: ACCESS DENIED - User role is {current_user.role}, expected {UserRole.MANAGER}")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Only managers can view all users. Your role: {current_user.role}"
        )
    
    print(f"DEBUG [get_all_users]: ACCESS GRANTED - Fetching all users")
    users = db.query(User).all()
    print(f"DEBUG [get_all_users]: Returning {len(users)} users")
    return users


@router.post("/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_user_ticket(
    ticket_data: UserTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new ticket as a user
    """
    # Convert priority string to enum
    try:
        priority_enum = TicketPriority[ticket_data.priority.upper()]
    except KeyError:
        priority_enum = TicketPriority.MEDIUM
    
    # Get SLA limit for priority
    sla_limit = get_sla_limit_for_priority(db, priority_enum.value)
    
    # Create ticket with user's name as customer
    new_ticket = Ticket(
        title=ticket_data.title,
        customer=current_user.name,
        description=ticket_data.description,
        priority=priority_enum,
        created_by_user_id=current_user.id,
        sla_limit_hours=sla_limit,
        assignee_id=None  # Users cannot assign tickets
    )
    
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)
    
    # Create activity log
    create_activity_log(
        db,
        new_ticket.id,
        "CREATED",
        current_user.id,
        f"Ticket created by {current_user.name}"
    )
    
    return enrich_ticket_response(new_ticket)


@router.get("/tickets/my-tickets", response_model=List[TicketResponse])
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tickets created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/active", response_model=List[TicketResponse])
def get_active_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get active tickets (OPEN or IN_PROGRESS) created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS])
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/high-priority", response_model=List[TicketResponse])
def get_high_priority_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get high priority tickets (HIGH or CRITICAL) created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.priority.in_([TicketPriority.HIGH, TicketPriority.CRITICAL])
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/breached", response_model=List[TicketResponse])
def get_breached_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get SLA breached tickets created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id
    ).all()
    
    # Filter by risk percentage >= 100
    breached = []
    for ticket in tickets:
        elapsed_hours = calculate_elapsed_hours(ticket.created_at)
        risk_percentage = calculate_risk_percentage(elapsed_hours, ticket.sla_limit_hours)
        if risk_percentage >= 100:
            breached.append(ticket)
    
    return [enrich_ticket_response(ticket) for ticket in breached]
