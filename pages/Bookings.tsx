import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';
import {  FaTrashAlt } from 'react-icons/fa';

interface AdminBookingsProps {
  bookings: Bookings[];
  editBooking: (updatedBooking: Bookings) => void;
  email: string;
}

const AdminBookings: React.FC<AdminBookingsProps> = ({ email}) => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`/api/booking`);
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data: Bookings[] = await response.json();
        console.log('Fetched bookings:', data); // Log the response for debugging
        setBookings(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookings();
  }, [email]);
  

  const handleDelete = async (bookingId: number) => {
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
      if (err instanceof Error) {
        console.error(err.message);
        setError(err.message);
      } else {
        console.error('Unexpected error:', err);
        setError('An unexpected error occurred during deletion');
      }
    }
  };
  

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Booking ID</th> {/* New Column */}
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
                  <tr key={booking.bookingid} className="border-t hover:bg-gray-100 transition duration-200">
                    <td className="px-6 py-4 text-sm text-gray-600">{booking.bookingid}</td> {/* Display Booking ID */}
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
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(booking.bookingid)}
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-4 text-center text-sm text-gray-600">No bookings found.</td>
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
