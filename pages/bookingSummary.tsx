// src/components/BookingSummary.tsx
import React, { useState } from 'react';
import { Bookings, servicePrices } from './api/type'; // Adjust the import according to your project structure
import PaymentContainer from './PaymentContainer'; // Adjust the import path as necessary

interface BookingSummaryProps {
  booking?: Bookings; // Make booking optional to avoid errors
  onBack: () => void;
  onProceedToPayment: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack, onProceedToPayment }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false); // State to control payment visibility

  const isServiceKey = (key: string): key is keyof typeof servicePrices => {
    return key in servicePrices;
  };

  // Use optional chaining and provide a default value to avoid undefined errors
  const servicePrice = booking && isServiceKey(booking.service) ? servicePrices[booking.service] : 0;

  const handleProceedToPayment = () => {
    setIsPaymentVisible(true); // Show payment container
    onProceedToPayment();
  };

  // Return null or some fallback content if booking is not available
  if (!booking) {
    return <div className="text-red-500">Booking information is not available.</div>;
  }

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-300 max-w-lg mx-auto">
      {isPaymentVisible ? ( // Conditional rendering based on payment visibility
        <PaymentContainer
          qrImage="/gcash-qr.png" // Pass the image URL
          onBack={onBack} // Pass the onBack prop to PaymentContainer
        />
      ) : (
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Booking Summary</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Name:</strong> {booking.name || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Email:</strong> {booking.user_email || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Date:</strong> {booking.date || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Time:</strong> {booking.time || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service:</strong> {booking.service || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Staff:</strong> {booking.staff || 'N/A'}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service Price:</strong> ₱{servicePrice}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-yellow-50">
              <p className="text-yellow-600"><strong>Notice:</strong> A 50% down payment of ₱{servicePrice * 0.5} is required for the services booked.</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button onClick={onBack} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-md transition duration-200 mr-4">
              Back to Booking Form
            </button>
            <button onClick={handleProceedToPayment} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow-md transition duration-200">
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSummary;
