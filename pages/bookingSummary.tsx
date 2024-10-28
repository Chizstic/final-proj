import React, { useState, useEffect } from 'react';
import { Bookings } from './api/type';

interface BookingSummaryProps {
  booking: Bookings | null; // Allow booking to be null
  onBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (booking) {
      setAmount(booking.servicePrice / 2); // Set amount to half of servicePrice
    }
  }, [booking]);

  const handleProceedToPayment = () => {
    setIsPaymentVisible(true);
  };

  const handlePaymentLink = async () => {
    const requestBody = {
      data: {
        attributes: {
          amount: amount * 100, // Convert to integer (in cents)
          currency: 'PHP',
          description: 'Booking Payment (50%)',
        },
      },
    };

    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const redirectUrl = data.data?.attributes?.checkout_url;

        if (redirectUrl) {
          window.open(redirectUrl, '_blank');
          setPaymentMessage('Payment link created successfully! Please pay 50% of the total service price.');
        } else {
          setPaymentMessage('Payment link not found in the response.');
        }
      } else {
        const errorData = await response.json();
        setPaymentMessage('Failed to create payment link: ' + JSON.stringify(errorData));
      }
    } catch  {
      setPaymentMessage('Error: Unable to create payment link.');
    }
  };

  if (!booking) {
    return <div>Loading...</div>; // Handle loading or undefined case
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg border border-gray-300 max-w-xs sm:max-w-md mx-auto">
      {isPaymentVisible ? (
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-center text-blue-600">Proceed to Payment</h2>
          <div className="mb-4">
            <label className="block text-gray-600 mb-1">Amount (PHP):</label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full p-2 border border-gray-300 rounded bg-gray-100 focus:outline-none"
            />
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Note: You are required to pay 50% of the total service price upfront. The remaining balance will be payable at the time of service.
          </p>
          <button
            onClick={handlePaymentLink}
            className="bg-green-500 hover:bg-green-600 text-white px-3 sm:px-4 py-1 rounded shadow-md transition duration-200 w-full"
          >
            Proceed to Payment
          </button>
          {paymentMessage && <p className="mt-4 text-center text-red-600">{paymentMessage}</p>}
        </div>
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
              <p className="text-gray-700"><strong>Price:</strong> ₱{booking.servicePrice}</p>
              <p className="text-gray-700"><strong>Amount to Pay (50%):</strong> ₱{amount}</p>
            </div>
            <div className="p-2 sm:p-3 border border-gray-200 rounded-md">
              <p className="text-gray-700"><strong>Staff:</strong> {booking.staffname}</p>
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
