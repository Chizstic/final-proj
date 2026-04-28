import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import StaffForm from "@/components/admin/StaffForm";
import { Staff } from "@/types";

interface StaffListProps {
  staffList: Staff[];
  handleAddStaff: (newStaff: Staff) => void;
  handleDeleteStaff: (staffId: number) => void;
  initialStaffList?: Staff[];
}

const StaffList: React.FC<StaffListProps> = ({ initialStaffList = [] }) => {
  const [staffList, setStaffList] = useState<Staff[]>(initialStaffList);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<Staff | undefined>(undefined);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/staff");
      if (!response.ok) {
        throw new Error("Failed to fetch staff members");
      }
      const data: Staff[] = await response.json();
      setStaffList(data);
    } catch (error) {
      setError("Error fetching staff members. Please try again later.");
      console.error("Error fetching staff:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = async (staffId: number) => {
    try {
      const response = await fetch(`/api/staff?id=${staffId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete staff member: ${errorMessage}`);
      }
      setStaffList(staffList.filter((staff) => staff.staffid !== staffId));
    } catch (error) {
      setError("Error deleting staff member. Please try again.");
      console.error("Error deleting staff:", error);
    }
  };

  const handleAddStaff = (newStaff: Staff) => {
    setStaffList([...staffList, newStaff]);
  };

  const handleCancelEdit = () => {
    setStaffToEdit(undefined);
  };

  const handleUpdateStaff = async (updatedStaff: Staff) => {
    try {
      const response = await fetch("/api/staff", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname: updatedStaff.fname,
          lname: updatedStaff.lname,
          position: updatedStaff.position,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update staff member");
      }

      setStaffList((prevStaffList) =>
        prevStaffList.map((staff) => (staff.staffid === updatedStaff.staffid ? updatedStaff : staff))
      );
      setStaffToEdit(undefined);
    } catch (error) {
      console.error("Error updating staff:", error);
    }
  };

  const handleEditStaff = (staff: Staff) => {
    setStaffToEdit(staff);
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  return (
    <div className="staff-list">
      <StaffForm
        handleAddStaff={handleAddStaff}
        staffToEdit={staffToEdit}
        handleUpdateStaff={handleUpdateStaff}
        handleCancelEdit={handleCancelEdit}
      />

      {loading ? (
        <p className="py-8 text-center text-gray-500">Loading staff members...</p>
      ) : error ? (
        <p className="py-8 text-center text-red-600">{error}</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] table-auto">
              <thead className="bg-rose-50">
                <tr>
                  <th className="p-4 text-left font-semibold text-slate-700">First Name</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Last Name</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Position</th>
                  <th className="p-4 text-left font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staffMember) => (
                    <tr
                      key={staffMember.staffid}
                      className="border-t border-rose-100 text-slate-700 transition hover:bg-rose-50/70"
                    >
                      <td className="p-4">{staffMember.fname}</td>
                      <td className="p-4">{staffMember.lname}</td>
                      <td className="p-4">{staffMember.position}</td>
                      <td className="p-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEditStaff(staffMember)}
                            className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
                          >
                            <FaEdit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (staffMember.staffid !== undefined) {
                                if (window.confirm(`Are you sure you want to delete staff ID: ${staffMember.staffid}?`)) {
                                  handleDeleteStaff(staffMember.staffid);
                                }
                              } else {
                                console.error("Staff ID is undefined");
                              }
                            }}
                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          >
                            <FaTrashAlt size={16} />
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-gray-500">
                      No staff members found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;
