import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from './footer';
import BookingForm from './bookingform';
import Image from 'next/image';
import Link from 'next/link';

// Define types for booking details and service types
type BookingDetails = {
  name: string;
  date: string;
  service: string;
};

type ServiceType = 'Hair Care' | 'Spa' | 'Hair & Make-up' | 'Nail Care';

function Homepage() {
  const router = useRouter();
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleContainerClick = (service: ServiceType) => {
    router.push({
      pathname: '/services',
      query: { serviceType: service },
    });
  };

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleBookingSubmit = (bookingDetails: BookingDetails) => {
    console.log("Booking details:", bookingDetails);
  };

  return (
    <div>
      <div className="bg-[#cd668855] p-2">
        <div className="text-sm font-semibold text-center text-gray-600">Call Us: +63 998 9099 129</div>
        <div className="text-sm font-semibold text-center text-gray-600">Opening Hours: Mon-Fri 9:00 AM - 6:00 PM</div>
      </div>

      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: 'rgba(171, 198, 191, 0.30)' }}>
        <nav className="flex items-center justify-between flex-wrap p-6 h-24">
          <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
            <Image src="/logo.png" alt="example" width={50} height={50} className="your-css-class another-css-class" />
            <div className="flex flex-row items-center">
              <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}> Guys & Gals</span>
              <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}> Salon</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">

<Link href="/shop">
  <button className="text-slate-700 text-xl py-2 px-4 rounded-md font-semibold hover:text-teal-600 transition duration-300">
    shop
  </button>
</Link>


<Link href="/services">
  <button className="text-slate-700 text-xl py-2 px-4 rounded-md font-semibold hover:text-teal-600 transition duration-300">
    Services
  </button>
</Link>

<Link href="/user">
  <button className="text-slate-700 text-xl py-2 px-4 rounded-md font-semibold hover:text-teal-600 transition duration-300">
    user
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
            <h2 className="text-white text-3xl font-bold mb-4 font-serif">"ELEVATE YOUR LOOK,</h2>
            <h2 className="text-white text-3xl font-bold mb-4 font-serif">"ELEVATE YOUR CONFIDENCE,</h2>
            <h2 className="text-white text-xl mb-4 font-thin">Get ready to be served what you deserve</h2>
            <button onClick={handleBookNowClick} className="bg-rose-600 hover:bg-rose-500 bg-opacity-85 text-white font-semibold py-2 px-4 rounded">Book Now</button>
          </div>
        </div>

        <div className="relative -mt-16 px-4 sm:px-10 pb-20">
          <div className="flex justify-center space-x-4 sm:space-x-6 flex-wrap">
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => handleContainerClick('Hair Care')}
            >
              <Image src="/Hair Care.jpg" alt="Care" width={90} height={100} className="w-30 h-28 object-cover rounded-full" />
              <h1 className="text-2xl -mt-4 font-bold text-gray-800 text-center">Hair Care</h1>
            </button>

            {/* Second Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => handleContainerClick('Spa')}>
              <Image src="/Spa.png" alt="Popular Service 1" width={90} height={100} className="image rounded-2xl mr-4 mb-4 img1" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Spa</h1>
            </button>

            {/* Third Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => handleContainerClick('Hair & Make-up')}
            >
              <Image src="/HnM.jpg" alt="Popular Service 2" width={90} height={100} className="image rounded-2xl mr-4 mb-4 img2" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Hair & Make-up</h1>
            </button>

            {/* Fourth Container */}
            <button
              className="bg-white bg-opacity-80 shadow-inner shadow-rose-300 p-5 rounded-lg w-56 h-36 flex flex-col items-center justify-center hover:bg-teal-50 focus:outline-none mb-4"
              onClick={() => handleContainerClick('Nail Care')}>
              <Image src="/Nail Care.png" alt="Popular Service 3" width={90} height={100} className="image rounded-2xl mr-4 mb-4 img3" />
              <h1 className="text-2xl font-bold text-gray-800 text-center">Nail Care</h1>
            </button>
          </div>
        </div>
      </main>

      <div className="container mx-auto mt-24 px-4 flex flex-col md:flex-row">
        {/* Description */}
        <div className="text-gray-800 text-lg md:w-1/2 first-line:uppercase first-line:tracking-widest first-letter:text-7xl first-letter:font-bold first-letter:text-black first-letter:mr-3 first-letter:float-left mt-9">
          <p><span className="font-2xl">Welcome to Guys & Gals Salon, where style meets personality!</span></p>
          <p>Step into our sanctuary of beauty and refinement, where expert</p>
          <p>stylists and personalized service await. Whether you're seeking</p>
          <p>a bold new look or a subtle enhancement, our salon is dedicated</p>
          <p>to elevating your confidence and enhancing your natural charm.</p>
          <p>Experience the epitome of glamour and relaxation at Guys & Gals Salon</p>
          <p>where every visit promises a transformative journey to your most radiant self.</p>
        </div>

        {/* Image */}
        <div className="md:w-1/2 md:ml-auto mt-6 md:mt-0">
          <Image src="/desc_img.jpg" alt="Description" width={400} height={250} className="h-full rounded-xl" />
        </div>
      </div>

      <div className="container mx-auto mt-24 flex flex-col items-center">
        <div className="text-center text-2xl font-bold mb-8 w-full">POPULAR SERVICES</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Image src="/img1.jpg" alt="Service 1" width={400} height={250} className="rounded-2xl" />
          <Image src="/img2.jpg" alt="Service 2" width={400} height={250} className="rounded-2xl" />
          <Image src="/img3.jpg" alt="Service 3" width={400} height={250} className="rounded-2xl" />
          <Image src="/img4.jpg" alt="Service 4" width={400} height={250} className="rounded-2xl" />
          <Image src="/img5.jpg" alt="Service 5" width={400} height={300} className="rounded-2xl" />
          <Image src="/img6.jpg" alt="Service 6" width={400} height={250} className="rounded-2xl" />
        </div>
      </div>

      <Footer />

      {showBookingForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <BookingForm onSubmit={handleBookingSubmit} onClose={handleCloseBookingForm} />
        </div>
      )}
    </div>
  );
}

export default Homepage;
