# EasyTrip API Documentation

URL: ...

## Endpoints

List of available endpoints:

### Public

- `GET /public/destinations`
- `GET /public/destinations/:id`
- `GET /public/transportations`
- `GET /public/transportations/:id`
- `GET /public/accommodations`
- `GET /public/accommodations/:id`
- `GET /public/guides`
- `GET /public/guides/:id`

### Auth

- `GET /auth/google`
- `POST /auth/register`
- `POST /auth/login`

### Desinations

- `GET /destinations`
- `GET /destinations/:id`
- `POST /destinations`
- `POST /destinations/generate`
- `POST /destinations/:id/packages`
- `POST /destinations/:id/itinerary`
- `PUT /destinations/:id`
- `DELETE /destinations/:id`

### Transportations

- `GET /transportations`
- `GET /transportations/:id`
- `POST /transportations`
- `PUT /transportations/:id`
- `DELETE /transportations/:id`

### Accommodations

- `GET /accommodations`
- `GET /accommodations/:id`
- `POST /accommodations`
- `PUT /accommodations/:id`
- `DELETE /accommodations/:id`

### Guide

- `GET /guides`
- `GET /guides/:id`
- `POST /guides`
- `PUT /guides/:id`
- `DELETE /guides/:id`

### Users

- `GET /users`
- `GET /users/me`
- `PUT /users/me`

### Orders

- `GET /orders`
- `GET /orders/:id`

## Global Responses

### Response (401 - Unauthorized)

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Please login first"
}
```

OR

```json
{
  "statusCode": 401,
  "error": "Unauthorized",
  "message": "Invalid token"
}
```

### Response (403 - Forbidden)

```json
{
  "statusCode": 403,
  "error": "Forbidden",
  "message": "You are not allowed to access this resource"
}
```

### Response (404 - Not Found)

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "<entity_name> not found"
}
```

### Response (500 - Internal Server Error)

```json
{
  "statusCode": 500,
  "error": "Internal Server Error",
  "message": "Something went wrong"
}
```
