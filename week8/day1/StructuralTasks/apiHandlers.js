/**
 * API Handlers
 * Example handlers that will be decorated with authentication
 */

const APIAdapter = require('./apiAdapter');
const AuthenticationDecorator = require('./authenticationDecorator');

class APIHandlers {
  constructor() {
    this.adapter = new APIAdapter();

    // Create decorated handlers
    this.getUser = AuthenticationDecorator.withAuthentication(
      this._getUser.bind(this)
    );

    this.updateUser = AuthenticationDecorator.withAuthentication(
      this._updateUser.bind(this),
      true // Requires admin
    );

    this.getAllUsers = AuthenticationDecorator.withRoleBasedAccess(
      this._getAllUsers.bind(this),
      ['admin', 'user']
    );

    this.deleteUser = AuthenticationDecorator.withRateLimit(
      AuthenticationDecorator.withAuthentication(
        this._deleteUser.bind(this),
        true // Requires admin
      ),
      5, // Max 5 requests
      60000 // Per 60 seconds
    );
  }

  /**
   * Original handler: Get user by ID
   * (wrapped by authentication decorator)
   */
  _getUser(req, res) {
    const userId = req.params?.userId;
    
    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
        statusCode: 400
      };
    }

    const result = this.adapter.getUser(userId);
    return {
      ...result,
      statusCode: result.success ? 200 : 404
    };
  }

  /**
   * Original handler: Update user
   * (wrapped by authentication decorator with admin requirement)
   */
  _updateUser(req, res) {
    const userId = req.params?.userId;
    const userData = req.body;

    if (!userId || !userData) {
      return {
        success: false,
        error: 'User ID and data are required',
        statusCode: 400
      };
    }

    const result = this.adapter.updateUser(userId, userData);
    return {
      ...result,
      statusCode: result.success ? 200 : 400
    };
  }

  /**
   * Original handler: Get all users
   * (wrapped by role-based access decorator)
   */
  _getAllUsers(req, res) {
    const result = this.adapter.getAllUsers();
    return {
      ...result,
      statusCode: result.success ? 200 : 500
    };
  }

  /**
   * Original handler: Delete user
   * (wrapped by rate limiting and admin requirement)
   */
  _deleteUser(req, res) {
    const userId = req.params?.userId;

    if (!userId) {
      return {
        success: false,
        error: 'User ID is required',
        statusCode: 400
      };
    }

    // Simulate delete operation
    return {
      success: true,
      message: `User ${userId} deleted successfully`,
      statusCode: 200
    };
  }
}

module.exports = APIHandlers;
