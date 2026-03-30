import { useEffect, useState } from 'react';
import api from '../utils/axios';

const Mess = () => {
  const [menus, setMenus] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('');
        const [menuRes, recordsRes] = await Promise.all([
          api.get('/api/mess/menu'),
          api.get('/api/mess/records/me').catch(() => ({ data: { data: [] } })),
        ]);

        setMenus(menuRes.data.data || []);
        setRecords(recordsRes.data.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load mess data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading mess information...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Mess</h2>

      <h3 style={{ marginTop: '1rem' }}>Weekly Menu</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Day</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Breakfast</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Lunch</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Dinner</th>
          </tr>
        </thead>
        <tbody>
          {menus.map((m) => (
            <tr key={m.id || m._id}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6', textTransform: 'capitalize' }}>
                {m.day}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {(m.breakfast?.items || []).join(', ')}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {(m.lunch?.items || []).join(', ')}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {(m.dinner?.items || []).join(', ')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 style={{ marginTop: '2rem' }}>My Mess Attendance</h3>
      {records.length === 0 ? (
        <p>No attendance records yet.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Meal</th>
              <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id || r._id}>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.mealType}</td>
                <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Mess;

