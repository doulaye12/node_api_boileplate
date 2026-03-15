# 🚀 REST API — Node.js + Express + MySQL + Sequelize

> A production-ready RESTful API boilerplate with JWT authentication, MySQL database, and Sequelize ORM — built with a clean layered architecture.

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Database Setup](#database-setup)
  - [Running the Server](#running-the-server)
- [API Reference](#-api-reference)
  - [Authentication](#authentication)
- [Authentication Flow](#-authentication-flow)
- [Architecture](#-architecture)
- [Error Handling](#-error-handling)
- [Security](#-security)
- [Extending the Project](#-extending-the-project)
- [Scripts](#-scripts)
- [License](#-license)

---

## 🧭 Overview

This project is a **Node.js REST API** starter template featuring:

- **JWT-based authentication** with access tokens and refresh tokens
- **MySQL** database with **Sequelize ORM** (auto-sync, hooks, associations)
- **Layered architecture**: Routes → Controllers → Services → Models
- **Input validation** with `express-validator`
- **Centralized error handling** via custom `AppError` class
- **Secure password hashing** with `bcryptjs`
- Ready to extend with additional resources (users, products, posts, etc.)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (v18+) |
| Framework | Express.js v4 |
| Database | MySQL 8+ |
| ORM | Sequelize v6 |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| Validation | express-validator |
| HTTP Logging | morgan |
| Environment | dotenv |
| Dev Server | nodemon |

---

## 📁 Project Structure

```
.
├── src/
│   ├── config/
│   │   └── database.js          # Sequelize instance & connection config
│   ├── controllers/
│   │   └── auth.controller.js   # Request handlers (thin layer)
│   ├── middlewares/
│   │   ├── auth.middleware.js   # JWT protect + role restriction
│   │   └── validate.middleware.js # express-validator rules & runner
│   ├── models/
│   │   ├── index.js             # Model registry & associations
│   │   └── user.model.js        # User Sequelize model
│   ├── routes/
│   │   ├── index.js             # Root router (mounts all sub-routers)
│   │   └── auth.routes.js       # /auth endpoints
│   ├── services/
│   │   └── auth.service.js      # Business logic (register, login, etc.)
│   └── utils/
│       ├── AppError.js          # Custom operational error class
│       └── ApiResponse.js       # Standardized JSON response helpers
├── app.js                       # Express app setup (middlewares, routes, errors)
├── server.js                    # Entry point — DB connect & HTTP listen
├── .env                         # Local environment variables (not committed)
├── .env.example                 # Environment variable template
├── .gitignore
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites

Make sure the following are installed on your machine:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [MySQL](https://www.mysql.com/) 8.0 or higher

---

### Installation

**1. Clone or copy the project into your working directory:**

```bash
cd D:\codes\nodejs
```

**2. Install all dependencies:**

```bash
npm install
```

---

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Then edit `.env`:

```env
# Server
PORT=3000
NODE_ENV=development

# MySQL Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rest_api_db
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT Access Token
JWT_SECRET=your_super_secret_key_min_32_chars
JWT_EXPIRES_IN=7d

# JWT Refresh Token
JWT_REFRESH_SECRET=another_secret_key_for_refresh
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

### Database Setup

Create the database in MySQL before starting the server:

```sql
CREATE DATABASE rest_api_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Sequelize will automatically create and sync all tables on first startup (`sync({ alter: true })`). No migrations needed to get started.

---

### Running the Server

**Development mode** (with auto-reload via nodemon):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

On successful startup, you should see:

```
✅ MySQL connection established successfully.
✅ Models synchronized with the database.
🚀 Server running at http://localhost:3000
📌 Environment: development
```

---

## 📡 API Reference

### Base URL

```
http://localhost:3000/api/v1
```

### Health Check

```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

---

### Authentication

All response bodies follow this envelope:

```json
{
  "status": "success | fail | error",
  "message": "Human-readable message",
  "data": { ... }
}
```

---

#### Register

```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Validation Rules:**
- `username` — required, 3–50 characters
- `email` — required, valid email format
- `password` — required, minimum 6 characters

**Success Response `201`:**

```json
{
  "status": "success",
  "message": "Account created successfully.",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    },
    "accessToken": "<jwt_access_token>",
    "refreshToken": "<jwt_refresh_token>"
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| `409` | Email already in use |
| `422` | Validation failed |

---

#### Login

```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Success Response `200`:**

```json
{
  "status": "success",
  "message": "Login successful.",
  "data": {
    "user": { ... },
    "accessToken": "<jwt_access_token>",
    "refreshToken": "<jwt_refresh_token>"
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| `401` | Invalid email or password |
| `403` | Account is disabled |
| `422` | Validation failed |

---

#### Refresh Token

```http
POST /api/v1/auth/refresh-token
Content-Type: application/json
```

**Request Body:**

```json
{
  "refreshToken": "<your_refresh_token>"
}
```

**Success Response `200`:**

```json
{
  "status": "success",
  "message": "Tokens refreshed successfully.",
  "data": {
    "accessToken": "<new_access_token>",
    "refreshToken": "<new_refresh_token>"
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| `401` | Refresh token missing, invalid, or revoked |

---

#### Logout

> 🔒 Requires authentication

```http
POST /api/v1/auth/logout
Authorization: Bearer <access_token>
```

**Success Response `200`:**

```json
{
  "status": "success",
  "message": "Logout successful.",
  "data": null
}
```

---

#### Get My Profile

> 🔒 Requires authentication

```http
GET /api/v1/auth/me
Authorization: Bearer <access_token>
```

**Success Response `200`:**

```json
{
  "status": "success",
  "message": "Profile retrieved successfully.",
  "data": {
    "user": {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "role": "user",
      "isActive": true,
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

**Error Responses:**

| Status | Reason |
|--------|--------|
| `401` | Missing or expired access token |
| `404` | User not found |

---

## 🔄 Authentication Flow

```
┌─────────┐                          ┌─────────────┐            ┌──────────┐
│  Client │                          │  API Server │            │  MySQL   │
└────┬────┘                          └──────┬──────┘            └────┬─────┘
     │                                      │                        │
     │  POST /auth/register                 │                        │
     │ ─────────────────────────────────►   │                        │
     │                                      │  INSERT user           │
     │                                      │ ──────────────────►    │
     │                                      │  ◄──────────────────   │
     │  { accessToken, refreshToken }       │                        │
     │ ◄─────────────────────────────────   │                        │
     │                                      │                        │
     │  GET /auth/me                        │                        │
     │  Authorization: Bearer <token>       │                        │
     │ ─────────────────────────────────►   │                        │
     │                                      │  Verify JWT            │
     │                                      │  SELECT user           │
     │  { user profile }                    │ ──────────────────►    │
     │ ◄─────────────────────────────────   │                        │
     │                                      │                        │
     │  POST /auth/refresh-token            │                        │
     │ ─────────────────────────────────►   │                        │
     │                                      │  Verify + rotate       │
     │  { new accessToken, refreshToken }   │                        │
     │ ◄─────────────────────────────────   │                        │
```

---

## 🏗 Architecture

This API follows a **Layered (N-Tier) Architecture** pattern:

```
Request
  └─► Router          (src/routes/)        — URL matching & middleware wiring
        └─► Middleware (src/middlewares/)   — Auth guard, input validation
              └─► Controller (src/controllers/) — Parse req, call service, send res
                    └─► Service (src/services/)     — Business logic, DB queries
                          └─► Model (src/models/)       — Sequelize ORM, DB schema
```

**Key design decisions:**

- **Controllers are thin** — they only extract data from `req` and delegate to services.
- **Services hold all business logic** — making them independently testable.
- **Models handle data integrity** — via Sequelize validations and hooks (e.g., auto-hash password).
- **`AppError`** is the single source of truth for operational errors — caught by the global error handler in `app.js`.
- **`ApiResponse`** ensures every response follows the same envelope structure.

---

## ⚠️ Error Handling

All errors are caught by the global error middleware in `app.js`.

**Operational errors** (user-facing, predictable) are created with `AppError`:

```js
throw new AppError('Resource not found.', 404);
```

**Response format:**

```json
{
  "status": "fail",
  "message": "Resource not found."
}
```

In **development**, the stack trace is also included:

```json
{
  "status": "fail",
  "message": "Resource not found.",
  "stack": "Error: Resource not found.\n    at ..."
}
```

---

## 🔐 Security

| Feature | Implementation |
|---|---|
| Password hashing | `bcryptjs` with 12 salt rounds |
| Access tokens | JWT signed with `JWT_SECRET`, expires in 7 days |
| Refresh tokens | Stored in DB, rotated on every use, invalidated on logout |
| Route protection | `protect` middleware verifies Bearer token on every protected route |
| Role-based access | `restrictTo('admin')` middleware for privileged routes |
| Input sanitization | `express-validator` normalizes and validates all inputs |
| Sensitive fields | `password` and `refreshToken` are stripped from all API responses via `toSafeObject()` |

---

## 🧩 Extending the Project

### Add a new resource (e.g., Posts)

**1. Create the model** `src/models/post.model.js`

**2. Register it** in `src/models/index.js` and define associations:
```js
const Post = PostModel(sequelize);
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
```

**3. Add a service** `src/services/post.service.js`

**4. Add a controller** `src/controllers/post.controller.js`

**5. Add routes** `src/routes/post.routes.js`

**6. Mount the router** in `src/routes/index.js`:
```js
router.use('/posts', postRoutes);
```

### Restrict a route to admins

```js
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.delete('/:id', protect, restrictTo('admin'), deleteUser);
```

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start with nodemon (auto-reload on file changes) |
| `npm start` | Start in production mode |

---

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

> Built with ❤️ using Node.js, Express, Sequelize and MySQL.