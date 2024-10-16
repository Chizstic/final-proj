import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type'; // Adjust the path according to your project structure

interface BookingFormProps {
  onClose: () => void;
  onSubmit: (booking: Bookings) => void;
  initialBookingDetails?: Bookings; // Optional prop for existing bookings
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, onSubmit, initialBookingDetails }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    id: undefined, // Optional id
    name: '',
    date: '',
    time:'',
    service: '',
    staff: '', // Add staff
    userEmail: '', // Add userEmail
  });

  useEffect(() => {
    if (initialBookingDetails) {
      setFormDetails(initialBookingDetails);
    }
  }, [initialBookingDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formDetails);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Booking Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formDetails.name}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Date:</label>
          <input
            type="date"
            name="date"
            value={formDetails.date}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Service:</label>
          <select
            name="service"
            value={formDetails.service}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select a service</option>
            <option value="Hair Care">Hair Care</option>
            <option value="Spa">Spa</option>
            <option value="Hair & Make-up">Hair & Make-up</option>
            <option value="Nail Care">Nail Care</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Staff:</label>
          <input
            type="text"
            name="staff"
            value={formDetails.staff}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Email:</label>
          <input
            type="email"
            name="userEmail"
            value={formDetails.userEmail}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-end">
          <button type="button" onClick={onClose} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookingForm;
