import React, { useEffect, useState } from 'react';
import BookingSummary from './bookingSummary';
import { Bookings } from './api/type';




interface ServiceOption {
  serviceid: string;
  servicename: string;
  price: number;
}

interface StaffOption {
  staffid: string;
  fname: string;
  lname: string;
  position: string;
}

// BookingForm.tsx
interface BookingFormProps {
  initialBookingDetails?: Bookings;
  bookingID: number;
  email: string;
  servicePrice?: number; // Ensure this is optional
}

const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, bookingID }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    bookingID,
    email: initialBookingDetails?.email || '',
    date: initialBookingDetails?.date || '',
    time: initialBookingDetails?.time || '',
    services: initialBookingDetails?.services || '',
    servicePrice: 0, // Default value if not passed
    staffname: initialBookingDetails?.staffname || '',
    paymentMethod: '',
  });

  const [showSummary, setShowSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const services = await response.json();
        setServiceOptions(services);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff');
        if (!response.ok) throw new Error('Failed to fetch staff');
        const staff = await response.json();
        setStaffOptions(staff);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    if (initialBookingDetails) setFormDetails(initialBookingDetails);
  }, [initialBookingDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'services') {
      const selectedService = serviceOptions.find((service) => service.servicename === value);
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        services: value,
        servicePrice: selectedService ? selectedService.price : 0,
      }));
    } else {
      setFormDetails((prevDetails) => ({
        ...prevDetails,
        [name]: value,
      }));
    }
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
      ...formDetails,
      created_at: new Date().toISOString(),
    };

    console.log('Booking data before submission:', bookingData);

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

  const handleBackToForm = () => setShowSummary(false);

  return (
    <div>
      {showSummary ? (
        <BookingSummary
          booking={formDetails}
          onBack={handleBackToForm}
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
                    {service.servicename} - ₱{service.price}
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
                <option value="GCash">GCash</option>
                <option value="Credit Card">Credit Card</option>
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
