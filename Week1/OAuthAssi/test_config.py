"""Test script to verify OAuth configuration"""
import os
from dotenv import load_dotenv

load_dotenv()

print("=" * 60)
print("OAuth Configuration Test")
print("=" * 60)

client_id = os.getenv("GOOGLE_CLIENT_ID")
client_secret = os.getenv("GOOGLE_CLIENT_SECRET")
jwt_secret = os.getenv("JWT_SECRET")

print(f"\n✓ GOOGLE_CLIENT_ID: {client_id[:20]}..." if client_id else "✗ GOOGLE_CLIENT_ID: NOT SET")
print(f"✓ GOOGLE_CLIENT_SECRET: {client_secret[:10]}..." if client_secret else "✗ GOOGLE_CLIENT_SECRET: NOT SET")
print(f"✓ JWT_SECRET: {jwt_secret[:10]}..." if jwt_secret else "✗ JWT_SECRET: NOT SET")

print("\n" + "=" * 60)
print("Expected Redirect URI in Google Console:")
print("=" * 60)
print("http://localhost:5000/callback")

print("\n" + "=" * 60)
print("Authorization URL that will be generated:")
print("=" * 60)
auth_url = (
    f"https://accounts.google.com/o/oauth2/v2/auth"
    f"?client_id={client_id}"
    f"&redirect_uri=http://localhost:5000/callback"
    f"&response_type=code"
    f"&scope=openid email profile"
)
print(auth_url)

print("\n" + "=" * 60)
print("Next Steps:")
print("=" * 60)
print("1. Make sure the redirect URI in Google Console is EXACTLY:")
print("   http://localhost:5000/callback")
print("2. Restart your Flask app")
print("3. Try in an incognito/private browser window")
print("4. Visit: http://localhost:5000")
print("=" * 60)
