// src/components/Checkout.tsx
import React from 'react';

interface CartItem {
  id: number;
  name: string;
  price: string;
}

interface CheckOutPageProps {
  cartItems: CartItem[];
}

const CheckOutPage: React.FC<CheckOutPageProps> = ({ cartItems }) => {
  const renderCartItems = () => {
    return cartItems.map((item) => (
      <div key={item.id} className="flex justify-between">
        <span>{item.name}</span>
        <span>{item.price}</span>
      </div>
    ));
  };

  return (
    <div>
    <h2 className="text-xl font-bold">Checkout</h2>
    {cartItems.length === 0 ? (
      <p>Your cart is empty.</p>
    ) : (
      <div>{renderCartItems()}</div>
    )}
  </div>
  
  );
};

export default CheckOutPage;
