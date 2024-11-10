import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StaffList from './stafflist';
import AdminBookings from './Bookings';
import { Staff, Bookings } from './api/type';
import { AiOutlineUser, AiOutlineSchedule, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'staff' | 'bookings'>('staff');
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

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
    <div className="flex min-h-screen bg-gray-50">
      {/* Menu Icon in the Top Left Corner */}
      <div className="absolute top-6 left-6 z-10">
        <AiOutlineMenu 
          className="text-3xl cursor-pointer text-gray-600" 
          onClick={() => setIsSidebarVisible(!isSidebarVisible)} 
        />
      </div>

      {/* Sidebar */}
      {isSidebarVisible && (
        <aside className="w-1/4 bg-white shadow-lg rounded-lg p-6">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center w-full px-4 mt-12 py-3 mb-4 rounded-lg text-lg font-medium text-gray-800 hover:bg-gray-100 transition-all ${
              activeTab === 'staff' ? 'bg-gray-100' : ''
            }`}
          >
            <AiOutlineUser className="mr-3 text-xl text-gray-600" />
            Manage Staff
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center w-full px-4 py-3 mb-4 rounded-lg text-lg font-medium text-gray-800 hover:bg-gray-100 transition-all ${
              activeTab === 'bookings' ? 'bg-gray-100' : ''
            }`}
          >
            <AiOutlineSchedule className="mr-3 text-xl text-gray-600" />
            View Bookings
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 mt-6 rounded-lg text-lg font-medium bg-red-500 text-white hover:bg-red-600 transition-all"
          >
            <AiOutlineLogout className="mr-3 text-xl" />
            Logout
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-8 transition-all ${isSidebarVisible ? 'ml-1/4' : ''}`}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-gray-400"></div>
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