import React, { useState } from 'react';
import { Bookings, servicePrices } from './api/type'; // Adjust the import according to your project structure
import PaymentContainer from './PaymentContainer'; // Adjust the import path as necessary

interface BookingSummaryProps {
  booking: Bookings | null; // Allow null in case booking is not defined
  onBack: () => void;
  onProceedToPayment: () => void; // Add the new prop here
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack, onProceedToPayment }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false); // State to control payment visibility

  // Type guard to check if the service exists in servicePrices
  const isServiceKey = (key: string): key is keyof typeof servicePrices => key in servicePrices;

  if (!booking) {
    return <p>Loading...</p>; // Handle the case when booking is not yet available
  }

  const servicePrice = isServiceKey(booking.service) ? servicePrices[booking.service] : 0;

  // Function to show the payment container
  const handleProceedToPayment = () => {
    setIsPaymentVisible(true); // Show payment container
    onProceedToPayment(); // Call the parent onProceedToPayment function
  };

  // Function to go back to the previous state
  const handleBack = () => {
    setIsPaymentVisible(false); // Hide payment container
    onBack(); // Call the parent onBack function to return to the form
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow-lg border border-gray-300 max-w-lg mx-auto">
      {isPaymentVisible ? (
        // Display the payment container when isPaymentVisible is true
        <PaymentContainer qrImage="/gcash-qr.png" onBack={handleBack} />
      ) : (
        // Display the booking summary when isPaymentVisible is false
        <>
          <h2 className="text-2xl font-semibold mb-6 text-center text-blue-600">Booking Summary</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Name:</strong> {booking.name}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Email:</strong> {booking.userEmail}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Date:</strong> {booking.date}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Time:</strong> {booking.time}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service:</strong> {booking.service}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Staff:</strong> {booking.staff}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service Price:</strong> ₱{servicePrice}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-md bg-yellow-50">
              <p className="text-yellow-600"><strong>Notice:</strong> A 50% down payment of ₱{(servicePrice * 0.5).toFixed(2)} is required for the services booked.</p>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button onClick={handleBack} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow-md transition duration-200 mr-4">
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
