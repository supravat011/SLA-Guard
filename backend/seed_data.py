from sqlalchemy.orm import Session
from models import User, Ticket, SLAConfig, UserRole, TicketPriority, TicketStatus
from auth import get_password_hash
from datetime import datetime, timedelta
from database import SessionLocal, engine, Base


def create_sla_configs(db: Session):
    """Create SLA configurations for all priority levels"""
    
    # Check if SLA configs already exist
    existing_configs = db.query(SLAConfig).count()
    if existing_configs > 0:
        print("⚠️  SLA configurations already exist. Skipping SLA config creation.")
        return
    
    sla_configs = [
        SLAConfig(priority="CRITICAL", sla_hours=4),
        SLAConfig(priority="HIGH", sla_hours=8),
        SLAConfig(priority="MEDIUM", sla_hours=24),
        SLAConfig(priority="LOW", sla_hours=48),
    ]
    
    db.add_all(sla_configs)
    db.commit()
    
    print("✅ Created SLA configurations:")
    print("   - CRITICAL: 4 hours")
    print("   - HIGH: 8 hours")
    print("   - MEDIUM: 24 hours")
    print("   - LOW: 48 hours")


def create_seed_users(db: Session):
    """Create predefined test users"""
    
    # Check if users already exist
    existing_users = db.query(User).count()
    if existing_users > 0:
        print("⚠️  Users already exist. Skipping seed data creation.")
        return
    
    users = [
        # Manager
        User(
            email="manager@company.com",
            name="Alice Johnson",
            password_hash=get_password_hash("password123"),
            role=UserRole.MANAGER
        ),
        # Technicians
        User(
            email="tech1@company.com",
            name="John Doe",
            password_hash=get_password_hash("password123"),
            role=UserRole.TECHNICIAN
        ),
        User(
            email="tech2@company.com",
            name="Sarah Connor",
            password_hash=get_password_hash("password123"),
            role=UserRole.TECHNICIAN
        ),
        # Senior Technicians
        User(
            email="senior1@company.com",
            name="Michael Chen",
            password_hash=get_password_hash("password123"),
            role=UserRole.SENIOR_TECHNICIAN
        ),
        User(
            email="senior2@company.com",
            name="Emily Rodriguez",
            password_hash=get_password_hash("password123"),
            role=UserRole.SENIOR_TECHNICIAN
        ),
        # User
        User(
            email="user@company.com",
            name="David Smith",
            password_hash=get_password_hash("password123"),
            role=UserRole.USER
        ),
    ]
    
    db.add_all(users)
    db.commit()
    
    print("✅ Created 6 test users:")
    print("   - Manager: manager@company.com / password123")
    print("   - Technician 1: tech1@company.com / password123")
    print("   - Technician 2: tech2@company.com / password123")
    print("   - Senior Technician 1: senior1@company.com / password123")
    print("   - Senior Technician 2: senior2@company.com / password123")
    print("   - User: user@company.com / password123")
    
    return users


def create_sample_tickets(db: Session, users: list):
    """Create sample tickets with varying SLA statuses"""
    
    # Get user IDs
    user = next(u for u in users if u.role == UserRole.USER)
    tech1 = next(u for u in users if u.email == "tech1@company.com")
    tech2 = next(u for u in users if u.email == "tech2@company.com")
    senior1 = next(u for u in users if u.role == UserRole.SENIOR_TECHNICIAN)
    
    # Get SLA configurations
    sla_high = db.query(SLAConfig).filter(SLAConfig.priority == "HIGH").first()
    sla_medium = db.query(SLAConfig).filter(SLAConfig.priority == "MEDIUM").first()
    sla_critical = db.query(SLAConfig).filter(SLAConfig.priority == "CRITICAL").first()
    
    now = datetime.utcnow()
    
    tickets = [
        # Recent ticket - Safe
        Ticket(
            title="Laptop not connecting to WiFi",
            customer="David Smith",
            description="Unable to connect to office WiFi network",
            priority=TicketPriority.HIGH,
            status=TicketStatus.OPEN,
            assignee_id=tech1.id,
            created_by_user_id=user.id,
            created_at=now - timedelta(hours=1),
            sla_limit_hours=sla_high.sla_hours if sla_high else 8
        ),
        # 50% SLA used - Warning
        Ticket(
            title="Email sync issues on mobile",
            customer="David Smith",
            description="Emails not syncing on iPhone",
            priority=TicketPriority.MEDIUM,
            status=TicketStatus.IN_PROGRESS,
            assignee_id=tech2.id,
            created_by_user_id=user.id,
            created_at=now - timedelta(hours=12),
            sla_limit_hours=sla_medium.sla_hours if sla_medium else 24
        ),
        # 80% SLA used - High Risk
        Ticket(
            title="VPN connection dropping frequently",
            customer="Marketing Department",
            description="VPN disconnects every 10 minutes",
            priority=TicketPriority.HIGH,
            status=TicketStatus.IN_PROGRESS,
            assignee_id=tech1.id,
            created_by_user_id=user.id,
            created_at=now - timedelta(hours=6.5),
            sla_limit_hours=sla_high.sla_hours if sla_high else 8
        ),
        # Escalated ticket
        Ticket(
            title="Server performance degradation",
            customer="IT Department",
            description="Production server running slow",
            priority=TicketPriority.CRITICAL,
            status=TicketStatus.ESCALATED,
            assignee_id=senior1.id,
            created_by_user_id=user.id,
            created_at=now - timedelta(hours=3),
            sla_limit_hours=sla_critical.sla_hours if sla_critical else 4
        ),
        # Resolved ticket
        Ticket(
            title="Password reset request",
            customer="David Smith",
            description="Forgot password for HR portal",
            priority=TicketPriority.MEDIUM,
            status=TicketStatus.RESOLVED,
            assignee_id=tech2.id,
            created_by_user_id=user.id,
            created_at=now - timedelta(days=1),
            resolved_at=now - timedelta(hours=22),
            sla_limit_hours=sla_medium.sla_hours if sla_medium else 24
        ),
        # Breached ticket
        Ticket(
            title="Printer not working",
            customer="Finance Department",
            description="Network printer offline",
            priority=TicketPriority.MEDIUM,
            status=TicketStatus.OPEN,
            assignee_id=None,
            created_by_user_id=user.id,
            created_at=now - timedelta(hours=26),
            sla_limit_hours=sla_medium.sla_hours if sla_medium else 24
        ),
    ]
    
    db.add_all(tickets)
    db.commit()
    
    print(f"✅ Created {len(tickets)} sample tickets with varying SLA statuses")


def seed_database():
    """Main function to seed the database"""
    print("\n🌱 Starting database seeding...")
    
    # Create tables
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Create SLA configurations first
        create_sla_configs(db)
        
        # Create users
        users = create_seed_users(db)
        
        if users:
            # Create sample tickets
            create_sample_tickets(db, users)
        
        print("\n✅ Database seeding completed successfully!\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {str(e)}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
