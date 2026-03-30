import { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [roleBusyId, setRoleBusyId] = useState(null);

  const loadUsers = async () => {
    try {
      setError('');
      const res = await api.get('/api/users');
      setUsers(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggleStatus = async (userId) => {
    try {
      setActionError('');
      setActionMessage('');
      setBusyId(userId);
      await api.put(`/api/users/${userId}/toggle-status`);
      setActionMessage('User status updated');
      await loadUsers();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setBusyId(null);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setActionError('');
      setActionMessage('');
      setBusyId(userId);
      await api.delete(`/api/users/${userId}`);
      setActionMessage('User deleted');
      await loadUsers();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setBusyId(null);
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      setActionError('');
      setActionMessage('');
      setRoleBusyId(userId);
      await api.put(`/api/users/${userId}`, { role: newRole });
      setActionMessage('User role updated');
      await loadUsers();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setRoleBusyId(null);
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Manage Users</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        View all users, toggle their active status, or remove them from the system.
      </p>

      {error && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>
          {error}
        </div>
      )}
      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>
          {actionError}
        </div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>
          {actionMessage}
        </div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Email</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Role</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id || u._id}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{u.name}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{u.email}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <select
                  value={u.role}
                  disabled={roleBusyId === (u.id || u._id)}
                  onChange={(e) => changeRole(u.id || u._id, e.target.value)}
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    fontSize: '0.8rem',
                  }}
                >
                  <option value="admin">Admin</option>
                  <option value="warden">Warden</option>
                  <option value="student">Student</option>
                </select>
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <span
                  style={{
                    padding: '0.15rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: u.isActive ? '#dcfce7' : '#fee2e2',
                    color: u.isActive ? '#166534' : '#991b1b',
                  }}
                >
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => toggleStatus(u.id || u._id)}
                  disabled={busyId === (u.id || u._id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: '#eff6ff',
                    color: '#1d4ed8',
                    cursor: busyId === (u.id || u._id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  {u.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  type="button"
                  onClick={() => deleteUser(u.id || u._id)}
                  disabled={busyId === (u.id || u._id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    cursor: busyId === (u.id || u._id) ? 'not-allowed' : 'pointer',
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

export default AdminUsers;

