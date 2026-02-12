import requests
import json
from jose import jwt
from datetime import datetime, timedelta

# Test token creation and validation locally
BASE_URL = "http://localhost:8000"
SECRET_KEY = "sla-guard-secret-key-change-in-production-2024"
ALGORITHM = "HS256"

print("=" * 60)
print("Testing JWT Token Creation and Validation")
print("=" * 60)

# Step 1: Login
print("\n1. Logging in...")
login_response = requests.post(
    f"{BASE_URL}/auth/login",
    json={"email": "user@company.com", "password": "password123"}
)

if login_response.status_code != 200:
    print(f"❌ Login failed: {login_response.status_code}")
    exit(1)

data = login_response.json()
token = data["access_token"]
user = data["user"]

print("[OK] Login successful!")
print(f"   User ID: {user['id']}")
print(f"   Token (first 50 chars): {token[:50]}...")

# Step 2: Decode token locally to verify it
print("\n2. Decoding token locally...")
try:
    payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    print(f"✅ Token decoded successfully!")
    print(f"   Payload: {json.dumps(payload, indent=2, default=str)}")
except Exception as e:
    print(f"❌ Token decode failed: {type(e).__name__}: {str(e)}")

# Step 3: Create a test token locally
print("\n3. Creating test token locally...")
test_payload = {"sub": user['id'], "exp": datetime.utcnow() + timedelta(hours=1)}
test_token = jwt.encode(test_payload, SECRET_KEY, algorithm=ALGORITHM)
print(f"   Test token created: {test_token[:50]}...")

# Step 4: Try to use the test token
print("\n4. Testing with locally created token...")
headers = {
    "Authorization": f"Bearer {test_token}",
    "Content-Type": "application/json"
}

test_response = requests.get(
    f"{BASE_URL}/users/tickets/my-tickets",
    headers=headers
)

print(f"   Response status: {test_response.status_code}")
if test_response.status_code == 200:
    print(f"✅ Test token works!")
else:
    print(f"❌ Test token failed: {test_response.text}")

# Step 5: Try with the original login token
print("\n5. Testing with original login token...")
headers2 = {
    "Authorization": f"Bearer {token}",
    "Content-Type": "application/json"
}

original_response = requests.get(
    f"{BASE_URL}/users/tickets/my-tickets",
    headers=headers2
)

print(f"   Response status: {original_response.status_code}")
if original_response.status_code == 200:
    print(f"✅ Original token works!")
else:
    print(f"❌ Original token failed: {original_response.text}")

print("\n" + "=" * 60)
