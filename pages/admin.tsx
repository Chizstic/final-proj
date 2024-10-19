// src/pages/admin.tsx
import React, { useEffect, useState } from 'react';
import StaffList from './stafflist'; // Ensure the path is correct
import Bookers from './books'; // Import the Bookers component
import { Staff, Bookings } from './api/type'; // Import both types

const AdminPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bookings, setBookings] = useState<Bookings[]>([]);
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
    setStaffList((prev) => prev.filter((staff) => staff.id !== staffId));
  };

  const deleteBooking = (bookingId: number) => {
    setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
  };

  const editBooking = (updatedBooking: Bookings) => {
    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === updatedBooking.id ? updatedBooking : booking
      )
    );
  };

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
          <Bookers
            bookings={bookings} // Pass the bookings state to Bookers
            deleteBooking={deleteBooking} // Pass the deleteBooking function
            editBooking={editBooking} // Pass the editBooking function
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
