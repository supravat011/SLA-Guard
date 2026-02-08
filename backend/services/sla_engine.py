from datetime import datetime
from sqlalchemy.orm import Session
from models import Ticket, SLAConfig, RiskLevel, TicketStatus
from typing import List


def calculate_elapsed_hours(created_at: datetime) -> float:
    """Calculate elapsed hours since ticket creation"""
    now = datetime.utcnow()
    delta = now - created_at
    return delta.total_seconds() / 3600


def calculate_risk_percentage(elapsed_hours: float, sla_limit_hours: float) -> float:
    """Calculate SLA risk percentage"""
    if sla_limit_hours == 0:
        return 100.0
    return min((elapsed_hours / sla_limit_hours) * 100, 100.0)


def determine_risk_level(risk_percentage: float) -> RiskLevel:
    """Determine risk level based on percentage"""
    if risk_percentage >= 100:
        return RiskLevel.BREACHED
    elif risk_percentage >= 75:
        return RiskLevel.HIGH_RISK
    elif risk_percentage >= 50:
        return RiskLevel.WARNING
    else:
        return RiskLevel.SAFE


def get_sla_limit_for_priority(db: Session, priority: str) -> float:
    """Get SLA limit hours for a given priority"""
    config = db.query(SLAConfig).filter(SLAConfig.priority == priority).first()
    if config:
        return config.sla_hours
    
    # Default fallback values
    defaults = {
        "CRITICAL": 4,
        "HIGH": 8,
        "MEDIUM": 24,
        "LOW": 48
    }
    return defaults.get(priority, 24)


def update_ticket_sla_status(db: Session, ticket: Ticket) -> dict:
    """
    Update a single ticket's SLA status
    Returns dict with updated values
    """
    # Skip resolved tickets
    if ticket.status == TicketStatus.RESOLVED:
        return {
            "ticket_id": ticket.id,
            "elapsed_hours": 0,
            "risk_percentage": 0,
            "risk_level": RiskLevel.SAFE,
            "updated": False
        }
    
    # Calculate current metrics
    elapsed_hours = calculate_elapsed_hours(ticket.created_at)
    risk_percentage = calculate_risk_percentage(elapsed_hours, ticket.sla_limit_hours)
    new_risk_level = determine_risk_level(risk_percentage)
    
    # Check if risk level changed
    risk_changed = ticket.risk_level != new_risk_level
    previous_risk = ticket.risk_level
    
    # Update ticket
    ticket.risk_level = new_risk_level
    
    # Notify managers if ticket just entered high-risk or breached status
    if risk_changed and new_risk_level in [RiskLevel.HIGH_RISK, RiskLevel.BREACHED]:
        from services.escalation import notify_managers_high_risk
        notify_managers_high_risk(db, ticket)
    
    return {
        "ticket_id": ticket.id,
        "elapsed_hours": elapsed_hours,
        "risk_percentage": risk_percentage,
        "risk_level": new_risk_level,
        "updated": risk_changed,
        "previous_risk": previous_risk if risk_changed else None
    }


def monitor_all_tickets(db: Session) -> List[dict]:
    """
    Monitor all active tickets and update their SLA status
    Returns list of update results
    """
    # Get all non-resolved tickets
    active_tickets = db.query(Ticket).filter(
        Ticket.status != TicketStatus.RESOLVED
    ).all()
    
    results = []
    for ticket in active_tickets:
        result = update_ticket_sla_status(db, ticket)
        results.append(result)
    
    db.commit()
    return results


def get_high_risk_tickets(db: Session) -> List[Ticket]:
    """Get all tickets with high risk or breached status"""
    return db.query(Ticket).filter(
        Ticket.risk_level.in_([RiskLevel.HIGH_RISK, RiskLevel.BREACHED]),
        Ticket.status != TicketStatus.RESOLVED
    ).all()


def get_tickets_needing_escalation(db: Session) -> List[Ticket]:
    """Get tickets that need escalation (high risk but not yet escalated)"""
    return db.query(Ticket).filter(
        Ticket.risk_level.in_([RiskLevel.HIGH_RISK, RiskLevel.BREACHED]),
        Ticket.status != TicketStatus.ESCALATED,
        Ticket.status != TicketStatus.RESOLVED
    ).all()
