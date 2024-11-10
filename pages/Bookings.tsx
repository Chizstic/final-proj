import React, { useEffect, useState } from 'react'; 
import { Bookings } from './api/type';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons for action buttons

interface AdminBookingsProps {
  bookings: Bookings[];
  deleteBooking: (bookingId: number) => void;
  editBooking: (updatedBooking: Bookings) => void;
  email: string;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ email, deleteBooking, editBooking }) => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, [email]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl font-semibold text-purple-600 mb-6">Manage Bookings</h2>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Service</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Staff</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingID} className="border-t hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.services}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.staffname}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.paymentmethod}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-800"
                          onClick={() => editBooking(booking)}
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800"
                          onClick={() => booking.bookingID ? deleteBooking(booking.bookingID) : null}
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-4 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;