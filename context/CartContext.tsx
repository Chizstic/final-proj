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
  const { user, logout } = useAuth(); // Get the logout function and user data from AuthContext
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Calculate the cart count
  const cartCount = cart.length;

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => [...prevCart, item]);
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  // Fetch cart data when user logs in, otherwise use localStorage cart
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    // If a user is logged in, fetch their cart from the database
    if (user) {
      // Fetch the cart from the server based on user email
      fetchCartFromDatabase(user.email);
    } else if (storedCart) {
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
  const fetchCartFromDatabase = async (email: string) => {
    try {
      const response = await fetch(`/api/cart?email=${email}`);
      if (!response.ok) {
        throw new Error('Failed to fetch cart data');
      }
      const result = await response.json();
      const fetchedCart = result.cart || [];
      setCart(fetchedCart);
      localStorage.setItem("cart", JSON.stringify(fetchedCart)); // Store in localStorage
    } catch (error) {
      console.error('Error fetching cart from database:', error);
    }
  };

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
