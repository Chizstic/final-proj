import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';
import { FaTrashAlt } from 'react-icons/fa';

interface AdminBookingsProps {
  bookings: Bookings[];
  editBooking: (updatedBooking: Bookings) => void;
  email: string;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ email }) => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(false);  // Loading state for status change or deletion
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/booking`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Bookings[] = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    fetchBookings();
  }, [email]);

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>, bookingId: number) => {
    const newStatus = e.target.value;
    setLoading(true);  // Set loading state to true while updating
  
    try {
      const response = await fetch(`/api/booking`, {
        method: 'PUT', // PUT is correct for updating data
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });
      if (response.ok) {
        const updatedBooking = await response.json();
        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingid === bookingId ? { ...booking, status: updatedBooking.booking.status } : booking
          )
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update booking status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during status update');
    } finally {
      setLoading(false);  // Set loading state to false when request completes
    }
  };
  

  const handleDelete = async (bookingId: number) => {
    setLoading(true);  // Set loading state to true while deleting

    try {
      const response = await fetch(`/api/booking?bookingID=${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.bookingid !== bookingId)
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to delete booking');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during deletion');
    } finally {
      setLoading(false);  // Set loading state to false when request completes
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Booking ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Time</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Service</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Staff</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Payment</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingid} className="border-t hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.bookingid}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.services}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.staffname}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.paymentmethod}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(booking.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <select
                        className="border rounded px-2 py-1"
                        value={booking.status}
                        onChange={(e) => handleStatusChange(e, booking.bookingid)}
                        disabled={loading} // Disable during loading to prevent multiple submissions
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(booking.bookingid)}
                        disabled={loading} // Disable during loading to prevent multiple submissions
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center text-sm text-gray-600">No bookings found</td>
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
