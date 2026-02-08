from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import String
from typing import List, Optional
from datetime import datetime
from database import get_db
from models import Ticket, User, UserRole, TicketStatus
from schemas import TicketCreate, TicketUpdate, TicketResponse
from auth import get_current_user
from services.sla_engine import (
    get_sla_limit_for_priority, 
    calculate_elapsed_hours, 
    calculate_risk_percentage,
    determine_risk_level,
    get_high_risk_tickets
)
from services.escalation import create_activity_log, notify_assignee

router = APIRouter(prefix="/tickets", tags=["Tickets"])


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


@router.post("/", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_ticket(
    ticket_data: TicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new ticket
    """
    # Get SLA limit for priority
    sla_limit = get_sla_limit_for_priority(db, ticket_data.priority.value)
    
    # Create ticket
    new_ticket = Ticket(
        title=ticket_data.title,
        customer=ticket_data.customer,
        description=ticket_data.description,
        priority=ticket_data.priority,
        assignee_id=ticket_data.assignee_id,
        created_by_user_id=current_user.id,
        sla_limit_hours=sla_limit
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
    
    # Notify assignee if assigned
    if ticket_data.assignee_id:
        notify_assignee(
            db,
            new_ticket,
            f"New ticket assigned: {new_ticket.title}"
        )
    
    return enrich_ticket_response(new_ticket)


@router.get("/search", response_model=List[TicketResponse])
def search_tickets(
    q: Optional[str] = None,
    status: Optional[TicketStatus] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[int] = None,
    customer: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Advanced search for tickets
    - q: Search in title and customer
    - status: Filter by status
    - priority: Filter by priority
    - assignee_id: Filter by assignee
    - customer: Filter by customer name
    """
    query = db.query(Ticket)
    
    # Role-based filtering
    if current_user.role == UserRole.TECHNICIAN:
        query = query.filter(Ticket.assignee_id == current_user.id)
    
    # Search query
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            (Ticket.title.like(search_term)) | 
            (Ticket.customer.like(search_term)) |
            (Ticket.id.cast(String).like(search_term))
        )
    
    # Apply filters
    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if assignee_id:
        query = query.filter(Ticket.assignee_id == assignee_id)
    if customer:
        query = query.filter(Ticket.customer.like(f"%{customer}%"))
    
    tickets = query.order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/", response_model=List[TicketResponse])
def get_tickets(
    status: Optional[TicketStatus] = None,
    priority: Optional[str] = None,
    assignee_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all tickets (filtered by role)
    Managers see all tickets, Technicians see only their assigned tickets
    """
    query = db.query(Ticket)
    
    # Role-based filtering
    if current_user.role == UserRole.TECHNICIAN:
        query = query.filter(Ticket.assignee_id == current_user.id)
    elif current_user.role == UserRole.SENIOR_TECHNICIAN:
        query = query.filter(Ticket.assignee_id == current_user.id)
    elif current_user.role == UserRole.USER:
        query = query.filter(Ticket.created_by_user_id == current_user.id)
    
    # Apply filters
    if status:
        query = query.filter(Ticket.status == status)
    if priority:
        query = query.filter(Ticket.priority == priority)
    if assignee_id:
        query = query.filter(Ticket.assignee_id == assignee_id)
    
    tickets = query.order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/high-risk", response_model=List[TicketResponse])
def get_high_risk_tickets_endpoint(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all high-risk tickets
    """
    tickets = get_high_risk_tickets(db)
    
    # Filter by role
    if current_user.role == UserRole.TECHNICIAN:
        tickets = [t for t in tickets if t.assignee_id == current_user.id]
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/{ticket_id}", response_model=TicketResponse)
def get_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get a specific ticket by ID
    """
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
    
    return enrich_ticket_response(ticket)


@router.put("/{ticket_id}", response_model=TicketResponse)
def update_ticket(
    ticket_id: int,
    ticket_update: TicketUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update a ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Update fields
    update_data = ticket_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ticket, field, value)
    
    db.commit()
    db.refresh(ticket)
    
    # Create activity log
    create_activity_log(
        db,
        ticket.id,
        "UPDATED",
        current_user.id,
        f"Ticket updated by {current_user.name}"
    )
    
    return enrich_ticket_response(ticket)


@router.post("/{ticket_id}/resolve", response_model=TicketResponse)
def resolve_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark a ticket as resolved
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    # Update status
    ticket.status = TicketStatus.RESOLVED
    ticket.resolved_at = datetime.utcnow()
    
    db.commit()
    db.refresh(ticket)
    
    # Create activity log
    create_activity_log(
        db,
        ticket.id,
        "RESOLVED",
        current_user.id,
        f"Ticket resolved by {current_user.name}"
    )
    
    return enrich_ticket_response(ticket)


@router.delete("/{ticket_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete a ticket (Manager only)
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can delete tickets"
        )
    
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    db.delete(ticket)
    db.commit()
    
    return None
