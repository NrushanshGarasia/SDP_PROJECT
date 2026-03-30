import { useEffect, useState } from 'react';
import api from '../utils/axios';

const WardenVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadVisitors = async () => {
    try {
      setError('');
      const res = await api.get('/api/visitors');
      setVisitors(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load visitors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      setBusyId(id);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/visitors/${id}`, { status });
      setActionMessage(`Visitor marked as ${status}.`);
      await loadVisitors();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update visitor');
    } finally {
      setBusyId(null);
    }
  };

  const handleMarkExit = async (id) => {
    try {
      setBusyId(id);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/visitors/${id}/exit`);
      setActionMessage('Visitor marked as left.');
      await loadVisitors();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to mark exit');
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'approved' || status === 'checked_in') return 'badge badge-success';
    if (status === 'pending' || status === 'scheduled') return 'badge badge-warning';
    if (status === 'denied' || status === 'left') return 'badge badge-danger';
    return 'badge badge-info';
  };

  if (loading) return <div>Loading visitors...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Visitors</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Monitor visitor entries and exits for all hostel students.
      </p>

      {error && <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}
      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>
      )}

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Visitor</th>
              <th>Contact</th>
              <th>Purpose</th>
              <th>Times</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visitors.map((v) => (
              <tr key={v.id || v._id}>
                <td>
                  {v.student?.studentId} - {v.student?.user?.name || 'Unknown'}
                </td>
                <td>
                  {v.visitorName}
                  {v.relation ? ` (${v.relation})` : ''}
                </td>
                <td>
                  {v.visitorPhone}
                  {v.visitorEmail ? ` • ${v.visitorEmail}` : ''}
                </td>
                <td style={{ maxWidth: '220px' }}>{v.purpose}</td>
                <td style={{ fontSize: '0.8rem', color: '#4b5563' }}>
                  {v.entryTime && (
                    <div>
                      <strong>In:</strong> {new Date(v.entryTime).toLocaleString()}
                    </div>
                  )}
                  {v.exitTime && (
                    <div>
                      <strong>Out:</strong> {new Date(v.exitTime).toLocaleString()}
                    </div>
                  )}
                </td>
                <td>
                  <span className={getStatusBadgeClass(v.status)} style={{ textTransform: 'capitalize' }}>
                    {v.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(v.id || v._id, 'approved')}
                    disabled={busyId === (v.id || v._id) || v.status === 'approved'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      marginRight: '0.35rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #bbf7d0',
                      backgroundColor: v.status === 'approved' ? '#e5e7eb' : '#ecfdf3',
                      color: '#15803d',
                      cursor:
                        busyId === (v.id || v._id) || v.status === 'approved' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(v.id || v._id, 'denied')}
                    disabled={busyId === (v.id || v._id) || v.status === 'denied'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      marginRight: '0.35rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #fee2e2',
                      backgroundColor: v.status === 'denied' ? '#e5e7eb' : '#fef2f2',
                      color: '#b91c1c',
                      cursor:
                        busyId === (v.id || v._id) || v.status === 'denied' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Deny
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMarkExit(v.id || v._id)}
                    disabled={busyId === (v.id || v._id) || v.status === 'left'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: v.status === 'left' ? '#e5e7eb' : '#f9fafb',
                      color: '#374151',
                      cursor:
                        busyId === (v.id || v._id) || v.status === 'left' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Mark Exit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WardenVisitors;

