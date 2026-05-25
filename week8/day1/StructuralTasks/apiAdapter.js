/**
 * API Adapter Pattern
 * Wraps the external API to provide a consistent interface
 * Converts external API calls to our application's expected format
 */

const MockExternalAPI = require('./mockExternalAPI');

class APIAdapter {
  constructor() {
    // Composition: wrap the external API
    this.externalAPI = new MockExternalAPI();
  }

  /**
   * Get user by ID
   * Adapts the external API's fetchUserData to our interface
   */
  getUser(userId) {
    try {
      // Call external API with its naming convention
      const response = this.externalAPI.fetchUserData(userId);
      
      // Adapt response to our standard format
      return {
        success: true,
        data: response.payload,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Update user information
   * Adapts the external API's updateUserInfo to our interface
   */
  updateUser(userId, userData) {
    try {
      // Call external API with its parameter structure
      const response = this.externalAPI.updateUserInfo(userId, userData);
      
      // Adapt response to our standard format
      return {
        success: response.responseCode === 200,
        data: response.data,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        error: error.message
      };
    }
  }

  /**
   * Get all users
   * Adapts the external API's listAllUsers to our interface
   */
  getAllUsers() {
    try {
      // Call external API with its method name
      const response = this.externalAPI.listAllUsers();
      
      // Adapt response to our standard format
      return {
        success: response.success,
        data: response.users,
        count: response.count,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        count: 0,
        error: error.message
      };
    }
  }
}

module.exports = APIAdapter;
