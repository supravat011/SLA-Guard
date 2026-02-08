import requests
import json

BASE_URL = "http://localhost:8000"

# Step 1: Login as user
print("Step 1: Logging in as user...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "user@company.com", "password": "password123"}
)

if login_response.status_code == 200:
    login_data = login_response.json()
    token = login_data["access_token"]
    print(f"✅ Login successful! Token: {token[:20]}...")
    
    # Step 2: Create a ticket
    print("\nStep 2: Creating a ticket...")
    headers = {"Authorization": f"Bearer {token}"}
    ticket_data = {
        "title": "Test ticket from API",
        "description": "Testing if submit button creates ticket correctly",
        "priority": "MEDIUM"
    }
    
    print(f"Request headers: {headers}")
    print(f"Request data: {ticket_data}")
    
    create_response = requests.post(
        f"{BASE_URL}/users/tickets",
        json=ticket_data,
        headers=headers
    )
    
    print(f"Response status: {create_response.status_code}")
    print(f"Response body: {create_response.text}")
    
    if create_response.status_code == 201:
        ticket = create_response.json()
        print(f"✅ Ticket created successfully!")
        print(f"   Ticket ID: {ticket['id']}")
        print(f"   Title: {ticket['title']}")
        print(f"   Priority: {ticket['priority']}")
        print(f"   Status: {ticket['status']}")
        print(f"   SLA Limit: {ticket['sla_limit_hours']} hours")
        
        # Step 3: Get user's tickets
        print("\nStep 3: Fetching user's tickets...")
        tickets_response = requests.get(
            f"{BASE_URL}/users/tickets/my-tickets",
            headers=headers
        )
        
        if tickets_response.status_code == 200:
            tickets = tickets_response.json()
            print(f"✅ Found {len(tickets)} ticket(s)")
            for t in tickets:
                print(f"   - #{t['id']}: {t['title']} ({t['status']})")
        else:
            print(f"❌ Failed to fetch tickets: {tickets_response.status_code}")
            print(tickets_response.text)
    else:
        print(f"❌ Failed to create ticket: {create_response.status_code}")
        print(create_response.text)
else:
    print(f"❌ Login failed: {login_response.status_code}")
    print(login_response.text)
