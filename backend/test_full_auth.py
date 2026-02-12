import requests
import json

BASE_URL = "http://localhost:8000"

# Login as manager
login_data = {
    "email": "manager@company.com",
    "password": "password123"
}

print("Attempting login...")
response = requests.post(f"{BASE_URL}/auth/login", json=login_data)
print(f"Login status: {response.status_code}")

if response.status_code == 200:
    auth_data = response.json()
    print(f"✅ Login successful!")
    print(f"User: {auth_data['user']}")
    
    token = auth_data['access_token']
    print(f"\nToken (first 50 chars): {token[:50]}...")
    
    # Decode token to see what's inside
    import jwt
    try:
        # Decode without verification to see payload
        decoded = jwt.decode(token, options={"verify_signature": False})
        print(f"Token payload: {decoded}")
    except Exception as e:
        print(f"Error decoding token: {e}")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test tickets endpoint
    print("\n" + "="*60)
    print("Testing /tickets/ endpoint:")
    tickets_response = requests.get(f"{BASE_URL}/tickets/", headers=headers)
    print(f"Status: {tickets_response.status_code}")
    if tickets_response.status_code == 200:
        tickets = tickets_response.json()
        print(f"✅ Success! Got {len(tickets)} tickets")
    else:
        print(f"❌ Error: {tickets_response.text}")
    
    # Test users endpoint
    print("\n" + "="*60)
    print("Testing /users endpoint:")
    users_response = requests.get(f"{BASE_URL}/users", headers=headers)
    print(f"Status: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"✅ Success! Got {len(users)} users")
        for user in users:
            print(f"  - {user['name']} ({user['email']}) - {user['role']}")
    else:
        print(f"❌ Error: {users_response.text}")
else:
    print(f"❌ Login failed: {response.text}")
