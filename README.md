# Hostel Management System (MERN)

A full-stack **Hostel Management System** built using the **MERN stack (MongoDB, Express, React, Node.js)** with **JWT authentication** and **role-based access control**.

- **Admin**: manage users, students, rooms, fees, complaints
- **Warden**: manage hostel operations (complaints, leave approvals, visitors, rooms/students view)
- **Student**: submit complaints, leave requests, visitor entries; view fees, notices, mess

Repository: `https://github.com/NrushanshGarasia/SDP_PROJECT`

---

## Features

- **Authentication**: JWT login/register, protected routes
- **Roles**: Admin / Warden / Student with authorization guards
- **Modules**:
  - Users
  - Students + room assignment/deallocation
  - Rooms (create/update/delete, occupancy tracking)
  - Fees (create/mark paid/delete; student view + invoice/receipt download)
  - Complaints (student submit; admin/warden resolve + status workflow)
  - Leave requests (student submit; admin/warden approve/reject)
  - Visitors (student register; admin/warden approve/deny + mark exit)
  - Notices, Mess menu/records
- **Security**: helmet, rate limiting, sanitization, centralized error handling
- **Modern UI**: responsive forms/tables with consistent design system

---

## Tech Stack

**Backend**
- Node.js, Express.js
- MongoDB, Mongoose
- JWT, bcrypt
- express-validator, helmet, rate-limit, sanitizers

**Frontend**
- React (Vite)
- React Router
- Axios (central instance + interceptors)
- Tailwind + custom reusable CSS classes (`card`, `input`, `select`, `textarea`, `table`, `badge`, `btn`)
- jsPDF (fee invoice/receipt PDF)

---

## Installation & Setup

### 1) Clone and install

```bash
git clone https://github.com/NrushanshGarasia/SDP_PROJECT.git
cd SDP_PROJECT
```

### 2) Backend environment variables

Create `.env` in the project root:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=change_this_secret
JWT_EXPIRE=7d
```

### 3) Run backend

```bash
npm install
npm run dev
```

Backend will run on `http://localhost:5000`.

### 4) Run frontend

```bash
cd Frontend
npm install
npm run dev
```

Frontend will run on Vite (typically `http://localhost:5173`) and proxies `/api` to the backend.

---

## Folder Structure

```text
HostelManagementSystem/
├─ server/
│  ├─ config/          # DB connection
│  ├─ controllers/     # Route handlers
│  ├─ middleware/      # Auth, security, error handling, validation
│  ├─ models/          # Mongoose schemas
│  ├─ routes/          # API routes
│  ├─ services/        # Business logic layer
│  └─ index.js         # Server entry point
├─ Frontend/
│  ├─ src/
│  │  ├─ components/   # Layout, ProtectedRoute, shared UI
│  │  ├─ context/      # AuthContext
│  │  ├─ pages/        # Role-based pages
│  │  └─ utils/        # Axios instance
│  └─ vite.config.js   # Proxy config
├─ .env                # ignored
└─ README.md
```

---

## Common Scripts

**Backend (root)**
- `npm run dev` – start backend in development
- `npm start` – start backend in production

**Frontend (`Frontend/`)**
- `npm run dev` – start frontend dev server
- `npm run build` – build frontend
- `npm run preview` – preview production build

---

## API (high level)

All APIs are under `/api/*` (auth required unless otherwise noted).

- **Auth**: `/api/auth/*`
- **Users**: `/api/users/*` (admin)
- **Students**: `/api/students/*`
- **Rooms**: `/api/rooms/*`
- **Fees**: `/api/fees/*`
- **Complaints**: `/api/complaints/*`
- **Leave requests**: `/api/leave-requests/*`
- **Visitors**: `/api/visitors/*`
- **Notices**: `/api/notices/*`
- **Mess**: `/api/mess/*`

---

## Notes

- If you see `README.md` merge conflicts, resolve them and commit before pushing.
- If MongoDB is not running locally, start it before running the backend.
