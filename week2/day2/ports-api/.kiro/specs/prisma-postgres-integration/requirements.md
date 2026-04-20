# Requirements Document

## Introduction

This document specifies the requirements for integrating Prisma ORM with PostgreSQL database connectivity into the existing Express.js Ports API. The system currently uses file-based JSON storage and will be migrated to use PostgreSQL as the persistent data store while maintaining all existing API functionality.

## Glossary

- **Ports_API**: The Express.js application that provides REST endpoints for managing port data
- **Prisma_Client**: The auto-generated database client provided by Prisma ORM
- **Database_Schema**: The PostgreSQL table structure defined in the Prisma schema file
- **Migration_Script**: A script that transfers existing port data from JSON file to PostgreSQL database
- **Port_Record**: A data entity representing a maritime port with fields: unlocode, country, name, port_role, and status
- **UNLOCODE**: United Nations Code for Trade and Transport Locations, a unique identifier for ports

## Requirements

### Requirement 1: Prisma ORM Integration

**User Story:** As a developer, I want to integrate Prisma ORM into the application, so that I can use a type-safe database client for PostgreSQL operations.

#### Acceptance Criteria

1. THE Ports_API SHALL include Prisma as a project dependency
2. THE Database_Schema SHALL define a Port model with fields: id (auto-increment integer), unlocode (unique string), country (string), name (string), port_role (enum: ORIGIN or DESTINATION), status (enum: active or passive), createdAt (timestamp), and updatedAt (timestamp)
3. THE Prisma_Client SHALL be generated from the Database_Schema
4. THE Ports_API SHALL initialize the Prisma_Client as a singleton instance accessible to all controllers

### Requirement 2: PostgreSQL Database Connection

**User Story:** As a developer, I want to establish a PostgreSQL database connection, so that the application can persist data reliably.

#### Acceptance Criteria

1. THE Ports_API SHALL connect to a PostgreSQL database using connection parameters from environment variables
2. WHEN the application starts, THE Ports_API SHALL verify the database connection is established
3. IF the database connection fails, THEN THE Ports_API SHALL log the error and exit with a non-zero status code
4. WHEN the application shuts down, THE Ports_API SHALL gracefully disconnect from the database

### Requirement 3: Data Migration from JSON to PostgreSQL

**User Story:** As a system administrator, I want to migrate existing port data from the JSON file to PostgreSQL, so that no data is lost during the transition.

#### Acceptance Criteria

1. THE Migration_Script SHALL read all Port_Records from the data/ports.json file
2. THE Migration_Script SHALL insert each Port_Record into the PostgreSQL database using the Prisma_Client
3. IF a Port_Record with the same unlocode already exists in the database, THEN THE Migration_Script SHALL skip that record and log a warning
4. WHEN the migration completes, THE Migration_Script SHALL report the total number of records migrated and any errors encountered
5. THE Migration_Script SHALL be idempotent, allowing safe re-execution without duplicating data

### Requirement 4: Database-Backed CRUD Operations

**User Story:** As an API consumer, I want all port operations to use the PostgreSQL database, so that data persists across application restarts.

#### Acceptance Criteria

1. WHEN a GET request is made to retrieve all ports, THE Ports_API SHALL query the database using the Prisma_Client and return Port_Records with pagination
2. WHEN a GET request is made with filter parameters (country, status, port_role), THE Ports_API SHALL apply those filters in the database query
3. WHEN a GET request is made to retrieve a port by UNLOCODE, THE Ports_API SHALL query the database and return the matching Port_Record or a 404 error
4. WHEN a POST request is made to create a new port, THE Ports_API SHALL validate required fields (unlocode, name, country) and insert the Port_Record into the database
5. IF a POST request attempts to create a port with a duplicate UNLOCODE, THEN THE Ports_API SHALL return a 409 conflict error
6. WHEN a DELETE request is made to remove a port by UNLOCODE, THE Ports_API SHALL delete the Port_Record from the database and return the deleted record
7. IF a DELETE request targets a non-existent UNLOCODE, THEN THE Ports_API SHALL return a 404 error

### Requirement 5: Environment Configuration

**User Story:** As a developer, I want database connection details to be configurable via environment variables, so that I can deploy the application to different environments without code changes.

#### Acceptance Criteria

1. THE Ports_API SHALL read the DATABASE_URL environment variable for PostgreSQL connection string
2. WHERE the DATABASE_URL is not provided, THE Ports_API SHALL use a default connection string for local development
3. THE Ports_API SHALL support a .env file for local environment configuration
4. THE Ports_API SHALL not commit sensitive database credentials to version control

### Requirement 6: Error Handling and Logging

**User Story:** As a developer, I want comprehensive error handling for database operations, so that I can diagnose and fix issues quickly.

#### Acceptance Criteria

1. WHEN a database operation fails, THE Ports_API SHALL log the error with sufficient context (operation type, parameters, error message)
2. WHEN a database constraint violation occurs, THE Ports_API SHALL return an appropriate HTTP status code (400 for validation errors, 409 for conflicts)
3. WHEN a database connection error occurs during a request, THE Ports_API SHALL return a 503 Service Unavailable error
4. THE Ports_API SHALL not expose internal database error details in API responses to clients

### Requirement 7: Data Integrity and Constraints

**User Story:** As a system administrator, I want the database to enforce data integrity rules, so that invalid data cannot be stored.

#### Acceptance Criteria

1. THE Database_Schema SHALL enforce UNLOCODE as a unique constraint
2. THE Database_Schema SHALL enforce NOT NULL constraints on unlocode, country, and name fields
3. THE Database_Schema SHALL enforce enum constraints on port_role (ORIGIN, DESTINATION) and status (active, passive)
4. WHEN an insert or update violates a constraint, THE Prisma_Client SHALL throw an error that the Ports_API handles appropriately

### Requirement 8: Backward Compatibility

**User Story:** As an API consumer, I want the API endpoints and response formats to remain unchanged, so that my existing integrations continue to work.

#### Acceptance Criteria

1. THE Ports_API SHALL maintain all existing endpoint paths (/ports, /ports/:code)
2. THE Ports_API SHALL maintain all existing query parameters (country, status, port_role, page, limit)
3. THE Ports_API SHALL maintain the existing JSON response format with success/error structure
4. THE Ports_API SHALL maintain the existing HTTP status codes for all operations
