import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setError('');
        const [studentsRes, roomsRes, feesRes, complaintsRes] = await Promise.all([
          api.get('/api/students'),
          api.get('/api/rooms'),
          api.get('/api/fees'),
          api.get('/api/complaints'),
        ]);

        setStats({
          students: studentsRes.data.count || 0,
          rooms: roomsRes.data.count || 0,
          fees: feesRes.data.count || 0,
          complaints: complaintsRes.data.count || 0,
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
      link: '/admin/students'
    },
    { 
      title: 'Total Rooms', 
      value: stats?.rooms ?? 0, 
      icon: '🏠', 
      color: '#10b981',
      bgColor: '#ecfdf5',
      link: '/admin/rooms'
    },
    { 
      title: 'Fee Records', 
      value: stats?.fees ?? 0, 
      icon: '💰', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      link: '/admin/fees'
    },
    { 
      title: 'Complaints', 
      value: stats?.complaints ?? 0, 
      icon: '📝', 
      color: '#ef4444',
      bgColor: '#fef2f2',
      link: '/admin/complaints'
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
          Admin Dashboard
        </h1>
        <p style={{ color: '#6b7280', fontSize: '0.9375rem' }}>
          Welcome back! Here's an overview of your hostel management system.
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
          <Link to="/admin/users" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            >
              <span style={{ fontSize: '1.25rem' }}>👥</span>
              <span style={{ fontWeight: '500', color: '#374151' }}>Manage Users</span>
            </button>
          </Link>
          <Link to="/admin/rooms" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            >
              <span style={{ fontSize: '1.25rem' }}>🏠</span>
              <span style={{ fontWeight: '500', color: '#374151' }}>Manage Rooms</span>
            </button>
          </Link>
          <Link to="/admin/students" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#f9fafb';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
            >
              <span style={{ fontSize: '1.25rem' }}>🎓</span>
              <span style={{ fontWeight: '500', color: '#374151' }}>Add Student</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
