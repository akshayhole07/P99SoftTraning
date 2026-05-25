/**
 * Structural Patterns Demonstration
 * Shows Adapter and Decorator patterns in action
 */

const APIAdapter = require('./apiAdapter');
const APIHandlers = require('./apiHandlers');
const AuthenticationDecorator = require('./authenticationDecorator');

console.log('=' .repeat(70));
console.log('STRUCTURAL PATTERNS: ADAPTER & DECORATOR');
console.log('=' .repeat(70));

// ==========================================
// 1. ADAPTER PATTERN DEMONSTRATION
// ==========================================
console.log('\n[1] ADAPTER PATTERN - Wrapping External API');
console.log('-'.repeat(70));

const adapter = new APIAdapter();

console.log('\n✓ Getting user (adapted from external API):');
const userResult = adapter.getUser(1);
console.log('Response:', JSON.stringify(userResult, null, 2));

console.log('\n✓ Getting all users (adapted):');
const allUsers = adapter.getAllUsers();
console.log('Response:', JSON.stringify(allUsers, null, 2));

console.log('\n✓ Updating user (adapted):');
const updateResult = adapter.updateUser(2, { name: 'Bob Updated', email: 'bob.new@example.com' });
console.log('Response:', JSON.stringify(updateResult, null, 2));

// ==========================================
// 2. DECORATOR PATTERN DEMONSTRATION
// ==========================================
console.log('\n[2] DECORATOR PATTERN - Authentication & Authorization');
console.log('-'.repeat(70));

const handlers = new APIHandlers();

// Mock request/response objects
const validRequest = {
  headers: { authorization: 'token123' },
  params: { userId: 1 },
  body: { name: 'Test' }
};

const adminRequest = {
  headers: { authorization: 'admin_token' },
  params: { userId: 1 },
  body: { name: 'Updated' }
};

const invalidTokenRequest = {
  headers: { authorization: 'invalid_token' },
  params: { userId: 1 },
  body: {}
};

const noTokenRequest = {
  headers: {},
  params: { userId: 1 },
  body: {}
};

// Test 1: Valid token for read operation
console.log('\n✓ Test 1: Valid token - GET user');
const response1 = handlers.getUser(validRequest, {});
console.log('Response:', JSON.stringify(response1, null, 2));

// Test 2: Invalid token
console.log('\n✗ Test 2: Invalid token - GET user');
const response2 = handlers.getUser(invalidTokenRequest, {});
console.log('Response:', JSON.stringify(response2, null, 2));

// Test 3: No token
console.log('\n✗ Test 3: No token - GET user');
const response3 = handlers.getUser(noTokenRequest, {});
console.log('Response:', JSON.stringify(response3, null, 2));

// Test 4: Admin-only operation with valid admin token
console.log('\n✓ Test 4: Admin token - UPDATE user (admin-only)');
const response4 = handlers.updateUser(adminRequest, {});
console.log('Response:', JSON.stringify(response4, null, 2));

// Test 5: Admin-only operation with regular token
console.log('\n✗ Test 5: Regular token - UPDATE user (admin-only)');
const response5 = handlers.updateUser(validRequest, {});
console.log('Response:', JSON.stringify(response5, null, 2));

// Test 6: Get all users with role-based access
console.log('\n✓ Test 6: Valid token - GET all users (role-based access)');
const response6 = handlers.getAllUsers(validRequest, {});
console.log('Response:', JSON.stringify(response6, null, 2));

// Test 7: Rate limiting - multiple requests
console.log('\n✓ Test 7: Rate limiting - multiple DELETE requests');
const response7a = handlers.deleteUser(adminRequest, {});
console.log('Request 1:', JSON.stringify(response7a, null, 2));

const response7b = handlers.deleteUser(adminRequest, {});
console.log('Request 2:', JSON.stringify(response7b, null, 2));

const response7c = handlers.deleteUser(adminRequest, {});
console.log('Request 3:', JSON.stringify(response7c, null, 2));

// ==========================================
// 3. PATTERN SUMMARY
// ==========================================
console.log('\n' + '=' .repeat(70));
console.log('PATTERN SUMMARY');
console.log('=' .repeat(70));

console.log(`
ADAPTER PATTERN:
  Purpose: Convert interface of a class into another interface
  Implementation:
    - Wraps MockExternalAPI
    - Provides consistent getUser(), updateUser(), getAllUsers() methods
    - Handles response format conversion
    - Isolates our code from external API changes

DECORATOR PATTERN:
  Purpose: Dynamically add behavior to objects without altering structure
  Implementation:
    - withAuthentication(): Adds token validation
    - withRoleBasedAccess(): Adds role-based authorization
    - withRateLimit(): Adds request rate limiting
    - Multiple decorators can be composed together

BENEFITS:
  ✓ Adapter: Loose coupling, easier to replace external APIs
  ✓ Decorator: Open/closed principle, reusable enhancement logic
  ✓ Together: Flexible, maintainable architecture
`);

console.log('=' .repeat(70));
console.log('Demo completed successfully!');
console.log('=' .repeat(70));
