import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import StaffList from './stafflist';
import AdminBookings from './Bookings';
import { Staff, Bookings } from './api/type';
import { AiOutlineUser, AiOutlineSchedule, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { useAuth } from "@/context/AuthContext";


const AdminPage: React.FC = () => {
  const router = useRouter();
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [userEmail, ] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'staff' | 'bookings'>('staff');
  const [loading, setLoading] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
   const { user, logout } = useAuth();
 

  useEffect(() => {
      if (!loading) {
          if (!user) {
              router.push("/login");
          } else if (user.role !== "admin") {
              router.push("/unauthorized");
          }
      }
  }, [user, loading, router]);

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

  

    fetchBookings();
  }, []);

  const handleLogout = () => {
   logout();
  };

  const pageTitle = activeTab === 'staff' ? 'Manage Staff' : 'Manage Bookings';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with Sidebar Toggle and Page Title */}
      <header className="flex items-center bg-white shadow-lg px-6 py-4 z-10">
        <button onClick={() => setIsSidebarVisible(!isSidebarVisible)} className="text-3xl text-gray-600 mr-4">
          {isSidebarVisible ? <AiOutlineMenu /> : <AiOutlineMenu />}
        </button>
        <h1 className="text-2xl font-bold text-gray-800">{pageTitle}</h1>
      </header>

      {/* Sidebar - Position it absolutely so it slides over content, without covering the header */}
      {isSidebarVisible && (
        <aside
          className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg p-6 z-20 transition-transform transform"
          style={{ marginTop: '4rem' }} // Adjust to match header height so it starts just below the header
        >
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex items-center w-full px-4 py-3 mb-4 rounded-lg text-lg font-medium text-gray-800 hover:bg-gray-100 transition-all ${
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
      <main className={`flex-1 p-8 transition-all ${isSidebarVisible ? 'ml-64' : ''}`}>
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
  editBooking={(updatedBooking): void =>
    setBookings((prev) =>
      prev.map((booking) =>
        booking.bookingid === updatedBooking.bookingid ? updatedBooking : booking
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