// src/components/Bookers.tsx
import React, { useState } from 'react';
import BookingList from './bookinglist'; // Ensure the path is correct
import BookingForm from './bookingform'; // Ensure the path is correct

interface BookingDetails {
  name: string;
  date: string;
  service: string;
}

interface Booking extends BookingDetails {
  id: number; // Required for existing bookings
}

const Bookers: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]); // Example bookings state

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowForm(true);
  };

  const handleDeleteBooking = (id: number) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  const handleSubmitBooking = (bookingDetails: BookingDetails) => {
    if (selectedBooking) {
      // Update existing booking
      setBookings(bookings.map(booking =>
        booking.id === selectedBooking.id ? { ...booking, ...bookingDetails } : booking
      ));
    } else {
      // Add new booking
      setBookings([...bookings, { id: bookings.length + 1, ...bookingDetails }]);
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
            name: selectedBooking.name,
            date: selectedBooking.date,
            service: selectedBooking.service,
          } : null}
        />
      )}
    </div>
  );
};

export default Bookers;
