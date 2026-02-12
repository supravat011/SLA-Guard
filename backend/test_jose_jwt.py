from jose import jwt
from config import settings

# Test token from login
token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImV4cCI6MTc3MDk1NDc5OH0.dummy"

print("Testing JWT decode with jose library:")
print("="*60)

try:
    payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    print(f"✅ Success! Payload: {payload}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")

# Also test with a fresh token
from datetime import datetime, timedelta

print("\n" + "="*60)
print("Creating and decoding a fresh token:")
print("="*60)

token_data = {"sub": 1}
expire = datetime.utcnow() + timedelta(minutes=30)
token_data.update({"exp": expire})

fresh_token = jwt.encode(token_data, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
print(f"Fresh token: {fresh_token[:50]}...")

try:
    decoded = jwt.decode(fresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    print(f"✅ Decoded successfully: {decoded}")
except Exception as e:
    print(f"❌ Error: {type(e).__name__}: {e}")
