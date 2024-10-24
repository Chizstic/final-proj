import React, { useEffect, useState } from 'react';
import StaffList from './stafflist'; // Ensure the path is correct
import AdminBookings from './adminBookings'; // Import the AdminBookings component
import { Staff, Bookings } from './api/type'; // Import both types

const AdminPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bookings, setBookings] = useState<Bookings[]>([]); // Initialize bookings state
  const [activeTab, setActiveTab] = useState<'staff' | 'bookings'>('staff');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/booking');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
    };

    fetchBookings();
  }, []);

  const handleAddStaff = (newStaff: Staff) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaffList((prev) => prev.filter((staff) => staff.staffid !== staffId));
  };

  const deleteBooking = (bookingId: number) => {
    setBookings((prev) => prev.filter((booking) => booking.bookingID !== bookingId)); // Update to use bookingID
  };

  const editBooking = (updatedBooking: Bookings) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.bookingID === updatedBooking.bookingID ? updatedBooking : booking // Update to use bookingID
      )
    );
  };

  // Placeholder for user email
  const user_email = "example@example.com"; // Replace with actual user email logic

  return (
    <div className="flex">
      <aside className="w-1/4 bg-gray-200 p-4">
        <h2 className="font-bold text-lg mb-4">Admin Panel</h2>
        <button
          onClick={() => setActiveTab('staff')}
          className={`w-full text-left p-2 rounded-lg ${activeTab === 'staff' ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
        >
          Staff
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`w-full text-left p-2 rounded-lg ${activeTab === 'bookings' ? 'bg-blue-500 text-white' : 'bg-transparent'}`}
        >
          Bookings
        </button>
      </aside>

      <main className="flex-1 p-6">
        {activeTab === 'staff' ? (
          <StaffList
            staffList={staffList}
            handleAddStaff={handleAddStaff}
            handleDeleteStaff={handleDeleteStaff}
          />
        ) : (
          <AdminBookings
            bookings={bookings} // Pass the bookings to AdminBookings component
            deleteBooking={deleteBooking} // Pass the deleteBooking function
            editBooking={editBooking} // Pass the editBooking function
            email={user_email} // Pass the user_email here
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
