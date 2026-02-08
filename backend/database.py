from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from config import settings

# Create SQLite engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False}  # Needed for SQLite
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    from models import User, Ticket, SLAConfig, Notification, ActivityLog
    Base.metadata.create_all(bind=engine)
    
    # Create default SLA configurations
    db = SessionLocal()
    try:
        existing_configs = db.query(SLAConfig).count()
        if existing_configs == 0:
            default_configs = [
                SLAConfig(priority="CRITICAL", sla_hours=4),
                SLAConfig(priority="HIGH", sla_hours=8),
                SLAConfig(priority="MEDIUM", sla_hours=24),
                SLAConfig(priority="LOW", sla_hours=48),
            ]
            db.add_all(default_configs)
            db.commit()
            print("✅ Default SLA configurations created")
    finally:
        db.close()
