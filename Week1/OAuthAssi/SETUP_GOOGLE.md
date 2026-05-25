# Google OAuth Setup Guide

## Step-by-Step Instructions

### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

### 2. Create or Select a Project
- Click the project dropdown at the top
- Click "New Project" or select an existing one

### 3. Enable Google+ API (if needed)
- Go to "APIs & Services" > "Library"
- Search for "Google+ API" 
- Click "Enable" (if not already enabled)

### 4. Create OAuth Consent Screen
- Go to "APIs & Services" > "OAuth consent screen"
- Choose "External" (for testing)
- Fill in:
  - App name: `OAuth JWT Demo`
  - User support email: your email
  - Developer contact: your email
- Click "Save and Continue"
- Skip scopes (click "Save and Continue")
- Add test users: Add your email address
- Click "Save and Continue"

### 5. Create OAuth 2.0 Credentials
- Go to "APIs & Services" > "Credentials"
- Click "Create Credentials" > "OAuth 2.0 Client ID"
- Application type: "Web application"
- Name: `OAuth Demo Client`
- Under "Authorized redirect URIs", click "Add URI"
- Add EXACTLY this (copy-paste to avoid typos):
  ```
  http://localhost:5000/callback
  ```
- Click "Create"

### 6. Copy Your Credentials
- You'll see a popup with Client ID and Client Secret
- Copy both values

### 7. Update Your .env File
Open `OAuthAssi/.env` and paste your credentials:
```
GOOGLE_CLIENT_ID=paste_your_client_id_here
GOOGLE_CLIENT_SECRET=paste_your_client_secret_here
JWT_SECRET=any_random_string_you_want
```

### 8. Restart Your Flask App
- Stop the running Flask app (Ctrl+C)
- Start it again:
  ```bash
  python app.py
  ```

### 9. Test
- Visit: http://localhost:5000
- Click "Login with Google"
- Should work now!

---

## Common Issues

### Issue: "redirect_uri_mismatch"
**Solution:** The redirect URI in Google Console must EXACTLY match:
```
http://localhost:5000/callback
```

Check for:
- ❌ `http://localhost:5000/callback/` (extra slash)
- ❌ `https://localhost:5000/callback` (https instead of http)
- ❌ `http://127.0.0.1:5000/callback` (127.0.0.1 instead of localhost)
- ✅ `http://localhost:5000/callback` (correct!)

### Issue: "invalid_client"
**Solution:** 
- Make sure you copied the Client ID and Secret correctly
- No extra spaces or line breaks
- Restart Flask after updating .env

### Issue: "Access blocked: This app's request is invalid"
**Solution:**
- Make sure OAuth consent screen is configured
- Add yourself as a test user
- App must be in "Testing" mode for external users

---

## Verification Checklist

Before testing, verify:

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Test user added (your email)
- [ ] OAuth 2.0 Client ID created
- [ ] Redirect URI is exactly: `http://localhost:5000/callback`
- [ ] Client ID and Secret copied to `.env`
- [ ] Flask app restarted after updating `.env`
- [ ] Visiting `http://localhost:5000` (not 127.0.0.1)

---

## Screenshot of Correct Configuration

In Google Cloud Console > Credentials > Your OAuth Client:

```
Authorized redirect URIs:
┌─────────────────────────────────────────┐
│ http://localhost:5000/callback          │
└─────────────────────────────────────────┘
```

That's it! If you followed all steps, it should work.
