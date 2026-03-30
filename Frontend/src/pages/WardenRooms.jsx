import AdminRooms from './AdminRooms';

// Warden sees the same room table as admin
const WardenRooms = () => {
  return (
    <div>
      <h2>Rooms (Warden View)</h2>
      <AdminRooms />
    </div>
  );
};

export default WardenRooms;

