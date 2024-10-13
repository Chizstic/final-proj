// src/pages/stafflist.tsx
import React from 'react';
import { Staff } from './api/type';

interface StaffListProps {
  staffList: Staff[];
  handleAddStaff: (newStaff: Staff) => void;
  handleDeleteStaff: (staffId: number) => void;
}

const StaffList: React.FC<StaffListProps> = ({ staffList, handleDeleteStaff }) => {
  return (
    <div>
      {staffList.length === 0 ? (
        <p>No staff members available.</p>
      ) : (
        staffList.map((staff) => (
          <div key={staff.id} className="flex justify-between items-center">
            <span>{`${staff.firstName} ${staff.lastName} - ${staff.position}`}</span>
            <button onClick={() => handleDeleteStaff(staff.id)} className="text-red-500">
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default StaffList;
