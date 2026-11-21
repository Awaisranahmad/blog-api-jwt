

# Blog Platform API with JWT Authentication

A secure RESTful API for a blogging platform built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**. 
Registered users can create, update, and delete their own posts, while anyone can read published posts.

> **Internship Project:** Backend Web Development Track (Week 2 Task)

---

## 🚀 Features

- ✅ **User Authentication**: Register and Login with JWT token generation.
- ✅ **Password Security**: Passwords are hashed using **bcrypt** before saving.
- ✅ **Public Routes**: Anyone can read posts (`GET /api/posts`, `GET /api/posts/:id`).
- ✅ **Protected Routes**: Only authenticated users can create, update, or delete posts.
- ✅ **Authorization**: Users can only edit/delete their **own** posts (403 Forbidden otherwise).
- ✅ **Centralized Error Handling**: Professional error responses for validation, auth, and server errors..
- ✅ **Environment Variables**: Secure management of sensitive data using `.env`.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for building REST APIs |
| **MongoDB Atlas** | Cloud-based NoSQL database |
| **Mongoose** | ODM for MongoDB |
| **bcrypt** | Password hashing |
| **jsonwebtoken (JWT)** | Token generation and verification |
| **dotenv** | Environment variable management |
| **Nodemon** | Development tool for auto-restarting the server |
| **Postman** | API testing and documentation |

---

## 📁 Project Structure

```
blog-backend/
├── models/
│   ├── User.js              # Mongoose schema for users
│   └── Post.js              # Mongoose schema for blog posts
├── controllers/
│   ├── authController.js    # Register & Login logic
│   └── postController.js    # CRUD logic for posts
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   └── postRoutes.js        # Post endpoints (public + protected)
├── middleware/
│   └── authMiddleware.js    # JWT verification middleware
├── utils/
│   └── asycHandler.js      # Wrapper to catch async errors
├── tests/
│   ├── auth.test.js        # Login/register tests (no database needed)
│   └── models.test.js      # Mongoose validation tests
├── server.js                # Main application entry point
├── .env                     # Environment variables (ignored by Git)
├── .env.example             # Template for required variables
├── .gitignore               # Files ignored by Git
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

---

## 🏁 Getting Started (Setup Instructions)

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (Free tier is sufficient)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Awaisranahmad/blog-api-jwt.git
   cd blog-api-jwt
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy the example file and fill in your own values:
   ```bash
   cp .env.example .env
   ```
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/blogDB?retryWrites=true&w=majority
   JWT_SECRET=change-this-to-a-long-random-secret
   ```
   > **Replace** `<username>`, `<password>`, and `cluster0.xxxxx` with your actual MongoDB Atlas credentials. Never commit the real `.env` — it is git-ignored.

4. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will start at `http://localhost:5000`. You should see:
   ```
   ✅ Blog Database Connected Successfully!
   🚀 Blog Server started at http://localhost:5000
   ```

---

## 📡 API Documentation (Full CRUD + Authentication)

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Success Status | Error Status |
|--------|----------|-------------|--------------|----------------|--------------|
| **POST** | `/api/auth/register` | Register a new user | `{ "username": "...", "email": "...", "password": "..." }` | `201 Created` | `400`, `500` |
| **POST** | `/api/auth/login` | Login and get JWT token | `{ "email": "...", "password": "..." }` | `200 OK` | `401`, `500` |

### Post Endpoints

| Method | Endpoint | Description | Auth Required | Request Body | Success Status | Error Status |
|--------|----------|-------------|---------------|--------------|----------------|--------------|
| **GET** | `/api/posts` | Get all posts | ❌ No | None | `200 OK` | `500` |
| **GET** | `/api/posts/:id` | Get a single post by ID | ❌ No | None | `200 OK` | `400`, `404`, `500` |
| **POST** | `/api/posts` | Create a new post | ✅ Yes (Bearer Token) | `{ "title": "...", "content": "..." }` | `201 Created` | `400`, `401`, `500` |
| **PUT** | `/api/posts/:id` | Update a post (owner only) | ✅ Yes (Bearer Token) | `{ "title": "...", "content": "..." }` | `200 OK` | `400`, `401`, `403`, `404`, `500` |
| **DELETE** | `/api/posts/:id` | Delete a post (owner only) | ✅ Yes (Bearer Token) | None | `200 OK` | `401`, `403`, `404`, `500` |

---

### 🔐 How to Use Authentication (Bearer Token)

After logging in, you will receive a JWT token in the response. For all protected endpoints (`POST`, `PUT`, `DELETE`), you must include this token in the **Authorization** header:

```
Authorization: Bearer <your_jwt_token>
```

---

### 📝 Example Requests

#### 1. POST /api/auth/register (Register User)

**Request Body (JSON):**
```json
{
  "username": "awais_blogger",
  "email": "awais@blog.com",
  "password": "secret123"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User is register succesfully",
  "data": {
    "id": "6a7acb8e6bcfb971782c02d3",
    "username": "awais_blogger",
    "email": "awais@blog.com"
  }
}
```

---

#### 2. POST /api/auth/login (Login User)

**Request Body (JSON):**
```json
{
  "email": "awais@blog.com",
  "password": "secret123"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVk9j...",
  "data": {
    "id": "6a7acb8e6bcfb971782c02d3",
    "username": "awais_blogger",
    "email": "awais@blog.com"
  }
}
```

> **Note:** The `token` is the JWT that must be used for all protected endpoints.

---

#### 3. POST /api/posts (Create a Post) - Protected

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVk9j...
```

**Request Body (JSON):**
```json
{
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post. I am learning Node.js!"
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Post created successfully",
  "data": {
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. I am learning Node.js!",
    "author": "6a7acb8e6bcfb971782c02d3",
    "_id": "6a7acd7a6bcfb971782c02d8",
    "__v": 0
  }
}
```

---

#### 4. GET /api/posts (Get All Posts) - Public

**Request:** No body, no token required.

**Success Response (200 OK):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6a7acd7a6bcfb971782c02d8",
      "title": "My First Blog Post",
      "content": "This is the content of my first blog post. I am learning Node.js!",
      "author": {
        "_id": "6a7acb8e6bcfb971782c02d3",
        "username": "awais_blogger",
        "email": "awais@blog.com"
      },
      "createdAt": "2026-08-11T12:21:42.000Z",
      "updatedAt": "2026-08-11T12:21:42.000Z"
    }
  ]
}
```

---

#### 5. PUT /api/posts/:id (Update a Post) - Protected (Owner Only)

**Headers:**
```
Authorization: Bearer <owner_token>
```

**Request Body (JSON):**
```json
{
  "title": "My Updated Blog Post",
  "content": "This content has been updated successfully!"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Post updated successfully",
  "data": {
    "_id": "6a7acd7a6bcfb971782c02d8",
    "title": "My Updated Blog Post",
    "content": "This content has been updated successfully!",
    "author": "6a7acb8e6bcfb971782c02d3",
    "__v": 0
  }
}
```

---

#### 6. DELETE /api/posts/:id (Delete a Post) - Protected (Owner Only)

**Headers:**
```
Authorization: Bearer <owner_token>
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Post deleted successfully",
  "data": {
    "_id": "6a7acd7a6bcfb971782c02d8",
    "title": "My Updated Blog Post",
    "content": "This content has been updated successfully!",
    "author": "6a7acb8e6bcfb971782c02d3",
    "__v": 0
  }
}
```

---

#### 7. Unauthorized / Forbidden Response (401 / 403)

**When no token is provided:**
```json
{
  "success": false,
  "message": "Not authorized, no token provided"
}
```

**When a user tries to update/delete someone else's post (403 Forbidden):**
```json
{
  "success": false,
  "message": "You are not authorized to update this post"
}
```

---

## 🧪 Tests

Run the test suite (no database or API key needed — the User model and bcrypt are stubbed, the real JWT is signed with a throwaway test secret):

```bash
npm test
```

15 tests cover: login with a wrong password must fail (regression test for the auth bypass fixed on 2026-11-21), login/register validation, and Mongoose model validation (including the Post `timestamps` option).

---

## 📝 Changelog

- **2026-11-21 — Auth + data fixes:** fixed a login bypass — `bcrypt.compare` ran but its result was never checked (`if (!password)` instead of `if (!isPasswordCorrect)`), so any password worked for an existing email. Fixed the `require('../models/User')` case mismatch (file is `user.js`), which crashed the app on Linux. Fixed the Post schema typo `timestamp: true` → `timestamps: true`, so `createdAt`/`updatedAt` are now set and sorting by `createdAt` works. Fixed `package.json` `main` (`index.js` → `server.js`), added `.env.example` and a `node:test` suite (`tests/`, 15 tests, `npm test`), and corrected the README (utils filename, Postman collection file does not exist).

---

## 🧪 Error Handling Strategy

The API uses a **Centralized Error Handling Middleware** to catch all errors in one place.

- **400 Bad Request**: Validation errors (e.g., missing fields, invalid ID format).
- **401 Unauthorized**: Missing or invalid JWT token.
- **403 Forbidden**: User is not the owner of the post.
- **404 Not Found**: Post or User not found in the database.
- **500 Internal Server Error**: Unexpected server-side issues.

---

## 📸 Postman Testing Screenshots

### 1. User Registration (201 Created)
<img width="1911" height="993" alt="Screenshot 2026-08-08 222521" src="https://github.com/user-attachments/assets/dafb5f30-7a60-4832-b575-777287973d25" />


### 2. User Login & JWT Token (200 OK)
<img width="1911" height="991" alt="Screenshot 2026-08-08 223005" src="https://github.com/user-attachments/assets/46de5611-5757-4384-944f-9d1015e564a0" />


### 3. Create Post (201 Created - Authenticated)
<img width="938" height="1013" alt="Screenshot 2026-08-11 122142" src="https://github.com/user-attachments/assets/425c13a1-bef8-40be-99ec-d8b8c16faeaf" />


### 4. Delete Post (200 OK - Owner)
<img width="945" height="1007" alt="Screenshot 2026-08-11 122633" src="https://github.com/user-attachments/assets/219275aa-1f67-471d-8c12-bdc4e753a93d" />


### 5. Forbidden (403) - Unauthorized Update Attempt
<img width="947" height="1015" alt="Screenshot 2026-08-11 123529" src="https://github.com/user-attachments/assets/7f468cb1-3596-4426-8e18-5800d054fedb" />


---

## 📦 Postman Collection

No Postman collection file is in the repo yet — the screenshots above show the tested requests. (An earlier README version claimed a `Blog-API.postman_collection.json` file; it was never committed.)

---

## 👨‍💻 Author

**Rana Awais Ahmad**  
- GitHub: [Awaisranahmad](https://github.com/Awaisranahmad)  
- Project Repository: [blog-api-jwt](https://github.com/Awaisranahmad/blog-api-jwt)

---

## 📅 Completion Status

- ✅ **Week 2 (Task 2):** JWT Authentication + Full CRUD with Authorization.
- ✅ **Public Routes:** GET /api/posts and GET /api/posts/:id.
- ✅ **Protected Routes:** POST, PUT, DELETE with ownership checks.
- ✅ **Error Handling:** 401, 403, 404, 400 handled properly.
- ✅ **Documentation:** Complete README and Postman collection provided.
```

