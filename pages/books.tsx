import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';

interface BookersProps {
  bookings: Bookings[];
  deleteBooking: (bookingId: number ) => void; // Function to delete a booking
  editBooking: (updatedBooking: Bookings) => void; // Function to edit a booking
}

const Bookers: React.FC<BookersProps> = ({ deleteBooking, editBooking }) => {
  const [bookings, setBookings] = useState<Bookings[]>([]); // State to hold all bookings
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, ] = useState<string | null>(null); // Add error state

  // Fetch paid bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/booking');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Bookings[] = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error(error);

        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Ensure bookings is defined and filter only if not undefined
  const paidBookings = bookings.filter(booking => booking.payment_method.toLowerCase() === 'paid');

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-6 text-purple-600">Manage Bookings</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Time</th>
              <th className="px-4 py-2">Service</th>
              <th className="px-4 py-2">Staff</th>
              <th className="px-4 py-2">Payment</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paidBookings.length > 0 ? (
              paidBookings.map((booking) => (
                <tr key={booking.id} className="border-t hover:bg-gray-100 transition">
                  <td className="px-4 py-2">{booking.name}</td>
                  <td className="px-4 py-2">{booking.user_email}</td>
                  <td className="px-4 py-2">{booking.date}</td>
                  <td className="px-4 py-2">{booking.time}</td>
                  <td className="px-4 py-2">{booking.service}</td>
                  <td className="px-4 py-2">{booking.staff}</td>
                  <td className="px-4 py-2">{booking.payment_method}</td>
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
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  No paid bookings found.
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
