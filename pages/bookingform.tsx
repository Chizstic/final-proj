import React, { useEffect, useState } from 'react';
import BookingSummary from './bookingSummary'; // Ensure the import path is correct
import { Bookings } from './api/type';

interface BookingFormProps {
  initialBookingDetails?: Bookings; // Make this optional
  bookingID: number  ; // Correct the case here
  email: string,

}
interface ServiceOption {
  serviceid: string; // Assuming serviceid is a string
  servicename: string;
  price: number;
}

interface StaffOption {
  staffid: string; // Assuming you have staff IDs
  fname: string;
  lname: string;
  position: string;
}
const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, bookingID }) => {
  // Set default state for formDetails
  const [formDetails, setFormDetails] = useState<Bookings>({
    bookingID, 
    email: '',
    date: '',
    time: '',
    services: '', // Changed to string
    staffname: '', // Changed to string
    paymentMethod: '',
  });

  const [showSummary, setShowSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);

  // Fetching services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const services = await response.json();
        setServiceOptions(services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  // Fetching staff members
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff');
        if (!response.ok) {
          throw new Error('Failed to fetch staff');
        }
        const staff = await response.json();
        setStaffOptions(staff);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaff();
  }, []);

  // Effect to update formDetails when initialBookingDetails changes
  useEffect(() => {
    if (initialBookingDetails) {
      setFormDetails(initialBookingDetails);
    }
  }, [initialBookingDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formDetails.date) errors.push('Date is required.');
    if (!formDetails.time) errors.push('Time is required.');
    if (!formDetails.staffname) errors.push('Staff selection is required.');
    if (!formDetails.services) errors.push('Service selection is required.');
    if (!formDetails.paymentMethod) errors.push('Payment method is required.');
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setErrorMessages(errors);
      return;
    }
    setErrorMessages([]);

    const bookingData = {
      email: formDetails.email,
      date: formDetails.date,
      time: formDetails.time,
      staffname: formDetails.staffname,     // This should be the staff name as a string
      services: formDetails.services, // This should be the service name as a string
      paymentMethod: formDetails.paymentMethod,
      created_at: new Date().toISOString(),
    };
    

    console.log('Booking data before submission:', bookingData); // Debugging line

    // Submit the booking
    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Failed to submit booking:', errorDetails);
        setErrorMessages(['Failed to submit booking. ' + (errorDetails.message || '')]);
        return;
      }
      setShowSummary(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      setErrorMessages(['Failed to submit booking.']);
    }
  };

  const handleBackToForm = () => {
    setShowSummary(false);
  };

  const handleProceedToPayment = () => {
    // Implement your payment processing logic here
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
              <label className="block text-gray-700">Email:</label>
              <input
                type="email"
                name="email"
                value={formDetails.email}
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
                name="services"
                value={formDetails.services}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a service</option>
                {serviceOptions.map((service) => (
                  <option key={service.serviceid} value={service.servicename}>
                    {service.servicename} - ${service.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Staff:</label>
              <select
                name="staffname"
                value={formDetails.staffname}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a staff member</option>
                {staffOptions.map((staff) => (
                  <option key={staff.staffid} value={`${staff.fname} ${staff.lname}`}>
                    {staff.fname} {staff.lname} - {staff.position}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payment Method:</label>
              <select
                name="paymentMethod"
                value={formDetails.paymentMethod || ''}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a payment method</option>
                <option value="Credit Card">Gcash</option>
              </select>
            </div>
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
              Submit Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
