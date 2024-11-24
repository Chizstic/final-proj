// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "../context/CartContext"; // Path to CartContext
import { AuthProvider } from "../context/AuthContext"; // Path to AuthContext

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider> {/* Wrap with AuthProvider */}
      <CartProvider> {/* Wrap with CartProvider */}
        <Component {...pageProps} />
      </CartProvider>
    </AuthProvider>
  );
}

export default MyApp;
