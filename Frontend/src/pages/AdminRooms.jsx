import { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [editRoomId, setEditRoomId] = useState('');
  const [editForm, setEditForm] = useState({
    block: '',
    floor: '',
    capacity: '',
    roomType: 'double',
  });
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [assignRoomId, setAssignRoomId] = useState('');
  const [assignStudentId, setAssignStudentId] = useState('');
  const [form, setForm] = useState({
    roomNumber: '',
    block: '',
    floor: '',
    capacity: '',
    roomType: 'double',
  });

  const loadRooms = async () => {
    try {
      const res = await api.get('/api/rooms');
      setRooms(res.data.data || []);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const res = await api.get('/api/students');
      setStudents(res.data.data || []);
    } catch {
      // keep silent here; assignment section will just have empty dropdown
    } finally {
      setStudentsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    loadStudents();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    try {
      if (!form.roomNumber || !form.block || !form.floor || !form.capacity) {
        setActionError('Please fill in all required fields.');
        return;
      }
      await api.post('/api/rooms', {
        roomNumber: form.roomNumber,
        block: form.block,
        floor: Number(form.floor),
        capacity: Number(form.capacity),
        roomType: form.roomType,
      });
      setActionMessage('Room created successfully.');
      setForm({
        roomNumber: '',
        block: '',
        floor: '',
        capacity: '',
        roomType: 'double',
      });
      await loadRooms();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create room');
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    try {
      setBusyId(roomId);
      setActionError('');
      setActionMessage('');
      await api.delete(`/api/rooms/${roomId}`);
      setActionMessage('Room deleted successfully.');
      await loadRooms();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete room');
    } finally {
      setBusyId(null);
    }
  };

  const handleSelectEditRoom = (e) => {
    const id = e.target.value;
    setEditRoomId(id);
    const room = rooms.find((r) => String(r.id || r._id) === id);
    if (room) {
      setEditForm({
        block: room.block || '',
        floor: room.floor ?? '',
        capacity: room.capacity ?? '',
        roomType: room.roomType || 'double',
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateRoom = async (e) => {
    e.preventDefault();
    if (!editRoomId) {
      setActionError('Please select a room to update.');
      return;
    }
    try {
      setBusyId(editRoomId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/rooms/${editRoomId}`, {
        block: editForm.block,
        floor: Number(editForm.floor),
        capacity: Number(editForm.capacity),
        roomType: editForm.roomType,
      });
      setActionMessage('Room updated successfully.');
      await loadRooms();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update room');
    } finally {
      setBusyId(null);
    }
  };

  const handleAssignSubmit = async (e) => {
    e.preventDefault();
    if (!assignRoomId || !assignStudentId) {
      setActionError('Please select both a room and a student.');
      return;
    }
    try {
      setBusyId(assignStudentId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/students/${assignStudentId}/assign-room`, {
        roomId: assignRoomId,
      });
      setActionMessage('Room assigned to student successfully.');
      await Promise.all([loadRooms(), loadStudents()]);
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to assign room');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div>Loading rooms...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Manage Rooms</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Create new rooms and view current availability.
      </p>

      {/* Create Room Form */}
      <form
        onSubmit={handleCreateRoom}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            Room Number
          </label>
          <input
            name="roomNumber"
            value={form.roomNumber}
            onChange={handleFormChange}
            required
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
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            Block
          </label>
          <input
            name="block"
            value={form.block}
            onChange={handleFormChange}
            required
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
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            Floor
          </label>
          <input
            name="floor"
            type="number"
            min="0"
            value={form.floor}
            onChange={handleFormChange}
            required
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
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            Capacity
          </label>
          <input
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={handleFormChange}
            required
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
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            Room Type
          </label>
          <select
            name="roomType"
            value={form.roomType}
            onChange={handleFormChange}
            style={{
              width: '100%',
              padding: '0.5rem 0.75rem',
              borderRadius: '0.5rem',
              border: '1px solid #d1d5db',
              fontSize: '0.9rem',
            }}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="triple">Triple</option>
            <option value="quad">Quad</option>
          </select>
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
            Add Room
          </button>
        </div>
      </form>

      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Room</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Block</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Floor</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Capacity</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Occupied</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Status</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id || r._id}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.roomNumber}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.block}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.floor}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.capacity}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{r.occupied}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <span
                  style={{
                    padding: '0.15rem 0.6rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    backgroundColor: r.isAvailable ? '#dcfce7' : '#fee2e2',
                    color: r.isAvailable ? '#166534' : '#991b1b',
                  }}
                >
                  {r.isAvailable ? 'Available' : 'Full'}
                </span>
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => deleteRoom(r.id || r._id)}
                  disabled={busyId === (r.id || r._id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    cursor: busyId === (r.id || r._id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Room Section */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Update Room</h3>
        <form
          onSubmit={handleUpdateRoom}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Select Room
            </label>
            <select
              value={editRoomId}
              onChange={handleSelectEditRoom}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            >
              <option value="">-- Choose a room --</option>
              {rooms.map((r) => (
                <option key={r.id || r._id} value={String(r.id || r._id)}>
                  {r.block}-{r.roomNumber}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Block
            </label>
            <input
              name="block"
              value={editForm.block}
              onChange={handleEditChange}
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
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Floor
            </label>
            <input
              name="floor"
              type="number"
              min="0"
              value={editForm.floor}
              onChange={handleEditChange}
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
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Capacity
            </label>
            <input
              name="capacity"
              type="number"
              min="1"
              value={editForm.capacity}
              onChange={handleEditChange}
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
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Room Type
            </label>
            <select
              name="roomType"
              value={editForm.roomType}
              onChange={handleEditChange}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            >
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="triple">Triple</option>
              <option value="quad">Quad</option>
            </select>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={!editRoomId}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: editRoomId
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#e5e7eb',
                color: editRoomId ? 'white' : '#9ca3af',
                fontWeight: 600,
                cursor: editRoomId ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
              }}
            >
              Update Room
            </button>
          </div>
        </form>
      </div>

      {/* Assign Room to Student */}
      <div
        style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Assign Room to Student</h3>
        <form
          onSubmit={handleAssignSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Room
            </label>
            <select
              value={assignRoomId}
              onChange={(e) => setAssignRoomId(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            >
              <option value="">-- Select room --</option>
              {rooms.map((r) => (
                <option key={r.id || r._id} value={String(r.id || r._id)}>
                  {r.block}-{r.roomNumber} (Cap {r.capacity}, Occ {r.occupied})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Student
            </label>
            <select
              value={assignStudentId}
              onChange={(e) => setAssignStudentId(e.target.value)}
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
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={!assignRoomId || !assignStudentId}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                background:
                  assignRoomId && assignStudentId
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : '#e5e7eb',
                color: assignRoomId && assignStudentId ? 'white' : '#9ca3af',
                fontWeight: 600,
                cursor: assignRoomId && assignStudentId ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
              }}
            >
              Assign Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRooms;

