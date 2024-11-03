import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';

const UserProfile: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedEmail = localStorage.getItem('userEmail'); // Ensure correct key
    const storedName = localStorage.getItem('userName');

    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);

    console.log("Retrieved name:", storedName); // Debugging line

    // Fetch user bookings
    const fetchBookings = async () => {
      console.log('Fetching bookings...'); // Debugging log
      setLoading(true);
      try {
        const response = await fetch('/api/booking');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings: ' + response.statusText);
        }
        const data: Bookings[] = await response.json();
        console.log('Fetched bookings:', data); // Debugging log
        
        // Filter bookings by logged-in user's email
        const userBookings = data.filter(booking => booking.email === storedEmail);
        setBookings(userBookings);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An error occurred';
        setError(errorMessage);
        console.error('Error fetching bookings:', error); // Log any errors
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login'; // Redirect to login
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {name || email || 'Guest'}</h1>
        </div>

        <div className="flex items-center">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <h2 className="text-2xl font-semibold mb-6 text-purple-600">My Bookings</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Time</th>
                <th className="px-4 py-2">Service</th>
                <th className="px-4 py-2">Staff</th>
                <th className="px-4 py-2">Payment</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.bookingID} className="border-t hover:bg-gray-100 transition">
                    <td className="px-4 py-2">{booking.email}</td>
                    <td className="px-4 py-2">{booking.date}</td>
                    <td className="px-4 py-2">{booking.time}</td>
                    <td className="px-4 py-2">{booking.services}</td>
                    <td className="px-4 py-2">{booking.staffname}</td>
                    <td className="px-4 py-2">{booking.paymentmethod}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-6 mt-6 text-center">
        <p>&copy; 2024 Guys & Gals Salon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
