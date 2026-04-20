# Implementation Plan: Prisma PostgreSQL Integration

## Overview

This plan implements the migration from file-based JSON storage to PostgreSQL database using Prisma ORM. The implementation maintains complete backward compatibility with existing API endpoints while adding robust database persistence, connection management, and data migration capabilities.

## Tasks

- [x] 1. Set up Prisma ORM and database schema
  - Install Prisma dependencies (@prisma/client, prisma as devDependency)
  - Initialize Prisma with `prisma init`
  - Create prisma/schema.prisma with Port model, enums (PortRole, PortStatus), and database configuration
  - Add indexes for country, status, and port_role fields
  - Create .env file with DATABASE_URL for PostgreSQL connection
  - Update package.json with Prisma scripts (prisma:generate, prisma:migrate, db:seed)
  - _Requirements: 1.1, 1.2, 5.1, 5.2, 5.3, 5.4_

- [x] 2. Create Prisma Client singleton and model layer
  - [x] 2.1 Create utils/prisma.js singleton
    - Implement Prisma Client singleton with hot-reload protection
    - Configure conditional logging based on NODE_ENV
    - _Requirements: 1.3, 1.4_
  
  - [x] 2.2 Create utils/models/portModel.js
    - Implement findAllPorts(filters, pagination) with transaction for count + findMany
    - Implement findPortByCode(unlocode) with case-insensitive lookup
    - Implement createPort(portData) with uppercase normalization and defaults
    - Implement deletePort(unlocode) with case-insensitive lookup
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.6_
  
  - [ ]* 2.3 Write property test for pagination correctness
    - **Property 2: Pagination Correctness**
    - **Validates: Requirements 4.1**
  
  - [ ]* 2.4 Write property test for filter correctness
    - **Property 3: Filter Correctness**
    - **Validates: Requirements 4.2**

- [x] 3. Update controller to use model layer
  - [x] 3.1 Refactor ports.controller.js to use portModel functions
    - Update getAllPorts to call portModel.findAllPorts with async/await
    - Update getPortByCode to call portModel.findPortByCode with async/await
    - Update createPort to call portModel.createPort with async/await
    - Update deletePort to call portModel.deletePort with async/await
    - Add try-catch blocks and next(error) for error handling
    - Map Prisma error codes (P2002 → 409, P2025 → 404)
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 6.1, 6.2_
  
  - [ ]* 3.2 Write property test for create-retrieve round trip
    - **Property 5: Create-Retrieve Round Trip**
    - **Validates: Requirements 4.4**
  
  - [ ]* 3.3 Write property test for duplicate UNLOCODE rejection
    - **Property 6: Duplicate UNLOCODE Rejection**
    - **Validates: Requirements 4.5**
  
  - [ ]* 3.4 Write unit tests for controller error handling
    - Test missing required fields returns 400
    - Test duplicate UNLOCODE returns 409
    - Test non-existent port returns 404
    - _Requirements: 4.3, 4.5, 4.7_

- [ ] 4. Checkpoint - Ensure model and controller tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement database connection lifecycle
  - [x] 5.1 Update app.js with async startup function
    - Create startServer() async function that tests connection with prisma.$connect()
    - Add error handling: log error and exit(1) if connection fails
    - Move app.listen() inside startServer() after successful connection
    - _Requirements: 2.1, 2.2, 2.3_
  
  - [x] 5.2 Add graceful shutdown handlers
    - Create shutdown() async function that calls prisma.$disconnect()
    - Register SIGINT and SIGTERM handlers
    - _Requirements: 2.4_
  
  - [ ]* 5.3 Write integration tests for connection lifecycle
    - Test application connects on startup
    - Test application exits on connection failure
    - Test graceful disconnection on shutdown
    - _Requirements: 2.2, 2.3, 2.4_

- [x] 6. Create data migration seed script
  - [x] 6.1 Create prisma/seed.js
    - Read data/ports.json file
    - Loop through ports and create each using prisma.port.create()
    - Handle P2002 errors (duplicates) by skipping and logging
    - Track created, skipped, and error counts
    - Print summary report at completion
    - Add proper cleanup with prisma.$disconnect() in finally block
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 6.2 Write property test for migration idempotency
    - **Property 1: Migration Idempotency**
    - **Validates: Requirements 3.3, 3.5**
  
  - [ ]* 6.3 Write unit tests for seed script
    - Test seed loads all ports from JSON
    - Test seed handles duplicate records gracefully
    - Test seed reports accurate counts
    - _Requirements: 3.4_

- [ ] 7. Implement comprehensive error handling
  - [ ] 7.1 Update error handling in controller
    - Add database connection error handling (return 503)
    - Ensure no internal error details exposed in responses
    - Add detailed server-side logging for all errors
    - _Requirements: 6.1, 6.3, 6.4_
  
  - [ ]* 7.2 Write property test for error response security
    - **Property 10: Error Response Security**
    - **Validates: Requirements 6.4**
  
  - [ ]* 7.3 Write unit tests for error scenarios
    - Test constraint violations return appropriate status codes
    - Test database errors return 503
    - Test error responses don't expose internal details
    - _Requirements: 6.2, 6.3, 6.4_

- [ ] 8. Verify backward compatibility
  - [ ]* 8.1 Write property test for response format consistency
    - **Property 9: Response Format Consistency**
    - **Validates: Requirements 8.3**
  
  - [ ]* 8.2 Write integration tests for API endpoints
    - Test GET /ports maintains response format
    - Test GET /ports/:code maintains response format
    - Test POST /ports maintains response format
    - Test DELETE /ports/:code maintains response format
    - Test all query parameters work (country, status, port_role, page, limit)
    - _Requirements: 8.1, 8.2, 8.3, 8.4_
  
  - [ ]* 8.3 Write property tests for delete operations
    - **Property 7: Delete Removes from Database**
    - **Property 8: Delete Non-Existent Returns 404**
    - **Validates: Requirements 4.6, 4.7**

- [ ] 9. Final checkpoint - Run all tests and verify functionality
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Property tests require fast-check library and minimum 100 iterations
- Use separate test database (e.g., ports_db_test) for all testing
- Run `npx prisma migrate dev` to create database schema before implementation
- Run `npm run db:seed` after migration to populate database from JSON
- All property tests must include comment tag: `// Feature: prisma-postgres-integration, Property {N}: {title}`
