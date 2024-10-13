// src/components/Cart.tsx
import React, { useState } from 'react';
import CheckOutPage from './checkout'; // Ensure the path is correct

interface CartItem {
  id: number;
  name: string;
  price: string;
}

interface CartProps {
  cartItems: CartItem[];
  removeFromCart: (id: number) => void;
}

const Cart: React.FC<CartProps> = ({ cartItems, removeFromCart }) => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const getTotalPrice = () => {
    return cartItems
      .reduce((total, item) => {
        const price = parseFloat(item.price.replace('₱', '').replace(/,/g, ''));
        return total + price;
      }, 0)
      .toFixed(2);
  };

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div>
      <div className="w-64 p-4 bg-gray-100 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Cart</h2>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center mb-4">
                <span>{item.name}</span>
                {isEditMode && (
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200"
                  >
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <p className="font-bold">Total: ₱{getTotalPrice()}</p>
          <div className="flex justify-between">
            <button
              onClick={toggleEditMode}
              className={`py-2 px-4 rounded-lg mt-4 ml-2 transition-colors duration-200 border
                ${isEditMode
                  ? 'bg-rose-800 text-white hover:bg-rose-700'
                  : 'bg-rose-200 bg-opacity-65 text-slate-800 font-medium border-rose-700 hover:bg-rose-400'}`}
            >
              {isEditMode ? 'Cancel' : 'Edit'}
            </button>

            <button
              onClick={openCheckout}
              className="bg-rose-500 ml-2 text-white font-medium py-2 px-4 rounded-lg mt-4 hover:bg-rose-600 transition-colors duration-200 w-full"
            >
              Checkout
            </button>
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-rose-100 border-teal-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={closeCheckout}
              className="absolute top-2 right-2 bg-gray-400 text-white px-2 rounded-full"
            >
              X
            </button>
            <CheckOutPage cartItems={cartItems} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
