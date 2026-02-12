import requests

BASE_URL = "http://localhost:8000"

# Login as manager
login_data = {
    "email": "manager@company.com",
    "password": "password123"
}

response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
if response.status_code == 200:
    auth_data = response.json()
    token = auth_data['access_token']
    
    # Get tickets
    headers = {"Authorization": f"Bearer {token}"}
    tickets_response = requests.get(f"{BASE_URL}/tickets/", headers=headers)
    
    if tickets_response.status_code == 200:
        tickets = tickets_response.json()
        print(f"Total tickets: {len(tickets)}")
        print(f"\nAll tickets:")
        for ticket in tickets:
            print(f"  ID: {ticket['id']}, Title: {ticket['title']}, Status: {ticket['status']}, Assignee: {ticket.get('assignee_name', 'Unassigned')}")
    else:
        print(f"Error getting tickets: {tickets_response.status_code}")
        print(tickets_response.text)
else:
    print(f"Login failed: {response.status_code}")
