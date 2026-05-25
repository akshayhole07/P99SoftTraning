import os
import jwt
import requests
import hashlib
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import Flask, redirect, request, jsonify, render_template
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

# ── Local user storage (in-memory dictionary) ─────────────────────────────────
users_db = {}  # Format: {"email": {"password": "hashed_password", "id": 1}}
 
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")

 

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


# ── JWT helpers ──────────────────────────────────────────────────────────────

def hash_password(password: str) -> str:
    """Simple password hashing using SHA256."""
    return hashlib.sha256(password.encode()).hexdigest()


def create_jwt(user: dict) -> str:
    """Issue a signed JWT valid for 1 hour."""
    payload = {
        "sub": str(user["id"]),
        "username": user["login"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")


def jwt_required(f):
    """Simple decorator to check JWT token."""
    @wraps(f)
    def wrapper(*args, **kwargs):
        # Get token from Authorization header
        auth_header = request.headers.get("Authorization", "")
        
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
        
        token = auth_header.split(" ", 1)[1]
        
        try:
            # Verify and decode the token
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
            # Attach user info to request
            request.user = payload
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
    
    return wrapper


# ── OAuth routes ─────────────────────────────────────────────────────────────

@app.route("/")
def home():
    """Serve the frontend."""
    return render_template("index.html")


@app.route("/success")
def success():
    """Success page after login."""
    return render_template("success.html")


@app.route("/dashboard")
def dashboard():
    """Protected dashboard page - serves HTML."""
    return render_template("dashboard.html")


@app.route("/dashboard-data")
@jwt_required
def dashboard_data():
    """Protected API endpoint - returns user data for dashboard."""
    return jsonify({
        "message": "Access granted to protected dashboard",
        "user_id": request.user['sub'],
        "email": request.user['username'],
        "exp": request.user['exp'],
        "authenticated": True
    })


# ── Credential-based Authentication Routes ────────────────────────────────────

@app.route("/signup", methods=["POST"])
def signup():
    """Register a new user with email and password."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    # Validation
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    if email in users_db:
        return jsonify({"error": "Email already exists"}), 400
    
    # Store user with hashed password
    users_db[email] = {
        "password": hash_password(password),
        "id": len(users_db) + 1
    }
    
    return jsonify({"message": "User registered successfully", "email": email}), 201


@app.route("/login-credentials", methods=["POST"])
def login_credentials():
    """Login with email and password, returns JWT token."""
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    
    # Validation
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    # Check if user exists
    if email not in users_db:
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Verify password
    if users_db[email]["password"] != hash_password(password):
        return jsonify({"error": "Invalid email or password"}), 401
    
    # Create JWT token
    user_data = {
        "id": users_db[email]["id"],
        "login": email
    }
    token = create_jwt(user_data)
    
    return jsonify({
        "message": "Login successful",
        "token": token,
        "email": email
    }), 200


@app.route("/login")
def login():
    """Step 1 — redirect the user to Google for authorization."""
    google_url = (
        f"{GOOGLE_AUTH_URL}"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri=http://localhost:5000/callback"
        f"&response_type=code"
        f"&scope=openid email profile"
        f"&prompt=select_account"
    )
    return redirect(google_url)


@app.route("/callback")
def callback():
    """Step 2 — Google redirects here with a code; exchange it for a token."""
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "No code returned from Google"}), 400

    # Exchange code for Google access token
    token_response = requests.post(
        GOOGLE_TOKEN_URL,
        data={
            "client_id": GOOGLE_CLIENT_ID,
            "client_secret": GOOGLE_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
            "redirect_uri": "http://localhost:5000/callback",
        },
    )
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return jsonify({"error": "Failed to obtain access token", "details": token_data}), 400

    # Fetch the authenticated user's profile from Google
    user_response = requests.get(
        GOOGLE_USER_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    user = user_response.json()

    # Issue our own JWT
    our_jwt = create_jwt({"id": user["id"], "login": user.get("email", user.get("name", "unknown"))})
    return redirect(f"/success?token={our_jwt}")


# ── Protected route with JWT authentication ──────────────────────────────────

@app.route("/profile")
@jwt_required
def profile():
    """Protected endpoint - requires valid JWT token."""
    return jsonify({
        "message": f"Hello, {request.user['username']}!",
        "user_id": request.user['sub'],
        "authenticated": True
    })


if __name__ == "__main__":
    app.run(debug=True)
