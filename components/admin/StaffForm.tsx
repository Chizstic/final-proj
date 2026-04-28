import React, { useEffect, useState } from "react";
import { Staff } from "@/types";

interface StaffFormProps {
  handleAddStaff: (newStaff: Staff) => void;
  staffToEdit?: Staff;
  handleUpdateStaff?: (updatedStaff: Staff) => void;
  handleCancelEdit?: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({
  handleAddStaff,
  staffToEdit,
  handleUpdateStaff,
  handleCancelEdit,
}) => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    if (staffToEdit) {
      setFirstName(staffToEdit.fname);
      setLastName(staffToEdit.lname);
      setPosition(staffToEdit.position);
      setEditMode(true);
    }
  }, [staffToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const staffData: Staff = {
      staffid: staffToEdit?.staffid,
      fname: firstName,
      lname: lastName,
      position,
    };

    try {
      if (editMode && handleUpdateStaff) {
        const response = await fetch(`/api/staff`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        });

        if (!response.ok) {
          throw new Error("Failed to update staff");
        }

        const updatedStaff: Staff = await response.json();
        handleUpdateStaff(updatedStaff);
      } else {
        const response = await fetch("/api/staff", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(staffData),
        });

        if (!response.ok) {
          throw new Error("Failed to add staff");
        }

        const newStaff: Staff = await response.json();
        handleAddStaff(newStaff);
      }

      setFirstName("");
      setLastName("");
      setPosition("");
      setEditMode(false);
    } catch (error) {
      console.error("Error submitting staff:", error);
    }
  };

  const handleCancel = () => {
    setFirstName("");
    setLastName("");
    setPosition("");
    setEditMode(false);
    if (handleCancelEdit) {
      handleCancelEdit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">
          {editMode ? "Edit staff member" : "Add a staff member"}
        </h2>
        <p className="mt-2 text-slate-600">
          Keep staff details clear so appointment assignments are easier to manage.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className="rounded-2xl border border-rose-200 px-4 py-3 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className="rounded-2xl border border-rose-200 px-4 py-3 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
        />
        <input
          type="text"
          placeholder="Position"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          required
          className="rounded-2xl border border-rose-200 px-4 py-3 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-full bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
        >
          {editMode ? "Update Staff" : "Add Staff"}
        </button>
        {editMode && (
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-full border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default StaffForm;
