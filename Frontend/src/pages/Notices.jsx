import { useEffect, useState } from 'react';
import api from '../utils/axios';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setError('');
        const res = await api.get('/api/notices/active');
        setNotices(res.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load notices');
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  if (loading) return <div>Loading notices...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Notices</h2>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {notices.map((n) => (
          <li
            key={n.id || n._id}
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: '#ffffff',
              marginBottom: '0.5rem',
              border: '1px solid #e5e7eb',
            }}
          >
            <h3 style={{ margin: 0 }}>{n.title}</h3>
            <p style={{ margin: '0.25rem 0' }}>{n.description}</p>
            <small style={{ color: '#6b7280' }}>
              Category: {n.category} • Audience: {n.targetAudience}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notices;

