import React, { useState, useEffect } from 'react';
import { Bookings } from './api/booking'; // Import the Bookings interface

// Define the type for booking details used within the form
interface BookingFormProps {
  onClose: () => void;
  onSubmit: (booking: Bookings) => void; // Use the Bookings type here
  initialBookingDetails?: Bookings; // Use Bookings for initial values
}

const BookingForm: React.FC<BookingFormProps> = ({ onClose, onSubmit, initialBookingDetails }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    name: '',
    date: '',
    service: '',
    id: undefined // Optional id
  });

  // Use effect to set initial values if provided
  useEffect(() => {
    if (initialBookingDetails) {
      setFormDetails(initialBookingDetails);
    }
  }, [initialBookingDetails]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDetails({ ...formDetails, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const booking: Bookings = {
      ...formDetails,
      id: Date.now(), // Assign a unique ID
    };
    onSubmit(booking); // Pass the Booking object to onSubmit
    onClose(); // Close the form after submission
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
