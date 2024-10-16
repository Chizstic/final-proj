import React, { useState } from 'react';
import BookingList from './bookinglist'; // Ensure the path is correct
import BookingForm from './bookingform'; // Ensure the path is correct
import { Bookings } from './api/type'; // Import the Bookings interface

const Bookers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Bookings | null>(null);
  const [bookings, setBookings] = useState<Bookings[]>([]); // Example bookings state

  const handleEditBooking = (booking: Bookings) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const handleSubmitBooking = (bookingDetails: Bookings) => {
    if (selectedBooking) {
      // Update existing booking
      setBookings(bookings.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, ...bookingDetails } : booking
      ));
    } else {
      // Add new booking
      const newId = bookings.length > 0 ? Math.max(...bookings.map(b => b.id ?? 0)) + 1 : 1; // Generate new id
      setBookings((prevBookings) => [...prevBookings, { id: newId, ...bookingDetails }]);
    }
    setShowForm(false);
    setSelectedBooking(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-purple-600">Manage Bookings</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <BookingList
          bookings={bookings}
          deleteBooking={handleDeleteBooking}
          editBooking={handleEditBooking}
        />
      </div>
      {showForm && (
        <BookingForm
          onClose={() => {
            setShowForm(false);
            setSelectedBooking(null);
          }}
          onSubmit={handleSubmitBooking}
          initialBookingDetails={selectedBooking ? {
            id: selectedBooking.id, // Include the id
            name: selectedBooking.name,
            date: selectedBooking.date,
            time: selectedBooking.time,
            service: selectedBooking.service,
            staff: selectedBooking.staff || '', // Add staff, defaulting to an empty string if not available
            userEmail: selectedBooking.userEmail || '', // Add userEmail, defaulting to an empty string if not available
          } : undefined} // Ensure undefined is passed if no selectedBooking
        />
      )}
    </div>
  );
};

export default Bookers;
