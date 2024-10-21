import React, { useState } from 'react';
import { Bookings, servicePrices } from './api/type'; // Adjust the import according to your project structure
import PaymentContainer from './PaymentContainer'; // Adjust the import path as necessary

interface BookingSummaryProps {
  booking?: Bookings; // Make the booking optional to handle cases where it might not be passed
  onBack: () => void;
  onProceedToPayment: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack, onProceedToPayment }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);

  // Check if the service is a valid key in servicePrices
  const isServiceKey = (key: string): key is keyof typeof servicePrices => {
    return key in servicePrices;
  };

  // Get the service price if the service is defined, otherwise set it to 0
  const servicePrice = booking && isServiceKey(booking.service) ? servicePrices[booking.service] : 0;

  const handleProceedToPayment = () => {
    setIsPaymentVisible(true);
    onProceedToPayment();
  };

  // Render a fallback UI if booking data is not available
  if (!booking) {
    return <div>Loading booking details...</div>;
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-300 max-w-xs sm:max-w-md mx-auto">
      {isPaymentVisible ? (
        <PaymentContainer
          bookingId={1}
          qrImage="/gcash-qr.png"
          onBack={onBack}
        />
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-blue-600">Booking Summary</h2>
          <div className="space-y-2 sm:space-y-3">
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Name:</strong> {booking.name}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Email:</strong> {booking.user_email || 'N/A'}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Date:</strong> {booking.date}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Time:</strong> {booking.time || 'N/A'}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service:</strong> {booking.service || 'N/A'}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Staff:</strong> {booking.staff || 'N/A'}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service Price:</strong> ₱{servicePrice}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md bg-yellow-50">
              <p className="text-yellow-600"><strong>Notice:</strong> A 50% down payment of ₱{servicePrice * 0.5} is required for the services booked.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between mt-4">
            <button onClick={onBack} className="bg-blue-500 hover:bg-blue-600 text-white px-3 sm:px-4 py-1 rounded shadow-md transition duration-200 mb-2 sm:mb-0 sm:mr-2">
              Back to Booking Form
            </button>
            <button onClick={handleProceedToPayment} className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1 rounded shadow-md transition duration-200">
              Proceed to Payment
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BookingSummary;
