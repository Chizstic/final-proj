// components/Unauthorized.tsx
import { useRouter } from "next/router";
import { useAuth } from "../context/AuthContext"; // Adjust the path if needed

const Unauthorized = () => {
  const { logout } = useAuth(); // Access logout function from AuthContext
  const router = useRouter();

  const handleBackToLogin = () => {
    logout(); // Ensure the user is logged out
    router.push("/login"); // Redirect to the login page
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Unauthorized</h1>
      <p>You do not have permission to access this page.</p>
      <button
        onClick={handleBackToLogin}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#0070f3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default Unauthorized;
