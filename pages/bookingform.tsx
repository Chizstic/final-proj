import React, { useEffect, useState } from 'react';
import BookingSummary from './bookingSummary';
import { useRouter } from 'next/router';
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
  bookingid: number;
  email: string; 
  servicePrice: number; 
}
interface CartItem {
  title: string;
  price: number;
}


const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, bookingid, email}) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    bookingid,
    email: email || initialBookingDetails?.email || '',
    date: initialBookingDetails?.date || '',
    time: initialBookingDetails?.time || '',
    services: initialBookingDetails?.services || [],
    servicePrice: 0,
    staffname: [],
    paymentmethod: '',
    created_at:'',
    status:'',
  });

  const [showSummary, setShowSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [, setBookedDates] = useState<string[]>([]);
  const router = useRouter();
  const { cartItems } = router.query;

  useEffect(() => {
    if (cartItems) {
      const parsedCartItems: CartItem[] = JSON.parse(cartItems as string); // Define parsedCartItems as an array of CartItem
      const selectedServices = parsedCartItems.map((item: CartItem) => item.title); // Specify item as CartItem
      const totalPrice = parsedCartItems.reduce((total: number, item: CartItem) => total + item.price, 0); // Specify item as CartItem

      console.log("Parsed cart items:", parsedCartItems);
      console.log("Selected services:", selectedServices);
      console.log("Total price:", totalPrice);

      setFormDetails((prevDetails) => ({
        ...prevDetails,
        services: selectedServices,
        servicePrice: totalPrice,
      }));
    }
  }, [cartItems]);
  
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

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/services');
        if (!response.ok) throw new Error('Failed to fetch services');
        const services = await response.json();
        const formattedServices = services.map((service: ServiceOption) => ({
          value: service.servicename,
          label: `${service.servicename} - ₱${service.price}`,
          price: Number(service.price), // This should ensure price is numeric
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

  // When setting the formDetails state for date
  useEffect(() => {
    if (initialBookingDetails) {
      const localDate = new Date(initialBookingDetails.date).toLocaleDateString('en-CA');
      setFormDetails({
        ...initialBookingDetails,
        date: localDate,
      });
    }
  }, [initialBookingDetails]);

  
  const handleServiceChange = (selectedOptions: MultiValue<ServiceOption>) => {
    // Calculate total price by summing the price of each selected option
    const totalPrice = selectedOptions.reduce((total, option) => total + Number(option.price), 0);
  
    console.log("Calculated totalPrice:", totalPrice); // Check if it's a valid number
  
    setFormDetails(prevDetails => ({
      ...prevDetails,
      services: selectedOptions.map(option => option.value), // Update services with selected values
      servicePrice: totalPrice, // Ensure servicePrice is numeric
    }));
  };
  
  
  const handleStaffChange = (selectedOptions: MultiValue<StaffOption>) => {
    const selectedStaff = selectedOptions.map(option => option.value).join(', '); // Join selected staff names into a single string
    setFormDetails(prevDetails => ({
      ...prevDetails,
      staffname: selectedStaff, // Set staffname to a single string
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
  
    const formattedDate = new Date(formDetails.date).toISOString();
  
    const bookingData = {
      ...formDetails,
      created_at: formattedDate,
    };

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
    <div className="max-w-4xl mx-auto p-8">
      {showSummary ? (
        <BookingSummary booking={formDetails} onBack={handleBackToForm} />
      ) : (
        <div className="bg-rose-50 rounded-2xl p-10 shadow-xl border border-gray-200">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-8 text-center">Book Your Appointment</h2>
  
          {errorMessages.length > 0 && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-8 shadow-md">
              <h3 className="font-semibold text-lg">Oops! Something went wrong:</h3>
              <ul className="list-disc pl-5 mt-3">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
  
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Email */}
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-800 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formDetails.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full p-4 border-2 border-rose-300 text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg"
              />
            </div>
  
            {/* Date and Time beside each other */}
            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Date */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Date of Appointment</label>
                <input
                  type="date"
                  name="date"
                  value={formDetails.date}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-rose-300 text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
  
              {/* Time */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={formDetails.time}
                  onChange={handleInputChange}
                  required
                  className="w-full p-4 border-2 border-rose-300 text-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg"
                />
              </div>
            </div>
  
            {/* Services and Staff beside each other */}
            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* Services */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2 ">Select Services</label>
                <Select
                  options={serviceOptions}
                  isMulti
                  onChange={handleServiceChange}
                  value={serviceOptions.filter((option) =>
                    formDetails.services.includes(option.value)
                  )}
                  className="mt-2 border-2 border-rose-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  classNamePrefix="select"
                  placeholder="Select one or more services..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      color: "gray",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "gray", // Change this to desired text color
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "black", // Text color for selected options
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isSelected ? "white" : "black", // Text color of options
                      backgroundColor: state.isSelected ? "#007BFF" : "white", // Highlight selected option
                    }),
                  }}
                />
              </div>
  
              {/* Staff */}
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Select Staff Members</label>
                <Select
                  options={staffOptions}
                  isMulti
                  onChange={handleStaffChange}
                  className="mt-2 border-2 border-rose-300 rounded-lg"
                  classNamePrefix="select"
                  placeholder="Select staff members..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      color: "gray", // Text color in the input area
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "black", // Text color for selected items
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "gray", // Placeholder text color
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isSelected ? "white" : "black", // Text color for dropdown options
                      backgroundColor: state.isSelected ? "#007BFF" : "white", // Highlight for selected options
                    }),
                  }}
                />

              </div>
            </div>
  
            {/* Payment Method */}
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-800 mb-2">Payment Method</label>
              <select
                name="paymentmethod"
                value={formDetails.paymentmethod || ""}
                onChange={handleInputChange}
                required
                className="w-full p-4 border-2 border-rose-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out hover:shadow-lg text-slate-700" // Tailwind class for blue text
              >
                <option value="">Select a payment method</option>
                <option value="GCash" className="text-black">GCash</option>
                <option value="Credit Card" className="text-black">Credit Card</option>
                <option value="Grab Pay" className="text-black">GrabPay</option>
                <option value="PayMaya" className="text-black">PayMaya</option>
              </select>

            </div>
  
            {/* Submit Button */}
            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold rounded-lg shadow-xl hover:from-rose-600 hover:to-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-300 transition duration-300 ease-in-out"
              >
                Submit Booking
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  ); 
};

export default BookingForm;
