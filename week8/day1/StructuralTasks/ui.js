// Mock data and functions to simulate the backend
const APIAdapter = {
  data: {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com' },
      { id: 2, name: 'Bob', email: 'bob@example.com' },
      { id: 3, name: 'Charlie', email: 'charlie@example.com' }
    ]
  },

  getUser(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, data: null, error: `User ${userId} not found` };
    }
    return { success: true, data: user, error: null };
  },

  updateUser(userId, userData) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      return { success: false, data: null, error: `User ${userId} not found` };
    }
    Object.assign(user, userData);
    return { success: true, data: user, error: null };
  },

  getAllUsers() {
    return { success: true, data: this.data.users, count: this.data.users.length, error: null };
  }
};

// Valid tokens
const validTokens = new Set(['token123', 'token456', 'admin_token']);

// Current selected token
let currentToken = '';

// Format JSON nicely
function formatJSON(obj) {
  return JSON.stringify(obj, null, 2);
}

// Format status code with color
function formatResponse(response) {
  let statusCode = response.statusCode || (response.success ? 200 : 400);
  let statusColor = statusCode >= 200 && statusCode < 300 ? '✓' : '✗';
  
  return `${statusColor} Status: ${statusCode}\n\n${formatJSON(response)}`;
}

// Select token
function selectToken(token) {
  currentToken = token;
  document.getElementById('current-token').textContent = token || '(None)';
  document.getElementById('decorator-response').textContent = `Token selected: ${token || 'None'}\n\nNow try an operation!`;
}

// Get user (Adapter Demo)
function getUser(userId) {
  const result = APIAdapter.getUser(userId);
  const response = {
    statusCode: result.success ? 200 : 404,
    ...result
  };
  document.getElementById('adapter-response').textContent = formatResponse(response);
}

// Get all users (Adapter Demo)
function getAllUsers() {
  const result = APIAdapter.getAllUsers();
  const response = {
    statusCode: result.success ? 200 : 500,
    ...result
  };
  document.getElementById('adapter-response').textContent = formatResponse(response);
}

// Check if token is valid
function isValidToken(token) {
  return validTokens.has(token);
}

// Check if token is admin
function isAdmin(token) {
  return token === 'admin_token';
}

// Decorator: Check authentication
function checkAuthentication(requireAdmin = false) {
  if (!currentToken) {
    return {
      success: false,
      error: 'Authentication failed: No token provided',
      statusCode: 401
    };
  }

  if (!isValidToken(currentToken)) {
    return {
      success: false,
      error: 'Authentication failed: Invalid token',
      statusCode: 401
    };
  }

  if (requireAdmin && !isAdmin(currentToken)) {
    return {
      success: false,
      error: 'Authorization failed: Admin access required',
      statusCode: 403
    };
  }

  return { success: true, authorized: true };
}

// Call handler with decorator
function callHandler(operation, userId) {
  let response;

  // Determine if operation requires admin
  const requiresAdmin = operation === 'updateUser' || operation === 'deleteUser';
  
  // Check authentication first (Decorator)
  const authCheck = checkAuthentication(requiresAdmin);
  
  if (!authCheck.success) {
    response = authCheck;
  } else {
    // Call the actual operation if authentication passed
    switch (operation) {
      case 'getUser':
        response = APIAdapter.getUser(userId);
        response.statusCode = response.success ? 200 : 404;
        break;

      case 'getAllUsers':
        response = APIAdapter.getAllUsers();
        response.statusCode = response.success ? 200 : 500;
        break;

      case 'updateUser':
        response = APIAdapter.updateUser(userId, { name: `Updated User ${userId}` });
        response.statusCode = response.success ? 200 : 400;
        break;

      case 'deleteUser':
        response = {
          success: true,
          message: `User ${userId} deleted successfully`,
          statusCode: 200
        };
        break;

      default:
        response = { success: false, error: 'Unknown operation', statusCode: 400 };
    }
  }

  // Display response
  document.getElementById('decorator-response').textContent = formatResponse(response);
}

// Show demo info on load
window.addEventListener('DOMContentLoaded', () => {
  console.log('UI loaded successfully!');
  console.log('Adapter and Decorator patterns are ready to demo');
});
