/**
 * Test Suite for Structural Patterns
 * Validates Adapter and Decorator implementations
 */

const APIAdapter = require('./apiAdapter');
const APIHandlers = require('./apiHandlers');
const AuthenticationDecorator = require('./authenticationDecorator');

// Simple test framework
class TestRunner {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, fn) {
    this.tests.push({ name, fn });
  }

  assertEqual(actual, expected, message) {
    if (JSON.stringify(actual) !== JSON.stringify(expected)) {
      throw new Error(`${message}\nExpected: ${JSON.stringify(expected)}\nActual: ${JSON.stringify(actual)}`);
    }
  }

  assertTrue(condition, message) {
    if (!condition) {
      throw new Error(message);
    }
  }

  assertFalse(condition, message) {
    if (condition) {
      throw new Error(message);
    }
  }

  run() {
    console.log('🧪 Running Test Suite\n');
    console.log('=' .repeat(70));

    this.tests.forEach((test, index) => {
      try {
        test.fn();
        this.passed++;
        console.log(`✓ Test ${index + 1}: ${test.name}`);
      } catch (error) {
        this.failed++;
        console.log(`✗ Test ${index + 1}: ${test.name}`);
        console.log(`  Error: ${error.message}\n`);
      }
    });

    console.log('=' .repeat(70));
    console.log(`\nResults: ${this.passed} passed, ${this.failed} failed\n`);

    return this.failed === 0;
  }
}

// ==========================================
// Test Suite
// ==========================================
const runner = new TestRunner();

// ADAPTER TESTS
runner.test('Adapter: getUser returns correct structure', () => {
  const adapter = new APIAdapter();
  const result = adapter.getUser(1);

  runner.assertTrue(result.hasOwnProperty('success'), 'Result should have success property');
  runner.assertTrue(result.hasOwnProperty('data'), 'Result should have data property');
  runner.assertTrue(result.hasOwnProperty('error'), 'Result should have error property');
  runner.assertEqual(result.success, true, 'Should succeed for valid user');
});

runner.test('Adapter: getUser returns user data correctly', () => {
  const adapter = new APIAdapter();
  const result = adapter.getUser(1);

  runner.assertEqual(result.data.id, 1, 'User ID should match');
  runner.assertEqual(result.data.name, 'Alice', 'User name should be correct');
});

runner.test('Adapter: getUser handles non-existent user', () => {
  const adapter = new APIAdapter();
  const result = adapter.getUser(999);

  runner.assertEqual(result.success, false, 'Should fail for non-existent user');
  runner.assertTrue(result.error.includes('not found'), 'Error should indicate user not found');
});

runner.test('Adapter: getAllUsers returns all users', () => {
  const adapter = new APIAdapter();
  const result = adapter.getAllUsers();

  runner.assertEqual(result.success, true, 'Should succeed');
  runner.assertEqual(result.count, 3, 'Should return 3 users');
  runner.assertEqual(result.data.length, 3, 'Data should contain 3 users');
});

runner.test('Adapter: updateUser modifies user data', () => {
  const adapter = new APIAdapter();
  const updateResult = adapter.updateUser(2, { name: 'Bob Updated' });

  runner.assertEqual(updateResult.success, true, 'Update should succeed');
  runner.assertEqual(updateResult.data.name, 'Bob Updated', 'Name should be updated');
});

// AUTHENTICATION DECORATOR TESTS
runner.test('Decorator: withAuthentication blocks missing token', () => {
  const handlers = new APIHandlers();
  const request = { headers: {}, params: { userId: 1 } };
  const result = handlers.getUser(request, {});

  runner.assertEqual(result.success, false, 'Should fail without token');
  runner.assertEqual(result.statusCode, 401, 'Status should be 401');
});

runner.test('Decorator: withAuthentication accepts valid token', () => {
  const handlers = new APIHandlers();
  const request = { 
    headers: { authorization: 'token123' }, 
    params: { userId: 1 } 
  };
  const result = handlers.getUser(request, {});

  runner.assertEqual(result.success, true, 'Should succeed with valid token');
  runner.assertEqual(result.statusCode, 200, 'Status should be 200');
});

runner.test('Decorator: withAuthentication rejects invalid token', () => {
  const handlers = new APIHandlers();
  const request = { 
    headers: { authorization: 'invalid_token' }, 
    params: { userId: 1 } 
  };
  const result = handlers.getUser(request, {});

  runner.assertEqual(result.success, false, 'Should fail with invalid token');
  runner.assertEqual(result.statusCode, 401, 'Status should be 401');
});

runner.test('Decorator: Admin-only operation requires admin token', () => {
  const handlers = new APIHandlers();
  const regularRequest = { 
    headers: { authorization: 'token123' }, 
    params: { userId: 1 },
    body: { name: 'Test' }
  };
  const result = handlers.updateUser(regularRequest, {});

  runner.assertEqual(result.success, false, 'Should fail for non-admin');
  runner.assertEqual(result.statusCode, 403, 'Status should be 403');
});

runner.test('Decorator: Admin token can access admin-only operations', () => {
  const handlers = new APIHandlers();
  const adminRequest = { 
    headers: { authorization: 'admin_token' }, 
    params: { userId: 1 },
    body: { name: 'Updated' }
  };
  const result = handlers.updateUser(adminRequest, {});

  runner.assertEqual(result.success, true, 'Admin should succeed');
  runner.assertEqual(result.statusCode, 200, 'Status should be 200');
});

runner.test('Decorator: Role-based access allows valid roles', () => {
  const handlers = new APIHandlers();
  const request = { 
    headers: { authorization: 'token123' }, 
    params: {} 
  };
  const result = handlers.getAllUsers(request, {});

  runner.assertEqual(result.success, true, 'User role should have access');
  runner.assertEqual(result.statusCode, 200, 'Status should be 200');
});

runner.test('Decorator: Rate limiting counts requests', () => {
  const handlers = new APIHandlers();
  const request = { 
    headers: { authorization: 'admin_token' }, 
    params: { userId: 1 } 
  };

  // Make multiple requests
  const results = [];
  for (let i = 0; i < 6; i++) {
    results.push(handlers.deleteUser(request, {}));
  }

  // First 5 should succeed, 6th should fail
  runner.assertEqual(results[0].success, true, '1st request should succeed');
  runner.assertEqual(results[4].success, true, '5th request should succeed');
  runner.assertEqual(results[5].success, false, '6th request should fail due to rate limit');
  runner.assertEqual(results[5].statusCode, 429, '6th request status should be 429');
});

runner.test('Decorator: Token validation utility functions', () => {
  runner.assertTrue(
    AuthenticationDecorator.isValidToken('token123'),
    'token123 should be valid'
  );

  runner.assertFalse(
    AuthenticationDecorator.isValidToken('invalid'),
    'invalid should not be valid'
  );

  runner.assertTrue(
    AuthenticationDecorator.isAdmin('admin_token'),
    'admin_token should be admin'
  );

  runner.assertFalse(
    AuthenticationDecorator.isAdmin('token123'),
    'token123 should not be admin'
  );
});

// Run all tests
runner.run();

module.exports = TestRunner;
