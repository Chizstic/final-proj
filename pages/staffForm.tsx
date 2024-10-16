import React, { useState } from 'react';
import { Staff } from './api/type'; // Adjust the path as necessary

interface AddingStaffProps {
  handleAddStaff: (newStaff: Staff) => void;
}

const AddingStaff: React.FC<AddingStaffProps> = ({ handleAddStaff }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, position }), // Send with the correct keys
      });

      if (!response.ok) {
        throw new Error('Failed to add staff'); // Throw error for failed response
      }

      const newStaff: Staff = await response.json(); // Get the new staff member
      handleAddStaff(newStaff); // Update the staff list

      // Clear the form fields
      setFirstName('');
      setLastName('');
      setPosition('');
    } catch (error) {
      console.error('Error adding staff:', error); // Log the error for further investigation
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="border p-2 rounded mr-2"
      />
      <input
        type="text"
        placeholder="Position"
        value={position}
        onChange={(e) => setPosition(e.target.value)}
        required
        className="border p-2 rounded mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600">
        Add Staff
      </button>
    </form>
  );
};

export default AddingStaff;
