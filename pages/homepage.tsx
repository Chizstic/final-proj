// ./pages/homepage.tsx
import React, { useState } from 'react';
import Footer from './footer';
import BookingForm from './bookingform';
import Image from 'next/image';
import Link from 'next/link';

function Homepage() {
  const [showBookingForm, setShowBookingForm] = useState(false);

 

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false); // or however you're managing the state
  };
  

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
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() =>('Hair Care')}
            >
              <Image src="/Hair_Care.png" alt="Care" width={90} height={100} className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Hair Care</h1>
            </button>
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => ('Spa')}
            >
              <Image src="/Spa.png" alt="Spa" width={90} height={100} className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Spa</h1>
            </button>
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => ('Hair & Make-up')}
            >
              <Image src="/HnM.jpg" alt="Hair & Make-up" width={90} height={100} className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Hair & Make-up</h1>
            </button>
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => ('Nail Care')}
            >
              <Image src="/Nail Care.png" alt="Nail Care" width={90} height={100} className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Nail Care</h1>
            </button>
          </div>
        </div>
      </main>


      <div className="container mx-auto mt-24 px-4 flex flex-col md:flex-row">
        {/* Description */}
        <div className="text-gray-800 text-lg md:w-1/2 first-line:uppercase first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left mt-9 select-none">
          <p><span className="font-2xl">Welcome to Guys & Gals Salon, where style meets personality!</span></p>
          <p>Step into our sanctuary of beauty and refinement, where expert</p>
          <p>stylists and personalized service await. Whether you&apos;re seeking</p>
          <p>a bold new look or a subtle enhancement, our salon is dedicated</p>
          <p>to elevating your confidence and enhancing your natural charm.</p>
          <p>Experience the epitome of glamour and relaxation at Guys & Gals Salon</p>
          <p>where every visit promises a transformative journey to your most radiant self.</p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 md:ml-auto mt-6 md:mt-0 -skew-y-1"> 
          <Image src="/desc_img.jpg" alt="Description" width={400} height={250} className="h-full rounded-xl" />
        </div>
      </div>




      <Footer />

      {showBookingForm && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="relative bg-white rounded-lg p-6 shadow-lg">
      {/* Close Button */}
      <button
        onClick={handleCloseBookingForm} // Call the function to close the overlay
        className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
        aria-label="Close"
      >
        &times; {/* You can also use an icon here */}
      </button>

      {/* Booking Form */}
      <BookingForm  />
    </div>
  </div>
)}

    </div>
  );
}

export default Homepage;
