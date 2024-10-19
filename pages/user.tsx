// pages/userProfile.tsx
import React from 'react';
import Bookers from './books'; // Ensure the path is correct
import { Bookings } from './api/type'; // Import the Bookings interface from the correct file

// Define the props type for user information
interface UserProfileProps {
  userBookings: Bookings[]; // Use the imported Bookings type
  userEmail: string;
  userName: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ userBookings, userEmail, userName }) => {
  
  const handleLogout = () => {
    // Clear user session
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    console.log('Logging out...');
    // Redirect to login
    window.location.href = '/login'; // Change to the appropriate route
  };

  const welcomeMessage = `Welcome back, ${userName || 'Guest'}.`;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {userName ? `Hello, ${userName}` : 'Loading...'}
          </h1>
          <span className="text-lg">{welcomeMessage}</span>
        </div>
        <div className="flex items-center">
          <span className="mr-4">{userEmail || 'Loading...'}</span>
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
            bookings={userBookings} // Pass the bookings to Bookers
            deleteBooking={(bookingId) => {
              console.log(`Delete booking with ID: ${bookingId}`);
              // Implement the delete functionality as needed
            }}
            editBooking={(updatedBooking) => {
              console.log('Update booking:', updatedBooking);
              // Implement the edit functionality as needed
            }}
           
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white p-6 mt-6 text-center">
        <p>&copy; 2024 Guys & Gals Salon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
