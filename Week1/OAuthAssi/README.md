# OAuth & JWT Authentication Demo

A Python Flask application demonstrating OAuth 2.0 (Google) and JWT authentication with credential-based signup/login.

## Features

- 🔐 Google OAuth 2.0 authentication
- 📧 Email/Password signup and login
- 🎫 JWT token generation and validation
- 🛡️ Protected routes with JWT authentication
- 📊 Protected dashboard page
- 💾 In-memory user storage

## Tech Stack

- Python 3.x
- Flask
- PyJWT
- Google OAuth 2.0
- HTML/CSS/JavaScript

## Installation

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure Google OAuth:
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Create OAuth 2.0 Client ID
   - Add redirect URI: `http://localhost:5000/callback`
   - Copy Client ID and Secret to `.env`

5. Run the application:
```bash
python app.py
```

6. Visit: `http://localhost:5000`

## Usage

### Google OAuth Login
1. Click "Login with Google"
2. Authorize the application
3. Get redirected with JWT token

### Credential-based Login
1. Click "Sign up" to create an account
2. Enter email and password
3. Login with your credentials
4. Get JWT token

### Access Protected Dashboard
1. After login, click "Go to Protected Dashboard"
2. Dashboard requires valid JWT token
3. Token is verified on every request

## Project Structure

```
OAuthAssi/
├── app.py                  # Main Flask application
├── templates/
│   ├── index.html         # Login/Signup page
│   ├── success.html       # Success page after login
│   └── dashboard.html     # Protected dashboard
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
├── EXPLANATION.md        # Detailed code explanation
└── SETUP_GOOGLE.md       # Google OAuth setup guide
```

## Security Notes

- Passwords are hashed using SHA256
- JWT tokens expire after 1 hour
- `.env` file is excluded from git (contains secrets)
- User data is stored in-memory (resets on restart)

## Documentation

- See [EXPLANATION.md](EXPLANATION.md) for detailed code walkthrough
- See [SETUP_GOOGLE.md](SETUP_GOOGLE.md) for Google OAuth setup

## License

MIT
