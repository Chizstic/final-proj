import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Bookings } from "@/types";

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
          throw new Error("Failed to fetch bookings");
        }
        const data: Bookings[] = await response.json();
        const sortedBookings = data.sort((a, b) => {
          if (a.status === "Completed" && b.status !== "Completed") return 1;
          if (a.status !== "Completed" && b.status === "Completed") return -1;
          return 0;
        });
        setBookings(sortedBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred");
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
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
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
        setError(errorData.message || "Failed to update booking status");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during status update");
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
        method: "DELETE",
      });

      if (response.ok) {
        setBookings((prevBookings) =>
          prevBookings.filter((booking) => booking.bookingid !== bookingId)
        );
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete booking");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during deletion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          {confirmationMessage && (
            <div className="m-4 rounded-2xl bg-green-600 p-4 text-white">{confirmationMessage}</div>
          )}

          {showConfirmDialog && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl bg-white p-8 text-gray-800 shadow-2xl">
                <h2 className="mb-4 text-2xl font-bold">Confirm Status Update</h2>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Booking ID:</span> {showConfirmDialog.bookingId}
                </p>
                <p className="text-gray-700 mb-6">
                  <span className="font-semibold">New Status:</span> {showConfirmDialog.newStatus}
                </p>

                <div className="flex justify-end gap-4">
                  <button
                    onClick={() =>
                      confirmStatusChange(showConfirmDialog.bookingId, showConfirmDialog.newStatus)
                    }
                    disabled={loading}
                    className="rounded-2xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700"
                  >
                    Yes
                  </button>
                  <button
                    onClick={cancelStatusChange}
                    disabled={loading}
                    className="rounded-2xl bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-auto">
            <thead className="bg-rose-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Booking ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Time</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Service</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Staff</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Created At</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingid} className="border-t border-rose-100 transition hover:bg-rose-50/70">
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.bookingid}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.email}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.time}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.services}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.staffname}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{booking.paymentmethod}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">{new Date(booking.created_at).toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-slate-700">
                      <select
                        value={booking.status}
                        onChange={(e) =>
                          handleStatusChange(e, booking.bookingid, booking.status)
                        }
                        disabled={loading}
                        className="rounded-full border border-rose-200 px-3 py-2 text-sm text-slate-700 outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Ongoing">Ongoing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        onClick={() => handleDelete(booking.bookingid)}
                        disabled={loading}
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="p-6 text-center text-slate-500">No bookings found</td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBookings;
