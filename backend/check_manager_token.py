import sqlite3
import jwt
from datetime import datetime, timedelta

# Check database
conn = sqlite3.connect('sla_guard.db')
cursor = conn.cursor()

print("="*60)
print("DATABASE CHECK")
print("="*60)

# Get manager user
cursor.execute("SELECT id, email, name, role FROM users WHERE role = 'MANAGER'")
manager = cursor.fetchone()
if manager:
    print(f"Manager found: ID={manager[0]}, Email={manager[1]}, Name={manager[2]}, Role={manager[3]}")
else:
    print("No manager found!")

conn.close()

print("\n" + "="*60)
print("TOKEN CHECK")
print("="*60)

# Create a test token for the manager
SECRET_KEY = "sla-guard-secret-key-change-in-production-2024"
ALGORITHM = "HS256"

if manager:
    # Create token with manager's ID
    token_data = {"sub": manager[0]}
    token = jwt.encode(token_data, SECRET_KEY, algorithm=ALGORITHM)
    print(f"Generated token for manager ID {manager[0]}")
    print(f"Token: {token[:50]}...")
    
    # Decode to verify
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"Decoded token: {decoded}")
