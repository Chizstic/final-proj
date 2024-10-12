// pages/shop.tsx

import React, { useState } from 'react';
import Cart from './cart';
import { FaShoppingCart } from 'react-icons/fa'; // Import a cart icon from react-icons

interface Product {
  id: number;
  name: string;
  size: string;
  price: string;
  image: string;
}

const ShopPage: React.FC = () => {
  const [isCartVisible, setIsCartVisible] = useState<boolean>(false); // State to toggle cart sidebar visibility
  const [cartItems, setCartItems] = useState<Product[]>([]); // State to manage cart items

  const products: Product[] = [
    { id: 1, name: 'Keravit', size: '1000ml', price: '₱1,650', image: './shopPics/keravit.png' },
    { id: 2, name: 'Keravit', size: '300ml', price: '₱500', image: './shopPics/keravit.png' },
    { id: 3, name: 'Cindynal Moisturizer', size: '500g', price: '₱250', image: './shopPics/cyndal.jpg' },
    { id: 4, name: 'Ashley Hair Serum', size: '120ml', price: '₱400', image: './shopPics/hair_serum.jpg' },
    { id: 5, name: 'Semidilino Essential Oil', size: '12x3ml', price: '₱800', image: './shopPics/semidilino.jpg' },
  ];

  const addToCart = (product: Product) => {
    const isProductInCart = cartItems.some((item) => item.id === product.id);
    
    if (!isProductInCart) {
      setCartItems((prevItems) => [...prevItems, product]);
    } else {
      alert(`${product.name} is already in your cart.`);
    }
  };

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  return (
    <div className="relative flex flex-col md:flex-row">
      {/* Product Grid Section */}
      <div className="flex grid-cols-1 lg:grid-cols-3 gap-3 p-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-pink-100 bg-opacity-40 p-6 rounded-lg shadow-lg border border-teal-600 border-opacity-25 hover:shadow-xl transition-shadow duration-300 flex flex-col items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-48 h-48 object-cover mb-4 border border-gray-200 rounded-md shadow-md"/>
            <h2 className="text-xl text-slate-700 font-semibold mb-1">{product.name}</h2>
            <p className="text-gray-500 mb-8 text-sm">{product.size}</p>
            <p className="text-rose-600 font-medium text-lg -ml-32 -mb-8">{product.price}</p>
            <button
              onClick={() => addToCart(product)}
              className="bg-rose-500 -mr-24 opacity-90 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition-colors duration-300">
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Cart Icon */}
      <button
        onClick={() => setIsCartVisible(!isCartVisible)}
        className="fixed bottom-6 right-6 bg-rose-500 text-white p-4 rounded-full shadow-lg hover:bg-rose-600 transition-colors duration-300 z-40"
      >
        <FaShoppingCart size={24} />
      </button>

      {/* Cart Sidebar */}
      {isCartVisible && (
        <div className="fixed top-0 right-0 w-80 h-full bg-slate-50 shadow-lg p-6 overflow-y-auto z-50">
          <button
            onClick={() => setIsCartVisible(false)}
            className="absolute top-4 right-4 -mr-2 bg-gray-400 text-white px-2 rounded-full hover:bg-red-600 transition-colors duration-300"
          >
            X
          </button>
          <Cart cartItems={cartItems} removeFromCart={removeFromCart} />
        </div>
      )}
    </div>
  );
};

export default ShopPage;
