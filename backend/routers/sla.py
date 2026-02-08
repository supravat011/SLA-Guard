from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models import SLAConfig, User
from schemas import SLAConfigResponse, SLAConfigUpdate
from auth import get_current_user, require_manager

router = APIRouter(prefix="/sla", tags=["SLA Configuration"])


@router.get("/config", response_model=List[SLAConfigResponse])
def get_sla_config(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all SLA configurations
    """
    configs = db.query(SLAConfig).all()
    return configs


@router.put("/config/{priority}", response_model=SLAConfigResponse)
def update_sla_config(
    priority: str,
    config_update: SLAConfigUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_manager)
):
    """
    Update SLA configuration for a priority level (Manager only)
    """
    config = db.query(SLAConfig).filter(SLAConfig.priority == priority.upper()).first()
    
    if not config:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"SLA config for priority '{priority}' not found"
        )
    
    config.sla_hours = config_update.sla_hours
    db.commit()
    db.refresh(config)
    
    return config
