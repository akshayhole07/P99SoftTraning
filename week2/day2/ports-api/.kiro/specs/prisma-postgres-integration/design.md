# Design Document: Prisma PostgreSQL Integration

## Overview

This design document outlines the integration of Prisma ORM with PostgreSQL for the Ports API. The system will transition from file-based JSON storage to a robust database-backed architecture while maintaining complete backward compatibility with existing API contracts.

The integration follows a layered architecture pattern:
- **Prisma Schema Layer**: Defines the database schema and generates type-safe client
- **Database Client Layer**: Singleton Prisma Client instance for connection management
- **Model Layer**: Abstraction layer providing database operations (portModel.js)
- **Controller Layer**: Business logic using model functions instead of direct database calls
- **Seed Layer**: Migration script to populate database from existing JSON data

This approach ensures separation of concerns, testability, and maintainability while preserving all existing API endpoints, query parameters, and response formats.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Express.js Application                   │
├─────────────────────────────────────────────────────────────┤
│  Routes Layer                                                │
│  └─ ports.routes.js (unchanged)                             │
├─────────────────────────────────────────────────────────────┤
│  Controller Layer                                            │
│  └─ ports.controller.js (updated to use model functions)    │
├─────────────────────────────────────────────────────────────┤
│  Model Layer (NEW)                                           │
│  └─ utils/models/portModel.js                               │
│     ├─ findAllPorts(filters, pagination)                    │
│     ├─ findPortByCode(unlocode)                             │
│     ├─ createPort(portData)                                 │
│     └─ deletePort(unlocode)                                 │
├─────────────────────────────────────────────────────────────┤
│  Database Client Layer (NEW)                                 │
│  └─ utils/prisma.js (Singleton Prisma Client)               │
├─────────────────────────────────────────────────────────────┤
│  Prisma ORM                                                  │
│  └─ Generated Client from schema.prisma                     │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │   PostgreSQL DB   │
                  │   Table: Port     │
                  └──────────────────┘

Seed Process (One-time):
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ ports.json   │ ───▶ │ seed.js      │ ───▶ │ PostgreSQL   │
└──────────────┘      └──────────────┘      └──────────────┘
```

### Connection Lifecycle

```
Application Startup:
1. Load environment variables (.env)
2. Initialize Prisma Client singleton (utils/prisma.js)
3. Test database connection ($connect())
4. If connection fails → log error and exit(1)
5. If connection succeeds → start Express server
6. Register shutdown handlers (SIGINT, SIGTERM)

Application Shutdown:
1. Receive shutdown signal
2. Call prisma.$disconnect()
3. Close Express server
4. Exit gracefully
```

### Data Flow

**Read Operation (GET /ports)**:
```
Client Request
  → Express Router
    → ports.controller.getAllPorts()
      → portModel.findAllPorts(filters, pagination)
        → Prisma Client query with where/skip/take
          → PostgreSQL SELECT
            → Return results
              → Controller formats response
                → Client receives JSON
```

**Write Operation (POST /ports)**:
```
Client Request
  → Express Router
    → ports.controller.createPort()
      → Validate required fields
        → portModel.createPort(portData)
          → Prisma Client create()
            → PostgreSQL INSERT
              → Return created record
                → Controller formats response
                  → Client receives JSON
```

## Components and Interfaces

### 1. Prisma Schema (prisma/schema.prisma)

Defines the database schema and Prisma Client configuration.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Port {
  id         Int      @id @default(autoincrement())
  unlocode   String   @unique @db.VarChar(5)
  country    String   @db.VarChar(255)
  name       String   @db.VarChar(255)
  port_role  PortRole
  status     PortStatus @default(active)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([country])
  @@index([status])
  @@index([port_role])
  @@map("ports")
}

enum PortRole {
  ORIGIN
  DESTINATION
}

enum PortStatus {
  active
  passive
}
```

**Design Decisions**:
- `id` as auto-increment primary key for database efficiency
- `unlocode` as unique constraint (business key)
- Indexes on frequently filtered fields (country, status, port_role)
- Enums for port_role and status to enforce data integrity
- Timestamps for audit trail
- VarChar limits based on data analysis (max observed lengths)

### 2. Prisma Client Singleton (utils/prisma.js)

Manages a single Prisma Client instance across the application lifecycle.

```javascript
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

// Ensure single instance in development (hot reload protection)
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

**Design Decisions**:
- Singleton pattern prevents connection pool exhaustion
- Conditional logging based on environment
- Hot reload protection for development mode
- Global reference prevents multiple instances during dev server restarts

### 3. Port Model Layer (utils/models/portModel.js)

Provides abstraction over Prisma Client for port-related database operations.

```javascript
import prisma from '../prisma.js';

/**
 * Find all ports with optional filtering and pagination
 * @param {Object} filters - { country?, status?, port_role? }
 * @param {Object} pagination - { page, limit }
 * @returns {Promise<{ports: Array, total: number}>}
 */
export const findAllPorts = async (filters = {}, pagination = { page: 1, limit: 10 }) => {
  const { country, status, port_role } = filters;
  const { page, limit } = pagination;

  const where = {};
  
  if (country) {
    where.country = {
      contains: country,
      mode: 'insensitive'
    };
  }
  
  if (status) {
    where.status = status.toLowerCase();
  }
  
  if (port_role) {
    where.port_role = port_role.toUpperCase();
  }

  const skip = (page - 1) * limit;

  const [ports, total] = await prisma.$transaction([
    prisma.port.findMany({
      where,
      skip,
      take: limit,
      orderBy: { unlocode: 'asc' }
    }),
    prisma.port.count({ where })
  ]);

  return { ports, total };
};

/**
 * Find a single port by UNLOCODE
 * @param {string} unlocode - Port UNLOCODE (case-insensitive)
 * @returns {Promise<Object|null>}
 */
export const findPortByCode = async (unlocode) => {
  return await prisma.port.findUnique({
    where: {
      unlocode: unlocode.toUpperCase()
    }
  });
};

/**
 * Create a new port
 * @param {Object} portData - { unlocode, country, name, port_role?, status? }
 * @returns {Promise<Object>}
 * @throws {Error} If unique constraint violated or validation fails
 */
export const createPort = async (portData) => {
  const { unlocode, country, name, port_role, status } = portData;
  
  return await prisma.port.create({
    data: {
      unlocode: unlocode.toUpperCase(),
      country,
      name,
      port_role: port_role ? port_role.toUpperCase() : 'DESTINATION',
      status: status ? status.toLowerCase() : 'active'
    }
  });
};

/**
 * Delete a port by UNLOCODE
 * @param {string} unlocode - Port UNLOCODE (case-insensitive)
 * @returns {Promise<Object>} Deleted port record
 * @throws {Error} If port not found
 */
export const deletePort = async (unlocode) => {
  return await prisma.port.delete({
    where: {
      unlocode: unlocode.toUpperCase()
    }
  });
};
```

**Design Decisions**:
- All functions are async and return Promises
- Case-insensitive search for country using Prisma's `contains` + `mode: 'insensitive'`
- UNLOCODE normalized to uppercase for consistency
- Transaction for count + findMany ensures consistency
- Default values applied at model layer (port_role: DESTINATION, status: active)
- Prisma errors bubble up to controller for proper HTTP status mapping

### 4. Updated Controller (controllers/ports.controller.js)

Modified to use model layer functions instead of direct JSON file operations.

```javascript
import * as portModel from '../utils/models/portModel.js';

const ok = (res, data, status = 200) => {
  res.status(status).json({ success: true, data });
};

const fail = (res, message, status = 400) => {
  res.status(status).json({ success: false, error: message });
};

export const getAllPorts = async (req, res, next) => {
  try {
    const { country, status, port_role } = req.query;
    const pageNum = Math.max(1, parseInt(req.query.page) || 1);
    const limitNum = Math.max(1, parseInt(req.query.limit) || 10);

    const filters = { country, status, port_role };
    const pagination = { page: pageNum, limit: limitNum };

    const { ports, total } = await portModel.findAllPorts(filters, pagination);

    const totalPages = Math.ceil(total / limitNum);

    ok(res, {
      ports,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPortByCode = async (req, res, next) => {
  try {
    const { code } = req.params;
    const port = await portModel.findPortByCode(code);

    if (!port) {
      return fail(res, 'Port not found', 404);
    }

    ok(res, { port });
  } catch (error) {
    next(error);
  }
};

export const createPort = async (req, res, next) => {
  try {
    const { unlocode, name, country } = req.body;
    const missing = [];

    if (!unlocode) missing.push('unlocode');
    if (!name) missing.push('name');
    if (!country) missing.push('country');

    if (missing.length > 0) {
      return fail(res, `Missing required fields: ${missing.join(', ')}`);
    }

    const newPort = await portModel.createPort(req.body);
    ok(res, { port: newPort }, 201);
  } catch (error) {
    // Prisma unique constraint violation
    if (error.code === 'P2002') {
      return fail(res, 'Port with this UN/LOCODE already exists', 409);
    }
    next(error);
  }
};

export const deletePort = async (req, res, next) => {
  try {
    const { code } = req.params;
    const removed = await portModel.deletePort(code);
    ok(res, { message: 'Port deleted successfully', port: removed });
  } catch (error) {
    // Prisma record not found
    if (error.code === 'P2025') {
      return fail(res, 'Port not found', 404);
    }
    next(error);
  }
};
```

**Design Decisions**:
- All controller functions now async
- Error handling with try-catch and next(error) for Express error middleware
- Prisma error codes mapped to appropriate HTTP status codes (P2002 → 409, P2025 → 404)
- Response format unchanged (maintains backward compatibility)
- Validation logic remains in controller (business logic layer)

### 5. Seed Script (prisma/seed.js)

One-time migration script to populate database from existing JSON file.

```javascript
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  const dataPath = join(__dirname, '../data/ports.json');
  const portsData = JSON.parse(readFileSync(dataPath, 'utf8'));

  let created = 0;
  let skipped = 0;
  const errors = [];

  for (const port of portsData) {
    try {
      await prisma.port.create({
        data: {
          unlocode: port.unlocode,
          country: port.country,
          name: port.name,
          port_role: port.port_role,
          status: port.status
        }
      });
      created++;
      console.log(`✓ Created port: ${port.unlocode}`);
    } catch (error) {
      if (error.code === 'P2002') {
        // Unique constraint violation - port already exists
        skipped++;
        console.log(`⊘ Skipped (already exists): ${port.unlocode}`);
      } else {
        errors.push({ unlocode: port.unlocode, error: error.message });
        console.error(`✗ Error creating port ${port.unlocode}:`, error.message);
      }
    }
  }

  console.log('\n=== Seed Summary ===');
  console.log(`Total records in JSON: ${portsData.length}`);
  console.log(`Successfully created: ${created}`);
  console.log(`Skipped (duplicates): ${skipped}`);
  console.log(`Errors: ${errors.length}`);

  if (errors.length > 0) {
    console.log('\nError details:');
    errors.forEach(e => console.log(`  - ${e.unlocode}: ${e.error}`));
  }
}

main()
  .catch((e) => {
    console.error('Seed script failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**Design Decisions**:
- Idempotent: safe to run multiple times (skips existing records)
- Detailed logging for transparency
- Summary report at completion
- Graceful error handling (continues on individual failures)
- Proper cleanup with $disconnect()

### 6. Application Startup (app.js modifications)

```javascript
import express from 'express';
import portsRouter from './routes/ports.routes.js';
import { errorHandler } from './utils/apiError.js';
import prisma from './utils/prisma.js';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} | ${req.method} ${req.url}`);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Ports API running' });
});

app.use('/ports', portsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// Error handling middleware (MUST be last)
app.use(errorHandler);

// Database connection test and server startup
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✓ Database connected successfully');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('✗ Failed to connect to database:', error);
    process.exit(1);
  }
}

// Graceful shutdown
async function shutdown() {
  console.log('\nShutting down gracefully...');
  await prisma.$disconnect();
  console.log('✓ Database disconnected');
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

startServer();
```

**Design Decisions**:
- Async startup function to test connection before accepting requests
- Fail-fast approach: exit if database unavailable
- Graceful shutdown handlers for SIGINT/SIGTERM
- Clear logging for operational visibility

### 7. Environment Configuration (.env)

```env
DATABASE_URL="postgresql://username:password@localhost:5432/ports_db?schema=public"
NODE_ENV="development"
PORT=3000
```

### 8. Package.json Updates

```json
{
  "name": "ports-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node app.js",
    "dev": "node --watch app.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "db:seed": "node prisma/seed.js"
  },
  "prisma": {
    "seed": "node prisma/seed.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "@prisma/client": "^6.1.0"
  },
  "devDependencies": {
    "prisma": "^6.1.0"
  }
}
```

## Data Models

### Port Entity

The Port entity represents a maritime port location with the following structure:

**Database Schema**:
```
Table: ports
├─ id: INTEGER (Primary Key, Auto-increment)
├─ unlocode: VARCHAR(5) (Unique, Not Null)
├─ country: VARCHAR(255) (Not Null)
├─ name: VARCHAR(255) (Not Null)
├─ port_role: ENUM('ORIGIN', 'DESTINATION') (Not Null)
├─ status: ENUM('active', 'passive') (Not Null, Default: 'active')
├─ createdAt: TIMESTAMP (Not Null, Default: now())
└─ updatedAt: TIMESTAMP (Not Null, Auto-update)

Indexes:
- PRIMARY KEY (id)
- UNIQUE (unlocode)
- INDEX (country)
- INDEX (status)
- INDEX (port_role)
```

**Field Specifications**:

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | Integer | PK, Auto-increment | Internal database identifier |
| unlocode | String(5) | Unique, Not Null | UN/LOCODE identifier (e.g., "USNYC") |
| country | String(255) | Not Null | Country name (e.g., "UNITED STATES") |
| name | String(255) | Not Null | Port name (e.g., "NEW YORK") |
| port_role | Enum | Not Null | Either "ORIGIN" or "DESTINATION" |
| status | Enum | Not Null, Default: active | Either "active" or "passive" |
| createdAt | DateTime | Not Null, Default: now() | Record creation timestamp |
| updatedAt | DateTime | Not Null, Auto-update | Record last update timestamp |

**Data Transformations**:
- UNLOCODE: Always stored in uppercase
- port_role: Stored in uppercase (ORIGIN/DESTINATION)
- status: Stored in lowercase (active/passive)
- country: Case-insensitive search supported
- Timestamps: Automatically managed by Prisma

**Validation Rules**:
- unlocode: Required, must be unique, 5 characters
- country: Required, non-empty string
- name: Required, non-empty string
- port_role: Must be one of: ORIGIN, DESTINATION
- status: Must be one of: active, passive

**API Response Format** (unchanged for backward compatibility):
```json
{
  "success": true,
  "data": {
    "port": {
      "id": 1,
      "unlocode": "USNYC",
      "country": "UNITED STATES",
      "name": "NEW YORK",
      "port_role": "DESTINATION",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Query Patterns**:
1. **List with filters**: `WHERE country LIKE '%value%' AND status = 'active' AND port_role = 'DESTINATION'`
2. **Pagination**: `OFFSET (page-1)*limit LIMIT limit`
3. **Find by code**: `WHERE unlocode = 'USNYC'`
4. **Count**: `SELECT COUNT(*) WHERE <filters>`


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Migration Idempotency

*For any* set of port records, running the seed script multiple times should result in the same database state as running it once, with no duplicate records created.

**Validates: Requirements 3.3, 3.5**

### Property 2: Pagination Correctness

*For any* valid page number and limit, the API should return exactly `limit` records (or fewer if on the last page), and the total count should match the actual number of records in the database matching the filters.

**Validates: Requirements 4.1**

### Property 3: Filter Correctness

*For any* combination of filter parameters (country, status, port_role), all returned ports should match the specified filters, and no matching ports should be excluded from the results.

**Validates: Requirements 4.2**

### Property 4: Lookup by UNLOCODE

*For any* UNLOCODE that exists in the database, a GET request should return that exact port record; for any UNLOCODE that does not exist, the API should return a 404 status code.

**Validates: Requirements 4.3**

### Property 5: Create-Retrieve Round Trip

*For any* valid port data (with required fields unlocode, name, country), creating a port via POST and then retrieving it via GET should return a port record with the same field values.

**Validates: Requirements 4.4**

### Property 6: Duplicate UNLOCODE Rejection

*For any* port that already exists in the database, attempting to create another port with the same UNLOCODE should fail with a 409 Conflict status code, and the database should remain unchanged.

**Validates: Requirements 4.5**

### Property 7: Delete Removes from Database

*For any* port that exists in the database, deleting it via DELETE request should result in that port no longer being retrievable via GET, and the delete response should include the deleted port's data.

**Validates: Requirements 4.6**

### Property 8: Delete Non-Existent Returns 404

*For any* UNLOCODE that does not exist in the database, a DELETE request should return a 404 status code and the database should remain unchanged.

**Validates: Requirements 4.7**

### Property 9: Response Format Consistency

*For any* API endpoint response (success or error), the response should follow the established format: `{ success: boolean, data?: object, error?: string }`, maintaining backward compatibility.

**Validates: Requirements 8.3**

### Property 10: Error Response Security

*For any* database error that occurs during request processing, the API response should not expose internal database error details (such as SQL queries, table names, or connection strings) to the client.

**Validates: Requirements 6.4**

## Error Handling

### Database Connection Errors

**Startup Connection Failure**:
- **Scenario**: PostgreSQL is unavailable when application starts
- **Behavior**: Log error message, exit with status code 1
- **Rationale**: Fail-fast approach prevents serving requests without database

**Runtime Connection Failure**:
- **Scenario**: Database connection lost during request processing
- **Behavior**: Return 503 Service Unavailable with generic error message
- **Rationale**: Indicates temporary service issue, client should retry

### Constraint Violation Errors

**Unique Constraint (P2002)**:
- **Scenario**: Attempt to create port with duplicate UNLOCODE
- **Behavior**: Return 409 Conflict with message "Port with this UN/LOCODE already exists"
- **Mapping**: Prisma error code P2002 → HTTP 409

**Not Found (P2025)**:
- **Scenario**: Attempt to update/delete non-existent port
- **Behavior**: Return 404 Not Found with message "Port not found"
- **Mapping**: Prisma error code P2025 → HTTP 404

**Foreign Key Constraint (P2003)**:
- **Scenario**: Constraint violation on related records (future-proofing)
- **Behavior**: Return 400 Bad Request with message "Invalid reference"
- **Mapping**: Prisma error code P2003 → HTTP 400

### Validation Errors

**Missing Required Fields**:
- **Scenario**: POST request without unlocode, name, or country
- **Behavior**: Return 400 Bad Request with message "Missing required fields: [field1, field2]"
- **Validation**: Performed in controller before database call

**Invalid Enum Values**:
- **Scenario**: port_role not in [ORIGIN, DESTINATION] or status not in [active, passive]
- **Behavior**: Prisma throws validation error, mapped to 400 Bad Request
- **Message**: "Invalid value for field [field_name]"

### Error Response Format

All errors follow consistent format:
```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

**Security Considerations**:
- Never expose Prisma error stack traces to clients
- Never expose SQL queries or database schema details
- Log full error details server-side for debugging
- Return generic messages for unexpected errors

### Error Handling Flow

```
Database Operation Error
  │
  ├─ Known Prisma Error Code?
  │  ├─ Yes → Map to appropriate HTTP status + message
  │  └─ No → Log full error, return 500 with generic message
  │
  └─ Pass to Express error middleware
     └─ errorHandler in utils/apiError.js
        └─ Format response, log, send to client
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests**: Focus on specific examples, edge cases, and integration points
**Property Tests**: Verify universal properties across all inputs through randomization

Together, these approaches provide complementary coverage: unit tests catch concrete bugs in specific scenarios, while property tests verify general correctness across a wide input space.

### Property-Based Testing

**Library**: We will use **fast-check** for JavaScript property-based testing.

**Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each test must reference its design document property via comment tag
- Tag format: `// Feature: prisma-postgres-integration, Property {number}: {property_text}`

**Property Test Implementation**:

Each correctness property from the design document must be implemented as a single property-based test. Examples:

```javascript
// Feature: prisma-postgres-integration, Property 1: Migration Idempotency
test('migration is idempotent', async () => {
  await fc.assert(
    fc.asyncProperty(fc.array(portGenerator()), async (ports) => {
      // Run migration twice with same data
      await seedDatabase(ports);
      const countAfterFirst = await prisma.port.count();
      
      await seedDatabase(ports);
      const countAfterSecond = await prisma.port.count();
      
      // Count should be the same
      expect(countAfterFirst).toBe(countAfterSecond);
    }),
    { numRuns: 100 }
  );
});

// Feature: prisma-postgres-integration, Property 5: Create-Retrieve Round Trip
test('created port can be retrieved with same data', async () => {
  await fc.assert(
    fc.asyncProperty(validPortGenerator(), async (portData) => {
      // Create port
      const created = await portModel.createPort(portData);
      
      // Retrieve port
      const retrieved = await portModel.findPortByCode(created.unlocode);
      
      // Should match
      expect(retrieved.unlocode).toBe(portData.unlocode.toUpperCase());
      expect(retrieved.name).toBe(portData.name);
      expect(retrieved.country).toBe(portData.country);
    }),
    { numRuns: 100 }
  );
});
```

**Generators**:
Property tests require custom generators for test data:

```javascript
// Generator for valid port data
const validPortGenerator = () => fc.record({
  unlocode: fc.stringOf(fc.constantFrom('A', 'B', 'C', 'D', 'E'), { minLength: 5, maxLength: 5 }),
  country: fc.string({ minLength: 3, maxLength: 50 }),
  name: fc.string({ minLength: 3, maxLength: 50 }),
  port_role: fc.constantFrom('ORIGIN', 'DESTINATION'),
  status: fc.constantFrom('active', 'passive')
});

// Generator for pagination parameters
const paginationGenerator = () => fc.record({
  page: fc.integer({ min: 1, max: 10 }),
  limit: fc.integer({ min: 1, max: 50 })
});

// Generator for filter combinations
const filterGenerator = () => fc.record({
  country: fc.option(fc.string({ minLength: 2 })),
  status: fc.option(fc.constantFrom('active', 'passive')),
  port_role: fc.option(fc.constantFrom('ORIGIN', 'DESTINATION'))
});
```

### Unit Testing

**Focus Areas**:
1. **Specific Examples**: Test known port data (e.g., "USNYC" for New York)
2. **Edge Cases**: Empty database, single record, maximum pagination
3. **Error Conditions**: Missing fields, invalid enum values, connection failures
4. **Integration**: Controller → Model → Prisma → Database flow

**Example Unit Tests**:

```javascript
describe('Port Model', () => {
  test('findPortByCode returns null for non-existent port', async () => {
    const result = await portModel.findPortByCode('XXXXX');
    expect(result).toBeNull();
  });

  test('createPort throws error for missing required fields', async () => {
    await expect(portModel.createPort({ unlocode: 'USNYC' }))
      .rejects.toThrow();
  });

  test('findAllPorts with empty database returns empty array', async () => {
    const { ports, total } = await portModel.findAllPorts();
    expect(ports).toEqual([]);
    expect(total).toBe(0);
  });
});

describe('Port Controller', () => {
  test('POST /ports with duplicate unlocode returns 409', async () => {
    await portModel.createPort({ unlocode: 'USNYC', name: 'New York', country: 'USA' });
    
    const response = await request(app)
      .post('/ports')
      .send({ unlocode: 'USNYC', name: 'New York', country: 'USA' });
    
    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
  });

  test('GET /ports/:code with invalid code returns 404', async () => {
    const response = await request(app).get('/ports/INVALID');
    expect(response.status).toBe(404);
  });
});
```

**Test Database Setup**:
- Use separate test database (e.g., `ports_db_test`)
- Reset database before each test suite
- Use transactions or cleanup after each test
- Mock Prisma Client for unit tests where appropriate

### Integration Testing

**Startup/Shutdown Tests**:
```javascript
test('application connects to database on startup', async () => {
  // Start app
  const server = await startServer();
  
  // Verify connection
  await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
  
  // Cleanup
  await server.close();
});

test('application disconnects gracefully on shutdown', async () => {
  const server = await startServer();
  
  // Trigger shutdown
  process.emit('SIGTERM');
  
  // Verify disconnection (Prisma client should be closed)
  await expect(prisma.$queryRaw`SELECT 1`).rejects.toThrow();
});
```

**Seed Script Tests**:
```javascript
test('seed script loads all ports from JSON', async () => {
  await runSeedScript();
  
  const count = await prisma.port.count();
  const jsonData = JSON.parse(readFileSync('./data/ports.json', 'utf8'));
  
  expect(count).toBe(jsonData.length);
});

test('seed script is idempotent', async () => {
  await runSeedScript();
  const countFirst = await prisma.port.count();
  
  await runSeedScript();
  const countSecond = await prisma.port.count();
  
  expect(countFirst).toBe(countSecond);
});
```

### Test Coverage Goals

- **Unit Tests**: 80%+ code coverage
- **Property Tests**: All 10 correctness properties implemented
- **Integration Tests**: All API endpoints and database operations
- **Edge Cases**: Connection failures, constraint violations, empty states

### Testing Tools

- **Test Framework**: Jest or Vitest
- **Property Testing**: fast-check
- **HTTP Testing**: supertest
- **Database**: Separate test database with Prisma migrations
- **Mocking**: Prisma Client mocking for isolated unit tests

