// src/pages/admin.tsx
import React, { useState } from 'react';
import StaffList from './stafflist';
import { Staff } from './api/type';

const AdminPage: React.FC = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]); // Initialize as an empty array

  const handleAddStaff = (newStaff: Staff) => {
    setStaffList((prev) => [...prev, newStaff]); // Add new staff to the list
  };

  const handleDeleteStaff = (staffId: number) => {
    setStaffList((prev) => prev.filter(staff => staff.id !== staffId)); // Remove staff by ID
  };

  return (
    <div>
      <StaffList 
        staffList={staffList} 
        handleAddStaff={handleAddStaff} 
        handleDeleteStaff={handleDeleteStaff} 
      />
    </div>
  );
};

export default AdminPage;
