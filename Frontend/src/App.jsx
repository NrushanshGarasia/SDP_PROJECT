import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/AdminDashboard';
import WardenDashboard from './pages/WardenDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminStudents from './pages/AdminStudents';
import AdminRooms from './pages/AdminRooms';
import AdminFees from './pages/AdminFees';
import AdminComplaints from './pages/AdminComplaints';
import WardenStudents from './pages/WardenStudents';
import WardenRooms from './pages/WardenRooms';
import WardenComplaints from './pages/WardenComplaints';
import WardenLeaveRequests from './pages/WardenLeaveRequests';
import WardenVisitors from './pages/WardenVisitors';
import StudentComplaints from './pages/StudentComplaints';
import StudentLeaveRequests from './pages/StudentLeaveRequests';
import StudentVisitors from './pages/StudentVisitors';
import StudentFees from './pages/StudentFees';
import Notices from './pages/Notices';
import Mess from './pages/Mess';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Admin routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminUsers />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminStudents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rooms"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminRooms />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/fees"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminFees />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Layout>
              <AdminComplaints />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Warden routes */}
      <Route
        path="/warden/dashboard"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/students"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenStudents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/rooms"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenRooms />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/complaints"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenComplaints />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/leave-requests"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenLeaveRequests />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/warden/visitors"
        element={
          <ProtectedRoute allowedRoles={['warden']}>
            <Layout>
              <WardenVisitors />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Student routes */}
      <Route
        path="/student/dashboard"
        element=
        {
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <StudentDashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/complaints"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <StudentComplaints />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/leave-requests"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <StudentLeaveRequests />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/visitors"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <StudentVisitors />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/fees"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Layout>
              <StudentFees />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Shared modules */}
      <Route
        path="/notices"
        element={
          <ProtectedRoute allowedRoles={['admin', 'warden', 'student']}>
            <Layout>
              <Notices />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/mess"
        element={
          <ProtectedRoute allowedRoles={['admin', 'warden', 'student']}>
            <Layout>
              <Mess />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;

