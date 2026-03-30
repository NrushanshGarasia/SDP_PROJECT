import { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [createForm, setCreateForm] = useState({
    studentId: '',
    feeType: 'hostel',
    amount: '',
    dueDate: '',
    remarks: '',
  });

  const loadFees = async () => {
    try {
      setError('');
      const res = await api.get('/api/fees');
      setFees(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load fees');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data.data || []);
    } catch {
      // ignore; form will just have empty dropdown
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
    loadStudents();
  }, []);

  const handleCreateChange = (e) => {
    const { name, value } = e.target;
    setCreateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreateFee = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');

    if (!createForm.studentId || !createForm.amount || !createForm.dueDate) {
      setActionError('Please fill student, amount and due date.');
      return;
    }

    try {
      await api.post('/api/fees', {
        student: createForm.studentId,
        feeType: createForm.feeType,
        amount: Number(createForm.amount),
        dueDate: createForm.dueDate,
        remarks: createForm.remarks,
      });
      setActionMessage('Fee record created.');
      setCreateForm({
        studentId: '',
        feeType: 'hostel',
        amount: '',
        dueDate: '',
        remarks: '',
      });
      await loadFees();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create fee record');
    }
  };

  const handleMarkPaid = async (feeId) => {
    try {
      setBusyId(feeId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/fees/${feeId}/pay`, {
        paymentMethod: 'cash',
      });
      setActionMessage('Fee marked as paid.');
      await loadFees();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to mark fee as paid');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (feeId) => {
    if (!window.confirm('Are you sure you want to delete this fee record?')) return;
    try {
      setBusyId(feeId);
      setActionError('');
      setActionMessage('');
      await api.delete(`/api/fees/${feeId}`);
      setActionMessage('Fee record deleted.');
      await loadFees();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete fee record');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div>Loading fee records...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>All Fee Records</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        View and manage all hostel fee records for students.
      </p>

      {error && <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>}
      {actionError && <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>}
      {actionMessage && <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>}

      {/* Create Fee Form */}
      <form
        onSubmit={handleCreateFee}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Student
          </label>
          <select
            name="studentId"
            value={createForm.studentId}
            onChange={handleCreateChange}
            disabled={studentsLoading}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          >
            <option value="">
              {studentsLoading ? 'Loading students...' : '-- Select student --'}
            </option>
            {!studentsLoading &&
              students.map((s) => (
                <option key={s.id || s._id} value={String(s.id || s._id)}>
                  {s.studentId} - {s.user?.name || 'No name'}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Fee Type
          </label>
          <select
            name="feeType"
            value={createForm.feeType}
            onChange={handleCreateChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          >
            <option value="hostel">Hostel</option>
            <option value="mess">Mess</option>
            <option value="maintenance">Maintenance</option>
            <option value="security">Security</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Amount
          </label>
          <input
            name="amount"
            type="number"
            min="0"
            value={createForm.amount}
            onChange={handleCreateChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Due Date
          </label>
          <input
            name="dueDate"
            type="date"
            value={createForm.dueDate}
            onChange={handleCreateChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div>
          <label
            style={{
              fontSize: '0.8rem',
              fontWeight: 600,
              color: '#374151',
              marginBottom: '0.25rem',
              display: 'block',
            }}
          >
            Remarks (optional)
          </label>
          <input
            name="remarks"
            value={createForm.remarks}
            onChange={handleCreateChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button
            type="submit"
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
            }}
          >
            Create Fee
          </button>
        </div>
      </form>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Student</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Type</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Amount</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Due Date</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((f) => (
            <tr key={f.id || f._id}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {f.student?.studentId} - {f.student?.user?.name || 'Unknown'}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{f.feeType}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>₹{f.amount}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {new Date(f.dueDate).toLocaleDateString()}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <span
                  style={{
                    padding: '0.15rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor:
                      f.status === 'paid' ? '#dcfce7' : f.status === 'overdue' ? '#fee2e2' : '#fef9c3',
                    color:
                      f.status === 'paid' ? '#166534' : f.status === 'overdue' ? '#991b1b' : '#92400e',
                  }}
                >
                  {f.status}
                </span>
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => handleMarkPaid(f.id || f._id)}
                  disabled={busyId === (f.id || f._id) || f.status === 'paid'}
                  style={{
                    padding: '0.35rem 0.75rem',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: f.status === 'paid' ? '#e5e7eb' : '#ecfdf5',
                    color: '#047857',
                    cursor:
                      busyId === (f.id || f._id) || f.status === 'paid' ? 'not-allowed' : 'pointer',
                  }}
                >
                  Mark Paid
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(f.id || f._id)}
                  disabled={busyId === (f.id || f._id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    cursor: busyId === (f.id || f._id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminFees;

