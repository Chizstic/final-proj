import React, { useEffect, useState } from "react";
import router from "next/router";
import { Bookings } from "@/types";

interface BookingSummaryProps {
  booking: Bookings | null;
  onBack: () => void;
}

const BookingSummary: React.FC<BookingSummaryProps> = ({ booking, onBack }) => {
  const [isPaymentVisible, setIsPaymentVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isSummaryVisible, setIsSummaryVisible] = useState(true);

  useEffect(() => {
    if (booking) {
      setAmount(booking.servicePrice / 2);
    }
  }, [booking]);

  const handleProceedToPayment = () => {
    setIsPaymentVisible(true);
  };

  const handlePaymentLink = async () => {
    const requestBody = {
      data: {
        attributes: {
          amount: amount * 100,
          currency: "PHP",
          description: "Booking Payment (50%)",
        },
      },
    };

    try {
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        const redirectUrl = data.data?.attributes?.checkout_url;

        if (redirectUrl) {
          window.open(redirectUrl, "_blank");
          setPaymentMessage("Payment link created successfully! Please pay 50% of the total service price.");
          setIsSummaryVisible(false);
          setIsPaymentVisible(false);

          setTimeout(() => {
            router.push("/homepage");
          }, 2000);
        } else {
          setPaymentMessage("Payment link not found in the response.");
        }
      } else {
        const errorData = await response.json();
        setPaymentMessage("Failed to create payment link: " + (errorData.message || "Unknown error."));
      }
    } catch (error) {
      console.error("Error during payment request:", error);
      setPaymentMessage("Error: Unable to create payment link.");
    }
  };

  if (!booking) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-rose-100 bg-white p-6 shadow-sm sm:p-8">
      {isSummaryVisible && !isPaymentVisible ? (
        <>
          <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">Booking Summary</h2>
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Email:</strong> {booking.email}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Date:</strong> {booking.date}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Time:</strong> {booking.time}</p>
            </div>
            <div className="rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Service:</strong> {Array.isArray(booking.services) ? booking.services.join(", ") : booking.services}</p>
              <p className="text-gray-700 font-medium">
                <strong>Price:</strong> PHP {booking.servicePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-gray-700 font-medium">
                <strong>Amount to Pay (50%):</strong> PHP {amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="rounded-2xl border border-rose-100 p-4 shadow-sm">
              <p className="text-gray-700 font-medium"><strong>Staff:</strong> {Array.isArray(booking.staffname) ? booking.staffname.join(", ") : booking.staffname}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
            <button
              onClick={onBack}
              className="rounded-2xl border border-rose-200 px-4 py-3 font-semibold text-slate-700 transition hover:bg-rose-50"
            >
              Back to Booking Form
            </button>
            <button
              onClick={handleProceedToPayment}
              className="rounded-2xl bg-rose-600 px-4 py-3 font-semibold text-white transition hover:bg-rose-700"
            >
              Proceed to Payment
            </button>
          </div>
        </>
      ) : isPaymentVisible ? (
        <div>
          <h2 className="mb-4 text-center text-2xl font-bold text-slate-800">Payment</h2>
          <div className="mb-6">
            <label className="block text-gray-600 font-medium mb-2">Amount to Pay (50%):</label>
            <input
              type="number"
              value={amount}
              readOnly
              className="w-full rounded-2xl border border-rose-200 bg-rose-50 p-4 text-gray-800 shadow-sm focus:outline-none"
            />
            <p className="text-gray-700 mt-2">PHP {amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Note: You are required to pay 50% of the total service price upfront. The remaining balance will be payable at the time of service.
          </p>
          <button
            onClick={handlePaymentLink}
            className="w-full rounded-2xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
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
