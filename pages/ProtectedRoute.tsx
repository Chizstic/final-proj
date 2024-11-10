// components/ProtectedRoute.tsx
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext"; // Path to useAuth hook

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useAuth(); // Access the user from AuthContext
  const router = useRouter();

  // If user is not authenticated, redirect to login
  if (!user) {
    router.push("/login"); // Change '/login' to your actual login page route
    return null; // Return null while redirecting
  }

  return <>{children}</>; // Render the children if the user is authenticated
};

export default ProtectedRoute;
