import React, { useState } from 'react';
import Image from 'next/image';

interface PaymentContainerProps {
  qrImage: string; // URL of the GCash QR code image
  onBack: () => void; // Add onBack prop for going back
}

const PaymentContainer: React.FC<PaymentContainerProps> = ({ qrImage, onBack }) => {
  const [receipt, setReceipt] = useState<File | null>(null);
  const [proofSubmitted, setProofSubmitted] = useState(false);

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setReceipt(event.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (receipt) {
      // Handle the proof of payment submission here
      console.log("Proof of payment submitted:", receipt); // Add logic to upload the receipt
      setProofSubmitted(true); // Set proofSubmitted to true to show success message
      setReceipt(null); // Reset the receipt after submission
    }
  };

  return (
    <div className="bg-white rounded-xl p-10 shadow-2xl border border-gray-200 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center text-indigo-600">
        Payment Instructions
      </h2>
      <Image
        src={qrImage}
        alt="GCash QR Code"
        layout="responsive" // Makes the image responsive
        width={500} // Set an appropriate width
        height={500} // Set an appropriate height
        className="rounded mb-6" // Additional styling
      />
      <p className="text-gray-600 mb-6">
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
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded shadow-md transition duration-200"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-lg shadow-md transition duration-300"
          >
            Submit Proof of Payment
          </button>
        </div>
      </form>
      {proofSubmitted && (
        <div className="mt-6 p-4 border border-green-200 bg-green-50 rounded-md">
          <p className="text-green-600">Proof of payment submitted successfully!</p>
        </div>
      )}
    </div>
  );
};

export default PaymentContainer;
