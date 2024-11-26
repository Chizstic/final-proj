import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext"; // Import the useAuth hook

interface CartItem {
  quantity: number;
  id: number;
  title: string;
  price: string;
  type: "service" | "combo"; // For identifying if it's a service or combo
}

interface CartContextProps {
  cart: CartItem[];
  cartCount: number; // Add cartCount to track the number of items in the cart
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user} = useAuth(); // Get the logout function and user data from AuthContext
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Calculate the cart count
  const cartCount = cart.length;

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Fetch cart data when user logs in, otherwise use localStorage cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    // If a user is logged in, fetch their cart from the database
    if (storedCart) {
      // If no user is logged in, use cart from localStorage
      const parsedCart = JSON.parse(storedCart);
      setCart(parsedCart);
    }

    // Handle logout - clear cart from state and localStorage
    const handleLogout = () => {
      localStorage.removeItem("cart");
      setCart([]); // Clear the cart in the state as well
    };

    if (!user) {
      handleLogout();
    }

    return () => {
      if (!user) {
        handleLogout(); // Clear cart on logout
      }
    };
  }, [user]);

  // Function to fetch cart data from database


  return (
    <CartContext.Provider value={{ cart, cartCount, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextProps => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
