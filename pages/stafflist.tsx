// src/components/StaffList.tsx
import React, { useState } from 'react';
import { Staff } from './api/type';

interface StaffListProps {
  staffList: Staff[];
  handleAddStaff: (newStaff: Staff) => void;
  handleDeleteStaff: (staffId: number) => void;
}

const StaffList: React.FC<StaffListProps> = ({ staffList, handleAddStaff, handleDeleteStaff }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  const onAddStaff = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newStaff: Staff = {
      id: staffList.length + 1, // Simulate ID based on array length
      firstName,
      lastName,
      position,
    };

    handleAddStaff(newStaff);
    setFirstName('');
    setLastName('');
    setPosition('');
  };

  return (
    <div className="staff-list">
      <h1>Staff List</h1>

      <form onSubmit={onAddStaff} className="mb-4">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="border border-gray-300 p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="border border-gray-300 p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="border border-gray-300 p-2 mr-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
          Add Staff
        </button>
      </form>

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
          {staffList.map((staffMember) => (
            <tr key={staffMember.id}>
              <td className="border border-gray-300 p-2">{staffMember.id}</td>
              <td className="border border-gray-300 p-2">{staffMember.firstName}</td>
              <td className="border border-gray-300 p-2">{staffMember.lastName}</td>
              <td className="border border-gray-300 p-2">{staffMember.position}</td>
              <td className="border border-gray-300 p-2">
                <button 
                  onClick={() => {
                    console.log('Deleting staff ID:', staffMember.id);
                    handleDeleteStaff(staffMember.id);
                  }} 
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
