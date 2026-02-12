import sys
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import User, UserRole
from auth import get_password_hash

def add_technicians():
    db = SessionLocal()
    try:
        # Check if technicians already exist
        existing_techs = db.query(User).filter(User.role == UserRole.TECHNICIAN).all()
        if existing_techs:
            print(f"Found {len(existing_techs)} existing technicians:")
            for tech in existing_techs:
                print(f"  - {tech.name} ({tech.email})")
            return
        
        # Add technicians
        technicians = [
            {
                "email": "john.tech@company.com",
                "name": "John Smith",
                "password": "password123",
                "role": UserRole.TECHNICIAN
            },
            {
                "email": "sarah.tech@company.com",
                "name": "Sarah Connor",
                "password": "password123",
                "role": UserRole.TECHNICIAN
            },
            {
                "email": "mike.tech@company.com",
                "name": "Mike Chen",
                "password": "password123",
                "role": UserRole.TECHNICIAN
            }
        ]
        
        for tech_data in technicians:
            tech = User(
                email=tech_data["email"],
                name=tech_data["name"],
                hashed_password=get_password_hash(tech_data["password"]),
                role=tech_data["role"]
            )
            db.add(tech)
        
        db.commit()
        print("✅ Successfully added 3 technicians:")
        for tech_data in technicians:
            print(f"  - {tech_data['name']} ({tech_data['email']})")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_technicians()
