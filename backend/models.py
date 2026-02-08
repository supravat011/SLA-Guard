from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base


class UserRole(str, enum.Enum):
    """User role enumeration"""
    MANAGER = "MANAGER"
    TECHNICIAN = "TECHNICIAN"
    SENIOR_TECHNICIAN = "SENIOR_TECHNICIAN"
    USER = "USER"


class TicketPriority(str, enum.Enum):
    """Ticket priority levels"""
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class TicketStatus(str, enum.Enum):
    """Ticket status states"""
    OPEN = "OPEN"
    IN_PROGRESS = "IN_PROGRESS"
    RESOLVED = "RESOLVED"
    ESCALATED = "ESCALATED"


class RiskLevel(str, enum.Enum):
    """SLA risk levels"""
    SAFE = "SAFE"
    WARNING = "WARNING"
    HIGH_RISK = "HIGH_RISK"
    BREACHED = "BREACHED"


class NotificationType(str, enum.Enum):
    """Notification types"""
    INFO = "INFO"
    WARNING = "WARNING"
    ALERT = "ALERT"


class User(Base):
    """User model for authentication and authorization"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False, default=UserRole.TECHNICIAN)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    assigned_tickets = relationship("Ticket", back_populates="assignee", foreign_keys="Ticket.assignee_id")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user")
    comments = relationship("Comment", back_populates="user")


class Ticket(Base):
    """Ticket model for support requests"""
    __tablename__ = "tickets"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    customer = Column(String, nullable=False)
    description = Column(String, nullable=True)
    priority = Column(SQLEnum(TicketPriority), nullable=False, default=TicketPriority.MEDIUM)
    status = Column(SQLEnum(TicketStatus), nullable=False, default=TicketStatus.OPEN)
    assignee_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_by_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
    sla_limit_hours = Column(Float, nullable=False)
    risk_level = Column(SQLEnum(RiskLevel), nullable=False, default=RiskLevel.SAFE)
    
    # Relationships
    assignee = relationship("User", back_populates="assigned_tickets", foreign_keys=[assignee_id])
    creator = relationship("User", foreign_keys=[created_by_user_id])
    activity_logs = relationship("ActivityLog", back_populates="ticket", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="ticket", cascade="all, delete-orphan")


class SLAConfig(Base):
    """SLA configuration for different priority levels"""
    __tablename__ = "sla_configs"
    
    id = Column(Integer, primary_key=True, index=True)
    priority = Column(String, unique=True, nullable=False)
    sla_hours = Column(Float, nullable=False)


class Notification(Base):
    """Notification model for alerts"""
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(String, nullable=False)
    type = Column(SQLEnum(NotificationType), nullable=False, default=NotificationType.INFO)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    ticket_id = Column(Integer, nullable=True)  # Optional reference to ticket
    
    # Relationships
    user = relationship("User", back_populates="notifications")


class ActivityLog(Base):
    """Activity log for ticket history"""
    __tablename__ = "activity_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    action = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    details = Column(String, nullable=True)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="activity_logs")
    user = relationship("User", back_populates="activity_logs")


class Comment(Base):
    """Comment model for ticket discussions"""
    __tablename__ = "comments"
    
    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("tickets.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(String, nullable=False)
    is_internal = Column(Boolean, default=False)  # Internal comments visible to managers only
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    ticket = relationship("Ticket", back_populates="comments")
    user = relationship("User", back_populates="comments")
