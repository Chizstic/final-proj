import React, { useState, useEffect, useRef } from 'react';
import Footer from './components/footer';
import BookingForm from './bookingform';
import Image from 'next/image';
import { Bookings } from './api/type';
import { FaUser, FaCheckCircle, FaShoppingCart  } from 'react-icons/fa';
import Services from './services';
import Cart from './cart'

function Homepage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showCart, setShowCart] = useState(false); // New state to control cart overlay visibility
  const [booking, setBooking] = useState<Bookings | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [showNotice, setShowNotice] = useState(false);


  useEffect(() => {
    const bookingData = localStorage.getItem('bookingDetails');
    if (bookingData) {
      setBooking(JSON.parse(bookingData));
    }
    
  }, []);

  const toggleCart = () => {
    setShowCart((prev) => !prev);
  };

  useEffect(() => {
    if (showNotice) {
      const timer = setTimeout(() => {
        setShowNotice(false);
      }, 10000); // Hide notice after 10 seconds
      return () => clearTimeout(timer);
    }
  }, [showNotice]);

  const handleBookNowClick = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
      setShowNotice(true); // Show the notice message
    }
  };


  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  
  const handleContainerClick = (serviceName: string) => {
    console.log(`Service selected: ${serviceName}`);
    // Scroll to the services section
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleProfileClick = () => {
    window.location.href = '/user';
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const currentUserEmail = typeof window !== 'undefined'
    ? localStorage.getItem('email') || ''
    : '';

  const bookingID = typeof window !== 'undefined' && localStorage.getItem('bookingID')
    ? Number(localStorage.getItem('bookingID'))
    : 0;

  return (
    <div>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="bg-[#cd668855] p-2 scroll-smooth">
        <div className="text-xs md:text-sm font-semibold text-center text-gray-600">
          Call Us: +63 998 9099 129
        </div>
        <div className="text-xs sm:text-sm md:text-sm lg:text-sm font-semibold text-center text-gray-600">
          Opening Hours: Mon-Fri 9:00am - 8:00pm, Sat-Sun 9:00am - 7:00pm
        </div>

      </div>

      <header
          className="sticky top-0 z-50 shadow-md"
          style={{ backgroundColor: 'rgba(251, 207, 232, 0.2)' }}
        >
          <nav className="flex flex-wrap items-center justify-between p-6 h-24">
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0 text-white mr-6">
              <Image
                src="/logo.png"
                alt=""
                className="rounded-full"
                width={60}
                height={60}
              />
              <div className="flex flex-row ml-6 items-center">
                <span
                  className="font-bold text-xl sm:text-xl md:text-xl lg:text-xl tracking-tight"
                  style={{ color: '#D20062', fontFamily: 'Serif' }}
                >
                  Guys & Gals
                </span>
                <span
                  className="font-bold text-xl sm:text-xl md:text-xl lg:text-xl tracking-tight ml-2"
                  style={{ color: '#D6589F', fontFamily: 'Serif' }}
                >
                  Salon
                </span>
              </div>

            </div>

            {/* User Dropdown Section */}
            <div className="flex items-center space-x-4 relative">
              <button
                onClick={toggleDropdown}
                className="flex items-center text-rose-600 text-lg sm:text-xl py-2 px-4 rounded-md font-semibold hover:text-rose-500 transition duration-300"
              >
                <FaUser size={24} className="mr-2" />
              </button>

              {dropdownVisible && (
                <div className="absolute right-0 mt-32 sm:mt-32 w-40 sm:w-48 bg-white rounded-md shadow-lg">
                  <button
                    onClick={handleProfileClick}
                    className="block px-4 py-2 text-gray-800 hover:bg-rose-100 w-full text-left"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogoutClick}
                    className="block px-4 py-2 text-gray-800 hover:bg-rose-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </header>

      

        <main>
  {/* Hero Section */}
  <div className="relative w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] lg:min-h-[600px] xl:min-h-[680px]">
    {/* Overlay */}
    <div className="absolute inset-0 bg-black bg-opacity-25"></div>

    {/* Responsive Background Image */}
    <Image
      src="/coverphoto1.jpg"
      alt="Cover Photo"
      fill
      className="object-cover object-center"
      priority
    />

    {/* Text and Button */}
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-10">
      <h2 className="text-white text-base sm:text-lg lg:text-2xl font-bold mb-2 font-serif">
       `ELEVATE YOUR LOOK,
      </h2>
      <h2 className="text-white text-base sm:text-lg lg:text-2xl font-bold mb-4 font-serif">
        ELEVATE YOUR CONFIDENCE.`
      </h2>
      <h2 className="text-white text-xs sm:text-sm lg:text-lg mb-4 font-thin">
        Get ready to be served what you deserve
      </h2>
      <button
        onClick={handleBookNowClick}
        className="text-rose-600 font-semibold py-1 px-4 sm:py-1 sm:px-4 lg:py-1 lg:px-4 rounded-full border-2 border-rose-600 hover:bg-rose-600 hover:text-white transition text-sm sm:text-base lg:text-lg"
      >
        Book Now
      </button>
    </div>
  </div>

  {/* Service Category */}
  <div className="relative -mt-9 px-4 sm:px-6 md:px-8 lg:px-10 pb-20">
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-center">
      {/* Service Category Buttons */}
      <button
        className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-4 sm:p-5 rounded-lg w-full h-36 flex flex-col items-center justify-center hover:bg-rose-50 focus:outline-none"
        onClick={() => handleContainerClick('Hair Care')}
      >
        <Image src="/Hair_Care.png" alt="Hair Care" width={150} height={100} className="object-cover rounded-full" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center -mt-2">Hair Care</h1>
      </button>

      <button
        className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-4 sm:p-5 rounded-lg w-full h-36 flex flex-col items-center justify-center hover:bg-rose-50 focus:outline-none"
        onClick={() => handleContainerClick('Spa')}
      >
        <Image src="/Spa.png" alt="Spa" width={100} height={100} className="object-cover rounded-full" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">Spa</h1>
      </button>

      <button
        className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-4 sm:p-5 rounded-lg w-full h-36 flex flex-col items-center justify-center hover:bg-rose-50 focus:outline-none"
        onClick={() => handleContainerClick('Hair & Make-up')}
      >
        <Image src="/HnM.jpg" alt="Hair & Make-up" width={100} height={100} className="object-cover rounded-full" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">Hair & Make-up</h1>
      </button>

      <button
        className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-4 sm:p-5 rounded-lg w-full h-36 flex flex-col items-center justify-center hover:bg-rose-50 focus:outline-none"
        onClick={() => handleContainerClick('Nail Care')}
      >
        <Image src="/Nail Care.png" alt="Nail Care" width={100} height={100} className="object-cover rounded-full" />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 text-center">Nail Care</h1>
      </button>
    </div>
  </div>
</main>



<div className="flex flex-col lg:flex-row items-center lg:items-start space-y-8 lg:space-y-0 lg:space-x-8 ml-4 lg:ml-16 mt-10">
  
  <div className="w-full lg:w-[250px] max-w-[300px]">
    <Image 
      src="/desc.png" 
      alt="Description Image" 
      className="w-full h-auto object-contain"
      width={250} 
      height={250} 
    />
  </div>

  <div className="flex flex-col justify-center text-center lg:text-left px-4 sm:px-8 lg:px-0 w-full lg:w-[60%]">
    <div className="text-lg font-semibold text-rose-700 mx-auto lg:mx-0">
      We provide the best quality spa and beauty services.
    </div>
    
    <div className="mt-2 text-lg text-gray-600 mx-auto lg:mx-0">
      Our salon offers a wide variety of beauty treatments tailored to meet your unique needs. From relaxing foot massages and makeup to expert hair styling, we ensure you leave feeling refreshed and confident.
    </div>
  </div>
  
  <div className="w-full lg:w-[30%] lg:ml-8 mt-6 lg:mt-0">
    <h1 className="font-semibold text-xl text-rose-700 mb-2 text-center lg:text-left">OUR BENEFITS</h1>
    <ul className="space-y-2 text-center lg:text-left">
      <li className="flex items-center justify-center lg:justify-start">
        <FaCheckCircle className="text-rose-700 mr-2" />
        Relaxing and rejuvenating experience
      </li>
      <li className="flex items-center justify-center lg:justify-start">
        <FaCheckCircle className="text-rose-700 mr-2" />
        Skilled and certified professionals
      </li>
      <li className="flex items-center justify-center lg:justify-start">
        <FaCheckCircle className="text-rose-700 mr-2" />
        Use of high-quality, organic products
      </li>
      <li className="flex items-center justify-center lg:justify-start">
        <FaCheckCircle className="text-rose-700 mr-2" />
        Customized treatments for all skin types
      </li>
      <li className="flex items-center justify-center lg:justify-start">
        <FaCheckCircle className="text-rose-700 mr-2" />
        Affordable and luxurious service options
      </li>
    </ul>
  </div>
</div>




{/* Second Image Section */}
<div className="flex justify-center mt-8 w-full">
  <Image 
    src="/time.png" 
    alt="Time Image" 
    width={800} 
    height={600} 
    objectFit="contain" 
    className="w-full sm:max-w-4xl"  // Ensures the image is responsive and adjusts to screen size
  />
</div>





      
     

<div className="text-center sm:text-left mt-10 text-gray-600 w-11/12 sm:w-9/12  mx-auto border rounded p-4">
  <p>
    Note: Prices are quoted at a minimum and may vary depending on hair length. Please consult with your stylist for possible additional charges.
  </p>
</div>

      {/* Services Section */}
      <div ref={servicesRef}>
        <Services/>
      </div>

       {/* Notice Message */}
      {showNotice && (
        <div className="fixed bottom-24 right-8 bg-rose-600 text-white px-4 py-2 rounded shadow-lg z-50">
        Please select a service first.
      </div>
      
      )}

      <Footer/>
      

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
              bookingid={bookingID}
              email={currentUserEmail}
              servicePrice={booking?.servicePrice || 0} // Provide a default value (like 0) if it's undefined
            />
          </div>
        </div>
      )}

      {/* Cart Icon */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleCart}
          className="bg-rose-600 p-4 sm:p-5 md:p-6 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center"
        >
          <FaShoppingCart size={30} className="text-white" />
        </button>
      </div>

      {/* Cart Overlay */}
      {showCart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 shadow-lg">
            {/* Close Button */}
            <button
              onClick={toggleCart}
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>

            {/* Render the Cart component here */}
            <Cart />
          </div>
        </div>
      )}
    </div>
  );
}

export default Homepage;
