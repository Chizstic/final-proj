import React, { useEffect, useState } from 'react';
import router, { } from 'next/router';
import { Bookings } from './api/type';

interface BookingSummaryProps {
  booking: Bookings | null; // Allow booking to be null
  onBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState('');
  const [isSummaryVisible, setIsSummaryVisible] = useState(true); // Manage visibility of the summary

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
          // Open the payment link in a new tab
          window.open(redirectUrl, '_blank');
  
          // Set messages and update UI states
          setPaymentMessage('Payment link created successfully! Please pay 50% of the total service price.');
          setIsSummaryVisible(false); // Close the booking summary
          setIsPaymentVisible(false); // Close the payment section
  
          // Redirect to homepage after a brief delay to ensure the user has opened the payment link
          setTimeout(() => {
            router.push('/homepage');
          }, 2000); // Adjust the delay time if needed
        } else {
          setPaymentMessage('Payment link not found in the response.');
        }
      } else {
        const errorData = await response.json();
        setPaymentMessage('Failed to create payment link: ' + (errorData.message || 'Unknown error.'));
      }
    } catch (error) {
      console.error('Error during payment request:', error);
      setPaymentMessage('Error: Unable to create payment link.');
    }
  };
  
  // Placeholder UI for undefined booking
  if (!booking) {
    return <div>Loading...</div>;
  };
  return (
    <div className="bg-rose-50  rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 max-w-xs sm:max-w-md mx-auto">
      {isSummaryVisible && !isPaymentVisible ? (
        <>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-slate-700">Booking Summary</h2>
          <div className="space-y-4">
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Email:</strong> {booking.email}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Date:</strong> {booking.date}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Time:</strong> {booking.time}</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Service:</strong> {Array.isArray(booking.services) ? booking.services.join(', ') : booking.services}</p>
              <p className="text-gray-700 font-medium">
                <strong>Price:</strong> ₱{booking.servicePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-gray-700 font-medium">
                <strong>Amount to Pay (50%):</strong> ₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Staff:</strong> {Array.isArray(booking.staffname) ? booking.staffname.join(', ') : booking.staffname}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
            <button
              onClick={onBack}
              className="border-2 border-rose-500  text-slate-800  px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Back to Booking Form
            </button>
            <button
              onClick={handleProceedToPayment}
              className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Proceed to Payment
            </button>
          </div>
        </>
      ) : isPaymentVisible ? (
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-center text-slate-600">Payment</h2>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Amount to Pay (50%):</label>
            <input
              type="number"
              value={amount} // Set the raw amount here
              readOnly
              className="w-full p-4 border-2 border-gray-300 rounded-lg bg-gray-100 focus:outline-none shadow-sm text-gray-800"
            />
            <p className="text-gray-700 mt-2">₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Note: You are required to pay 50% of the total service price upfront. The remaining balance will be payable at the time of service.
          </p>
          <button
            onClick={handlePaymentLink}
            className="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-lg shadow-md hover:from-green-600 hover:to-green-700 transition duration-300 ease-in-out"
          >
            Proceed to Payment
          </button>
          {paymentMessage && <p className="mt-6 text-center text-red-600">{paymentMessage}</p>}
        </div>
      ) : null}
    </div>
  );
};

export default BookingSummary;
