# OAuth + JWT Implementation - Complete Explanation

## 🎯 What This App Does

This app lets users login using their Google account, then gives them a JWT token to access protected pages.

---

## 📦 Required Packages (requirements.txt)

```
flask          → Web framework to build the server
requests       → Makes HTTP calls to Google API
pyjwt          → Creates and validates JWT tokens
python-dotenv  → Reads secrets from .env file
```

---

## 🔄 The Complete Flow

```
1. User visits homepage (/)
   ↓
2. User clicks "Login with Google"
   ↓
3. Browser redirects to Google's login page
   ↓
4. User enters password on Google (NOT our app!)
   ↓
5. Google asks: "Allow this app to see your email?"
   ↓
6. User clicks "Allow"
   ↓
7. Google redirects back to our app with a SECRET CODE
   ↓
8. Our app exchanges the code for an ACCESS TOKEN
   ↓
9. Our app uses the access token to get user info from Google
   ↓
10. Our app creates a JWT token
   ↓
11. User is redirected to homepage with JWT saved
   ↓
12. User can now access protected routes using the JWT
```

---

## 📝 Code Explanation - Line by Line

### Part 1: Imports and Setup

```python
import os
```
- Allows us to read environment variables (secrets)

```python
import jwt
```
- Library to create and verify JWT tokens
- JWT = JSON Web Token (a signed piece of data)

```python
import requests
```
- Makes HTTP calls to external APIs (Google, GitHub)

```python
from datetime import datetime, timedelta, timezone
```
- Used to set token expiration time
- Example: "This token expires in 1 hour"

```python
from functools import wraps
```
- Helps create decorators (like @jwt_required)
- Preserves function names when wrapping

```python
from flask import Flask, redirect, request, jsonify, render_template
```
- `Flask` → Creates the web app
- `redirect` → Sends user to another URL
- `request` → Reads incoming data (URL params, headers)
- `jsonify` → Converts Python dict to JSON response
- `render_template` → Shows HTML pages

```python
from dotenv import load_dotenv
load_dotenv()
```
- Reads the `.env` file
- Makes secrets available via `os.getenv()`

```python
app = Flask(__name__)
```
- Creates the Flask application instance

---

### Part 2: Configuration

```python
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
```
- Reads Google OAuth credentials from `.env` file
- These are like username/password for your app

```python
JWT_SECRET = os.getenv("JWT_SECRET", "fallback_secret")
```
- Secret key used to sign JWT tokens
- If not in `.env`, uses "fallback_secret" (not recommended for production!)

```python
GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USER_URL = "https://www.googleapis.com/oauth2/v2/userinfo"
```
- Google's OAuth endpoints
- AUTH_URL → Where we send users to login
- TOKEN_URL → Where we exchange code for token
- USER_URL → Where we get user info

---

### Part 3: JWT Helper Functions

#### Creating a JWT Token

```python
def create_jwt(user: dict) -> str:
```
- Function that takes user info and returns a JWT token
- `user: dict` means user is a dictionary
- `-> str` means it returns a string

```python
    payload = {
        "sub": str(user["id"]),
        "username": user["login"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=1),
    }
```
- `payload` = the data we want to store in the token
- `sub` = subject (standard JWT field for user ID)
- `username` = the user's name
- `exp` = expiration time (1 hour from now)

```python
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")
```
- Creates the JWT token
- Signs it with `JWT_SECRET` so nobody can fake it
- Uses HS256 algorithm (HMAC with SHA-256)

#### Protecting Routes with JWT

```python
def jwt_required(f):
```
- This is a decorator function
- It wraps other functions to add JWT checking

```python
    @wraps(f)
    def wrapper(*args, **kwargs):
```
- `@wraps(f)` preserves the original function's name
- `wrapper` is the new function that adds security

```python
        auth_header = request.headers.get("Authorization", "")
```
- Gets the "Authorization" header from the HTTP request
- Example: "Authorization: Bearer eyJhbGc..."
- If not present, returns empty string

```python
        if not auth_header.startswith("Bearer "):
            return jsonify({"error": "Missing or invalid Authorization header"}), 401
```
- Checks if header starts with "Bearer "
- If not, returns error with status code 401 (Unauthorized)

```python
        token = auth_header.split(" ", 1)[1]
```
- Extracts the token part
- "Bearer TOKEN" → splits by space → takes second part

```python
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
```
- Tries to decode and verify the token
- If signature is wrong or token is tampered, this fails

```python
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token expired"}), 401
```
- Catches expired tokens

```python
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid token"}), 401
```
- Catches any other token errors (bad signature, malformed, etc.)

```python
        request.user = payload
```
- Attaches the decoded user info to the request
- Now other functions can access `request.user`

```python
        return f(*args, **kwargs)
    return wrapper
```
- Calls the original function
- Returns the wrapper function

---

### Part 4: Routes

#### Homepage

```python
@app.route("/")
def home():
    return render_template("index.html")
```
- When user visits `http://localhost:5000/`
- Shows the HTML page with login buttons

#### Google Login

```python
@app.route("/login")
def login():
```
- When user clicks "Login with Google"

```python
    google_url = (
        f"{GOOGLE_AUTH_URL}"
        f"?client_id={GOOGLE_CLIENT_ID}"
        f"&redirect_uri=http://localhost:5000/callback"
        f"&response_type=code"
        f"&scope=openid email profile"
    )
```
- Builds Google authorization URL
- `redirect_uri` tells Google where to send user back
- `response_type=code` means we want an authorization code
- `scope` asks for email and profile info

```python
    return redirect(google_url)
```
- Sends user to Google's login page

---

### Part 5: OAuth Callback

#### Google Callback

```python
@app.route("/callback")
def callback():
```
- Google redirects here after user approves

```python
    code = request.args.get("code")
```
- Gets the authorization code from URL
- Example: `/callback?code=abc123`

```python
    if not code:
        return jsonify({"error": "No code returned from Google"}), 400
```
- If no code, something went wrong

```python
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
```
- Exchanges code for Google access token
- `grant_type` tells Google this is an authorization code flow
- `redirect_uri` must match what we registered

```python
    token_data = token_response.json()
    access_token = token_data.get("access_token")
    if not access_token:
        return jsonify({"error": "Failed to obtain access token", "details": token_data}), 400
```
- Gets the access token or returns error

```python
    user_response = requests.get(
        GOOGLE_USER_URL,
        headers={"Authorization": f"Bearer {access_token}"},
    )
    user = user_response.json()
```
- Gets user info from Google

```python
    our_jwt = create_jwt({"id": user["id"], "login": user.get("email", user.get("name", "unknown"))})
```
- Creates our JWT
- Uses email as username, or name if no email

```python
    return redirect(f"/?token={our_jwt}")
```
- Redirects back to homepage with token

---

### Part 6: Protected Route

```python
@app.route("/profile")
@jwt_required
def profile():
```
- This route requires a valid JWT
- `@jwt_required` decorator checks the token first

```python
    return jsonify({"message": f"Hello, {request.user['username']}!", "claims": request.user})
```
- Returns a JSON response
- `request.user` was set by the `@jwt_required` decorator
- Shows the username and all token claims

---

### Part 7: Run the Server

```python
if __name__ == "__main__":
    app.run(debug=True)
```
- Only runs if this file is executed directly
- `debug=True` shows detailed errors and auto-reloads on code changes

---

## 🔐 Security Concepts

### Why OAuth?
- Users don't give us their password
- Google/GitHub handles authentication
- We just get permission to access basic info

### Why JWT?
- Stateless (no database needed for sessions)
- Self-contained (all info is in the token)
- Signed (can't be faked without the secret)

### Token Flow
```
OAuth Token (from Google)  →  Used once to get user info
                              ↓
JWT Token (from our app)   →  Used for all future requests
```

---

## 🚀 How to Run

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Set up Google OAuth:
   - Go to https://console.cloud.google.com/apis/credentials
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:5000/callback`

3. Create `.env` file:
```
GOOGLE_CLIENT_ID=your_actual_client_id
GOOGLE_CLIENT_SECRET=your_actual_secret
JWT_SECRET=any_random_string
```

4. Run the app:
```bash
python app.py
```

5. Visit: http://localhost:5000

---

## 🧪 Testing the Flow

1. Click "Login with Google"
2. Approve on Google's page
3. You'll be redirected back with a token
4. Click "Test Protected Route"
5. You should see your user info

---

## ❓ Common Questions

**Q: Why do we need both OAuth and JWT?**
A: OAuth gets the user's identity from Google. JWT is our own token for managing sessions.

**Q: Where is the JWT stored?**
A: In the browser's localStorage (check the HTML file)

**Q: Can someone fake a JWT?**
A: No, because it's signed with JWT_SECRET. Without the secret, they can't create a valid signature.

**Q: What if the token expires?**
A: The user needs to login again. The token is valid for 1 hour.

**Q: Why not just use Google's token?**
A: Google's token is for accessing Google APIs. Our JWT is for our own app's authentication.

---

## 🎓 Key Takeaways

1. **OAuth** = Secure login via third party (Google/GitHub)
2. **JWT** = Our own session token
3. **Decorators** = Add functionality to routes (like @jwt_required)
4. **Environment Variables** = Keep secrets out of code
5. **HTTP Flow** = Redirect → Callback → Exchange → Token

---

Good luck with your training! 🚀
