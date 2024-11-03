import React, { useEffect, useState } from 'react';
import BookingSummary from './bookingSummary';
import { Bookings } from './api/type';
import Select, { MultiValue } from 'react-select';

interface ServiceOption {
  servicename: string;
  value: string;
  label: string;
  price: number;
}

interface StaffOption {
  value: string;
  label: string;
  staffid: string;
  fname: string;
  lname: string;
  position: string;
}

// BookingForm Props
interface BookingFormProps {
  initialBookingDetails?: Bookings;
  bookingID: number;
  email: string; 
  servicePrice: number; 
}

const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, bookingID, email}) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    bookingID,
    email: email || initialBookingDetails?.email || '',
    date: initialBookingDetails?.date || '',
    time: initialBookingDetails?.time || '',
    services: initialBookingDetails?.services || [],
    servicePrice: 0,
    staffname: [],
    paymentmethod: '',
  });

  const [showSummary, setShowSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [bookedDates, setBookedDates] = useState<string[]>([]);

  // Fetch booked dates
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch('/api/bookings'); 
        if (!response.ok) throw new Error('Failed to fetch booked dates');
        const data = await response.json();
        const dates = data.map((booking: Bookings) => booking.date);
        setBookedDates(dates);
      } catch (error) {
        console.error('Error fetching booked dates:', error);
      }
    };

    fetchBookedDates();
  }, []);

  // Fetch services
  // Fetch services
useEffect(() => {
  const fetchServices = async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to fetch services');
      const services = await response.json();
      const formattedServices = services.map((service: ServiceOption) => ({
        value: service.servicename,
        label: `${service.servicename} - ₱${service.price}`,
        price: Number(service.price), // Ensure price is a number
      }));
      setServiceOptions(formattedServices);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  fetchServices();
}, []);

  // Fetch staff members
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await fetch('/api/staff');
        if (!response.ok) throw new Error('Failed to fetch staff');
        const staff = await response.json();
        const formattedStaff = staff.map((member: StaffOption) => ({
          value: `${member.fname} ${member.lname}`, 
          label: `${member.fname} ${member.lname} - ${member.position}`, 
          staffid: member.staffid,
          fname: member.fname,
          lname: member.lname,
          position: member.position,
        }));
        setStaffOptions(formattedStaff);
      } catch (error) {
        console.error('Error fetching staff:', error);
      }
    };

    fetchStaff();
  }, []);

  useEffect(() => {
    if (initialBookingDetails) setFormDetails(initialBookingDetails);
  }, [initialBookingDetails]);

  const handleServiceChange = (selectedOptions: MultiValue<ServiceOption>) => {
    const selectedServices = selectedOptions.map(option => option.value);
    const totalPrice = selectedOptions.reduce((total, option) => total + option.price, 0); // Sum the prices of selected options
    setFormDetails(prevDetails => ({
      ...prevDetails,
      services: selectedServices,
      servicePrice: totalPrice, // Set total price here
    }));
  };
  
  
  const handleStaffChange = (selectedOptions: MultiValue<StaffOption>) => {
    const selectedStaff = selectedOptions.map(option => option.value);
    setFormDetails(prevDetails => ({
      ...prevDetails,
      staffname: selectedStaff, 
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors: string[] = [];
    if (!formDetails.date) errors.push('Date is required.');
    if (!formDetails.time) errors.push('Time is required.');
    if (!formDetails.staffname.length) errors.push('Staff selection is required.'); 
    if (!formDetails.services.length) errors.push('Service selection is required.'); 
    if (!formDetails.paymentmethod) errors.push('Payment method is required.');
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
  
    // Log booking data to see the total price
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
    <div className="max-w-lg mx-auto p-4">
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
                onChange={handleInputChange} 
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
                onChange={handleInputChange} 
                required
                className="w-full p-2 border border-gray-300 rounded"
                min={new Date().toISOString().split("T")[0]} 
              />
              {bookedDates.map((date) => (
                <style key={date}>
                  {`
                    [type="date"]::-webkit-calendar-picker-indicator {
                      display: none;
                    }
                    [type="date"][value="${date}"] {
                      color: #c00;
                    }
                  `}
                </style>
              ))}
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Time:</label>
              <input
                type="time"
                name="time"
                value={formDetails.time}
                onChange={handleInputChange} 
                required
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Service:</label>
              <Select
                options={serviceOptions}
                isMulti
                onChange={handleServiceChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select services..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Staff:</label>
              <Select
                options={staffOptions}
                isMulti
                onChange={handleStaffChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select staff members..."
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Payment Method:</label>
              <select
                name="paymentmethod"
                value={formDetails.paymentmethod || ''}
                onChange={handleInputChange} 
                required
                className="w-full p-2 border border-gray-300 rounded"
              >
                <option value="">Select a payment method</option>
                <option value="GCash">GCash</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Grab Pay">GrabPay</option>
                <option value="PayMaya">PayMaya</option>
              </select>
            </div>

            <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
              Submit Booking
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default BookingForm;
