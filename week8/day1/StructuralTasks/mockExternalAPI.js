/**
 * Mock External REST API
 * Simulates a third-party API with its own interface
 */

class MockExternalAPI {
  constructor() {
    this.data = {
      users: [
        { id: 1, name: 'Alice', email: 'alice@example.com' },
        { id: 2, name: 'Bob', email: 'bob@example.com' },
        { id: 3, name: 'Charlie', email: 'charlie@example.com' }
      ]
    };
  }

  // External API uses different method naming convention
  fetchUserData(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    return { status: 'success', payload: user, timestamp: new Date() };
  }

  // External API uses different parameter structure
  updateUserInfo(userId, updateData) {
    const user = this.data.users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }
    Object.assign(user, updateData);
    return { status: 'updated', data: user, responseCode: 200 };
  }

  // External API returns data in different format
  listAllUsers() {
    return { 
      success: true, 
      users: this.data.users,
      count: this.data.users.length
    };
  }
}

module.exports = MockExternalAPI;
