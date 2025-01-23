# User Registration API Documentation

## Register User Endpoint

### `POST /users/register`

Register a new user in the system.

### Request Body

```json
{
    "name": "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| name | string | User's full name |
| email | string | User's email address |
| password | string | User's password (min 6 characters) |
| phoneNumber | string | User's phone number |

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 201 | User successfully created |
| 400 | Bad Request - Invalid input data |
| 409 | Conflict - Email already exists |
| 500 | Internal Server Error |

### Example Response (Success)

```json
{
    "status": "success",
    "message": "User registered successfully",
    "data": {
        "userId": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "1234567890"
    }
}
```

### Example Response (Error)

```json
{
    "status": "error",
    "message": "Email already exists"
}
```

## Login User Endpoint

### `POST /users/login`

Authenticate a user and receive an access token.

### Request Body

```json
{
    "email": "string",
    "password": "string"
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| email | string | User's registered email address |
| password | string | User's password (min 6 characters) |

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Login successful |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Invalid credentials |
| 500 | Internal Server Error |

### Example Response (Success)

```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "token": "jwt_token_string",
        "user": {
            "userId": "uuid",
            "name": "John Doe",
            "email": "john@example.com"
        }
    }
}
```

### Example Response (Error)

```json
{
    "status": "error",
    "message": "Invalid email or password"
}
```

## Get User Profile Endpoint

### `GET /users/profile`

Retrieve the authenticated user's profile information.

### Headers

| Name | Type | Description |
|------|------|-------------|
| Authorization | string | Bearer token (required) |

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Profile retrieved successfully |
| 401 | Unauthorized - Invalid or missing token |
| 500 | Internal Server Error |

### Example Response (Success)

```json
{
    "status": "success",
    "data": {
        "userId": "uuid",
        "firstname": "John",
        "lastname": "Doe",
        "email": "john@example.com"
    }
}
```

## Logout User Endpoint

### `GET /users/logout`

Logout the currently authenticated user and invalidate their token.

### Headers

| Name | Type | Description |
|------|------|-------------|
| Authorization | string | Bearer token (required) |

### Response Status Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Successfully logged out |
| 401 | Unauthorized - Invalid or missing token |
| 500 | Internal Server Error |

### Example Response (Success)

```json
{
    "status": "success",
    "message": "Successfully logged out"
}
```

# Captain API Documentation

## Register Captain Endpoint

### `POST /captain/register`

Register a new captain in the system.

### Request Body
```javascript
{
    fullname: {
        firstname: "John", // required, captain's first name
        lastname: "Doe"    // required, captain's last name
    },
    email: "john@example.com",      // required, must be unique and valid email
    password: "password123",        // required, minimum 6 characters
    phoneNumber: "+1234567890",     // required, must be unique
    vehicle: {
        color: "Black",             // required, vehicle color
        plate: "ABC-123",           // required, vehicle plate number
        capacity: 4,                // required, number of seats
        vehicleType: "Sedan"        // required, type of vehicle
    }
}
```

### Success Response (201)
```javascript
{
    message: "Captain registered successfully",
    token: "jwt_token_string",      // JWT token for authentication
    captain: {
        id: "captain_id",           // MongoDB ObjectId
        fullname: {
            firstname: "John",
            lastname: "Doe"
        },
        email: "john@example.com",
        phoneNumber: "+1234567890"
    }
}
```

## Login Captain Endpoint

### `POST /captain/login`

### Request Body
```javascript
{
    email: "john@example.com",      // required, registered email
    password: "password123"         // required, minimum 6 characters
}
```

### Success Response (200)
```javascript
{
    message: "Login successful",
    token: "jwt_token_string",      // JWT token for authentication
    captain: {
        id: "captain_id",           // MongoDB ObjectId
        fullname: {
            firstname: "John",
            lastname: "Doe"
        },
        email: "john@example.com"
    }
}
```

## Get Captain Profile Endpoint

### `GET /captain/profile`

Requires Authentication Header: `Authorization: Bearer <token>`

### Success Response (200)
```javascript
{
    captain: {
        id: "captain_id",
        fullname: {
            firstname: "John",
            lastname: "Doe"
        },
        email: "john@example.com",
        phoneNumber: "+1234567890",
        vehicle: {
            color: "Black",
            plate: "ABC-123",
            capacity: 4,
            vehicleType: "Sedan"
        },
        // Other captain details excluding sensitive information
    }
}
```

## Logout Captain Endpoint

### `GET /captain/logout`

Requires Authentication Header: `Authorization: Bearer <token>`

### Success Response (200)
```javascript
{
    message: "Logged out successfully"
}
```

### Error Responses for All Endpoints
```javascript
// 400 Bad Request
{
    errors: [
        {
            msg: "Error message",    // Validation error message
            param: "field_name",     // Field that caused the error
            location: "body"         // Location of the error
        }
    ]
}

// 401 Unauthorized
{
    message: "Invalid credentials"   // For login failures
    // OR
    message: "Authentication required" // For protected routes
}

// 500 Internal Server Error
{
    message: "Internal server error"
}
```
