import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkStyle = (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: active ? '#667eea' : '#4b5563',
    backgroundColor: active ? '#f0f0ff' : 'transparent',
    borderRadius: '0.5rem',
    textDecoration: 'none',
    transition: 'all 0.15s ease',
  });

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/students', label: 'Students', icon: '🎓' },
    { path: '/admin/rooms', label: 'Rooms', icon: '🏠' },
  ];

  const wardenLinks = [
    { path: '/warden/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/warden/students', label: 'Students', icon: '🎓' },
    { path: '/warden/rooms', label: 'Rooms', icon: '🏠' },
    { path: '/warden/complaints', label: 'Complaints', icon: '📝' },
    { path: '/warden/leave-requests', label: 'Leave Requests', icon: '📅' },
    { path: '/warden/visitors', label: 'Visitors', icon: '🚶' },
  ];

  const studentLinks = [
    { path: '/student/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/student/complaints', label: 'Complaints', icon: '📝' },
    { path: '/student/leave-requests', label: 'Leave Requests', icon: '📅' },
    { path: '/student/visitors', label: 'Visitors', icon: '🚶' },
    { path: '/student/fees', label: 'Fees', icon: '💰' },
  ];

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'warden' ? wardenLinks : studentLinks;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* Top Navigation */}
      <nav style={{
        backgroundColor: 'white',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '64px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🏠
            </div>
            <span style={{
              fontSize: '1.125rem',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Hostel Management
            </span>
          </div>

          {/* Nav Links */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={navLinkStyle(isActive(link.path))}
                onMouseOver={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#f9fafb',
              borderRadius: '2rem'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: '600', color: '#1f2937' }}>
                  {user?.name || 'User'}
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: '#667eea',
                  textTransform: 'capitalize',
                  fontWeight: '500'
                }}>
                  {user?.role}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.5rem 1rem',
                fontSize: '0.8125rem',
                fontWeight: '500',
                color: '#ef4444',
                backgroundColor: '#fef2f2',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#fee2e2';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#fef2f2';
              }}
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '2rem 1.5rem'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
