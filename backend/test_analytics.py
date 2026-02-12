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
    print("Login successful!")
    print(f"User: {auth_data['user']}")
    print(f"Token: {auth_data['access_token'][:50]}...")
    
    token = auth_data['access_token']
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test analytics endpoint
    print("\n" + "="*60)
    print("Testing /analytics/technician-workload endpoint")
    print("="*60)
    
    analytics_response = requests.get(f"{BASE_URL}/analytics/technician-workload", headers=headers)
    print(f"Status Code: {analytics_response.status_code}")
    
    if analytics_response.status_code == 200:
        print("Success! Data:", analytics_response.json())
    else:
        print(f"Error: {analytics_response.text}")
else:
    print(f"Login failed: {response.status_code}")
    print(response.text)
