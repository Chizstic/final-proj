import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';

// Update the AdminBookingsProps interface to include user_email
interface AdminBookingsProps {
  bookings: Bookings[];
  deleteBooking: (bookingId: number ) => void;
  editBooking: (updatedBooking: Bookings) => void;
  email: string;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ email, deleteBooking, editBooking }) => {
  const [bookings, setBookings] = useState<Bookings[]>([]); // State to hold all bookings
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState<string | null>(null); // Add error state

  // Fetch paid bookings when the component mounts
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/booking`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Bookings[] = await response.json();
        setBookings(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [email]); // Include user_email as a dependency

  // Ensure bookings is an array before filtering
const paidBookings = Array.isArray(bookings)
? bookings.filter(
    (booking) => booking.paymentMethod?.toLowerCase() === 'paid'
  )
: [];

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
                <tr key={booking.bookingID} className="border-t hover:bg-gray-100 transition">
                  <td className="px-4 py-2">{booking.email}</td>
                  <td className="px-4 py-2">{booking.date}</td>
                  <td className="px-4 py-2">{booking.time}</td>
                  <td className="px-4 py-2">{booking.services}</td>
                  <td className="px-4 py-2">{booking.staffname}</td>
                  <td className="px-4 py-2">{booking.paymentMethod}</td>
                  <td className="px-4 py-2">
                    <button
                      className="text-blue-500 mr-4 hover:underline"
                      onClick={() => editBooking(booking)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 hover:underline"
                      onClick={() => booking.bookingID ? deleteBooking(booking.bookingID) : null} // Ensure booking.id is defined
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

export default AdminBookings;
