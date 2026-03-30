import { useEffect, useState } from 'react';
import api from '../utils/axios';

const initialForm = {
  visitorName: '',
  visitorPhone: '',
  relation: '',
  purpose: '',
  visitorEmail: '',
  idProof: '',
  idNumber: '',
};

const StudentVisitors = () => {
  const [visitors, setVisitors] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadVisitors = async () => {
    try {
      setError('');
      const res = await api.get('/api/visitors/me');
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

    if (!form.visitorName || !form.visitorPhone || !form.relation || !form.purpose) {
      setError('Name, phone, relation and purpose are required');
      setSubmitting(false);
      return;
    }

    try {
      await api.post('/api/visitors', form);
      setSuccess('Visitor added successfully');
      setForm(initialForm);
      await loadVisitors();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add visitor');
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === 'checked_in') return 'badge badge-success';
    if (status === 'scheduled' || status === 'pending') return 'badge badge-warning';
    if (status === 'cancelled' || status === 'denied') return 'badge badge-danger';
    return 'badge badge-info';
  };

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.25rem' }}>My Visitors</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Register visitors and see the status of their visit approvals.
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
            <label htmlFor="visitorName" className="label">
              Name
            </label>
            <input
              id="visitorName"
              name="visitorName"
              type="text"
              value={form.visitorName}
              onChange={handleChange}
              className="input"
              placeholder="Full name of the visitor"
              required
            />
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
              <label htmlFor="visitorPhone" className="label">
                Phone
              </label>
              <input
                id="visitorPhone"
                name="visitorPhone"
                type="tel"
                value={form.visitorPhone}
                onChange={handleChange}
                className="input"
                placeholder="Contact number"
                required
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="relation" className="label">
                Relation
              </label>
              <input
                id="relation"
                name="relation"
                type="text"
                value={form.relation}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Parent, Friend"
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="purpose" className="label">
              Purpose
            </label>
            <input
              id="purpose"
              name="purpose"
              type="text"
              value={form.purpose}
              onChange={handleChange}
              className="input"
              placeholder="Reason for the visit"
              required
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="visitorEmail" className="label">
              Email (optional)
            </label>
            <input
              id="visitorEmail"
              name="visitorEmail"
              type="email"
              value={form.visitorEmail}
              onChange={handleChange}
              className="input"
              placeholder="Visitor's email address"
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
              <label htmlFor="idProof" className="label">
                ID Proof (optional)
              </label>
              <input
                id="idProof"
                name="idProof"
                type="text"
                value={form.idProof}
                onChange={handleChange}
                className="input"
                placeholder="e.g. Aadhaar, Passport"
              />
            </div>
            <div style={{ flex: 1, minWidth: '180px' }}>
              <label htmlFor="idNumber" className="label">
                ID Number (optional)
              </label>
              <input
                id="idNumber"
                name="idNumber"
                type="text"
                value={form.idNumber}
                onChange={handleChange}
                className="input"
                placeholder="Document number"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ width: '100%', maxWidth: '220px' }}
          >
            {submitting ? 'Saving...' : 'Add Visitor'}
          </button>
        </form>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {loading ? (
          <div>Loading visitors...</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Relation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.map((v) => (
                <tr key={v.id || v._id}>
                  <td>{v.visitorName}</td>
                  <td>{v.visitorPhone}</td>
                  <td>{v.relation}</td>
                  <td>
                    <span className={getStatusBadgeClass(v.status)} style={{ textTransform: 'capitalize' }}>
                      {v.status}
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

export default StudentVisitors;

