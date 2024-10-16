// src/pages/stafflist.tsx
import React from 'react';
import { Staff } from './api/type';
import AddingStaff from './staffForm'; // Ensure this import path is correct

interface StaffListProps {
  staffList: Staff[]; // Ensure this is not optional
  handleAddStaff: (newStaff: Staff) => void;
  handleDeleteStaff: (staffId: number) => void;
}

const StaffList: React.FC<StaffListProps> = ({
  staffList,
  handleAddStaff,
  handleDeleteStaff
}) => {
  return (
    <div className="staff-list">
      <h1 className="text-2xl font-bold mb-4">Staff List</h1>

      {/* Ensure handleAddStaff is passed correctly here */}
      <AddingStaff handleAddStaff={handleAddStaff} />

      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">Staff ID</th>
            <th className="border border-gray-300 p-2">First Name</th>
            <th className="border border-gray-300 p-2">Last Name</th>
            <th className="border border-gray-300 p-2">Position</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staffList.length > 0 ? (
            staffList.map((staffMember) => (
              <tr key={staffMember.id}>
                <td className="border border-gray-300 p-2">{staffMember.id}</td>
                <td className="border border-gray-300 p-2">{staffMember.first_name}</td>
                <td className="border border-gray-300 p-2">{staffMember.last_name}</td>
                <td className="border border-gray-300 p-2">{staffMember.position}</td>
                <td className="border border-gray-300 p-2">
                  <button
                    onClick={() => {
                      if (staffMember.id !== undefined) {
                        if (window.confirm(`Are you sure you want to delete staff ID: ${staffMember.id}?`)) {
                          handleDeleteStaff(staffMember.id);
                        }
                      } else {
                        console.error('Staff ID is undefined');
                      }
                    }}
                    className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center p-4">No staff members found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
