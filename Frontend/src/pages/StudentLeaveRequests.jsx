import { useEffect, useState } from 'react';
import api from '../utils/axios';

const initialForm = {
  leaveType: 'short',
  startDate: '',
  endDate: '',
  reason: '',
  destination: '',
  guardianContact: '',
};

const StudentLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRequests = async () => {
    try {
      setError('');
      const res = await api.get('/api/leave-requests/me');
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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    if (!form.startDate || !form.endDate || !form.reason) {
      setError('Start date, end date and reason are required');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/api/leave-requests', form);
      setSuccess('Leave request submitted successfully');
      setForm(initialForm);
      await loadRequests();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'approved') return 'badge badge-success';
    if (status === 'pending') return 'badge badge-warning';
    if (status === 'rejected') return 'badge badge-danger';
    return 'badge badge-info';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>My Leave Requests</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Submit a leave request and track approval status from the hostel administration.
      </p>

      <div
        className="card"
        style={{
          marginTop: '0.5rem',
          marginBottom: '2rem',
          maxWidth: '720px',
        }}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                marginBottom: '0.75rem',
                fontSize: '0.85rem',
                color: '#b91c1c',
              }}
            >
              {error}
            </div>
          )}
          {success && (
            <div
              style={{
                marginBottom: '0.75rem',
                fontSize: '0.85rem',
                color: '#15803d',
              }}
            >
              {success}
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="leaveType" className="label">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="select"
            >
              <option value="short">Short</option>
              <option value="long">Long</option>
              <option value="emergency">Emergency</option>
            </select>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="startDate" className="label">
                Start Date
              </label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="endDate" className="label">
                End Date
              </label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="reason" className="label">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="textarea"
              placeholder="Explain why you need leave and any important details..."
              required
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              marginBottom: '1.25rem',
            }}
          >
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="destination" className="label">
                Destination (optional)
              </label>
              <input
                id="destination"
                name="destination"
                type="text"
                value={form.destination}
                onChange={handleChange}
                className="input"
                placeholder="Where will you be staying?"
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="guardianContact" className="label">
                Guardian Contact (optional)
              </label>
              <input
                id="guardianContact"
                name="guardianContact"
                type="text"
                value={form.guardianContact}
                onChange={handleChange}
                className="input"
                placeholder="Guardian phone or email"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '240px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Leave Request'}
          </button>
        </form>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div>Loading leave requests...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Start</th>
                <th>End</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id || r._id}>
                  <td style={{ textTransform: 'capitalize' }}>{r.leaveType}</td>
                  <td>{new Date(r.startDate).toLocaleDateString()}</td>
                  <td>{new Date(r.endDate).toLocaleDateString()}</td>
                  <td>
                    <span className={getStatusBadgeClass(r.status)} style={{ textTransform: 'capitalize' }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentLeaveRequests;

