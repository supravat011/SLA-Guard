from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """Application configuration settings"""
    
    SECRET_KEY: str = "sla-guard-secret-key-change-in-production-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    DATABASE_URL: str = "sqlite:///./sla_guard.db"
    
    # Scheduler settings
    SLA_CHECK_INTERVAL_MINUTES: int = 5
    
    # Email settings (optional)
    EMAIL_ENABLED: bool = False  # Set to True to enable email notifications
    SMTP_SERVER: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str = ""
    SMTP_PASSWORD: str = ""
    FROM_EMAIL: str = "noreply@slaguard.com"
    
    # SLA default configurations (hours)
    SLA_CRITICAL: int = 4
    SLA_HIGH: int = 8
    SLA_MEDIUM: int = 24
    SLA_LOW: int = 48
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
