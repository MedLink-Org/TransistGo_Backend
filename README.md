# TransitGo Backend



- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL via Supabase
- **Auth:** JWT (jsonwebtoken) + bcryptjs for password hashing
- **Dev tooling:** nodemon

## Structure

```
TransistGo/
├── config/
│   └── db.js              # PostgreSQL connection pool
├── controllers/
│   ├── auth.controller.js
│   ├── route.controller.js
│   └── vehicle.controller.js
├── models/
│   ├── route.model.js
│   └── vehicle.model.js
├── middleware/
│   └── auth.js             # JWT verification middleware
├── routes/
│   ├── auth.routes.js
│   ├── route.routes.js
│   └── vehicle.routes.js
├── app.js                  # Express app config, middleware, route mounting
├── index.js                # Server entry point
├── .env
└── package.json
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:
   ```
   PORT=5000
   DATABASE_URL= postgresql://postgres.bzcpbwgjjuastbkqsxzl:Y8a3KehAstIUwfF5@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
   JWT_SECRET=
   ```

3. Run in development mode:
   ```bash
   npm run dev
   ```

The server will run at `http://localhost:5000` and log a confirmation once it connects to the database.

## Database Schema

Six tables: `users`, `vehicles`, `routes`, `trips`, `tickets`, `driver_locations`. All primary keys are UUIDs (`gen_random_uuid()`).

- **users** — passengers, drivers, admins (role-based)
- **vehicles** — plate number, capacity, assigned driver
- **routes** — origin, destination, fare, stops (JSONB)
- **trips** — a scheduled instance of a route, with driver + vehicle + departure time + status
- **tickets** — passenger bookings tied to a trip, with payment and boarding status
- **driver_locations** — live GPS pings tied to a trip, for real-time tracking

## Authentication

All protected endpoints require a JWT in the request header:

```
Authorization: Bearer <token>
```

Tokens are issued on register/login and expire after 7 days.

---

## API Endpoints

### Auth — `/auth`

#### `POST /auth/register`
Register a new user.

**Body:**
```json
{
  "name": "Test User",
  "email": "test@test.com",
  "password": "test123",
  "role": "passenger"
}
```
`role` must be one of: `passenger`, `driver`, `admin`.

**Response — 201 Created:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@test.com",
    "role": "passenger"
  },
  "token": "jwt-token-here"
}
```

**Errors:**
- `400` — missing required field
- `409` — email already registered

---

#### `POST /auth/login`
Log in an existing user.

**Body:**
```json
{
  "email": "test@test.com",
  "password": "test123"
}
```

**Response — 200 OK:**
```json
{
  "user": {
    "id": "uuid",
    "name": "Test User",
    "email": "test@test.com",
    "role": "passenger"
  },
  "token": "jwt-token-here"
}
```

**Errors:**
- `400` — missing email or password
- `401` — invalid credentials

---

### Routes — `/api/routes`

Represents transit routes (origin, destination, fare, stops) — not to be confused with Express routing.

#### `GET /api/routes`
Get all routes. No auth required.

**Response — 200 OK:**
```json
[
  {
    "id": "uuid",
    "name": "Main Gate - Hostel B",
    "origin": "Main Gate",
    "destination": "Hostel B",
    "fare": "100.00",
    "stops": [],
    "created_at": "2026-07-29T09:00:00.000Z"
  }
]
```

#### `GET /api/routes/:id`
Get a single route by ID. No auth required.

**Response — 200 OK:** single route object (as above)
**Errors:** `404` — route not found

#### `POST /api/routes`
Create a new route. **Requires auth.**

**Body:**
```json
{
  "name": "Main Gate - Hostel B",
  "origin": "Main Gate",
  "destination": "Hostel B",
  "fare": 100,
  "stops": []
}
```

**Response — 201 Created:** the created route object
**Errors:** `400` — missing required field

#### `PUT /api/routes/:id`
Update a route. **Requires auth.**

**Body:** same shape as create
**Response — 200 OK:** updated route object
**Errors:** `404` — route not found

#### `DELETE /api/routes/:id`
Delete a route. **Requires auth.**

**Response — 200 OK:**
```json
{ "message": "Route deleted" }
```
**Errors:** `404` — route not found

---

### Vehicles — `/api/vehicles`

#### `GET /api/vehicles`
Get all vehicles. No auth required.

**Response — 200 OK:**
```json
[
  {
    "id": "uuid",
    "plate_number": "ABC-123-XY",
    "capacity": 14,
    "driver_id": null,
    "created_at": "2026-07-29T09:00:00.000Z"
  }
]
```

#### `GET /api/vehicles/:id`
Get a single vehicle by ID. No auth required.

**Response — 200 OK:** single vehicle object
**Errors:** `404` — vehicle not found

#### `POST /api/vehicles`
Create a new vehicle. **Requires auth.**

**Body:**
```json
{
  "plate_number": "ABC-123-XY",
  "capacity": 14,
  "driver_id": null
}
```

**Response — 201 Created:** the created vehicle object
**Errors:**
- `400` — missing plate_number or capacity
- `409` — plate number already exists

#### `PUT /api/vehicles/:id`
Update a vehicle. **Requires auth.**

**Body:** same shape as create
**Response — 200 OK:** updated vehicle object
**Errors:** `404` — vehicle not found

#### `DELETE /api/vehicles/:id`
Delete a vehicle. **Requires auth.**

**Response — 200 OK:**
```json
{ "message": "Vehicle deleted" }
```
**Errors:** `404` — vehicle not found

---


