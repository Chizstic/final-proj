import React, { useState, useEffect } from 'react';
import { Staff } from './api/type'; // Adjust the path as necessary

interface AddingStaffProps {
  handleAddStaff: (newStaff: Staff) => void;
  staffToEdit?: Staff; // Optional staff prop for editing
  handleUpdateStaff?: (updatedStaff: Staff) => void; // Optional handler for updating staff
}

const AddingStaff: React.FC<AddingStaffProps> = ({ handleAddStaff, staffToEdit, handleUpdateStaff }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (staffToEdit) {
      // If a staffToEdit is passed in, populate the form fields and set edit mode
      setFirstName(staffToEdit.fname);
      setLastName(staffToEdit.lname);
      setPosition(staffToEdit.position);
      setEditMode(true);
    }
  }, [staffToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const staffData: Staff = {
      staffid: staffToEdit?.staffid, // Use the existing ID if editing, otherwise it will be undefined
      fname: firstName,
      lname: lastName,
      position,
    };

    try {
      if (editMode && handleUpdateStaff) {
        // Update existing staff
        const response = await fetch(`/api/staff`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(staffData),
        });

        if (!response.ok) {
          throw new Error('Failed to update staff');
        }

        const updatedStaff: Staff = await response.json();
        handleUpdateStaff(updatedStaff); // Update the staff list in the parent component
      } else {
        // Add new staff
        const response = await fetch('/api/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(staffData),
        });

        if (!response.ok) {
          throw new Error('Failed to add staff');
        }

        const newStaff: Staff = await response.json();
        handleAddStaff(newStaff); // Add the new staff to the list in the parent component
      }

      // Clear the form fields and reset edit mode
      setFirstName('');
      setLastName('');
      setPosition('');
      setEditMode(false);
    } catch (error) {
      console.error('Error submitting staff:', error);
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
        {editMode ? 'Update Staff' : 'Add Staff'}
      </button>
    </form>
  );
};

export default AddingStaff;
