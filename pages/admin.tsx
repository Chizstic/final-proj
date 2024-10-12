// src/pages/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import  Link  from 'next/link';
import StaffList from './stafflist';
import { Staff } from './api/type';

const AdminPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
 
  const fetchStaffList = async () => {
    // Simulated fetch staff list for Next.js
    const data: Staff[] = [
      { id: 1, firstName: 'John', lastName: 'Doe', position: 'Manager' },
      // Add more sample data if necessary
    ];
    setStaffList(data);
  };

  useEffect(() => {
    fetchStaffList();
  }, []);

  const handleAddStaff = (newStaff: Staff) => {
    setStaffList((prev) => [...prev, newStaff]);
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaffList((prev) => prev.filter(staff => staff.id !== staffId));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <main className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Staffs</h2>
            <p className="text-gray-700">View and manage your staff.</p>
            
            <StaffList 
              staffList={staffList} 
              handleAddStaff={handleAddStaff} 
              handleDeleteStaff={handleDeleteStaff} 
            />
          </section>

          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 text-purple-600">Navigate</h2>
            <Link href="/books" className="text-blue-600 hover:underline">
              Go to Bookings
            </Link>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
