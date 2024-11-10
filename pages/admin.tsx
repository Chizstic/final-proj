import React, { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/router';
import StaffList from './stafflist';
import AdminBookings from './Bookings';
import { Staff, Bookings } from './api/type';
import { AiOutlineUser, AiOutlineSchedule, AiOutlineLogout } from 'react-icons/ai';
import { useAuth } from '../context/AuthContext'; // Use the custom hook

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { user } = useAuth(); // UseAuth hook to get user from context
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'staff' | 'bookings'>('staff');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Prevent search engines from indexing the page
    const metaTag = document.createElement('meta');
    metaTag.name = 'robots';
    metaTag.content = 'noindex, nofollow';
    document.head.appendChild(metaTag);

    // Clean up the meta tag when the component unmounts
    return () => {
      document.head.removeChild(metaTag);
    };
  }, []);

  // Redirect if the user is not authenticated
  useEffect(() => {
    if (!user) {
      router.push('/login');  // Redirect to the login page if not authenticated
    }
  }, [user, router]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/booking');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      }
      setLoading(false);
    };

    const fetchUserEmail = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Network response was not ok');
        const userData = await response.json();
        setUserEmail(userData.email);
      } catch (error) {
        console.error('Error fetching user email:', error);
      }
    };

    fetchBookings();
    fetchUserEmail();
  }, []);

  const handleLogout = () => {
    router.push('/'); // Logout and redirect to home page
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-1/4 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white shadow-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Panel</h2>
        <button
          onClick={() => setActiveTab('staff')}
          className={`flex items-center w-full px-4 py-2 mb-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all ${
            activeTab === 'staff' ? 'bg-blue-700' : 'bg-transparent'
          }`}
        >
          <AiOutlineUser className="mr-3" />
          Staff
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center w-full px-4 py-2 mb-2 rounded-lg text-lg font-medium hover:bg-blue-700 transition-all ${
            activeTab === 'bookings' ? 'bg-blue-700' : 'bg-transparent'
          }`}
        >
          <AiOutlineSchedule className="mr-3" />
          Bookings
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 mt-6 rounded-lg text-lg font-medium bg-red-600 hover:bg-red-700 transition-all"
        >
          <AiOutlineLogout className="mr-3" />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
          </div>
        ) : activeTab === 'staff' ? (
          <StaffList
            staffList={staffList}
            handleAddStaff={(newStaff) => setStaffList((prev) => [...prev, newStaff])}
            handleDeleteStaff={(staffId) =>
              setStaffList((prev) => prev.filter((staff) => staff.staffid !== staffId))
            }
          />
        ) : (
          <AdminBookings
            bookings={bookings}
            deleteBooking={(bookingId) =>
              setBookings((prev) => prev.filter((booking) => booking.bookingID !== bookingId))
            }
            editBooking={(updatedBooking) =>
              setBookings((prev) =>
                prev.map((booking) =>
                  booking.bookingID === updatedBooking.bookingID ? updatedBooking : booking
                )
              )
            }
            email={userEmail}
          />
        )}
      </main>
    </div>
  );
};

export default AdminPage;
