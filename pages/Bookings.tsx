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
  const [loading, setLoading] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState<{
    bookingId: number;
    newStatus: string;
    previousStatus: string;
  } | null>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/booking`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Bookings[] = await response.json();
        const sortedBookings = data.sort((a, b) => {
          if (a.status === 'Completed' && b.status !== 'Completed') return 1;
          if (a.status !== 'Completed' && b.status === 'Completed') return -1;
          return 0;
        });
        setBookings(sortedBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    fetchBookings();
  }, [email]);

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    bookingId: number,
    currentStatus: string
  ) => {
    const newStatus = e.target.value;
    setShowConfirmDialog({ bookingId, newStatus, previousStatus: currentStatus });
  };

  const confirmStatusChange = async (bookingId: number, newStatus: string) => {
    setLoading(true);

    try {
      const response = await fetch(`/api/booking`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bookingId, status: newStatus }),
      });

      if (response.ok) {
        const updatedBooking = await response.json();

        setBookings((prevBookings) =>
          prevBookings.map((booking) =>
            booking.bookingid === bookingId
              ? { ...booking, status: updatedBooking.status }
              : booking
          )
        );

        setConfirmationMessage(`Booking ID ${bookingId} status updated to "${newStatus}"`);
        setTimeout(() => setConfirmationMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to update booking status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during status update');
    } finally {
      setLoading(false);
      setShowConfirmDialog(null);
    }
  };

  const cancelStatusChange = () => {
    if (showConfirmDialog) {
      const { bookingId, previousStatus } = showConfirmDialog;
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.bookingid === bookingId ? { ...booking, status: previousStatus } : booking
        )
      );
    }
    setShowConfirmDialog(null);
  };

  const handleDelete = async (bookingId: number) => {
    setLoading(true);

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
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {confirmationMessage && (
            <div className="bg-green-500 text-white p-4 rounded-md mb-4">{confirmationMessage}</div>
          )}

          {showConfirmDialog && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-lg">
                <h2 className="text-lg font-semibold">Are you sure you want to update the status?</h2>
                <p>Booking ID: {showConfirmDialog.bookingId}</p>
                <p>New Status: {showConfirmDialog.newStatus}</p>
                <div className="mt-4">
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-md mr-4"
                    onClick={() =>
                      confirmStatusChange(showConfirmDialog.bookingId, showConfirmDialog.newStatus)
                    }
                    disabled={loading}
                  >
                    Yes
                  </button>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-md"
                    onClick={cancelStatusChange}
                    disabled={loading}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
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
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(e, booking.bookingid, booking.status)
                        }
                        disabled={loading}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                    <button
                        className="text-gray-500 hover:text-red-500"
                        onClick={() => handleDelete(booking.bookingid)}
                        disabled={loading}
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10}>No bookings found</td>
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


