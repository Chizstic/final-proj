import React, { useEffect, useState } from 'react';
import Bookers from './books'; // Ensure the path is correct
import { Bookings } from './api/type'; // Import the Bookings interface from the correct file

interface UserProfileProps {
  email: string;
  name: string;
  role: string; // Add userRole prop to determine user permissions
}

const UserProfile: React.FC<UserProfileProps> = ({ email, name, role }) => {
  const [userBookings, setUserBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/bookings'); // Fetch all bookings
        if (!response.ok) {
          throw new Error('Error fetching user data');
        }
        const data = await response.json();
        const filteredBookings = data.bookings.filter((booking: Bookings) => booking.user_email === email); // Filter bookings by email
        setUserBookings(filteredBookings); // Set user bookings
      } catch  {
        setError('Failed to fetch bookings'); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    if (email) {
      fetchUserData(); // Fetch data only if email is present
    }
  }, [email]); // Run effect when userEmail changes

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login'; // Redirect to login
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading message
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>; // Show error message
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {name}</h1>
          <span className="text-lg">Welcome back, {name || 'Guest'}.</span>
        </div>
        <div className="flex items-center">
          <span className="mr-4">{email || 'Loading...'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">My Bookings</h2>
          <p className="text-gray-700 mb-4">View and manage your upcoming appointments and booking history.</p>
          <Bookers
            bookings={userBookings}
            deleteBooking={role === 'admin' ? (bookingId) => {
              console.log(`Delete booking with ID: ${bookingId}`);
              // Implement the delete functionality as needed
            } : () => {}}
            editBooking={role === 'admin' ? (updatedBooking) => {
              console.log('Update booking:', updatedBooking);
              // Implement the edit functionality as needed
            } : () => {}}
          />
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-6 mt-6 text-center">
        <p>&copy; 2024 Guys & Gals Salon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
