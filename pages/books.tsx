import React from 'react';
import { Bookings } from './api/type'; // Ensure you're importing the type

interface BookersProps {
  bookings: Bookings[] | undefined;
  deleteBooking: (id: number) => void;
  editBooking: (booking: Bookings) => void;
}

const Bookers: React.FC<BookersProps> = ({ bookings, deleteBooking, editBooking }) => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-purple-600">Manage Bookings</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? (
              bookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-gray-100 transition">
                  <td className="px-4 py-2">{booking.name}</td>
                  <td className="px-4 py-2">{booking.date}</td>
                  <td className="px-4 py-2">{booking.service}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 mr-4 hover:underline"
                      onClick={() => editBooking(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => deleteBooking(booking.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookers;
