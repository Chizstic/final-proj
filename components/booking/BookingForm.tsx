import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Select, { MultiValue } from 'react-select';
import BookingSummary from '@/components/booking/BookingSummary';
import { useCart } from '@/context/CartContext';
import { Bookings } from '@/types';

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

const BookingForm: React.FC<BookingFormProps> = ({ initialBookingDetails, bookingid, email }) => {
  const [formDetails, setFormDetails] = useState<Bookings>({
    bookingid,
    email: email || initialBookingDetails?.email || '',
    date: initialBookingDetails?.date || '',
    time: initialBookingDetails?.time || '',
    services: initialBookingDetails?.services || [],
    servicePrice: 0,
    staffname: [],
    paymentmethod: '',
    created_at: '',
    status: '',
  });

  const { cart, removeFromCart } = useCart();
  const [showSummary, setShowSummary] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [, setBookedDates] = useState<string[]>([]);
  const router = useRouter();
  const { cartItems } = router.query;

  useEffect(() => {
    if (cartItems) {
      const parsedCartItems: CartItem[] = JSON.parse(cartItems as string);
      const selectedServices = parsedCartItems.map((item: CartItem) => item.title);
      const totalPrice = parsedCartItems.reduce((total: number, item: CartItem) => total + item.price, 0);

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

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await fetch('/api/booking');
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
          label: `${service.servicename} - PHP ${Number(service.price).toFixed(2)}`,
          price: Number(service.price),
        }));
        setServiceOptions(formattedServices);
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
    if (initialBookingDetails) {
      const localDate = new Date(initialBookingDetails.date).toLocaleDateString('en-CA');
      setFormDetails({
        ...initialBookingDetails,
        date: localDate,
      });
    }
  }, [initialBookingDetails]);

  const handleServiceChange = (selectedOptions: MultiValue<ServiceOption>) => {
    const totalPrice = selectedOptions.reduce((total, option) => total + Number(option.price), 0);

    console.log("Calculated totalPrice:", totalPrice);

    setFormDetails((prevDetails) => ({
      ...prevDetails,
      services: selectedOptions.map((option) => option.value),
      servicePrice: totalPrice,
    }));
  };

  const handleStaffChange = (selectedOptions: MultiValue<StaffOption>) => {
    const selectedStaff = selectedOptions.map((option) => option.value).join(', ');
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      staffname: selectedStaff,
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

    try {
      if (Array.isArray(cart)) {
        cart.forEach((item) => removeFromCart(item.id));
      }
    } catch (err) {
      console.warn("Failed to clear cart:", err);
    }
  };

  const handleBackToForm = () => setShowSummary(false);

  return (
    <div className="mx-auto max-w-5xl">
      {showSummary ? (
        <BookingSummary booking={formDetails} onBack={handleBackToForm} />
      ) : (
        <div className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
              Appointment Form
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              Book your salon visit
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Fill in your date, time, services, staff preference, and payment
              method. We kept the form simple so it is easy to complete.
            </p>
          </div>

          {errorMessages.length > 0 && (
            <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
              <h3 className="text-lg font-semibold">Please check these details:</h3>
              <ul className="list-disc pl-5 mt-3">
                {errorMessages.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-800 mb-2">Email Address</label>
              <input
                type="email"
                name="email"
                value={formDetails.email}
                onChange={handleInputChange}
                required
                placeholder="Enter your email address"
                className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Date of Appointment</label>
                <input
                  type="date"
                  name="date"
                  value={formDetails.date}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Preferred Time</label>
                <input
                  type="time"
                  name="time"
                  value={formDetails.time}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                />
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2 ">Select Services</label>
                <Select
                  options={serviceOptions}
                  isMulti
                  onChange={handleServiceChange}
                  value={serviceOptions.filter((option) =>
                    formDetails.services.includes(option.value)
                  )}
                  className="mt-2"
                  classNamePrefix="select"
                  placeholder="Select one or more services..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "58px",
                      borderRadius: "1rem",
                      borderColor: "#fecdd3",
                      boxShadow: "none",
                      paddingLeft: "6px",
                    }),
                    singleValue: (base) => ({
                      ...base,
                      color: "#334155",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#0f172a",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#ffe4e6",
                      borderRadius: "9999px",
                      padding: "2px 6px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#64748b",
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isSelected ? "white" : "#0f172a",
                      backgroundColor: state.isSelected ? "#e11d48" : "white",
                    }),
                  }}
                />
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-800 mb-2">Select Staff Members</label>
                <Select
                  options={staffOptions}
                  isMulti
                  onChange={handleStaffChange}
                  className="mt-2"
                  classNamePrefix="select"
                  placeholder="Select staff members..."
                  styles={{
                    control: (base) => ({
                      ...base,
                      minHeight: "58px",
                      borderRadius: "1rem",
                      borderColor: "#fecdd3",
                      boxShadow: "none",
                      paddingLeft: "6px",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#0f172a",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#ffe4e6",
                      borderRadius: "9999px",
                      padding: "2px 6px",
                    }),
                    placeholder: (base) => ({
                      ...base,
                      color: "#64748b",
                    }),
                    option: (base, state) => ({
                      ...base,
                      color: state.isSelected ? "white" : "#0f172a",
                      backgroundColor: state.isSelected ? "#e11d48" : "white",
                    }),
                  }}
                />
              </div>
            </div>

            <div className="col-span-1">
              <label className="block text-lg font-medium text-gray-800 mb-2">Payment Method</label>
              <select
                name="paymentmethod"
                value={formDetails.paymentmethod || ""}
                onChange={handleInputChange}
                required
                className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
              >
                <option value="">Select a payment method</option>
                <option value="GCash" className="text-black">GCash</option>
                <option value="Credit Card" className="text-black">Credit Card</option>
                <option value="Grab Pay" className="text-black">GrabPay</option>
                <option value="PayMaya" className="text-black">PayMaya</option>
              </select>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <button
                type="submit"
                className="w-full rounded-2xl bg-rose-600 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200"
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
