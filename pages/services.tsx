import React from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string; // Added price property
}

interface Combo {
  id: number;
  title: string;
  description: string;
  price: string; // Added price property
}

const services: Service[] = [
  { id: 1, title: "Hair Trim", description: "Professional haircuts for a fresh look.", image: "/SO_img1.png", price: "₱248.22" },
  { id: 2, title: "Hair Cut", description: "Professional haircuts for a fresh look.", image: "/SO_img1.2.png", price: "₱223.21" },
  { id: 3, title: "Hair Color", description: "Vibrant hair color tailored to you.", image: "/SO_img2.png", price: "₱1,699" },
  { id: 4, title: "Hot Oil", description: "Nourishing treatment for shiny, healthy hair.", image: "/SO_img3.png", price: "₱1,999" },
  { id: 5, title: "Balayage", description: "Natural, hand-painted highlights.", image: "/SO_img4.png", price: "₱1,699" },
  { id: 6, title: "Hair Rebond", description: "Straighten and smoothen frizzy hair.", image: "/SO_img5.png", price: "₱1,499" },
  { id: 7, title: "Hair Botox", description: "Revitalize hair with deep conditioning.", image: "/SO_img6.png", price: "₱1,599" },
  { id: 8, title: "Keratin", description: "Silky, frizz-free hair treatment.", image: "/SO_img7.png", price: "₱1,699" },
  { id: 9, title: "Highlights", description: "Accentuate with natural-looking highlights.", image: "/SO_img8.png", price: "₱1,799" },
  { id: 10, title: "Foot Spa", description: "Relax and rejuvenate your feet.", image: "/SO_img9.png", price: "₱299" },
  { id: 11, title: "Foot Massage", description: "Relaxing massage to relieve foot tension.", image: "/SO_img10.png", price: "₱232.73" },
  { id: 12, title: "Waxing (Armpit & Legs)", description: "Smooth and hair-free skin.", image: "/SO_img11.png", price: "₱227.45" },
  { id: 13, title: "Hair Styling", description: "Glamorous styles for any occasion.", image: "/SO_img12.png", price: "₱499" },
  { id: 14, title: "Makeup", description: "Flawless makeup for special events.", image: "/SO_img13.png", price: "₱599" },
  { id: 15, title: "Manicure", description: "Elegant nail shaping and polish.", image: "/SO_img14.png", price: "₱236.74" },
  { id: 16, title: "Pedicure", description: "Relaxing nail and foot care.", image: "/SO_img15.png", price: "₱	251.12" },
  { id: 17, title: "Nail Gel", description: "Glossy, durable nail coating.", image: "/SO_img16.png", price: "₱349" },
  { id: 18, title: "Gel Polish", description: "Long-lasting, chip-resistant polish.", image: "/SO_img17.png", price: "₱449" },
  { id: 19, title: "Soft Gel Nail Extension", description: "Extend nails with natural-looking gel.", image: "/SO_img18.png", price: "₱459" },
];


// Add more services here as needed

const combo: Combo[] = [
  {
    id: 1,
    title: "Hair Spa + Haircut",
    description: "Revitalize your hair with a spa treatment and fresh haircut.",
    price: "₱400",
  },
  {
    id: 2,
    title: "Perm Curl with Treatment",
    description: "Achieve beautiful curls with a professional perm and nourishing treatment.",
    price: "₱1,299",
  },
  {
    id: 3,
    title: "Rebond + Color + Treatment",
    description: "Straighten, color, and rejuvenate your hair for a complete makeover.",
    price: "₱1,999",
  },
  {
    id: 4,
    title: "Rebond + Keratin",
    description: "Get sleek, straight hair with rebonding and keratin treatment for extra shine.",
    price: "₱1,999",
  },
  {
    id: 5,
    title: "Rebond + Single Color",
    description: "Straighten and add a single-tone color for a smooth, vibrant look.",
    price: "₱1,499",
  },
  {
    id: 6,
    title: "Brazilian Blowout + Hair Color",
    description: "Enjoy frizz-free, glossy hair with a Brazilian blowout and fresh color.",
    price: "₱1,499",
  },
  {
    id: 7,
    title: "Balayage Plus",
    description: "Enhance your look with natural, sun-kissed balayage highlights.",
    price: "₱1,499",
  },
  {
    id: 8,
    title: "Highlights Plus",
    description: "Add dimension with customized, radiant hair highlights.",
    price: "₱499",
  },
  {
    id: 9,
    title: "Hair Cut",
    description: "Get a professional haircut to refresh your style.",
    price: "₱150",
  },
];


const Services: React.FC = () => {
  const { addToCart } = useCart(); // Access addToCart function from context

  return (
    <div className="p-8 bg-white">
    <h2 className="text-2xl font-bold mb-10 text-gray-800">All Services For You!</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {services.map((service) => (
        <div
          key={service.id}
          className="p-6 rounded-lg shadow-inner shadow-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col h-[380px]"
        >
          <Image
            src={service.image}
            alt={service.title}
            width={300}
            height={200}
            className="rounded-md mb-4 object-cover h-48 w-full"
          />
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{service.title}</h3>
            <span className="text-lg font-semibold text-gray-700">{service.price}</span>
          </div>
          <p className="text-gray-600 text-sm flex-grow">{service.description}</p>
          <button
            className="py-1 px-3 text-rose-600 w-28 text-sm border-2 border-rose-600 rounded-full font-semibold hover:bg-rose-100 transition-colors duration-300 mt-4"
            onClick={() =>
              addToCart({
                id: service.id,
                title: service.title,
                price: service.price,
                type: "service",
                quantity:1,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  
    <h2 className="text-2xl font-bold mt-16 mb-10 text-gray-800">Combo Rates</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {combo.map((comboItem) => (
        <div
          key={comboItem.id}
          className="p-6 rounded-lg shadow-inner shadow-slate-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-gray-700">{comboItem.title}</h3>
            <span className="text-lg font-semibold text-gray-700">{comboItem.price}</span>
          </div>
          <p className="text-gray-600 text-sm mb-4">{comboItem.description}</p>
          <button
            className="py-1 px-3 w-28 text-rose-600 text-sm border-2 border-rose-600 rounded-full font-semibold hover:bg-rose-100 transition-colors duration-300"
            onClick={() =>
              addToCart({
                id: comboItem.id,
                title: comboItem.title,
                price: comboItem.price,
                type: "combo",
                quantity:1,
              })
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Services;