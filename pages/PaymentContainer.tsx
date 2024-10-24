import React, { useState } from 'react';
import Image from 'next/image';

interface PaymentContainerProps {
  qrImage: string; // URL of the GCash QR code image
  onBack: () => void; // Add onBack prop for going back
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({ qrImage, onBack }) => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [proofSubmitted, setProofSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setReceipt(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!receipt) {
      setError('Please upload a receipt.');
      return;
    }

    try {
      console.log("Proof of payment submitted:", receipt);

      const response = await fetch('/api/booking', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          payment_method: 'paid',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
        return;
      }

      setProofSubmitted(true);
      setReceipt(null);
      setError(null);
    } catch (err) {
      console.error('Error updating payment method:', err);
      setError('Failed to update payment status.');
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-2xl border border-gray-200 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center text-indigo-600">
        Payment Instructions
      </h2>
      <Image
        src={qrImage}
        alt="GCash QR Code"
        layout="responsive"
        width={400}
        height={400}
        className="rounded mb-3"
      />
      <p className="text-gray-600 mb-3">
        Please scan the QR code above to complete your payment. After payment,
        please upload your proof of payment below.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          required
        />
        <div className="flex justify-between mt-3">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded shadow-md transition duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-lg shadow-md transition duration-300"
          >
            Submit Proof of Payment
          </button>
        </div>
      </form>
      {proofSubmitted && (
        <div className="mt-3 p-2 border border-green-200 bg-green-50 rounded-md">
          <p className="text-green-600">Proof of payment submitted successfully!</p>
        </div>
      )}
      {error && (
        <div className="mt-3 p-2 border border-red-200 bg-red-50 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentContainer;
