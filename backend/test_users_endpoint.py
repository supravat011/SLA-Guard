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
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test users endpoint
    print("Testing /users endpoint:")
    print("="*60)
    users_response = requests.get(f"{BASE_URL}/users", headers=headers)
    print(f"Status: {users_response.status_code}")
    if users_response.status_code == 200:
        users = users_response.json()
        print(f"✅ Success! Got {len(users)} users:")
        for user in users:
            print(f"  - {user['name']} ({user['email']}) - Role: {user['role']}")
    else:
        print(f"❌ Error: {users_response.text}")
else:
    print(f"Login failed: {response.status_code}")
