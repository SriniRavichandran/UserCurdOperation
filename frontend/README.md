# React Frontend client (TypeScript + Vite + Chakra UI)

This is the client interface for the User Management CRUD application, offering a responsive UI, database dashboard stats, sorting columns, search inputs, and modal operations.

## 📂 Folder Architecture

To ensure scalability, the client is structured under three main directories:

1. **`core/`**: Central application setups (Axios client `core/api/client.ts` and configuration constants `core/config/constants.ts`).
2. **`shared/`**: Common reusable files and components:
   - `layouts/`: Holds global layout containers (`MainLayout.tsx`).
   - `lib/validation/`: Form input validation logic (`user.schema.ts`).
3. **`page/`**: Encapsulates all page-specific views, state, and actions:
   - `components/`: UI pieces (table, search inputs, delete confirmations, stats cards).
   - `hooks/`: Declarative query React hooks (`useUsers`, `useUserStats`, `useUserMutations`).
   - `services/`: Specific services interfacing with backend endpoints.
   - `types/`: Page-specific TypeScript types.

---

## 🚦 Endpoint Modes

The client supports two data sources which can be dynamically toggled inside the header banner:

1. **Express API Server (Port 5000)**: Communicates with the live Node/Express + MySQL server.
2. **JSON Server (Port 5001)**: Communicates with a local lightweight mockup file database (`db.json`) for zero-database mock setups.

---

## 🧪 Development Commands

- **Run Dev Server**:
  ```bash
  npm run dev
  ```
  *Serves the app on `http://localhost:5173`*

- **Run Mock JSON Server**:
  ```bash
  npm run local
  ```
  *Serves database mockups on `http://localhost:5001`*

- **Build Assets for Production**:
  ```bash
  npm run build
  ```

- **Run ESLint Linter**:
  ```bash
  npm run lint
  ```
