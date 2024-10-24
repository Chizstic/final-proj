import React, { useState, useEffect } from 'react';
import { Staff } from './api/type';
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

  // Update a staff member in the list
  const handleUpdateStaff = (updatedStaff: Staff) => {
    setStaffList((prevStaffList) =>
      prevStaffList.map((staff) => (staff.staffid === updatedStaff.staffid ? updatedStaff : staff))
    );
    setStaffToEdit(undefined); // Clear the edit state after updating
  };

  // Edit a staff member
  const handleEditStaff = (staff: Staff) => {
    setStaffToEdit(staff);
  };

  // Fetch staff data when the component mounts
  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="staff-list">
      <h1 className="text-2xl font-bold mb-4">Staff List</h1>

      <AddingStaff
        handleAddStaff={handleAddStaff}
        staffToEdit={staffToEdit}
        handleUpdateStaff={handleUpdateStaff}
      />

      {loading ? (
        <p>Loading staff members...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
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
                <tr key={staffMember.staffid}>
                  <td className="border border-gray-300 p-2">{staffMember.staffid}</td>
                  <td className="border border-gray-300 p-2">{staffMember.fname}</td>
                  <td className="border border-gray-300 p-2">{staffMember.lname}</td>
                  <td className="border border-gray-300 p-2">{staffMember.position}</td>
                  <td className="border border-gray-300 p-2">
                    <button
                      onClick={() => handleEditStaff(staffMember)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (staffMember.staffid !== undefined) {
                          if (window.confirm(`Are you sure you want to delete staff ID: ${staffMember.staffid}?`)) {
                            handleDeleteStaff(staffMember.staffid);
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
      )}
    </div>
  );
};

export default StaffList;
