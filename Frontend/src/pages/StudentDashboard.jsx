import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/axios';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setError('');
        const [feesRes, complaintsRes, leaveRes] = await Promise.all([
          api.get('/api/fees/me'),
          api.get('/api/complaints/me'),
          api.get('/api/leave-requests/me'),
        ]);

        setSummary({
          fees: feesRes.data.count || 0,
          pendingFees: feesRes.data.data?.filter(f => f.status === 'pending').length || 0,
          complaints: complaintsRes.data.count || 0,
          pendingComplaints: complaintsRes.data.data?.filter(c => c.status === 'pending').length || 0,
          leaves: leaveRes.data.count || 0,
          pendingLeaves: leaveRes.data.data?.filter(l => l.status === 'pending').length || 0,
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
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
      title: 'My Fees', 
      value: summary?.fees ?? 0,
      subtitle: `${summary?.pendingFees ?? 0} pending`,
      icon: '💰', 
      color: '#f59e0b',
      bgColor: '#fffbeb',
      link: '/student/fees'
    },
    { 
      title: 'My Complaints', 
      value: summary?.complaints ?? 0,
      subtitle: `${summary?.pendingComplaints ?? 0} pending`,
      icon: '📝', 
      color: '#ef4444',
      bgColor: '#fef2f2',
      link: '/student/complaints'
    },
    { 
      title: 'Leave Requests', 
      value: summary?.leaves ?? 0,
      subtitle: `${summary?.pendingLeaves ?? 0} pending`,
      icon: '📅', 
      color: '#3b82f6',
      bgColor: '#eff6ff',
      link: '/student/leave-requests'
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
      {/* Welcome Header */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem'
          }}>
            👋
          </div>
          <div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              margin: '0 0 0.25rem'
            }}>
              Welcome back, {user?.name || 'Student'}!
            </h1>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '0.9375rem' }}>
              {user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
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
                  <p style={{
                    fontSize: '0.75rem',
                    color: card.color,
                    marginTop: '0.25rem',
                    fontWeight: '500'
                  }}>
                    {card.subtitle}
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
          <Link to="/student/complaints" style={{ textDecoration: 'none' }}>
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
              <span style={{ fontWeight: '500', color: '#dc2626' }}>File a Complaint</span>
            </button>
          </Link>
          <Link to="/student/leave-requests" style={{ textDecoration: 'none' }}>
            <button style={{
              width: '100%',
              padding: '1rem',
              backgroundColor: '#eff6ff',
              border: 'none',
              borderRadius: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#eff6ff'}
            >
              <span style={{ fontSize: '1.25rem' }}>📅</span>
              <span style={{ fontWeight: '500', color: '#2563eb' }}>Request Leave</span>
            </button>
          </Link>
          <Link to="/student/visitors" style={{ textDecoration: 'none' }}>
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
              <span style={{ fontWeight: '500', color: '#059669' }}>Register Visitor</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
