# Express API Backend (Node.js + TS + MySQL)

This is the backend service for the User Management CRUD application, providing database operations and statistical aggregation using Sequelize ORM.

## 📂 Architecture Overview

The backend uses a standard Layered Repository-Service architecture:

- **Controllers**: Extracted HTTP request inputs and mapped to output response envelopes.
- **Services**: Business logic layer (email duplication checks, calculations).
- **Repositories**: Encapsulated raw Sequelize queries.
- **Models**: Defines table schemas and Sequelize field options.

---

## 🛠️ Database Setup & Commands

All database scripts use the Sequelize CLI under the hood, mapped to standard NPM scripts:

- **Create Database**:
  ```bash
  npm run db:create
  ```
- **Run Migrations**:
  ```bash
  npm run db:migrate
  ```
- **Seed Default Records**:
  ```bash
  npm run db:seed
  ```
- **Undo Migrations**:
  ```bash
  npm run db:undo
  ```

---

## 🚦 API Endpoints

All responses follow a standard JSON envelope format:
```json
{
  "success": true,
  "message": "Description",
  "data": ...
}
```

### 👤 User Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/users` | Retrieve all users (supports optional `search`, `company`, `role` query parameters) |
| **GET** | `/api/users/:id` | Retrieve user details by ID |
| **POST** | `/api/users` | Add a new user record (validated using Joi schemas) |
| **PUT** | `/api/users/:id` | Update an existing user record |
| **DELETE** | `/api/users/:id` | Permanently remove a user record |
| **GET** | `/api/users/stats` | Retrieve computed headcount, average salary, and top corporate employer |

---

## 🧪 Development Commands

- **Start Dev Server**:
  ```bash
  npm run dev
  ```
- **Compile TypeScript**:
  ```bash
  npm run build
  ```
- **Run ESLint Linter**:
  ```bash
  npm run lint
  ```
- **Run Prettier Formatter**:
  ```bash
  npm run format
  ```
