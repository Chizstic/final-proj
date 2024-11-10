import React, { useState } from "react";
import { useCart } from "../context/CartContext"; // Assuming you have a CartContext to manage global cart state
import { useRouter } from 'next/router';

const Cart: React.FC = () => {
  const { cart, addToCart, removeFromCart } = useCart(); // Make sure `removeFromCart` is available in your context
  const [isEditing, setIsEditing] = useState(false);
  const [tempCart, setTempCart] = useState(cart);
  const router = useRouter();

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
    <div className="p-8 bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">Your Cart</h2>
      {tempCart.length === 0 ? (
        <p className="text-gray-600">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {tempCart.map((item) => (
              <li key={item.id} className="flex justify-between items-center py-2 border-b border-gray-300">
                <span>{item.title}</span>
                <span>{item.price}</span>
                {isEditing && (
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex justify-between">
            {isEditing ? (
              <>
                <button
                  className="py-2 px-4 bg-gray-500 text-white rounded-full font-semibold hover:bg-gray-600"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-4 bg-green-600 text-white rounded-full font-semibold hover:bg-green-700"
                  onClick={handleEditToggle}
                >
                  Done
                </button>
              </>
            ) : (
              <>
                <button
                  className="py-2 px-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700"
                  onClick={handleEditToggle}
                >
                  Edit Services
                </button>
                <button
                  className="py-2 px-4 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700"
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
  );
};

export default Cart;
