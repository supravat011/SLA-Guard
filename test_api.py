import requests
import json

# Test login and ticket creation
BASE_URL = "http://localhost:8000"

print("=" * 60)
print("Testing SLA Guard API")
print("=" * 60)

# Step 1: Login
print("\n1. Testing login with user@company.com...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "user@company.com", "password": "password123"}
)

if login_response.status_code == 200:
    print("✅ Login successful!")
    data = login_response.json()
    token = data["access_token"]
    user = data["user"]
    print(f"   User: {user['name']} ({user['email']})")
    print(f"   Role: {user['role']}")
    print(f"   Token: {token[:20]}...")
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(f"   Response: {login_response.text}")
    exit(1)

# Step 2: Create ticket
print("\n2. Testing ticket creation...")
headers = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

ticket_data = {
    "title": "Test Ticket from API",
    "description": "Testing ticket creation via API",
    "priority": "MEDIUM"
}

ticket_response = requests.post(
    f"{BASE_URL}/users/tickets",
    headers=headers,
    json=ticket_data
)

if ticket_response.status_code == 201:
    print("✅ Ticket created successfully!")
    ticket = ticket_response.json()
    print(f"   Ticket ID: {ticket['id']}")
    print(f"   Title: {ticket['title']}")
    print(f"   Priority: {ticket['priority']}")
else:
    print(f"❌ Ticket creation failed: {ticket_response.status_code}")
    print(f"   Response: {ticket_response.text}")
    
    # Try to get more details
    try:
        error_detail = ticket_response.json()
        print(f"   Error detail: {json.dumps(error_detail, indent=2)}")
    except:
        pass

print("\n" + "=" * 60)
