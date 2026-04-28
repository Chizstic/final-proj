import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useCart } from "@/context/CartContext";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string;
}

interface Combo {
  id: number;
  title: string;
  description: string;
  price: string;
}

const services: Service[] = [
  { id: 1, title: "Hair Trim", description: "Professional haircuts for a fresh look.", image: "/SO_img1.png", price: "PHP 248.22" },
  { id: 2, title: "Hair Cut", description: "Professional haircuts for a fresh look.", image: "/SO_img1.2.png", price: "PHP 223.21" },
  { id: 3, title: "Hair Color", description: "Vibrant hair color tailored to you.", image: "/SO_img2.png", price: "PHP 1,699" },
  { id: 4, title: "Hot Oil", description: "Nourishing treatment for shiny, healthy hair.", image: "/SO_img3.png", price: "PHP 1,999" },
  { id: 5, title: "Balayage", description: "Natural, hand-painted highlights.", image: "/SO_img4.png", price: "PHP 1,699" },
  { id: 6, title: "Hair Rebond", description: "Straighten and smoothen frizzy hair.", image: "/SO_img5.png", price: "PHP 1,499" },
  { id: 7, title: "Hair Botox", description: "Revitalize hair with deep conditioning.", image: "/SO_img6.png", price: "PHP 1,599" },
  { id: 8, title: "Keratin", description: "Silky, frizz-free hair treatment.", image: "/SO_img7.png", price: "PHP 1,699" },
  { id: 9, title: "Highlights", description: "Accentuate with natural-looking highlights.", image: "/SO_img8.png", price: "PHP 1,799" },
  { id: 10, title: "Foot Spa", description: "Relax and rejuvenate your feet.", image: "/SO_img9.png", price: "PHP 299" },
  { id: 11, title: "Foot Massage", description: "Relaxing massage to relieve foot tension.", image: "/SO_img10.png", price: "PHP 232.73" },
  { id: 12, title: "Waxing (Armpit & Legs)", description: "Smooth and hair-free skin.", image: "/SO_img11.png", price: "PHP 227.45" },
  { id: 13, title: "Hair Styling", description: "Glamorous styles for any occasion.", image: "/SO_img12.png", price: "PHP 499" },
  { id: 14, title: "Makeup", description: "Flawless makeup for special events.", image: "/SO_img13.png", price: "PHP 599" },
  { id: 15, title: "Manicure", description: "Elegant nail shaping and polish.", image: "/SO_img14.png", price: "PHP 236.74" },
  { id: 16, title: "Pedicure", description: "Relaxing nail and foot care.", image: "/SO_img15.png", price: "PHP 251.12" },
  { id: 17, title: "Nail Gel", description: "Glossy, durable nail coating.", image: "/SO_img16.png", price: "PHP 349" },
  { id: 18, title: "Gel Polish", description: "Long-lasting, chip-resistant polish.", image: "/SO_img17.png", price: "PHP 449" },
  { id: 19, title: "Soft Gel Nail Extension", description: "Extend nails with natural-looking gel.", image: "/SO_img18.png", price: "PHP 459" },
];

const combo: Combo[] = [
  { id: 1, title: "Hair Spa + Haircut", description: "Revitalize your hair with a spa treatment and fresh haircut.", price: "PHP 400" },
  { id: 2, title: "Perm Curl with Treatment", description: "Achieve beautiful curls with a professional perm and nourishing treatment.", price: "PHP 1,299" },
  { id: 3, title: "Rebond + Color + Treatment", description: "Straighten, color, and rejuvenate your hair for a complete makeover.", price: "PHP 1,999" },
  { id: 4, title: "Rebond + Keratin", description: "Get sleek, straight hair with rebonding and keratin treatment for extra shine.", price: "PHP 1,999" },
  { id: 5, title: "Rebond + Single Color", description: "Straighten and add a single-tone color for a smooth, vibrant look.", price: "PHP 1,499" },
  { id: 6, title: "Brazilian Blowout + Hair Color", description: "Enjoy frizz-free, glossy hair with a Brazilian blowout and fresh color.", price: "PHP 1,499" },
  { id: 7, title: "Balayage Plus", description: "Enhance your look with natural, sun-kissed balayage highlights.", price: "PHP 1,499" },
  { id: 8, title: "Highlights Plus", description: "Add dimension with customized, radiant hair highlights.", price: "PHP 499" },
  { id: 9, title: "Hair Cut", description: "Get a professional haircut to refresh your style.", price: "PHP 150" },
];

const Services: React.FC = () => {
  const { addToCart, removeFromCart, cart } = useCart();
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  useEffect(() => {
    if (Array.isArray(cart) && cart.length > 0) {
      const idsFromCart = cart.map((c) => Number(c.id));
      setSelectedIds(idsFromCart);
    }
  }, [cart]);

  const parsePrice = (price: string) => {
    if (!price) return 0;
    const cleaned = price.toString().replace(/[^\d.-]/g, "");
    const numeric = Number(cleaned);
    return Number.isFinite(numeric) ? numeric : 0;
  };

  const total = (Array.isArray(cart) ? cart : []).reduce((acc, item) => {
    const numeric = parsePrice(String(item.price));
    return acc + numeric;
  }, 0);

  const toggleSelect = (item: { id: number; title: string; price: string }, type: "service" | "combo") => {
    const id = item.id;
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
      try {
        removeFromCart(id);
      } catch (err) {
        console.warn("removeFromCart error:", err);
      }
    } else {
      setSelectedIds((prev) => [...prev, id]);
      try {
        addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          type,
          quantity: 1,
        });
      } catch (err) {
        console.warn("addToCart error:", err);
      }
    }
  };

  const handleContinue = () => {
    router.push({
      pathname: "/bookingform",
      query: {
        cartItems: JSON.stringify(
          (cart || []).map((item) => ({
            ...item,
            price: Number(String(item.price).replace(/[^\d.-]/g, "")),
          }))
        ),
      },
    });
  };

  return (
    <div className="bg-rose-50 px-4 pb-32 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
            Service Menu
          </p>
          <h2 className="mt-2 text-3xl font-bold text-slate-800">
            Choose the services you want
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
            Tap any card to select it. When you are ready, use the Continue
            button below to move to the booking form.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service) => {
            const isSelected = selectedIds.includes(service.id);
            return (
              <div
                key={service.id}
                onClick={() => toggleSelect(service, "service")}
                className={`flex h-full min-h-[390px] cursor-pointer flex-col rounded-3xl bg-white p-5 transition ${
                  isSelected
                    ? "border-2 border-rose-500 shadow-lg"
                    : "border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <div className="relative mb-5 h-48 overflow-hidden rounded-2xl">
                  <Image
                    src={service.image}
                    alt={service.title}
                    width={300}
                    height={200}
                    className="h-48 w-full object-cover"
                  />
                </div>

                <div className="mb-2 flex items-start justify-between gap-3">
                  <h3 className="text-xl font-bold text-slate-800">{service.title}</h3>
                  <span className="shrink-0 text-lg font-bold text-rose-700">{service.price}</span>
                </div>

                <p className="flex-grow text-base leading-7 text-slate-600">
                  {service.description}
                </p>

                <div className="mt-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(service, "service");
                    }}
                    className={`rounded-full px-5 py-2 text-base font-semibold transition ${
                      isSelected
                        ? "bg-rose-600 text-white"
                        : "border border-rose-300 text-rose-700 hover:bg-rose-50"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mb-6 mt-14">
          <h2 className="text-3xl font-bold text-slate-800">Combo Rates</h2>
          <p className="mt-2 text-base text-slate-600">
            Choose a bundled option if you want a faster, easier package.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {combo.map((comboItem) => {
            const isSelected = selectedIds.includes(comboItem.id);
            return (
              <div
                key={comboItem.id}
                onClick={() => toggleSelect(comboItem, "combo")}
                className={`flex cursor-pointer flex-col justify-between rounded-3xl bg-white p-6 transition ${
                  isSelected
                    ? "border-2 border-rose-500 shadow-lg"
                    : "border border-rose-100 shadow-sm hover:-translate-y-1 hover:shadow-md"
                }`}
              >
                <div>
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold text-slate-800">{comboItem.title}</h3>
                    <span className="shrink-0 text-lg font-bold text-rose-700">{comboItem.price}</span>
                  </div>
                  <p className="text-base leading-7 text-slate-600">{comboItem.description}</p>
                </div>

                <div className="mt-5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelect(comboItem, "combo");
                    }}
                    className={`rounded-full px-5 py-2 text-base font-semibold transition ${
                      isSelected
                        ? "bg-rose-600 text-white"
                        : "border border-rose-300 text-rose-700 hover:bg-rose-50"
                    }`}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {Array.isArray(cart) && cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 z-50 w-[94%] max-w-4xl -translate-x-1/2 rounded-3xl border border-rose-200 bg-white px-5 py-4 shadow-xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium text-slate-500">
                {cart.length} service(s) selected
              </div>
              <div className="text-2xl font-bold text-slate-800">
                PHP {Number(total).toLocaleString()}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  try {
                    cart.forEach((item) => removeFromCart(Number(item.id)));
                  } catch (err) {
                    console.warn("removeFromCart error while clearing:", err);
                  }
                  setSelectedIds([]);
                }}
                className="rounded-full border border-slate-300 px-5 py-3 text-base font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Clear
              </button>

              <button
                onClick={handleContinue}
                className="rounded-full bg-rose-600 px-6 py-3 text-base font-semibold text-white transition hover:bg-rose-700"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
