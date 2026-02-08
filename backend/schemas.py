from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from models import UserRole, TicketPriority, TicketStatus, RiskLevel, NotificationType


# ==================== User Schemas ====================

class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole


class UserCreate(UserBase):
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# ==================== Ticket Schemas ====================

class TicketBase(BaseModel):
    title: str
    customer: str
    description: Optional[str] = None
    priority: TicketPriority


class TicketCreate(TicketBase):
    assignee_id: Optional[int] = None


class TicketUpdate(BaseModel):
    title: Optional[str] = None
    customer: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TicketPriority] = None
    status: Optional[TicketStatus] = None
    assignee_id: Optional[int] = None


class TicketResponse(TicketBase):
    id: int
    status: TicketStatus
    assignee_id: Optional[int]
    assignee_name: Optional[str] = None
    created_by_user_id: Optional[int]
    creator_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    resolved_at: Optional[datetime]
    sla_limit_hours: float
    time_elapsed_hours: float
    risk_level: RiskLevel
    risk_percentage: float
    
    class Config:
        from_attributes = True


# ==================== SLA Config Schemas ====================

class SLAConfigBase(BaseModel):
    priority: str
    sla_hours: float


class SLAConfigCreate(SLAConfigBase):
    pass


class SLAConfigUpdate(BaseModel):
    sla_hours: float


class SLAConfigResponse(SLAConfigBase):
    id: int
    
    class Config:
        from_attributes = True


# ==================== Notification Schemas ====================

class NotificationBase(BaseModel):
    message: str
    type: NotificationType


class NotificationCreate(NotificationBase):
    user_id: int
    ticket_id: Optional[int] = None


class NotificationResponse(NotificationBase):
    id: int
    user_id: int
    read: bool
    created_at: datetime
    ticket_id: Optional[int]
    
    class Config:
        from_attributes = True


# ==================== Activity Log Schemas ====================

class ActivityLogBase(BaseModel):
    action: str
    details: Optional[str] = None


class ActivityLogCreate(ActivityLogBase):
    ticket_id: int
    user_id: Optional[int] = None


class ActivityLogResponse(ActivityLogBase):
    id: int
    ticket_id: int
    user_id: Optional[int]
    user_name: Optional[str] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True


# ==================== Analytics Schemas ====================

class AnalyticsOverview(BaseModel):
    total_tickets: int
    high_risk_tickets: int
    breached_tickets: int
    avg_resolution_hours: float
    open_tickets: int
    in_progress_tickets: int
    resolved_tickets: int
    escalated_tickets: int


class RiskDistribution(BaseModel):
    safe: int
    warning: int
    high_risk: int
    breached: int


class TechnicianWorkload(BaseModel):
    technician_id: int
    technician_name: str
    assigned_tickets: int
    high_risk_tickets: int
