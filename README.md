# Hostel Management System

A comprehensive Hostel Management System built with MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

```
HostelManagementSystem/
├── server/                 # Backend
│   ├── config/            # Configuration files
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # Express routes
│   ├── services/          # Business logic
│   └── index.js           # Server entry point
└── package.json
```

## Features

- JWT Authentication
- Role-based Access Control (Admin, Warden, Student)
- RESTful API Architecture
- MongoDB Database
- Password Hashing with bcrypt

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hostel_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**Important:** Make sure MongoDB is running on your system before starting the server.

3. Start the server:
```bash
# From the root directory (recommended)
npm start          # Production mode
npm run dev        # Development mode (with nodemon)

# OR from the server directory
cd server
npm start          # Production mode
npm run dev        # Development mode
```

**Note:** The `.env` file should be in the root directory of the project.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Users (Admin only)
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/toggle-status` - Activate/Deactivate user
- `DELETE /api/users/:id` - Delete user

### Students
- `GET /api/students` - Get all students (Admin, Warden)
- `GET /api/students/me` - Get my profile (Student)
- `GET /api/students/:id` - Get single student
- `POST /api/students` - Create student (Admin, Warden)
- `PUT /api/students/:id` - Update student (Admin, Warden)
- `PUT /api/students/:id/assign-room` - Assign room to student
- `DELETE /api/students/:id` - Delete student (Admin)

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get single room
- `POST /api/rooms` - Create room (Admin, Warden)
- `PUT /api/rooms/:id` - Update room (Admin, Warden)
- `DELETE /api/rooms/:id` - Delete room (Admin)

### Fees
- `GET /api/fees` - Get all fees (Admin, Warden)
- `GET /api/fees/me` - Get my fees (Student)
- `GET /api/fees/:id` - Get single fee
- `POST /api/fees` - Create fee (Admin, Warden)
- `PUT /api/fees/:id` - Update fee (Admin, Warden)
- `PUT /api/fees/:id/pay` - Pay fee
- `DELETE /api/fees/:id` - Delete fee (Admin)

### Complaints
- `GET /api/complaints` - Get all complaints (Admin, Warden)
- `GET /api/complaints/me` - Get my complaints (Student)
- `GET /api/complaints/:id` - Get single complaint
- `POST /api/complaints` - Create complaint (Student)
- `PUT /api/complaints/:id` - Update complaint (Admin, Warden)
- `PUT /api/complaints/:id/resolve` - Resolve complaint (Admin, Warden)
- `DELETE /api/complaints/:id` - Delete complaint (Admin)

### Leave Requests
- `GET /api/leave-requests` - Get all leave requests (Admin, Warden)
- `GET /api/leave-requests/me` - Get my leave requests (Student)
- `GET /api/leave-requests/:id` - Get single leave request
- `POST /api/leave-requests` - Create leave request (Student)
- `PUT /api/leave-requests/:id` - Update leave request (Student)
- `PUT /api/leave-requests/:id/approve` - Approve/Reject leave request (Admin, Warden)
- `DELETE /api/leave-requests/:id` - Delete leave request (Student)

### Visitors
- `GET /api/visitors` - Get all visitors (Admin, Warden)
- `GET /api/visitors/me` - Get my visitors (Student)
- `GET /api/visitors/:id` - Get single visitor
- `POST /api/visitors` - Create visitor entry (Student)
- `PUT /api/visitors/:id` - Update visitor (Admin, Warden)
- `PUT /api/visitors/:id/exit` - Mark visitor exit (Admin, Warden)
- `DELETE /api/visitors/:id` - Delete visitor (Admin)

### Notices
- `GET /api/notices` - Get all notices
- `GET /api/notices/active` - Get active notices
- `GET /api/notices/:id` - Get single notice
- `POST /api/notices` - Create notice (Admin, Warden)
- `PUT /api/notices/:id` - Update notice (Admin, Warden)
- `DELETE /api/notices/:id` - Delete notice (Admin, Warden)

### Mess Management
- `GET /api/mess/records` - Get all mess records (Admin, Warden)
- `GET /api/mess/records/me` - Get my mess records (Student)
- `POST /api/mess/records` - Create mess record (Admin, Warden)
- `PUT /api/mess/records/:id` - Update mess record (Admin, Warden)
- `DELETE /api/mess/records/:id` - Delete mess record (Admin, Warden)
- `GET /api/mess/menu` - Get all menus
- `GET /api/mess/menu/:day` - Get menu by day
- `POST /api/mess/menu` - Create/Update menu (Admin, Warden)
- `DELETE /api/mess/menu/:id` - Delete menu (Admin, Warden)

## User Roles

- **Admin**: Full system access
- **Warden**: Manage hostel operations
- **Student**: Access personal information and submit requests

## Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - Prevent brute force attacks
- **Data Sanitization** - Protection against NoSQL injection and XSS
- **HPP** - HTTP Parameter Pollution protection
- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcrypt for password encryption
- **Role-based Access Control** - Admin, Warden, Student roles

## Development Status

✅ **STEP 1: Backend Setup** - Complete
- Node.js with Express
- MongoDB connection
- Folder structure
- JWT authentication
- Role-based access control

✅ **STEP 2: Backend Modules** - Complete
- Users management
- Students management
- Rooms management
- Fees management
- Complaints management
- Leave Requests management
- Visitors management
- Notices management
- Mess Management

✅ **STEP 3: Error Handling & Security** - Complete
- Global error middleware
- Password hashing
- JWT token handling
- Environment variable protection
- Security middleware (Helmet, Rate Limiting, XSS, NoSQL injection protection)

## Troubleshooting

### Server won't start
1. Make sure MongoDB is running: `mongod` or start MongoDB service
2. Check if `.env` file exists and has correct values
3. Verify `MONGODB_URI` in `.env` matches your MongoDB connection string
4. Check if port 5000 is available or change `PORT` in `.env`

### MongoDB Connection Error
- Ensure MongoDB is installed and running
- Check MongoDB connection string in `.env`
- Verify MongoDB is accessible on the specified host and port
