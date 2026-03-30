import { useEffect, useState } from 'react';
import api from '../utils/axios';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [editStudentId, setEditStudentId] = useState('');
  const [editForm, setEditForm] = useState({
    course: '',
    year: '',
    semester: '',
    guardianName: '',
    guardianPhone: '',
  });
  const [form, setForm] = useState({
    userEmail: '',
    studentId: '',
    course: '',
    year: '',
    semester: '',
    guardianName: '',
    guardianPhone: '',
  });

  const loadStudents = async () => {
    try {
      setError('');
      const res = await api.get('/api/students');
      setStudents(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleFormChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateStudent = async (e) => {
    e.preventDefault();
    setActionError('');
    setActionMessage('');
    setCreating(true);

    try {
      if (!form.userEmail || !form.studentId || !form.course || !form.year || !form.semester) {
        setActionError('Please fill in all required fields.');
        setCreating(false);
        return;
      }

      // Find user by email (admin should create the user account first)
      const usersRes = await api.get('/api/users');
      const allUsers = usersRes.data.data || [];
      const user = allUsers.find((u) => u.email?.toLowerCase() === form.userEmail.toLowerCase());

      if (!user) {
        setActionError('No user found with that email. Please create the user account first with role "student".');
        setCreating(false);
        return;
      }

      await api.post('/api/students', {
        user: user.id || user._id,
        studentId: form.studentId,
        course: form.course,
        year: form.year,
        semester: form.semester,
        guardianName: form.guardianName,
        guardianPhone: form.guardianPhone,
      });

      setActionMessage('Student created successfully.');
      setForm({
        userEmail: '',
        studentId: '',
        course: '',
        year: '',
        semester: '',
        guardianName: '',
        guardianPhone: '',
      });
      await loadStudents();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to create student');
    } finally {
      setCreating(false);
    }
  };

  const handleSelectEditStudent = (e) => {
    const id = e.target.value;
    setEditStudentId(id);
    const s = students.find((st) => String(st.id || st._id) === id);
    if (s) {
      setEditForm({
        course: s.course || '',
        year: s.year || '',
        semester: s.semester || '',
        guardianName: s.guardianName || '',
        guardianPhone: s.guardianPhone || '',
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

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    if (!editStudentId) {
      setActionError('Please select a student to update.');
      return;
    }
    try {
      setBusyId(editStudentId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/students/${editStudentId}`, {
        course: editForm.course,
        year: editForm.year,
        semester: editForm.semester,
        guardianName: editForm.guardianName,
        guardianPhone: editForm.guardianPhone,
      });
      setActionMessage('Student updated successfully.');
      await loadStudents();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update student');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to delete this student profile? This does not delete the user account.')) {
      return;
    }
    try {
      setBusyId(studentId);
      setActionError('');
      setActionMessage('');
      await api.delete(`/api/students/${studentId}`);
      setActionMessage('Student deleted successfully.');
      await loadStudents();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete student');
    } finally {
      setBusyId(null);
    }
  };

  const handleDeallocateRoom = async (studentId) => {
    try {
      setBusyId(studentId);
      setActionError('');
      setActionMessage('');
      await api.put(`/api/students/${studentId}/deallocate-room`);
      setActionMessage('Room deallocated successfully.');
      await loadStudents();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to deallocate room');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div>Loading students...</div>;

  return (
    <div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Manage Students</h2>
      <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>
        Link existing user accounts to student profiles and see their room assignments.
      </p>

      {/* Create Student Form */}
      <form
        onSubmit={handleCreateStudent}
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
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
            User Email (must already exist as a user)
          </label>
          <input
            name="userEmail"
            type="email"
            value={form.userEmail}
            onChange={handleFormChange}
            required
            placeholder="student@example.com"
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
            Student ID
          </label>
          <input
            name="studentId"
            value={form.studentId}
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
            Course
          </label>
          <input
            name="course"
            value={form.course}
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
            Year
          </label>
          <input
            name="year"
            value={form.year}
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
            Semester
          </label>
          <input
            name="semester"
            value={form.semester}
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
            Guardian Name
          </label>
          <input
            name="guardianName"
            value={form.guardianName}
            onChange={handleFormChange}
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
            Guardian Phone
          </label>
          <input
            name="guardianPhone"
            value={form.guardianPhone}
            onChange={handleFormChange}
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
            disabled={creating}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '0.75rem',
              border: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              fontWeight: 600,
              cursor: creating ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
            }}
          >
            {creating ? 'Creating...' : 'Add Student'}
          </button>
        </div>
      </form>

      {error && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{error}</div>
      )}
      {actionError && (
        <div style={{ marginBottom: '0.75rem', color: '#b91c1c', fontSize: '0.9rem' }}>{actionError}</div>
      )}
      {actionMessage && (
        <div style={{ marginBottom: '0.75rem', color: '#15803d', fontSize: '0.9rem' }}>{actionMessage}</div>
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Student ID</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Course</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Room</th>
            <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #e5e7eb' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.id || s._id}>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{s.studentId}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{s.user?.name}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>{s.course}</td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                {s.room ? `${s.room.block}-${s.room.roomNumber}` : 'Unassigned'}
              </td>
              <td style={{ padding: '0.5rem', borderBottom: '1px solid #f3f4f6' }}>
                <button
                  type="button"
                  onClick={() => handleDeallocateRoom(s.id || s._id)}
                  disabled={busyId === (s.id || s._id) || !s.room}
                  style={{
                    padding: '0.35rem 0.75rem',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #d1d5db',
                    backgroundColor: s.room ? '#eff6ff' : '#f3f4f6',
                    color: '#1d4ed8',
                    cursor: s.room && busyId !== (s.id || s._id) ? 'pointer' : 'not-allowed',
                  }}
                >
                  Deallocate Room
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteStudent(s.id || s._id)}
                  disabled={busyId === (s.id || s._id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.8rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #fecaca',
                    backgroundColor: '#fef2f2',
                    color: '#b91c1c',
                    cursor: busyId === (s.id || s._id) ? 'not-allowed' : 'pointer',
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Update Student Section */}
      <div
        style={{
          marginTop: '2rem',
          padding: '1rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.75rem' }}>Update Student</h3>
        <form
          onSubmit={handleUpdateStudent}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Select Student
            </label>
            <select
              value={editStudentId}
              onChange={handleSelectEditStudent}
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            >
              <option value="">-- Choose a student --</option>
              {students.map((s) => (
                <option key={s.id || s._id} value={String(s.id || s._id)}>
                  {s.studentId} - {s.user?.name || 'No name'}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#374151', marginBottom: '0.25rem', display: 'block' }}>
              Course
            </label>
            <input
              name="course"
              value={editForm.course}
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
              Year
            </label>
            <input
              name="year"
              value={editForm.year}
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
              Semester
            </label>
            <input
              name="semester"
              value={editForm.semester}
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
              Guardian Name
            </label>
            <input
              name="guardianName"
              value={editForm.guardianName}
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
              Guardian Phone
            </label>
            <input
              name="guardianPhone"
              value={editForm.guardianPhone}
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
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="submit"
              disabled={!editStudentId}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '0.75rem',
                border: 'none',
                background: editStudentId
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#e5e7eb',
                color: editStudentId ? 'white' : '#9ca3af',
                fontWeight: 600,
                cursor: editStudentId ? 'pointer' : 'not-allowed',
                fontSize: '0.9rem',
              }}
            >
              Update Student
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminStudents;

