import { useEffect, useState } from 'react';
import api from '../utils/axios';

const WardenComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [responseText, setResponseText] = useState('');

  const loadComplaints = async () => {
    try {
      setError('');
      const res = await api.get('/api/complaints');
      setComplaints(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleResolve = async (complaintId) => {
    if (!responseText.trim()) {
      setActionError('Please enter a response before resolving.');
      return;
    }
    try {
      setBusyId(complaintId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/complaints/${complaintId}/resolve`, {
        response: responseText,
      });
      setActionMessage('Complaint resolved successfully.');
      setResponseText('');
      await loadComplaints();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to resolve complaint');
    } finally {
      setBusyId(null);
    }
  };

  const handleUpdateStatus = async (complaintId, status) => {
    try {
      setBusyId(complaintId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/complaints/${complaintId}`, { status });
      setActionMessage(`Complaint marked as ${status.replace('_', ' ')}.`);
      await loadComplaints();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update complaint status');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div>Loading complaints...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>Complaints (Warden)</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Review and process complaints submitted by students. Only admins can delete complaints.
      </p>

      {error && <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}
      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>
      )}

      <div style={{ marginBottom: '1rem' }}>
        <label
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '0.25rem',
            display: 'block',
          }}
        >
          Resolution Response (used when resolving a complaint)
        </label>
        <textarea
          rows={3}
          value={responseText}
          onChange={(e) => setResponseText(e.target.value)}
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid #d1d5db',
            fontSize: '0.9rem',
          }}
          placeholder="Enter your response that will be recorded with the complaint..."
        />
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Student</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((c) => (
              <tr key={c.id || c._id}>
                <td>{c.title}</td>
                <td>
                  {c.student?.studentId} - {c.student?.user?.name || 'Unknown'}
                </td>
                <td>{c.category}</td>
                <td style={{ textTransform: 'capitalize' }}>{c.priority}</td>
                <td>
                  <span
                    className={
                      c.status === 'resolved'
                        ? 'badge badge-success'
                        : c.status === 'rejected'
                        ? 'badge badge-danger'
                        : 'badge badge-warning'
                    }
                    style={{ textTransform: 'capitalize' }}
                  >
                    {c.status}
                  </span>
                </td>
                <td>
                  <div style={{ marginBottom: '0.25rem', fontSize: '0.8rem', color: '#6b7280' }}>
                    {c.createdAt && (
                      <>
                        <strong>Created:</strong> {new Date(c.createdAt).toLocaleString()}
                      </>
                    )}
                  </div>
                  {c.response && (
                    <div style={{ marginBottom: '0.25rem', fontSize: '0.8rem', color: '#047857' }}>
                      <strong>Response:</strong> {c.response}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleResolve(c.id || c._id)}
                    disabled={busyId === (c.id || c._id) || c.status === 'resolved'}
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      marginRight: '0.4rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: c.status === 'resolved' ? '#e5e7eb' : '#ecfdf5',
                      color: '#047857',
                      cursor:
                        busyId === (c.id || c._id) || c.status === 'resolved' ? 'not-allowed' : 'pointer',
                    }}
                  >
                    Resolve
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.id || c._id, 'in_progress')}
                    disabled={
                      busyId === (c.id || c._id) ||
                      c.status === 'in_progress' ||
                      c.status === 'resolved'
                    }
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      marginRight: '0.4rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #d1d5db',
                      backgroundColor: '#eff6ff',
                      color: '#1d4ed8',
                      cursor:
                        busyId === (c.id || c._id) ||
                        c.status === 'in_progress' ||
                        c.status === 'resolved'
                          ? 'not-allowed'
                          : 'pointer',
                    }}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(c.id || c._id, 'rejected')}
                    disabled={
                      busyId === (c.id || c._id) ||
                      c.status === 'rejected' ||
                      c.status === 'resolved'
                    }
                    className="btn"
                    style={{
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.8rem',
                      borderRadius: '0.5rem',
                      border: '1px solid #fee2e2',
                      backgroundColor: '#fff7ed',
                      color: '#b45309',
                      cursor:
                        busyId === (c.id || c._id) ||
                        c.status === 'rejected' ||
                        c.status === 'resolved'
                          ? 'not-allowed'
                          : 'pointer',
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

export default WardenComplaints;

