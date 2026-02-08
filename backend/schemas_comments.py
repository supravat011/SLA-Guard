from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ==================== Comment Schemas ====================

class CommentBase(BaseModel):
    content: str
    is_internal: bool = False


class CommentCreate(CommentBase):
    ticket_id: int


class CommentUpdate(BaseModel):
    content: Optional[str] = None
    is_internal: Optional[bool] = None


class CommentResponse(CommentBase):
    id: int
    ticket_id: int
    user_id: int
    user_name: str
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
