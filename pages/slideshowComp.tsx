import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

const comboRatesImages = [
  // '/ComboRates.png',
  '/SS1.png',
  '/SS2.png',
  '/SS3.png', // Fixed the path here to ensure it has the leading slash
];

interface SlideshowProps {
  images: string[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex, nextSlide]);

  return (
    <div className="relative overflow-hidden group" style={{ maxWidth: '700px' }}>
      <Image
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        layout="responsive"
        width={700} // Specify the width you want for the image
        height={400} // Specify the height you want for the image
        className="object-cover"
      />
      <button onClick={prevSlide} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="w-5 h-5 border-t-2 border-l-2 border-slate-600 block transform -rotate-45" />
      </button>
      <button onClick={nextSlide} className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="w-5 h-5 border-t-2 border-r-2 border-slate-600 block transform rotate-45" />
      </button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-9 h-1 rounded-lg ${index === currentIndex ? 'bg-slate-200' : 'bg-slate-200 bg-opacity-25'}`}
          />
        ))}
      </div>
    </div>
  );
};

const SlideshowComp: React.FC = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Slideshow images={comboRatesImages} />
      <div className="flex flex-col space-y-9 ml-2">
        <Image
          src="/cpromo.png"
          alt="Promo 3"
          layout="responsive"
          width={200} // Specify the width for the promo image
          height={200} // Specify the height for the promo image
          style={{ maxHeight: '200px' }}
        />
        <Image
          src="/cpromo2.png"
          alt="Promo 4"
          layout="responsive"
          width={200} // Specify the width for the promo image
          height={200} // Specify the height for the promo image
          style={{ maxHeight: '200px' }}
        />
      </div>
    </div>
  );
};

export default SlideshowComp;
