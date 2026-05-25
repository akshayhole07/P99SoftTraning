# Structural Patterns Assignment

## What Are These Patterns?

### 1️⃣ Adapter Pattern
**Simple Idea:** You have an old remote that doesn't fit a new TV. Use an adapter to make them work together.

**In Code:** We have an external API that works differently. The Adapter translates between the external API and our code.

**Example:**
- External API: `fetchUserData(id)` → returns `{status, payload}`
- Our Code Needs: `getUser(id)` → returns `{success, data}`
- **Adapter Solution:** Convert one format to the other

### 2️⃣ Decorator Pattern
**Simple Idea:** A basic gift box becomes fancy when you add wrapping, ribbon, and a bow. The box is still there, just decorated.

**In Code:** We have a simple API handler. The Decorator adds security (like authentication) without changing the original handler.

**Example:**
```
Original handler: Gets user from database
Decorator adds: "Check if user has valid token first"
Result: Secured handler that checks token THEN gets user
```

## Quick Start

```bash
# Run the demo to see both patterns in action
node demo.js

# Run the tests
node test.js
```

## How to Demo This to Someone

### Step 1: Show the Problem
```
"This external API returns data in a weird format. 
Our code expects a different format. How do we fix this?"
```

### Step 2: Show the Adapter Solution
Run the demo:
```bash
node demo.js
```

Point to this part of the output:
```
[1] ADAPTER PATTERN - Wrapping External API
✓ Getting user (adapted from external API):
Response: {
  "success": true,
  "data": { "id": 1, "name": "Alice", "email": "alice@example.com" },
  "error": null
}
```

Say: **"The Adapter translated the weird format into our clean format!"**

### Step 3: Show the Problem with Handlers
```
"Now we have handlers that work, but they're not secure. 
Anyone can call them! How do we add security without rewriting everything?"
```

### Step 4: Show the Decorator Solution
Continue reading the demo output, point to this:
```
[2] DECORATOR PATTERN - Authentication & Authorization

✗ Test 2: Invalid token - GET user
Response: {
  "success": false,
  "error": "Authentication failed: Invalid token",
  "statusCode": 401
}

✓ Test 4: Admin token - UPDATE user (admin-only)
✓ Authentication successful for token: admin_token
Response: {
  "success": true,
  "data": { ... },
  "statusCode": 200
}
```

Say: **"The Decorator wrapped the handler with security! Invalid tokens get blocked, admin-only operations require admin token!"**

## Test Tokens (Use These for Testing)

```
'token123'    - Regular user
'token456'    - Regular user  
'admin_token' - Admin (can do anything)
```

## Files in This Project

| File | What It Does |
|------|-------------|
| `mockExternalAPI.js` | Fake API that has a weird interface |
| `apiAdapter.js` | Translates the weird API into our simple format |
| `authenticationDecorator.js` | Adds security checks to handlers |
| `apiHandlers.js` | API handlers wrapped with security |
| `demo.js` | Shows everything working - run this! |
| `test.js` | Tests to verify everything works |

## Quick Summary

**Adapter:** "Old remote + new TV" → Adapter fixes it ✓

**Decorator:** "Basic handler + security" → Decorator adds security ✓

Both make your code **reusable**, **maintainable**, and **easy to change**!
