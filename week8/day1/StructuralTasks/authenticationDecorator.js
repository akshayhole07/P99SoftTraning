/**
 * Authentication Decorator
 * Adds authentication checks to API handler functions
 * Follows the Decorator pattern to enhance existing handlers
 */

class AuthenticationDecorator {
  /**
   * Valid tokens for demonstration
   */
  static validTokens = new Set(['token123', 'token456', 'admin_token']);

  /**
   * Validate if a token is valid
   */
  static isValidToken(token) {
    return this.validTokens.has(token);
  }

  /**
   * Decorator function that wraps an API handler with authentication
   * @param {Function} handler - The original API handler function
   * @param {Boolean} requireAdmin - Whether this handler requires admin privileges
   * @returns {Function} - Enhanced handler with authentication check
   */
  static withAuthentication(handler, requireAdmin = false) {
    return function(req, res) {
      // Extract token from request headers or query
      const token = req.headers?.authorization || req.query?.token || null;

      // Check if token is provided
      if (!token) {
        return {
          success: false,
          error: 'Authentication failed: No token provided',
          statusCode: 401
        };
      }

      // Validate token
      if (!AuthenticationDecorator.isValidToken(token)) {
        return {
          success: false,
          error: 'Authentication failed: Invalid token',
          statusCode: 401
        };
      }

      // Check admin privileges if required
      if (requireAdmin && !AuthenticationDecorator.isAdmin(token)) {
        return {
          success: false,
          error: 'Authorization failed: Admin access required',
          statusCode: 403
        };
      }

      // Token is valid, proceed to original handler
      console.log(`✓ Authentication successful for token: ${token}`);
      return handler(req, res);
    };
  }

  /**
   * Check if a token has admin privileges
   */
  static isAdmin(token) {
    return token === 'admin_token';
  }

  /**
   * Decorator to add role-based access control
   */
  static withRoleBasedAccess(handler, allowedRoles = []) {
    return function(req, res) {
      const token = req.headers?.authorization || req.query?.token || null;

      if (!token) {
        return {
          success: false,
          error: 'Authentication failed: No token provided',
          statusCode: 401
        };
      }

      if (!AuthenticationDecorator.isValidToken(token)) {
        return {
          success: false,
          error: 'Authentication failed: Invalid token',
          statusCode: 401
        };
      }

      // Determine user role based on token
      const userRole = AuthenticationDecorator.getUserRole(token);

      // Check if user's role is allowed
      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        return {
          success: false,
          error: `Access denied: User role '${userRole}' not allowed`,
          statusCode: 403
        };
      }

      console.log(`✓ Access granted for role: ${userRole}`);
      return handler(req, res);
    };
  }

  /**
   * Get user role based on token
   */
  static getUserRole(token) {
    if (token === 'admin_token') return 'admin';
    return 'user';
  }

  /**
   * Decorator to add rate limiting
   */
  static withRateLimit(handler, maxRequests = 10, timeWindow = 60000) {
    const requestMap = new Map();

    return function(req, res) {
      const token = req.headers?.authorization || req.query?.token || 'anonymous';
      const now = Date.now();

      // Initialize or get request history for this token
      if (!requestMap.has(token)) {
        requestMap.set(token, []);
      }

      const requests = requestMap.get(token);
      
      // Remove old requests outside the time window
      const recentRequests = requests.filter(time => now - time < timeWindow);

      // Check if rate limit exceeded
      if (recentRequests.length >= maxRequests) {
        return {
          success: false,
          error: `Rate limit exceeded: Max ${maxRequests} requests per ${timeWindow}ms`,
          statusCode: 429
        };
      }

      // Add current request timestamp
      recentRequests.push(now);
      requestMap.set(token, recentRequests);

      console.log(`✓ Rate limit OK: ${recentRequests.length}/${maxRequests} requests`);
      return handler(req, res);
    };
  }
}

module.exports = AuthenticationDecorator;
