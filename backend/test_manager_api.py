import requests
import json

BASE_URL = "http://localhost:8000"

# Test 1: Login as manager
print("=" * 60)
print("Test 1: Login as Manager")
print("=" * 60)

login_data = {
    "email": "manager@company.com",
    "password": "password123"
}

try:
    response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        auth_data = response.json()
        print(f"Login successful!")
        print(f"User: {auth_data['user']['name']} ({auth_data['user']['role']})")
        token = auth_data['access_token']
        
        # Test 2: Get all tickets as manager
        print("\n" + "=" * 60)
        print("Test 2: Get All Tickets as Manager")
        print("=" * 60)
        
        headers = {"Authorization": f"Bearer {token}"}
        tickets_response = requests.get(f"{BASE_URL}/tickets/", headers=headers)
        print(f"Status Code: {tickets_response.status_code}")
        
        if tickets_response.status_code == 200:
            tickets = tickets_response.json()
            print(f"Total tickets returned: {len(tickets)}")
            
            if len(tickets) > 0:
                print("\nFirst 3 tickets:")
                for ticket in tickets[:3]:
                    print(f"  - ID: {ticket['id']}, Title: {ticket['title']}, Status: {ticket['status']}")
            else:
                print("WARNING: No tickets returned despite database having 9 tickets!")
        else:
            print(f"Error: {tickets_response.text}")
    else:
        print(f"Login failed: {response.text}")
        
except Exception as e:
    print(f"Error: {e}")

print("\n" + "=" * 60)
