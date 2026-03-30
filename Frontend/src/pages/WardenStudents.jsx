import AdminStudents from './AdminStudents';

// Warden sees the same student table as admin
const WardenStudents = () => {
  return (
    <div>
      <h2>Students (Warden View)</h2>
      <AdminStudents />
    </div>
  );
};

export default WardenStudents;

