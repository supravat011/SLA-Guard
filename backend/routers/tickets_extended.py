"""
Additional ticket endpoints for escalation, reassignment, and senior technician workflows
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import Ticket, User, UserRole, TicketStatus
from schemas import TicketResponse
from auth import get_current_user
from services.escalation import escalate_ticket, reassign_ticket, create_activity_log
from services.sla_engine import calculate_elapsed_hours, calculate_risk_percentage

router = APIRouter(prefix="/tickets", tags=["Tickets - Extended"])


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


@router.post("/{ticket_id}/escalate", response_model=TicketResponse)
def escalate_ticket_endpoint(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Escalate a ticket to senior technician (Manager only)
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can escalate tickets"
        )
    
    try:
        # Auto-assign to available senior technician
        ticket = escalate_ticket(
            db,
            ticket_id,
            reason="High-risk ticket requiring senior expertise",
            escalated_by_user_id=current_user.id
        )
        return enrich_ticket_response(ticket)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{ticket_id}/reassign", response_model=TicketResponse)
def reassign_ticket_endpoint(
    ticket_id: int,
    new_assignee_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Reassign a ticket to a different technician (Manager only)
    """
    if current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers can reassign tickets"
        )
    
    try:
        ticket = reassign_ticket(
            db,
            ticket_id,
            new_assignee_id,
            current_user.id,
            reason="Workload balancing"
        )
        return enrich_ticket_response(ticket)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/{ticket_id}/accept", response_model=TicketResponse)
def accept_ticket(
    ticket_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Accept an assigned ticket (Technician/Senior Technician only)
    """
    if current_user.role not in [UserRole.TECHNICIAN, UserRole.SENIOR_TECHNICIAN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only technicians can accept tickets"
        )
    
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    if ticket.assignee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only accept tickets assigned to you"
        )
    
    # Update status to IN_PROGRESS
    ticket.status = TicketStatus.IN_PROGRESS
    db.commit()
    db.refresh(ticket)
    
    # Create activity log
    create_activity_log(
        db,
        ticket.id,
        "ACCEPTED",
        current_user.id,
        f"Ticket accepted by {current_user.name}"
    )
    
    return enrich_ticket_response(ticket)


@router.get("/escalated", response_model=List[TicketResponse])
def get_escalated_tickets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all escalated tickets (Senior Technician sees their assigned, Manager sees all)
    """
    query = db.query(Ticket).filter(Ticket.status == TicketStatus.ESCALATED)
    
    # Filter by role
    if current_user.role == UserRole.SENIOR_TECHNICIAN:
        query = query.filter(Ticket.assignee_id == current_user.id)
    elif current_user.role != UserRole.MANAGER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only managers and senior technicians can view escalated tickets"
        )
    
    tickets = query.order_by(Ticket.created_at.desc()).all()
    
    return [enrich_ticket_response(ticket) for ticket in tickets]


@router.post("/{ticket_id}/update-progress", response_model=TicketResponse)
def update_ticket_progress(
    ticket_id: int,
    notes: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update ticket progress with activity notes (Technician/Senior Technician only)
    """
    if current_user.role not in [UserRole.TECHNICIAN, UserRole.SENIOR_TECHNICIAN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only technicians can update ticket progress"
        )
    
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found"
        )
    
    if ticket.assignee_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update tickets assigned to you"
        )
    
    # Create activity log
    create_activity_log(
        db,
        ticket.id,
        "PROGRESS_UPDATE",
        current_user.id,
        notes
    )
    
    return enrich_ticket_response(ticket)
