import React, { useState, useEffect } from 'react';
import { Staff } from './api/type';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons from react-icons
import AddingStaff from './staffForm'; // Ensure this import path is correct

interface StaffListProps {
  staffList: Staff[]; // Prop for the staff list
  handleAddStaff: (newStaff: Staff) => void; // Prop for adding staff
  handleDeleteStaff: (staffId: number) => void; // Prop for deleting staff
  initialStaffList?: Staff[]; // Optional prop to initialize the staff list
}

const StaffList: React.FC<StaffListProps> = ({ initialStaffList = [] }) => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<Staff | undefined>(undefined); // State for staff to edit

  // Fetch staff data from the backend
  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous error
      const response = await fetch('/api/staff');
      if (!response.ok) {
        throw new Error('Failed to fetch staff members');
      }
      const data: Staff[] = await response.json();
      setStaffList(data);
    } catch (error) {
      setError('Error fetching staff members. Please try again later.');
      console.error('Error fetching staff:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a staff member
  const handleDeleteStaff = async (staffId: number) => {
    try {
      const response = await fetch(`/api/staff?id=${staffId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete staff member: ${errorMessage}`);
      }
      // Update the state to reflect the deletion
      setStaffList(staffList.filter((staff) => staff.staffid !== staffId));
    } catch (error) {
      setError('Error deleting staff member. Please try again.');
      console.error('Error deleting staff:', error);
    }
  };

  // Add a new staff member to the list
  const handleAddStaff = (newStaff: Staff) => {
    setStaffList([...staffList, newStaff]);
  };

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setStaffToEdit(undefined); // Reset the staff being edited
  };

  // Handle the update of a staff member
  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      // Send the updated staff data to the backend
      const response = await fetch('/api/staff', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fname: updatedStaff.fname,
          lname: updatedStaff.lname,
          position: updatedStaff.position,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update staff member');
      }

      // Update the local state with the new staff data
      setStaffList((prevStaffList) =>
        prevStaffList.map((staff) => (staff.staffid === updatedStaff.staffid ? updatedStaff : staff))
      );
      setStaffToEdit(undefined); // Clear the edit mode
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  // Edit a staff member
  const handleEditStaff = (staff: Staff) => {
    setStaffToEdit(staff); // Set the staff member to edit
  };

  // Fetch staff data when the component mounts
  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="staff-list container mx-auto px-6 py-10">
      <AddingStaff
        handleAddStaff={handleAddStaff}
        staffToEdit={staffToEdit} // Pass the staff to edit here
        handleUpdateStaff={handleUpdateStaff}
        handleCancelEdit={handleCancelEdit} // Pass cancel handler here
      />

      {loading ? (
        <p className="text-center text-gray-500">Loading staff members...</p>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : (
        <table className="w-full table-auto border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="p-4 text-left text-gray-700 font-medium bg-gray-100">First Name</th>
              <th className="p-4 text-left text-gray-700 font-medium bg-gray-100">Last Name</th>
              <th className="p-4 text-left text-gray-700 font-medium bg-gray-100">Position</th>
              <th className="p-4 text-left text-gray-700 font-medium bg-gray-100">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.length > 0 ? (
              staffList.map((staffMember, index) => (
                <tr
                  key={staffMember.staffid}
                  className={`border-b  border-gray-200 hover:bg-gray-100 transition duration-300 ${index % 2 === 0 ? 'bg-white' : 'bg-white'}`}
                >
                  <td className="p-4 text-gray-600">{staffMember.fname}</td>
                  <td className="p-4 text-gray-600">{staffMember.lname}</td>
                  <td className="p-4 text-gray-600">{staffMember.position}</td>
                  <td className="p-4">
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleEditStaff(staffMember)} // Edit the staff member
                        className="text-gray-500 hover:text-teal-600 focus:outline-none transition duration-200"
                      >
                        <FaEdit size={20} />
                      </button>
                      <button
                        onClick={() => {
                          if (staffMember.staffid !== undefined) {
                            if (window.confirm(`Are you sure you want to delete staff ID: ${staffMember.staffid}?`)) {
                              handleDeleteStaff(staffMember.staffid); // Delete the staff member
                            }
                          } else {
                            console.error('Staff ID is undefined');
                          }
                        }}
                        className="text-gray-500 hover:text-red-500 focus:outline-none transition duration-200"
                      >
                        <FaTrashAlt size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 p-4">
                  No staff members found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default StaffList;
