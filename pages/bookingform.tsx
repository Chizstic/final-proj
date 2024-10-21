import React, { useEffect, useState } from 'react';
import { Bookings, servicePrices } from './api/type'; // Adjust the import according to your project structure
import BookingSummary from './bookingSummary'; // Adjust the import according to your project structure

interface BookingFormProps {
  initialBookingDetails?: Bookings; // Optional prop for existing bookings
}

const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    id: undefined, // Optional id
    name: '',
    date: '',
    time: '',
    service: '',
    staff: '',
    user_email: '',
    payment_method: '',
  });
  const [showSummary, setShowSummary] = useState(false); // Toggle between form and summary
  const [errorMessages, setErrorMessages] = useState<string[]>([]); // Array to hold error messages

  // Staff members list
  const staffMembers = [
    { id: 1, name: 'Arman Buscato', role: 'Hairstylist' },
    { id: 2, name: 'Tata Marsada Quimpan', role: 'Hairstylist' },
    { id: 3, name: 'Rusty Cauilanza', role: 'Hairstylist' },
    { id: 4, name: 'Rowena Palma', role: 'Manicurist' },
    { id: 5, name: 'Aurora Rubia', role: 'Manicurist' },
    { id: 6, name: 'Cheryl Otazo', role: 'Manicurist' },
    { id: 7, name: 'Angelyn Omale', role: 'Manicurist' },
    { id: 8, name: 'Chesil Padual', role: 'Manicurist' },
  ];

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
    const { name, date, time, service, staff, user_email, payment_method } = formDetails;
    const errors: string[] = [];
    
    if (!name) errors.push('Name is required.');
    if (!date) errors.push('Date is required.');
    if (!time) errors.push('Time is required.');
    if (!service) errors.push('Service is required.');
    if (!staff) errors.push('Staff selection is required.');
    if (!user_email) errors.push('Email is required.');
    if (!payment_method) errors.push('Payment method is required.');
  
    // Optional: Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (user_email && !emailPattern.test(user_email)) {
      errors.push('Invalid email format.');
    }
  
    setErrorMessages(errors);
    return errors.length === 0;
  };
  
  const submitBooking = async (booking: Bookings) => {
    console.log('Booking object before submission:', booking);
  
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error details:', errorData);
        throw new Error(errorData.message || `Failed to submit booking. Status code: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('Booking submitted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error submitting booking:', error);
      throw error;
    }
  };
  
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!validateForm()) {
      console.error('Validation failed:', formDetails);
      return;
    }  
    console.log('Form details to be submitted:', formDetails); // Debugging statement
  
    try {
      await submitBooking(formDetails);
      setShowSummary(true); // Show the summary after submission
    } catch (error) {
      console.error('Failed to submit booking:', error);
    }
  };
  

  const handleBackToForm = () => {
    setShowSummary(false);
  };

  const handleProceedToPayment = () => {
    console.log('Proceeding to payment with:', formDetails);
  };

  const resetForm = () => {
    setFormDetails({
      id: undefined,
      name: '',
      date: '',
      time: '',
      service: '',
      staff: '',
      user_email: '',
      payment_method: '',
    });
    setErrorMessages([]);
  };

  return (
    <div>
      {showSummary ? (
        <BookingSummary
          booking={formDetails}
          onBack={handleBackToForm}
          onProceedToPayment={handleProceedToPayment}
        />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Booking Form</h2>
          {errorMessages.length > 0 && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <ul>
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
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
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="user_email"
                value={formDetails.user_email}
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
                    {service} - ₱{servicePrices[service as keyof typeof servicePrices]}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Staff:</label>
              <select
                name="staff"
                value={formDetails.staff}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a staff member</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name} - {staff.role}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payment Method:</label>
              <select
                name="payment_method"
                value={formDetails.payment_method}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a payment method</option>
                <option value="GCash">GCash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
                Confirm Booking
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
