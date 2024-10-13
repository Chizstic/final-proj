import React, { useState, useEffect, useRef, useCallback } from 'react';
import BookingForm from './bookingform';
import Image from 'next/image';

const comboRatesImages = [
  '/SO_img1.jpg',
  '/SO_img2.jpg',
  '/SO_img3.jpg',
  '/SO_img4.jpg',
  '/SO_img5.jpg',
  '/SO_img6.jpg',
  '/SO_img7.jpg',
  '/SO_img8.jpg',
  '/SO_img9.jpg',
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
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        layout="fill"
        objectFit="cover"
        className="w-full h-full"
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
    { name: 'Hair Trim', image: '/SO_img1.jpg' },
    { name: 'Hair Color', image: '/SO_img2.jpg' },
    { name: 'Hot Oil', image: '/SO_img4.jpg' },
    { name: 'Balayage', image: '/SO_img3.jpg' },
    { name: 'Hair Rebond', image: '/SO_img5.jpg' },
    { name: 'Hair Botox', image: '/SO_img6.jpg' },
    { name: 'Keratin', image: '/SO_img7.jpg' },
    { name: 'Highlights', image: '/SO_img8.jpg' },
  ],
  spaTreatments: [
    { name: 'Foot Spa', image: '/SO_img9.jpg' },
    { name: 'Foot Massage', image: '/SO_img10.jpg' },
    { name: 'Waxing (Armpit & Legs)', image: '/SO_img11.jpg' },
  ],
  hairAndMakeUp: [
    { name: 'Hair Styling', image: '/SO_img12.jpg' },
    { name: 'Makeup', image: '/SO_img13.jpg' },
  ],
  nailCare: [
    { name: 'Manicure', image: '/SO_img14.jpg' },
    { name: 'Pedicure', image: '/SO_img15.jpg' },
    { name: 'Nail Gel', image: '/SO_img16.jpg' },
    { name: 'Gel Polish', image: '/SO_img17.jpg' },
    { name: 'Soft Gel Nail Extension', image: '/SO_img18.jpg' },
  ],
};

const Section: React.FC<{
  title: string;
  services: Service[];
  sectionRef: React.RefObject<HTMLDivElement>;
}> = ({ title, services, sectionRef }) => {
  return (
    <div ref={sectionRef} className="mb-12 bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-4xl font-bold text-center text-teal-600 mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="relative bg-white shadow-xl rounded-lg flex flex-col items-center justify-center overflow-hidden transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl focus:outline-none">
            <div className="relative w-full h-60">
              <Image
                src={service.image}
                alt={service.name}
                layout="fill"
                objectFit="cover"
                className="w-full h-full"
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
    setShowBookingForm(true); // Show the form when "Book Now" is clicked
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false); // Hide the form when "Close" is clicked
  };

  const handleBookingSubmit = (bookingDetails: BookingDetails) => {
    console.log('Booking details:', bookingDetails);
    handleCloseBookingForm(); // Close the form after submission
  };

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 w-full py-4 flex justify-between items-center px-8 z-50" style={{ backgroundColor: 'rgba(171, 198, 191, 0.30)' }}>
        <div className="flex items-center flex-shrink-0 text-white mr-6">
          <Image src="/logo.png" alt="Logo" width={64} height={64} className="mr-4 rounded-full" />
          <div className="flex flex-row items-center">
            <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>Guys & Gals</span>
            <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>Salon</span>
          </div>
        </div>
        <button onClick={handleBookNowClick} className="hover:text-teal-600 bg-opacity-70 text-slate-700 font-semibold text-xl hover:underline py-2 px-4 rounded">
          Book Now
        </button>
      </div>

      <Slideshow images={comboRatesImages} />

      <Section title="Hair Care" services={servicesData.hairCare} sectionRef={hairCareRef} />
      <Section title="Spa Treatments" services={servicesData.spaTreatments} sectionRef={spaTreatmentsRef} />
      <Section title="Hair and Make Up" services={servicesData.hairAndMakeUp} sectionRef={hairAndMakeUpRef} />
      <Section title="Nail Care" services={servicesData.nailCare} sectionRef={nailCareRef} />

      {/* Conditionally render the BookingForm */}
      {showBookingForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <BookingForm onClose={handleCloseBookingForm} onSubmit={handleBookingSubmit} />
        </div>
      )}
    </div>
  );
};

export default ServicesPage;