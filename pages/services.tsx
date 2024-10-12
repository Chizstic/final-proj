// pages/services.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import BookingForm from './bookingform';

const comboRatesImages = [
  '/servicesOffered/SO_img1.jpg',
  '/servicesOffered/SO_img2.jpg',
  '/servicesOffered/SO_img3.jpg',
  '/servicesOffered/SO_img4.jpg',
  '/servicesOffered/SO_img5.jpg',
  '/servicesOffered/SO_img6.jpg',
  '/servicesOffered/SO_img7.jpg',
  '/servicesOffered/SO_img8.jpg',
  '/servicesOffered/SO_img9.jpg',
];

interface Service {
  name: string;
  image: string;
}

const Slideshow: React.FC<{ images: string[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  }, [images.length]);

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      nextSlide();
    }, 3000);

    return () => clearTimeout(timeoutRef.current!);
  }, [currentIndex, nextSlide]);

  return (
    <div className="relative w-2/4 h-96 overflow-hidden group">
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />
      <button
        className="absolute left-3 top-1/2 transform -translate-y-1/2 border-none text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={prevSlide}>
        <span className="w-5 h-5 border-t-2 border-l-2 border-slate-600 block transform -rotate-45" />
      </button>
      <button
        className="absolute right-3 top-1/2 transform -translate-y-1/2 border-none text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        onClick={nextSlide}>
        <span className="w-5 h-5 border-t-2 border-r-2 border-slate-600 block transform rotate-45" />
      </button>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-9 h-1 rounded-lg bg-gray-100 ${index === currentIndex ? 'bg-slate-600' : 'bg-opacity-50'}`}
          />
        ))}
      </div>
    </div>
  );
};

const servicesData = {
  hairCare: [
    { name: 'Hair Trim', image: '/servicesOffered/SO_img1.jpg' },
    { name: 'Hair Color', image: '/servicesOffered/SO_img2.jpg' },
    { name: 'Hot Oil', image: '/servicesOffered/SO_img4.jpg' },
    { name: 'Balayage', image: '/servicesOffered/SO_img3.jpg' },
    { name: 'Hair Rebond', image: '/servicesOffered/SO_img5.jpg' },
    { name: 'Hair Botox', image: '/servicesOffered/SO_img6.jpg' },
    { name: 'Keratin', image: '/servicesOffered/SO_img7.jpg' },
    { name: 'Highlights', image: '/servicesOffered/SO_img8.jpg' },
  ],
  spaTreatments: [
    { name: 'Foot Spa', image: '/servicesOffered/SO_img9.jpg' },
    { name: 'Foot Massage', image: '/servicesOffered/SO_img10.jpg' },
    { name: 'Waxing (Armpit & Legs)', image: '/servicesOffered/SO_img11.jpg' },
  ],
  hairAndMakeUp: [
    { name: 'Hair Styling', image: '/servicesOffered/SO_img12.jpg' },
    { name: 'Makeup', image: '/servicesOffered/SO_img13.jpg' },
  ],
  nailCare: [
    { name: 'Manicure', image: '/servicesOffered/SO_img14.jpg' },
    { name: 'Pedicure', image: '/servicesOffered/SO_img15.jpg' },
    { name: 'Nail Gel', image: '/servicesOffered/SO_img16.jpg' },
    { name: 'Gel Polish', image: '/servicesOffered/SO_img17.jpg' },
    { name: 'Soft Gel Nail Extension', image: '/servicesOffered/SO_img18.jpg' },
  ],
};

const Section: React.FC<{
  title: string;
  services: Service[];
  sectionRef: React.RefObject<HTMLDivElement>;
  onBookNowClick: () => void;
}> = ({ title, services, sectionRef, onBookNowClick }) => {
  return (
    <div ref={sectionRef} className="mb-12 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-4xl font-bold text-center text-teal-600 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="relative bg-white shadow-xl rounded-lg flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none">
            <div className="relative w-full h-60">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 right-0 p-2 bg-rose-200 rounded-lg bg-opacity-70 text-gray-800">
                <h3 className="text-lg font-semibold">{service.name}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServicesPage: React.FC = () => {
  const [showBookingForm, setShowBookingForm] = useState<boolean>(false);
  const hairCareRef = useRef<HTMLDivElement>(null);
  const spaTreatmentsRef = useRef<HTMLDivElement>(null);
  const hairAndMakeUpRef = useRef<HTMLDivElement>(null);
  const nailCareRef = useRef<HTMLDivElement>(null);

  const handleBookNowClick = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleBookingSubmit = (bookingDetails: any) => {
    console.log('Booking details:', bookingDetails);
  };

  return (
    <div className="min-h-screen sticky top-0 z-50 shadow-md">
      <div className="fixed top-0 left-0 w-full py-4 flex justify-between items-center px-8 z-50" style={{ backgroundColor: 'rgba(171, 198, 191, 0.30)' }}>
        <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
          <img src="/logo.png" alt="Logo" className="h-16 w-16 mr-4 rounded-full" />
          <div className="flex flex-row items-center">
            <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>Guys & Gals</span>
            <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>Salon</span>
          </div>
        </div>
        <button onClick={handleBookNowClick} className="hover:text-teal-600 bg-opacity-70 text-slate-700 font-semibold text-xl hover:underline py-2 px-4 rounded ml-52">
          Book Now
        </button>
      </div>

      <div className="mt-20 relative pt-20 p-8 bg-white bg-opacity-90 min-h-screen">
        <div className="container mx-auto">
          <Slideshow images={comboRatesImages} />
          <Section
            title="Hair Care Services"
            services={servicesData.hairCare}
            sectionRef={hairCareRef}
            onBookNowClick={handleBookNowClick}
          />
          <Section
            title="Spa Treatments"
            services={servicesData.spaTreatments}
            sectionRef={spaTreatmentsRef}
            onBookNowClick={handleBookNowClick}
          />
          <Section
            title="Hair & Makeup Services"
            services={servicesData.hairAndMakeUp}
            sectionRef={hairAndMakeUpRef}
            onBookNowClick={handleBookNowClick}
          />
          <Section
            title="Nail Care Services"
            services={servicesData.nailCare}
            sectionRef={nailCareRef}
            onBookNowClick={handleBookNowClick}
          />
        </div>

        {showBookingForm && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg z-50">
              <h2 className="text-2xl font-bold mb-4">Booking Form</h2>
              <BookingForm onClose={handleCloseBookingForm} onSubmit={handleBookingSubmit} />
              <button onClick={handleCloseBookingForm} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesPage;
