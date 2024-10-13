// pages/userProfile.tsx
import React from 'react';
import BookingList from './bookinglist'; // Ensure the path is correct

// Define the props type for user information and bookings
interface Booking {
  id: number;
  name: string; // Add name property to match the Bookings interface
  service: string;
  date: string;
  time: string;
}

interface UserProfileProps {
  userBookings: Booking[]; // Updated to match the new Booking type
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
    // Redirect to login or homepage
    window.location.href = '/'; // Change to the appropriate route
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {userName ? `Hello, ${userName}` : 'Loading...'}
          </h1>
          <span className="text-lg">Welcome to your profile</span>
        </div>
        <div className="flex items-center">
          <span className="mr-4">{userEmail || 'Loading...'}</span> {/* Display loading state for email */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">My Bookings</h2>
          <p className="text-gray-700 mb-4">View and manage your upcoming appointments and booking history.</p>
          {/* Mocked bookings data */}
          <BookingList 
            bookings={userBookings} 
            deleteBooking={() => {}} 
            editBooking={() => {}} 
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

// Static props for demonstration purposes
export async function getStaticProps() {
  // Mock user information and bookings
  const userBookings = [
    { id: 1, name: 'John Doe', service: 'Haircut', date: '2024-10-15', time: '10:00 AM' },
    { id: 2, name: 'John Doe', service: 'Manicure', date: '2024-10-20', time: '2:00 PM' },
  ];

  return {
    props: {
      userBookings,
      userEmail: 'user@example.com',
      userName: 'John Doe',
    },
  };
}

export default UserProfile;
