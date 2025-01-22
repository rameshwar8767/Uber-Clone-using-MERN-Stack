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
