from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Ticket, User, UserRole, TicketStatus, Notification, NotificationType, ActivityLog
from datetime import datetime
from typing import Optional


def create_activity_log(
    db: Session,
    ticket_id: int,
    action: str,
    user_id: Optional[int] = None,
    details: Optional[str] = None
):
    """Create an activity log entry for a ticket"""
    log = ActivityLog(
        ticket_id=ticket_id,
        user_id=user_id,
        action=action,
        details=details,
        timestamp=datetime.utcnow()
    )
    db.add(log)
    db.commit()
    return log


def notify_user(
    db: Session,
    user_id: int,
    message: str,
    notification_type: NotificationType = NotificationType.INFO,
    ticket_id: Optional[int] = None
):
    """Create a notification for a user"""
    notification = Notification(
        user_id=user_id,
        message=message,
        type=notification_type,
        ticket_id=ticket_id,
        read=False
    )
    db.add(notification)
    db.commit()
    return notification


def notify_assignee(db: Session, ticket: Ticket, message: str):
    """Notify the assignee of a ticket"""
    if ticket.assignee_id:
        notify_user(
            db,
            ticket.assignee_id,
            message,
            NotificationType.INFO,
            ticket.id
        )


def escalate_ticket(
    db: Session,
    ticket_id: int,
    reason: str,
    escalated_by_user_id: int,
    senior_technician_id: Optional[int] = None
) -> Ticket:
    """
    Escalate a ticket to a senior technician
    
    Args:
        db: Database session
        ticket_id: ID of ticket to escalate
        reason: Reason for escalation
        escalated_by_user_id: ID of user performing escalation (usually manager)
        senior_technician_id: Optional specific senior technician, otherwise auto-assign
    
    Returns:
        Updated ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")
    
    # Find available senior technician if not specified
    if not senior_technician_id:
        senior_technician_id = find_available_senior_technician(db)
        if not senior_technician_id:
            raise ValueError("No available senior technicians found")
    
    # Update ticket
    old_assignee_id = ticket.assignee_id
    ticket.status = TicketStatus.ESCALATED
    ticket.assignee_id = senior_technician_id
    
    db.commit()
    db.refresh(ticket)
    
    # Create activity log
    escalated_by = db.query(User).filter(User.id == escalated_by_user_id).first()
    create_activity_log(
        db,
        ticket.id,
        "ESCALATED",
        escalated_by_user_id,
        f"Escalated by {escalated_by.name if escalated_by else 'Unknown'}. Reason: {reason}"
    )
    
    # Notify senior technician
    senior = db.query(User).filter(User.id == senior_technician_id).first()
    if senior:
        notify_user(
            db,
            senior.id,
            f"🚨 Escalated ticket assigned: {ticket.title}. Reason: {reason}",
            NotificationType.ALERT,
            ticket.id
        )
    
    # Notify previous assignee if exists
    if old_assignee_id and old_assignee_id != senior_technician_id:
        notify_user(
            db,
            old_assignee_id,
            f"Ticket #{ticket.id} has been escalated to senior technician",
            NotificationType.INFO,
            ticket.id
        )
    
    return ticket


def find_available_senior_technician(db: Session) -> Optional[int]:
    """
    Find the senior technician with the lowest current workload
    
    Returns:
        User ID of available senior technician, or None if none found
    """
    # Get all senior technicians
    senior_techs = db.query(User).filter(User.role == UserRole.SENIOR_TECHNICIAN).all()
    
    if not senior_techs:
        return None
    
    # Calculate workload for each
    workloads = []
    for tech in senior_techs:
        workload = check_technician_workload(db, tech.id)
        workloads.append((tech.id, workload))
    
    # Sort by workload (ascending) and return the one with lowest workload
    workloads.sort(key=lambda x: x[1])
    return workloads[0][0]


def check_technician_workload(db: Session, technician_id: int) -> int:
    """
    Calculate the current workload of a technician
    
    Args:
        technician_id: ID of technician
    
    Returns:
        Number of open/in-progress tickets assigned to technician
    """
    count = db.query(Ticket).filter(
        Ticket.assignee_id == technician_id,
        Ticket.status.in_([TicketStatus.OPEN, TicketStatus.IN_PROGRESS, TicketStatus.ESCALATED])
    ).count()
    
    return count


def reassign_ticket(
    db: Session,
    ticket_id: int,
    new_assignee_id: int,
    reassigned_by_user_id: int,
    reason: Optional[str] = None
) -> Ticket:
    """
    Reassign a ticket to a different technician
    
    Args:
        db: Database session
        ticket_id: ID of ticket to reassign
        new_assignee_id: ID of new assignee
        reassigned_by_user_id: ID of user performing reassignment
        reason: Optional reason for reassignment
    
    Returns:
        Updated ticket
    """
    ticket = db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise ValueError(f"Ticket {ticket_id} not found")
    
    old_assignee_id = ticket.assignee_id
    ticket.assignee_id = new_assignee_id
    
    db.commit()
    db.refresh(ticket)
    
    # Create activity log
    reassigned_by = db.query(User).filter(User.id == reassigned_by_user_id).first()
    details = f"Reassigned by {reassigned_by.name if reassigned_by else 'Unknown'}"
    if reason:
        details += f". Reason: {reason}"
    
    create_activity_log(
        db,
        ticket.id,
        "REASSIGNED",
        reassigned_by_user_id,
        details
    )
    
    # Notify new assignee
    new_assignee = db.query(User).filter(User.id == new_assignee_id).first()
    if new_assignee:
        notify_user(
            db,
            new_assignee.id,
            f"Ticket assigned to you: {ticket.title}",
            NotificationType.INFO,
            ticket.id
        )
    
    # Notify old assignee if exists
    if old_assignee_id and old_assignee_id != new_assignee_id:
        notify_user(
            db,
            old_assignee_id,
            f"Ticket #{ticket.id} has been reassigned",
            NotificationType.INFO,
            ticket.id
        )
    
    return ticket


def auto_escalate_high_risk_tickets(db: Session) -> list:
    """
    Automatically escalate tickets that have reached high-risk threshold (75%+)
    and notify managers
    
    Returns:
        List of escalation results
    """
    from models import RiskLevel, TicketStatus
    from services.sla_engine import get_tickets_needing_escalation
    
    # Get tickets that need escalation (high risk but not yet escalated)
    tickets_to_escalate = get_tickets_needing_escalation(db)
    
    results = []
    
    for ticket in tickets_to_escalate:
        try:
            # Find available senior technician
            senior_tech_id = find_available_senior_technician(db)
            
            if not senior_tech_id:
                results.append({
                    'ticket_id': ticket.id,
                    'ticket_title': ticket.title,
                    'risk_level': ticket.risk_level.value,
                    'escalated': False,
                    'reason': 'No available senior technicians'
                })
                continue
            
            # Escalate the ticket
            old_assignee_id = ticket.assignee_id
            ticket.status = TicketStatus.ESCALATED
            ticket.assignee_id = senior_tech_id
            
            db.commit()
            db.refresh(ticket)
            
            # Create activity log
            create_activity_log(
                db,
                ticket.id,
                "AUTO_ESCALATED",
                None,  # System action, no user
                f"Automatically escalated due to {ticket.risk_level.value} status (SLA at {ticket.risk_level.value})"
            )
            
            # Notify senior technician
            senior = db.query(User).filter(User.id == senior_tech_id).first()
            if senior:
                notify_user(
                    db,
                    senior.id,
                    f"🚨 AUTO-ESCALATED: {ticket.title} (Ticket #{ticket.id}) - {ticket.risk_level.value}",
                    NotificationType.ALERT,
                    ticket.id
                )
            
            # Notify all managers about the escalation
            managers = db.query(User).filter(User.role == UserRole.MANAGER).all()
            for manager in managers:
                notify_user(
                    db,
                    manager.id,
                    f"⚠️ Ticket #{ticket.id} auto-escalated to {senior.name if senior else 'senior technician'} - Risk: {ticket.risk_level.value}",
                    NotificationType.WARNING,
                    ticket.id
                )
            
            # Notify previous assignee if exists
            if old_assignee_id and old_assignee_id != senior_tech_id:
                notify_user(
                    db,
                    old_assignee_id,
                    f"Ticket #{ticket.id} has been auto-escalated due to high SLA risk",
                    NotificationType.INFO,
                    ticket.id
                )
            
            results.append({
                'ticket_id': ticket.id,
                'ticket_title': ticket.title,
                'risk_level': ticket.risk_level.value,
                'escalated': True,
                'senior_technician': senior.name if senior else 'Unknown'
            })
            
        except Exception as e:
            results.append({
                'ticket_id': ticket.id,
                'ticket_title': ticket.title,
                'risk_level': ticket.risk_level.value if hasattr(ticket, 'risk_level') else 'Unknown',
                'escalated': False,
                'reason': str(e)
            })
    
    return results


def notify_managers_high_risk(db: Session, ticket: Ticket):
    """
    Notify all managers when a ticket reaches high-risk status
    """
    managers = db.query(User).filter(User.role == UserRole.MANAGER).all()
    
    for manager in managers:
        notify_user(
            db,
            manager.id,
            f"⚠️ HIGH RISK ALERT: Ticket #{ticket.id} - {ticket.title} has reached {ticket.risk_level.value} status",
            NotificationType.WARNING,
            ticket.id
        )
