import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from './footer';
import BookingForm from './bookingform';

// Define types for booking details and service types
type BookingDetails = {
  name: string;
  date: string;
  service: string;
  // Add more fields as needed
};

type ServiceType = 'Hair Care' | 'Spa' | 'Hair & Make-up' | 'Nail Care';

function Homepage() {
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleContainerClick = (service: ServiceType) => {
    // Navigate to the Services page and pass the service type as a query parameter
    router.push({
      pathname: '/services',
      query: { serviceType: service },
    });
  };

  const handleBookNowClick = () => {
    // Show the booking form overlay
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleBookingSubmit = (bookingDetails: BookingDetails) => {
    // Handle booking details here
    console.log("Booking details:", bookingDetails);
    // You might want to add more logic here, such as sending data to a server
  };

  return (
    <div>
      {/* Top Info Bar */}
      <div className="bg-[#cd668855] p-2">
        <div className="text-sm font-semibold text-center text-gray-600">Call Us: +63 998 9099 129</div>
        <div className="text-sm font-semibold text-center text-gray-600">Opening Hours: Mon-Fri 9:00 AM - 6:00 PM</div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: 'rgba(171, 198, 191, 0.30)' }}>
        <nav className="flex items-center justify-between flex-wrap p-6 h-24">
          <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
            <img src="/logo.png" alt="Logo" className="h-16 w-16 mr-4 rounded-full" />
            <div className="flex flex-row items-center">
              <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>Guys & Gals</span>
              <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>Salon</span>
            </div>
          </div>

          <div className="flex items-center ">
            <button className=" text-slate-700 text-xl py-2 px-6 rounded-md font-semibold hover:text-teal-600 transition duration-300"
              onClick={() => router.push('/shop')}>
              Shop
            </button>
            <button
              className=" text-slate-700 text-xl py-2 px-4 rounded-md font-semibold hover:text-teal-600 transition duration-300"
              onClick={() => router.push('/services')}>
              Services
            </button>
            <button
              className=" text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition duration-300"
              onClick={() => router.push('/user')}>
              <img src="UserProfile.png" alt="User Profile" className="h-8 w-8 rounded-full" />
            </button>
          </div>
        </nav>
      </header>

      <main className="">
        {/* Cover Photo Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <img src="/coverphoto.jpg" alt="" className="w-full" style={{ maxHeight: '730px' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <h2 className="text-white text-3xl font-bold mb-4 ml-56 font-serif">"ELEVATE YOUR LOOK,</h2>
            <h2 className="text-white text-3xl font-bold mb-4 ml-56 font-serif">"ELEVATE YOUR CONFIDENCE,</h2>
            <h2 className="text-white text-xl mb-4 ml-56 font-thin">Get ready to be served what you deserve</h2>
            <button onClick={handleBookNowClick} className="bg-rose-600 hover:bg-rose-500 bg-opacity-85 text-white font-semibold py-2 px-4 rounded ml-52">Book Now</button>
          </div>
        </div>

        <div className="relative -mt-16 px-10 pb-20">
          <div className="flex justify-center space-x-6">
            {/* First Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none"
              onClick={() => handleContainerClick('Hair Care')}
            >
              <img src="/Hair Care.png" alt="Care" className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Hair Care</h1>
            </button>

            {/* Second Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none"
              onClick={() => handleContainerClick('Spa')}>
              <img src="/Spa.png" alt="Spa" className="w-24 h-24 object-cover rounded-full" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Spa</h1>
            </button>

            {/* Third Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none"
              onClick={() => handleContainerClick('Hair & Make-up')}
            >
              <img src="/HnM.jpg" alt="Hnm" className="w-24 h-24 object-cover rounded-full" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Hair & Make-up</h1>
            </button>

            {/* Fourth Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none"
              onClick={() => handleContainerClick('Nail Care')}>
              <img src="/Nail Care.png" alt="NC" className="w-24 h-24 object-cover rounded-full" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Nail Care</h1>
            </button>
          </div>
        </div>
      </main>

      <div className="container mx-auto mt-24 px-4 flex">
        {/* Description */}
        <div className="text-gray-800 text-lg ml-32 first-line:uppercase first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left mt-9">
          <p><span className="font-2xl">Welcome to Guys & Gals Salon, where style meets personality!</span></p>
          <p>Step into our sanctuary of beauty and refinement, where expert</p>
          <p>stylists and personalized service await. Whether you're seeking</p>
          <p>a bold new look or a subtle enhancement, our salon is dedicated</p>
          <p>to elevating your confidence and enhancing your natural charm.</p>
          <p>Experience the epitome of glamour and relaxation at Guys & Gals Salon</p>
          <p>where every visit promises a transformative journey to your most radiant self.</p>
        </div>

        {/* Image */}
        <div className="ml-auto">
          <img src="/desc_img.jpg" alt="" className="h-full mr-32 rounded-xl" style={{ maxHeight: '250px' }} />
        </div>
      </div>

      <div className="container mx-auto mt-24 flex flex-wrap justify-center">
        <div className="text-center text-2xl font-bold mb-4 w-full">POPULAR SERVICES</div>
        <div className="flex justify-center mt-4">
          <img src="/popularServices/img1.jpg" alt="" className="image rounded-2xl mr-4 mb-4 img1" style={{ maxWidth: '400px' }} />
          <img src="/popularServices/img2.jpg" alt="" className="image rounded-2xl mr-4 mb-4 img2" style={{ maxWidth: '400px' }} />
          <img src="/popularServices/img3.jpg" alt="" className="image rounded-2xl mr-4 mb-4 img3" style={{ maxWidth: '400px' }} />
        </div>
      </div>

      <Footer />

      {/* Booking Form Overlay */}
      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <BookingForm onSubmit={handleBookingSubmit} onClose={handleCloseBookingForm} />
        </div>
      )}
    </div>
  );
}

export default Homepage;
