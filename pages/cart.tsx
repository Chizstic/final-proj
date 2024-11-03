import React, { useState } from "react";
import { useCart } from "../context/CartContext";

const Cart: React.FC = () => {
  const { cart, addToCart } = useCart();
  const [isEditing, setIsEditing] = useState(false);
  const [tempCart, setTempCart] = useState(cart);

  const calculateTotal = () => {
    return tempCart.reduce((total, item) => total + parseFloat(item.price.replace("₱", "")), 0);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes from temporary cart to actual cart
      tempCart.forEach(item => addToCart(item));
    } else {
      // Initialize tempCart with current cart items for editing
      setTempCart([...cart]);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    // Discard changes by resetting tempCart to initial cart state
    setTempCart([...cart]);
    setIsEditing(false);
  };

  const handleRemoveItem = (id: number) => {
    // Remove item from tempCart during editing mode
    setTempCart(tempCart.filter((item) => item.id !== id));
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
          <div className="mt-4 flex justify-between">
            <span className="font-bold text-gray-700">Total:</span>
            <span className="font-bold text-gray-700">₱{calculateTotal().toFixed(2)}</span>
          </div>
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
                  onClick={() => alert("Proceeding to checkout with selected items.")}
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