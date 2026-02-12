from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Ticket, User, UserRole, TicketStatus, RiskLevel
from schemas import AnalyticsOverview, RiskDistribution, TechnicianWorkload
from auth import get_current_user, require_manager
from typing import List

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/overview", response_model=AnalyticsOverview)
def get_analytics_overview(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get dashboard analytics overview
    """
    # Total tickets
    total_tickets = db.query(Ticket).count()
    
    # High risk tickets
    high_risk_tickets = db.query(Ticket).filter(
        Ticket.risk_level.in_([RiskLevel.HIGH_RISK, RiskLevel.BREACHED]),
        Ticket.status != TicketStatus.RESOLVED
    ).count()
    
    # Breached tickets
    breached_tickets = db.query(Ticket).filter(
        Ticket.risk_level == RiskLevel.BREACHED
    ).count()
    
    # Average resolution time (for resolved tickets)
    resolved_tickets = db.query(Ticket).filter(
        Ticket.status == TicketStatus.RESOLVED,
        Ticket.resolved_at.isnot(None)
    ).all()
    
    if resolved_tickets:
        total_hours = sum([
            (ticket.resolved_at - ticket.created_at).total_seconds() / 3600
            for ticket in resolved_tickets
        ])
        avg_resolution_hours = total_hours / len(resolved_tickets)
    else:
        avg_resolution_hours = 0.0
    
    # Status counts
    open_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.OPEN).count()
    in_progress_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.IN_PROGRESS).count()
    resolved_tickets_count = db.query(Ticket).filter(Ticket.status == TicketStatus.RESOLVED).count()
    escalated_tickets = db.query(Ticket).filter(Ticket.status == TicketStatus.ESCALATED).count()
    
    return AnalyticsOverview(
        total_tickets=total_tickets,
        high_risk_tickets=high_risk_tickets,
        breached_tickets=breached_tickets,
        avg_resolution_hours=round(avg_resolution_hours, 2),
        open_tickets=open_tickets,
        in_progress_tickets=in_progress_tickets,
        resolved_tickets=resolved_tickets_count,
        escalated_tickets=escalated_tickets
    )


@router.get("/risk-distribution", response_model=RiskDistribution)
def get_risk_distribution(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get distribution of tickets by risk level
    """
    safe = db.query(Ticket).filter(Ticket.risk_level == RiskLevel.SAFE).count()
    warning = db.query(Ticket).filter(Ticket.risk_level == RiskLevel.WARNING).count()
    high_risk = db.query(Ticket).filter(Ticket.risk_level == RiskLevel.HIGH_RISK).count()
    breached = db.query(Ticket).filter(Ticket.risk_level == RiskLevel.BREACHED).count()
    
    return RiskDistribution(
        safe=safe,
        warning=warning,
        high_risk=high_risk,
        breached=breached
    )


@router.get("/technician-workload", response_model=List[TechnicianWorkload])
def get_technician_workload(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get workload summary for all technicians (Manager only)
    """
    # Manual role check with better debugging
    if current_user.role != UserRole.MANAGER:
        print(f"DEBUG: User {current_user.email} (role: {current_user.role}) attempted to access technician-workload")
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Access denied. Manager role required. Your role: {current_user.role}"
        )
    
    # Get both technicians and senior technicians
    technicians = db.query(User).filter(
        User.role.in_([UserRole.TECHNICIAN, UserRole.SENIOR_TECHNICIAN])
    ).all()
    
    workload_data = []
    for tech in technicians:
        assigned_tickets = db.query(Ticket).filter(
            Ticket.assignee_id == tech.id,
            Ticket.status != TicketStatus.RESOLVED
        ).count()
        
        high_risk_tickets = db.query(Ticket).filter(
            Ticket.assignee_id == tech.id,
            Ticket.risk_level.in_([RiskLevel.HIGH_RISK, RiskLevel.BREACHED]),
            Ticket.status != TicketStatus.RESOLVED
        ).count()
        
        workload_data.append(
            TechnicianWorkload(
                technician_id=tech.id,
                technician_name=tech.name,
                assigned_tickets=assigned_tickets,
                high_risk_tickets=high_risk_tickets,
                role=tech.role.value  # Add role field
            )
        )
    
    return workload_data
