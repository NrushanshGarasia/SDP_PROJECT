import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const WardenDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError('');
        const [studentsRes, roomsRes, complaintsRes, leaveRes] = await Promise.all([
          api.get('/api/students'),
          api.get('/api/rooms'),
          api.get('/api/complaints'),
          api.get('/api/leave-requests'),
        ]);

        setStats({
          students: studentsRes.data.count || 0,
          rooms: roomsRes.data.count || 0,
          availableRooms: roomsRes.data.data?.filter(r => r.isAvailable).length || 0,
          complaints: complaintsRes.data.count || 0,
          pendingComplaints: complaintsRes.data.data?.filter(c => c.status === 'pending').length || 0,
          leaveRequests: leaveRes.data.count || 0,
          pendingLeaves: leaveRes.data.data?.filter(l => l.status === 'pending').length || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  };

  const statsCards = [
    { 
      title: 'Total Students', 
      value: stats?.students ?? 0, 
      icon: '🎓', 
      color: '#3b82f6',
      bgColor: '#eff6ff',
      link: '/warden/students'
    },
    { 
      title: 'Total Rooms', 
      value: stats?.rooms ?? 0,
      subtitle: `${stats?.availableRooms ?? 0} available`,
      icon: '🏠', 
      color: '#10b981',
      bgColor: '#ecfdf5',
      link: '/warden/rooms'
    },
    { 
      title: 'Complaints', 
      value: stats?.complaints ?? 0,
      subtitle: `${stats?.pendingComplaints ?? 0} pending`,
      icon: '📝', 
      color: '#ef4444',
      bgColor: '#fef2f2',
      link: '/warden/complaints'
    },
    { 
      title: 'Leave Requests', 
      value: stats?.leaveRequests ?? 0,
      subtitle: `${stats?.pendingLeaves ?? 0} pending`,
      icon: '📅', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      link: '/warden/leave-requests'
    },
  ];

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '300px'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '3px solid #e5e7eb',
            borderTopColor: '#667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>Loading dashboard...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        color: '#dc2626',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '0.5rem'
        }}>
          Warden Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          Welcome, {user?.name || 'Warden'}! Manage hostel operations efficiently.
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {statsCards.map((card, index) => (
          <Link
            key={index}
            to={card.link}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={cardStyle}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between'
              }}>
                <div>
                  <p style={{
                    fontSize: '0.8125rem',
                    fontWeight: '500',
                    color: '#6b7280',
                    marginBottom: '0.5rem'
                  }}>
                    {card.title}
                  </p>
                  <p style={{
                    fontSize: '2rem',
                    fontWeight: '700',
                    color: '#1f2937',
                    margin: 0
                  }}>
                    {card.value}
                  </p>
                  {card.subtitle && (
                    <p style={{
                      fontSize: '0.75rem',
                      color: card.color,
                      marginTop: '0.25rem',
                      fontWeight: '500'
                    }}>
                      {card.subtitle}
                    </p>
                  )}
                </div>
                <div style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: card.bgColor,
                  borderRadius: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {card.icon}
                </div>
              </div>
              <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                color: card.color,
                fontSize: '0.8125rem',
                fontWeight: '500'
              }}>
                View details
                <span>→</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#1f2937',
          marginBottom: '1rem'
        }}>
          Quick Actions
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <Link to="/warden/complaints" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#fef2f2',
              border: 'none',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
            >
              <span style={{ fontSize: '1.25rem' }}>📝</span>
              <span style={{ fontWeight: '500', color: '#dc2626' }}>Review Complaints</span>
            </button>
          </Link>
          <Link to="/warden/leave-requests" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#fffbeb',
              border: 'none',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef3c7'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fffbeb'}
            >
              <span style={{ fontSize: '1.25rem' }}>📅</span>
              <span style={{ fontWeight: '500', color: '#d97706' }}>Approve Leaves</span>
            </button>
          </Link>
          <Link to="/warden/visitors" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#ecfdf5',
              border: 'none',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1fae5'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ecfdf5'}
            >
              <span style={{ fontSize: '1.25rem' }}>🚶</span>
              <span style={{ fontWeight: '500', color: '#059669' }}>Manage Visitors</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WardenDashboard;
