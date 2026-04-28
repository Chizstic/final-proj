import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [tempCart, setTempCart] = useState(cart);

  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setTempCart(parsedCart);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(tempCart));
  }, [tempCart]);

  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setTempCart(parsedCart);
      }
    }
  }, [user]);

  const handleEditToggle = () => {
    if (isEditing) {
      tempCart.forEach((item) => addToCart(item));
    } else {
      setTempCart([...cart]);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setTempCart([...cart]);
    setIsEditing(false);
  };

  const handleRemoveItem = (id: number) => {
    const updatedTempCart = tempCart.filter((item) => item.id !== id);
    setTempCart(updatedTempCart);
    removeFromCart(id);
    localStorage.setItem("cart", JSON.stringify(updatedTempCart));
  };

  const handleCheckout = () => {
    router.push({
      pathname: "/bookingform",
      query: {
        cartItems: JSON.stringify(
          tempCart.map((item) => ({
            ...item,
            price: Number(item.price.toString().replace(/[^\d.-]/g, "")),
          }))
        ),
      },
    });
  };

  return (
    <div className="relative">
      <div className="p-8 bg-gray-100 rounded-lg shadow-lg max-w-lg mx-auto">
        <h2 className="text-3xl font-bold mb-5 text-gray-800">Your Cart</h2>

        {tempCart.length === 0 ? (
          <p className="text-gray-600 text-lg">Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {tempCart.map((item) => (
                <li key={item.id} className="flex justify-between items-center py-4 border-b border-gray-300">
                  <div>
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.price}</p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500  hover:text-red-700 font-semibold text-lg"
                    >
                      Remove
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex justify-between">
              {isEditing ? (
                <>
                  <button
                    className="py-3 px-6 border-2 border-gray-700  text-slate-800 rounded-full font-semibold text-lg hover:bg-slate-200 transition"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-3 px-6 bg-green-600 ml-2 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition"
                    onClick={handleEditToggle}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="py-3 px-6 border-2 border-rose-500 text-slate-800 rounded-full font-semibold text-lg hover:bg-slate-200 transition"
                    onClick={handleEditToggle}
                  >
                    Edit Services
                  </button>
                  <button
                    className="py-3 px-6 bg-rose-600 ml-2 text-white rounded-full font-semibold text-lg hover:bg-rose-700 transition"
                    onClick={handleCheckout}
                  >
                    Checkout
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
