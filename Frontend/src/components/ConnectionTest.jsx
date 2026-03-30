import { useEffect, useRef, useState } from 'react';
import api from '../utils/axios';

const ConnectionTest = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const hasRunRef = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in development.
    // Prevent duplicate calls that can trip rate limiting.
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const testConnection = async () => {
      try {
        // IMPORTANT:
        // Call backend through the same /api path used by auth.
        // In dev, Vite proxy forwards /api -> http://localhost:5000
        await api.get('/api/health');
        setStatus('connected');
        setMessage('Backend server is connected and running!');
      } catch (error) {
        setStatus('error');
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
          setMessage('Cannot connect to backend server. Please ensure:\n1. Backend is running on http://localhost:5000\n2. No firewall is blocking the connection\n3. Check browser console for more details');
        } else {
          setMessage(`Connection error: ${error.message}`);
        }
      }
    };

    testConnection();
  }, []);

  const retry = async () => {
    setStatus('checking');
    setMessage('');
    try {
      await api.get('/api/health');
      setStatus('connected');
      setMessage('Backend server is connected and running!');
    } catch (error) {
      setStatus('error');
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setMessage('Cannot connect to backend server. Please ensure:\n1. Backend is running on http://localhost:5000\n2. No firewall is blocking the connection\n3. Check browser console for more details');
      } else {
        setMessage(`Connection error: ${error.message}`);
      }
    }
  };

  if (status === 'checking') {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fef3c7',
        border: '1px solid #fbbf24',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid #f59e0b',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          <span style={{ color: '#92400e', fontSize: '0.875rem' }}>Checking backend connection...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div style={{
        padding: '1rem',
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '0.5rem',
        marginBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem' }}>⚠️</span>
          <div>
            <div style={{ fontWeight: '600', color: '#dc2626', marginBottom: '0.25rem' }}>
              Backend Connection Failed
            </div>
            <div style={{ color: '#991b1b', fontSize: '0.875rem', whiteSpace: 'pre-line' }}>
              {message}
            </div>
            <button
              type="button"
              onClick={retry}
              style={{
                marginTop: '0.75rem',
                padding: '0.5rem 0.75rem',
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: '#991b1b',
                backgroundColor: '#fff',
                border: '1px solid #fecaca',
                borderRadius: '0.5rem',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      padding: '1rem',
      backgroundColor: '#ecfdf5',
      border: '1px solid #86efac',
      borderRadius: '0.5rem',
      marginBottom: '1rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.25rem' }}>✅</span>
        <span style={{ color: '#166534', fontSize: '0.875rem', fontWeight: '500' }}>
          {message}
        </span>
      </div>
    </div>
  );
};

export default ConnectionTest;
