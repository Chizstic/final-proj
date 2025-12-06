import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/router";

interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  price: string; // keep as string
}

interface Combo {
  id: number;
  title: string;
  description: string;
  price: string; // keep as string
}

/* ---------- keep your original arrays exactly as they are ---------- */
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
  { id: 16, title: "Pedicure", description: "Relaxing nail and foot care.", image: "/SO_img15.png", price: "₱\t251.12" },
  { id: 17, title: "Nail Gel", description: "Glossy, durable nail coating.", image: "/SO_img16.png", price: "₱349" },
  { id: 18, title: "Gel Polish", description: "Long-lasting, chip-resistant polish.", image: "/SO_img17.png", price: "₱449" },
  { id: 19, title: "Soft Gel Nail Extension", description: "Extend nails with natural-looking gel.", image: "/SO_img18.png", price: "₱459" },
];

const combo: Combo[] = [
  { id: 1, title: "Hair Spa + Haircut", description: "Revitalize your hair with a spa treatment and fresh haircut.", price: "₱400" },
  { id: 2, title: "Perm Curl with Treatment", description: "Achieve beautiful curls with a professional perm and nourishing treatment.", price: "₱1,299" },
  { id: 3, title: "Rebond + Color + Treatment", description: "Straighten, color, and rejuvenate your hair for a complete makeover.", price: "₱1,999" },
  { id: 4, title: "Rebond + Keratin", description: "Get sleek, straight hair with rebonding and keratin treatment for extra shine.", price: "₱1,999" },
  { id: 5, title: "Rebond + Single Color", description: "Straighten and add a single-tone color for a smooth, vibrant look.", price: "₱1,499" },
  { id: 6, title: "Brazilian Blowout + Hair Color", description: "Enjoy frizz-free, glossy hair with a Brazilian blowout and fresh color.", price: "₱1,499" },
  { id: 7, title: "Balayage Plus", description: "Enhance your look with natural, sun-kissed balayage highlights.", price: "₱1,499" },
  { id: 8, title: "Highlights Plus", description: "Add dimension with customized, radiant hair highlights.", price: "₱499" },
  { id: 9, title: "Hair Cut", description: "Get a professional haircut to refresh your style.", price: "₱150" },
];
/* -------------------------------------------------------------------- */

const Services: React.FC = () => {
  const { addToCart, removeFromCart, cart } = useCart(); // keep these exact names
  const router = useRouter();

  // selected IDs stored locally for immediate UI feedback
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize selection from existing cart so selections persist
  useEffect(() => {
    if (Array.isArray(cart) && cart.length > 0) {
      const idsFromCart = cart.map((c: any) => Number(c.id));
      setSelectedIds(idsFromCart);
    }
  }, [cart]);

  // helper: parse price strings like "₱1,699" or "₱\t251.12" to number
  const parsePrice = (p: string) => {
    if (!p) return 0;
    const cleaned = p.toString().replace(/[^\d.-]/g, "");
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // compute totals from cart (the Cart component persists localStorage; reuse cart for accuracy)
  const total = (Array.isArray(cart) ? cart : []).reduce((acc: number, item: any) => {
    const numeric = parsePrice(String(item.price));
    return acc + numeric;
  }, 0);

  // toggle selection while keeping addToCart/removeFromCart calls (same param shapes you used)
  const toggleSelect = (item: { id: number; title: string; price: string }, type: "service" | "combo") => {
    const id = item.id;
    const isSelected = selectedIds.includes(id);

    if (isSelected) {
      // remove
      setSelectedIds((prev) => prev.filter((s) => s !== id));
      try {
        removeFromCart(id); // keep same name and signature as your Cart usage
      } catch (err) {
        // swallow so UI won't crash if context implementation differs
        console.warn("removeFromCart error:", err);
      }
    } else {
      // add
      setSelectedIds((prev) => [...prev, id]);
      try {
        addToCart({
          id: item.id,
          title: item.title,
          price: item.price,
          type: type,
          quantity: 1,
        });
      } catch (err) {
        console.warn("addToCart error:", err);
      }
    }
  };

  // navigate to booking form — same approach you used in Cart.tsx (send cart items in query)
  const handleContinue = () => {
    router.push({
      pathname: "/bookingform",
      query: {
        cartItems: JSON.stringify(
          (cart || []).map((item: any) => ({
            ...item,
            price: Number(String(item.price).replace(/[^\d.-]/g, "")),
          }))
        ),
      },
    });
  };

  return (
    <div className="p-8 bg-white pb-28">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Services For You!</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {services.map((service) => {
          const isSelected = selectedIds.includes(service.id);
          return (
            <div
              key={service.id}
              onClick={() => toggleSelect(service, "service")}
              className={`p-6 rounded-xl transition-shadow duration-250 cursor-pointer h-[380px] flex flex-col
                ${isSelected ? "border-2 border-rose-500 shadow-xl" : "border border-transparent shadow-sm hover:shadow-md"}`}
            >
              <div className="relative mb-4">
                <Image
                  src={service.image}
                  alt={service.title}
                  width={300}
                  height={200}
                  className="rounded-md object-cover h-48 w-full"
                />
                {/* {isSelected && (
                  <div className="absolute top-3 right-3 bg-rose-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow">
                    Selected
                  </div>
                )} */}
              </div>

              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-700">{service.title}</h3>
                <span className="text-lg font-semibold text-gray-700">{service.price}</span>
              </div>

              <p className="text-gray-600 text-sm flex-grow">{service.description}</p>

              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // keep click only for toggle via button too
                    toggleSelect(service, "service");
                  }}
                  className={`w-28 py-1 text-sm rounded-full font-semibold transition
                    ${isSelected ? "bg-rose-600 text-white" : "text-rose-600 border-2 border-rose-600 hover:bg-rose-50"}`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-6 text-gray-800">Combo Rates</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {combo.map((comboItem) => {
          const isSelected = selectedIds.includes(comboItem.id);
          return (
            <div
              key={comboItem.id}
              onClick={() => toggleSelect(comboItem, "combo")}
              className={`p-6 rounded-xl transition-shadow duration-250 cursor-pointer flex flex-col justify-between
                ${isSelected ? "border-2 border-rose-500 shadow-xl" : "border border-transparent shadow-sm hover:shadow-md"}`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-gray-700">{comboItem.title}</h3>
                  <span className="text-lg font-semibold text-gray-700">{comboItem.price}</span>
                </div>
                <p className="text-gray-600 text-sm">{comboItem.description}</p>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600">{isSelected ? "✓ Selected" : ""}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(comboItem, "combo");
                  }}
                  className={`w-28 py-1 text-sm rounded-full font-semibold transition
                    ${isSelected ? "bg-rose-600 text-white" : "text-rose-600 border-2 border-rose-600 hover:bg-rose-50"}`}
                >
                  {isSelected ? "Selected" : "Select"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating summary (reads from cart to show real totals) */}
      {Array.isArray(cart) && cart.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[92%] max-w-3xl bg-white border rounded-full shadow-lg px-6 py-3 flex items-center justify-between z-50">
          <div>
            <div className="text-sm text-gray-500">{cart.length} service(s) selected</div>
            <div className="text-lg font-semibold text-gray-800">₱{Number(total).toLocaleString()}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                // quick clear selections: remove each id from cart and local selectedIds
                try {
                  cart.forEach((c: any) => removeFromCart(Number(c.id)));
                } catch (err) {
                  console.warn("removeFromCart error while clearing:", err);
                }
                setSelectedIds([]);
              }}
              className="py-2 px-4 rounded-full border border-gray-300 text-sm text-black font-semibold hover:bg-gray-50 transition"
            >
              Clear
            </button>

            <button
              onClick={handleContinue}
              className="py-2 px-6 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;