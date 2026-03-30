import { useEffect, useState } from 'react';
import api from '../utils/axios';

const WardenLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [remarks, setRemarks] = useState('');

  const loadRequests = async () => {
    try {
      setError('');
      const res = await api.get('/api/leave-requests');
      setRequests(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleDecision = async (id, status) => {
    try {
      setBusyId(id);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/leave-requests/${id}/approve`, {
        status,
        remarks,
      });
      setActionMessage(`Leave request ${status}.`);
      setRemarks('');
      await loadRequests();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update leave request');
    } finally {
      setBusyId(null);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'badge badge-success';
    if (status === 'pending') return 'badge badge-warning';
    if (status === 'rejected') return 'badge badge-danger';
    return 'badge badge-info';
  };

  if (loading) return <div>Loading leave requests...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Leave Requests</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Review and approve or reject leave requests submitted by students.
      </p>

      {error && <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}
      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>
      )}

      <div
        className="card"
        style={{
          marginBottom: '1.5rem',
        }}
      >
        <label
          className="label"
          htmlFor="remarks"
        >
          Decision Remarks (optional)
        </label>
        <textarea
          id="remarks"
          className="textarea"
          placeholder="Add remarks that will be recorded with your decision..."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Type</th>
              <th>Dates</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id || r._id}>
                <td>
                  {r.student
                    ? `${r.student.studentId} - ${r.student.user?.name || r.student.user?.email || 'Unknown'}`
                    : 'Unknown'}
                </td>
                <td style={{ textTransform: 'capitalize' }}>{r.leaveType}</td>
                <td>
                  {new Date(r.startDate).toLocaleDateString()} –{' '}
                  {new Date(r.endDate).toLocaleDateString()}
                </td>
                <td style={{ maxWidth: '260px' }}>{r.reason}</td>
                <td>
                  <span className={getStatusBadgeClass(r.status)} style={{ textTransform: 'capitalize' }}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    onClick={() => handleDecision(r.id || r._id, 'approved')}
                    disabled={busyId === (r.id || r._id) || r.status !== 'pending'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      marginRight: '0.4rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #bbf7d0',
                      backgroundColor: r.status === 'pending' ? '#ecfdf3' : '#e5e7eb',
                      color: '#15803d',
                      cursor:
                        busyId === (r.id || r._id) || r.status !== 'pending' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecision(r.id || r._id, 'rejected')}
                    disabled={busyId === (r.id || r._id) || r.status !== 'pending'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #fecaca',
                      backgroundColor: r.status === 'pending' ? '#fef2f2' : '#e5e7eb',
                      color: '#b91c1c',
                      cursor:
                        busyId === (r.id || r._id) || r.status !== 'pending' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Reject
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

export default WardenLeaveRequests;

