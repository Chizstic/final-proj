import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext"; // Assuming you have a CartContext to manage global cart state
import { useRouter } from 'next/router';
import { useAuth } from "../context/AuthContext"; // Importing AuthContext

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart(); // Make sure `removeFromCart` is available in your context
  const { user } = useAuth(); // Access the logged-in user from AuthContext
  const [isEditing, setIsEditing] = useState(false);
  const [tempCart, setTempCart] = useState(cart);
  const [cartCount, setCartCount] = useState(0); // To hold the count of items in the cart
  const [showCartCount] = useState(true); // State to manage visibility of cart count notification
  const router = useRouter();

  // Sync cart with localStorage on changes
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      setTempCart(parsedCart);
      setCartCount(parsedCart.length); // Set the number of items in cart
    }
  }, []);

  useEffect(() => {
    // Update the cart count in localStorage when tempCart is updated
    localStorage.setItem("cart", JSON.stringify(tempCart));
    setCartCount(tempCart.length); // Update the cart count notification
  }, [tempCart]);

  // Sync back the cart to the global state and localStorage when the user logs in
  useEffect(() => {
    if (user) {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setTempCart(parsedCart);
        setCartCount(parsedCart.length);
      } else {
        // Optionally, fetch cart data from server based on user's email if needed
      }
    }
  }, [user]);

  // Toggle edit mode
  const handleEditToggle = () => {
    if (isEditing) {
      tempCart.forEach(item => addToCart(item)); // Sync back any temporary changes to the cart
    } else {
      setTempCart([...cart]);
    }
    setIsEditing(!isEditing);
  };

  // Cancel editing and restore the original cart state
  const handleCancelEdit = () => {
    setTempCart([...cart]);
    setIsEditing(false);
  };

  // Remove an item from the cart
  const handleRemoveItem = (id: number) => {
    // Remove from tempCart
    const updatedTempCart = tempCart.filter((item) => item.id !== id);
    setTempCart(updatedTempCart);

    // Remove from the global cart state and localStorage
    removeFromCart(id); // Assuming this is a method in your context to update global cart
    localStorage.setItem("cart", JSON.stringify(updatedTempCart)); // Update localStorage
  };

  // Checkout handler
  const handleCheckout = () => {
    router.push({
      pathname: '/bookingform',
      query: {
        cartItems: JSON.stringify(
          tempCart.map(item => ({
            ...item,
            price: Number(item.price.toString().replace(/[^\d.-]/g, '')), // Clean price if needed
          }))
        )
      },
    });
  };

  return (
    <div className="relative">
      {/* Cart Count Notification */}
      {showCartCount && (
        <div className="absolute top-0 right-0 p-2 flex items-center bg-red-600 text-white rounded-full px-2 py-2 text-lg cursor-pointer">
          {cartCount} {cartCount === 1 ? 'item' : 'items'}
        </div>
      )}

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
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-600">{item.price}</p>
                  </div>
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-lg"
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
                    className="py-3 px-6 bg-gray-500 text-white rounded-full font-semibold text-lg hover:bg-gray-600 transition"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                  <button
                    className="py-3 px-6 bg-green-600 text-white rounded-full font-semibold text-lg hover:bg-green-700 transition"
                    onClick={handleEditToggle}
                  >
                    Done
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="py-3 px-6 bg-blue-600 text-white rounded-full font-semibold text-lg hover:bg-blue-700 transition"
                    onClick={handleEditToggle}
                  >
                    Edit Services
                  </button>
                  <button
                    className="py-3 px-6 bg-rose-600 text-white rounded-full font-semibold text-lg hover:bg-rose-700 transition"
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
