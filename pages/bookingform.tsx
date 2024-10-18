// src/components/BookingForm.tsx
import React, { useEffect, useState } from 'react';
import { Bookings, servicePrices } from './api/type'; // Adjust the import according to your project structure
import BookingSummary from './bookingSummary'; // Adjust the import according to your project structure

interface BookingFormProps {
  initialBookingDetails?: Bookings; // Optional prop for existing bookings
  onSubmit: (bookingDetails: Bookings) => void; // Prop for handling form submission
  onClose: () => void; // Prop for handling closing the form
}

const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, onSubmit, onClose }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    id: undefined, // Optional id
    name: '',
    date: '',
    time: '',
    service: '',
    staff: '',
    userEmail: '',
    userId: undefined,
  });

  const [showSummary, setShowSummary] = useState(false); // State to toggle between form and summary

  useEffect(() => {
    if (initialBookingDetails) {
      setFormDetails(initialBookingDetails);
    }
  }, [initialBookingDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const validateForm = () => {
    const { name, date, time, service, staff, userEmail } = formDetails;
    // Ensure all required fields are filled
    if (!name || !date || !time || !service || !staff || !userEmail) {
      alert('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    console.log('Submitting booking with details:', formDetails);
    onSubmit(formDetails); // Call the onSubmit prop with form details
    setShowSummary(true); // Show the summary after submission
  };

  const handleBackToForm = () => {
    setShowSummary(false); // Go back to the form
  };

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment with:', formDetails);
    // Logic for proceeding to payment
  };

  return (
    <div>
      {showSummary ? (
        <BookingSummary
          booking={formDetails}
          onBack={handleBackToForm}
          onProceedToPayment={handleProceedToPayment} // Pass the new function
        />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Booking Form</h2>
          <form onSubmit={handleSubmit}>
            {/* Form fields */}
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
              <label className="block text-gray-700">Time:</label>
              <input
                type="time"
                name="time"
                value={formDetails.time}
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
                {Object.keys(servicePrices).map((service) => (
                  <option key={service} value={service}>
                    {service} - ₱{servicePrices[service as keyof typeof servicePrices]} {/* Using type assertion */}
                  </option>
                ))}
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
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Confirm Booking
            </button>
            <button
              type="button"
              onClick={onClose} // Call the onClose function when this button is clicked
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ml-2"
            >
              Close
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
