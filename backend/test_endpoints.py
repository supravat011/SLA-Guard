import requests
import json

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
    
    # Test tickets endpoint (this should work)
    print("Testing /tickets/ endpoint:")
    tickets_response = requests.get(f"{BASE_URL}/tickets/", headers=headers)
    print(f"Status: {tickets_response.status_code}")
    if tickets_response.status_code == 200:
        tickets = tickets_response.json()
        print(f"✅ Success! Got {len(tickets)} tickets")
    else:
        print(f"❌ Error: {tickets_response.text}")
    
    print("\n" + "="*60)
    
    # Test analytics endpoint (this is failing)
    print("Testing /analytics/technician-workload endpoint:")
    try:
        analytics_response = requests.get(f"{BASE_URL}/analytics/technician-workload", headers=headers)
        print(f"Status: {analytics_response.status_code}")
        if analytics_response.status_code == 200:
            data = analytics_response.json()
            print(f"✅ Success! Got {len(data)} technicians")
            print(json.dumps(data, indent=2))
        else:
            print(f"❌ Error: {analytics_response.text}")
    except Exception as e:
        print(f"❌ Exception: {e}")
else:
    print(f"Login failed: {response.status_code}")
