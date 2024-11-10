// pages/_app.tsx
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { CartProvider } from "../context/CartContext"; // Path to CartContext

function MyApp({ Component, pageProps }: AppProps) {
  return (

      <CartProvider> {/* Wrap with CartProvider */}
        <Component {...pageProps} />
      </CartProvider>
  );
}

export default MyApp;
