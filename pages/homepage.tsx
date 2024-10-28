import React, { useState, useEffect } from 'react';
import Footer from './footer';
import BookingForm from './bookingform';
import Image from 'next/image';
import Link from 'next/link';
import { Bookings } from './api/type'; // Adjust the import based on your project structure

function Homepage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [booking, setBooking] = useState<Bookings | null>(null); // State to hold booking details

  useEffect(() => {
    // Retrieve booking details from localStorage or other source
    const bookingData = localStorage.getItem('bookingDetails'); // Example: retrieving a string from localStorage
    if (bookingData) {
      setBooking(JSON.parse(bookingData)); // Assuming bookingDetails is a JSON string
    }
  }, []);

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  // Retrieve email from localStorage
  const currentUserEmail = typeof window !== 'undefined'
    ? localStorage.getItem('email') || ''
    : '';

  const bookingID = typeof window !== 'undefined' && localStorage.getItem('bookingID')
    ? Number(localStorage.getItem('bookingID'))
    : 0; // Default to 0 or another valid number

  return (
    <div>
      <div className="bg-[#cd668855] p-2 scroll-smooth">
        <div className="text-sm font-semibold text-center text-gray-600">Call Us: +63 998 9099 129</div>
        <div className="text-sm font-semibold text-center text-gray-600">Opening Hours: Mon-Fri 9:00 AM - 6:00 PM</div>
      </div>

      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: 'rgba(171, 198, 191, 0.30)' }}>
        <nav className="flex items-center justify-between flex-wrap p-6 h-24">
          <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
            <Image src="/logo.png" alt="example" width={50} height={50} />
            <div className="flex flex-row items-center">
              <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>Guys & Gals</span>
              <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>Salon</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/user">
              <button className="text-slate-700 text-xl py-2 px-4 rounded-md font-semibold hover:text-teal-600 transition duration-300">
                User
              </button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Cover Photo Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <Image src="/coverphoto1.jpg" alt="Cover Photo" layout="responsive" width={300} height={200} className="w-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-white text-3xl font-bold mb-4 font-serif">&quot;ELEVATE YOUR LOOK,&quot;</h2>
            <h2 className="text-white text-3xl font-bold mb-4 font-serif">&quot;ELEVATE YOUR CONFIDENCE,&quot;</h2>
            <h2 className="text-white text-xl mb-4 font-thin">Get ready to be served what you deserve</h2>
            <button onClick={handleBookNowClick} className="bg-rose-600 hover:bg-rose-500 bg-opacity-85 text-white font-semibold py-2 px-4 rounded">Book Now</button>
          </div>
        </div>

        <div className="relative -mt-16 px-4 sm:px-10 pb-20">
          <div className="flex justify-center space-x-4 sm:space-x-6 flex-wrap">
            {/* Service buttons */}
            {/* Your other content */}
          </div>
        </div>
      </main>

      <Footer />

      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={handleCloseBookingForm}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Booking Form */}
            <BookingForm
              bookingID={bookingID}
              email={currentUserEmail}
              servicePrice={booking?.servicePrice} // Ensure this is available
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
