// src/components/BookingList.tsx
import React from 'react';
import { Bookings } from './api/booking'; // Ensure the path is correct

interface BookingListProps {
  bookings: Bookings[]; // Correctly using Bookings
  deleteBooking: (id: number) => void;
  editBooking: (booking: Bookings) => void; // Correct type for editBooking
}

const BookingList: React.FC<BookingListProps> = ({ bookings, deleteBooking, editBooking }) => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Bookings</h2>
      <table className="min-w-full bg-white border border-gray-200 shadow-md">
        <thead>
          <tr>
            <th className="border-b p-2">Client Name</th>
            <th className="border-b p-2">Booking Date</th>
            <th className="border-b p-2">Service</th>
            <th className="border-b p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id || booking.name}> 
              <td className="border-b p-2">{booking.name}</td>
              <td className="border-b p-2">{booking.date}</td>
              <td className="border-b p-2">{booking.service}</td>
              <td className="border-b p-2">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2 hover:bg-red-700 transition"
                  onClick={() => {
                    const id = booking.id;
                    if (id) {
                      deleteBooking(id);
                    } else {
                      console.error("Booking ID is undefined.");
                    }
                  }}
                >
                  Delete
                </button>

                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded ml-2 hover:bg-blue-700 transition"
                  onClick={() => editBooking(booking)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BookingList;


