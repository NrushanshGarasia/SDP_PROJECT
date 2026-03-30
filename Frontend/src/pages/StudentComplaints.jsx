import { useEffect, useState } from 'react';
import api from '../utils/axios';

const initialForm = {
  title: '',
  description: '',
  category: 'room',
  priority: 'medium',
};

const StudentComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadComplaints = async () => {
    try {
      setError('');
      const res = await api.get('/api/complaints/me');
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

    if (!form.title || !form.description) {
      setError('Title and description are required');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/api/complaints', form);
      setSuccess('Complaint submitted successfully');
      setForm(initialForm);
      await loadComplaints();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'resolved') return 'badge badge-success';
    if (status === 'pending' || status === 'in_progress') return 'badge badge-warning';
    if (status === 'rejected') return 'badge badge-danger';
    return 'badge badge-info';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>My Complaints</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Submit a new complaint and track the status of your previous requests.
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
            <label htmlFor="title" className="label">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              className="input"
              placeholder="Short summary of your complaint"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description" className="label">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              className="textarea"
              placeholder="Describe the issue in detail so the warden can help you quickly..."
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
              <label htmlFor="category" className="label">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className="select"
              >
                <option value="room">Room</option>
                <option value="mess">Mess</option>
                <option value="maintenance">Maintenance</option>
                <option value="security">Security</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="priority" className="label">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '220px' }}
          >
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </button>
        </form>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div>Loading complaints...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c) => (
                <tr key={c.id || c._id}>
                  <td>{c.title}</td>
                  <td>{c.category}</td>
                  <td style={{ textTransform: 'capitalize' }}>{c.priority}</td>
                  <td>
                    <span className={getStatusBadgeClass(c.status)} style={{ textTransform: 'capitalize' }}>
                      {c.status}
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

export default StudentComplaints;

