from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import User, Ticket, UserRole, TicketStatus
from schemas import TicketResponse
from schemas_tickets import UserTicketCreate
from auth import get_current_user, require_role
from services.sla_engine import get_sla_limit_for_priority, calculate_elapsed_hours, calculate_risk_percentage, determine_risk_level
from services.escalation import create_activity_log, notify_user
from models import NotificationType

router = APIRouter(prefix="/users", tags=["Users"])


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


@router.post("/tickets", response_model=TicketResponse, status_code=status.HTTP_201_CREATED)
def create_user_ticket(
    ticket_data: UserTicketCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    User raises a new ticket
    Ticket is automatically sent to manager queue (unassigned)
    """
    # Get SLA limit for priority
    sla_limit = get_sla_limit_for_priority(db, ticket_data.priority.value)
    
    # Create ticket
    new_ticket = Ticket(
        title=ticket_data.title,
        customer=current_user.name,  # Use user's name as customer
        description=ticket_data.description,
        priority=ticket_data.priority,
        status=TicketStatus.OPEN,
        assignee_id=None,  # Unassigned, goes to manager queue
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
        f"Ticket created by user {current_user.name}"
    )
    
    # Notify all managers
    managers = db.query(User).filter(User.role == UserRole.MANAGER).all()
    for manager in managers:
        notify_user(
            db,
            manager.id,
            f"New ticket from {current_user.name}: {new_ticket.title}",
            NotificationType.INFO,
            new_ticket.id
        )
    
    return enrich_ticket_response(new_ticket)


@router.get("/tickets/my-tickets", response_model=List[TicketResponse])
def get_my_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    Get all tickets created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.status != TicketStatus.RESOLVED
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/closed", response_model=List[TicketResponse])
def get_closed_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    Get all closed/resolved tickets created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.status == TicketStatus.RESOLVED
    ).order_by(Ticket.resolved_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/active", response_model=List[TicketResponse])
def get_active_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    Get all active (open/in-progress) tickets created by the current user
    """
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS])
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/high-priority", response_model=List[TicketResponse])
def get_high_priority_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    Get all high priority tickets created by the current user
    """
    from models import TicketPriority
    
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.priority.in_([TicketPriority.HIGH, TicketPriority.CRITICAL]),
        Ticket.status != TicketStatus.RESOLVED
    ).order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.get("/tickets/breached", response_model=List[TicketResponse])
def get_breached_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.USER))
):
    """
    Get all SLA breached tickets created by the current user
    """
    from models import RiskLevel
    
    tickets = db.query(Ticket).filter(
        Ticket.created_by_user_id == current_user.id,
        Ticket.status != TicketStatus.RESOLVED
    ).all()
    
    # Filter for breached tickets
    breached_tickets = []
    for ticket in tickets:
        elapsed = calculate_elapsed_hours(ticket.created_at)
        if elapsed > ticket.sla_limit_hours:
            breached_tickets.append(ticket)
    
    return [enrich_ticket_response(ticket) for ticket in breached_tickets]
