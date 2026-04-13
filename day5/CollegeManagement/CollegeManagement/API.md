# College Management API

## Base URL
```
http://localhost:8000/v1/api/students
```

## Endpoints

### 1. Create Student
- **Method:** POST
- **URL:** `http://localhost:8000/v1/api/students/create`
- **Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "course": "Computer Science"
}
```

### 2. Get All Students
- **Method:** GET
- **URL:** `http://localhost:8000/v1/api/students/get`

### 3. Get Student by ID
- **Method:** GET
- **URL:** `http://localhost:8000/v1/api/students/get/1`

### 4. Update Student
- **Method:** PUT
- **URL:** `http://localhost:8000/v1/api/students/update/1`
- **Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "course": "IT"
}
```

### 5. Delete Student
- **Method:** DELETE
- **URL:** `http://localhost:8000/v1/api/students/delete/1`

## Headers
```
Content-Type: application/json
```

