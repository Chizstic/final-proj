import React, { useState, useEffect } from 'react';
import { Bookings } from './api/type';
import PaymentContainer from './PaymentContainer'; // Adjust the import path as necessary

interface BookingSummaryProps {
  booking: Bookings | null; // Allow booking to be null
  onBack: () => void;
  onProceedToPayment: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack, onProceedToPayment }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [servicePrice, setServicePrice] = useState<number | null>(null);
  const [loading, ] = useState(true); // Add loading state
  const [error, ] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchServicePrice = async () => {
      if (booking?.services) {
        try {
          const response = await fetch(`/api/services?serviceID=${booking.services}`);
          if (!response.ok) {
            throw new Error('Service not found');
          }
          const data = await response.json();
          setServicePrice(data.price); // Ensure this price is a number
        } catch (error) {
          console.error('Error fetching service price:', error);
          setServicePrice(null); // Handle error gracefully
        }
      }
    };
  
    fetchServicePrice();
  }, [booking]);
  

  const handleProceedToPayment = () => {
    setIsPaymentVisible(true);
    onProceedToPayment();
  };

  if (!booking) {
    return <div>Loading...</div>; // Handle loading or undefined case
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-300 max-w-xs sm:max-w-md mx-auto">
      {isPaymentVisible ? (
        <PaymentContainer
          qrImage="/gcash-qr.png"
          onBack={onBack}
        />
      ) : (
        <>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-blue-600">Booking Summary</h2>
          <div className="space-y-2 sm:space-y-3">
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Email:</strong> {booking.email}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Date:</strong> {booking.date}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Time:</strong> {booking.time}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Service:</strong> {booking.services}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Staff:</strong> {booking.staffname}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              {loading ? (
                <p className="text-gray-700"><strong>Service Price:</strong> Loading...</p>
              ) : error ? (
                <p className="text-red-600"><strong>Error:</strong> {error}</p>
              ) : (
                <p className="text-gray-700">
                  <strong>Service Price:</strong> ₱{typeof servicePrice === 'number' ? servicePrice.toFixed(2) : 'N/A'}
                </p>
              )}
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md bg-yellow-50">
              <p className="text-yellow-600">
                <strong>Notice:</strong> A 50% down payment of ₱{typeof servicePrice === 'number' ? (servicePrice * 0.5).toFixed(2) : 'Loading...'} is required for the services booked.
              </p>
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
