import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Removed Spinner component since it's no longer needed

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      return; // No error message will be displayed
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return; // No error message will be displayed
    }

    setLoading(true); // Set loading to true when the button is clicked

    // Send data to the backend
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'client' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong'); // No error message will be displayed
      }

      // If registration is successful
      // setSuccess('Sign up successful! You can now log in.');

      // Simulate a redirect to login after successful sign-up
      setTimeout(() => {
        router.push('/login');
      }, 1000); // Redirect after 1 second
    } catch (err) {
      console.error(err); // Error is logged but not shown to the user
    } finally {
      setLoading(false); // Reset loading state after completion
    }
  };

  return (
    <div className="flex h-screen justify-center items-center bg-slate-100">
      <div className="flex items-center justify-center w-full">
        <div className="w-full max-w-md bg-pink-300 bg-opacity-30 p-12 rounded-lg shadow-md">
          <div className="w-full flex flex-col mb-10">
            <h3 className="text-4xl font-extrabold mb-2 text-center">
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text">Sign Up</span>
            </h3>
          </div>
          <form onSubmit={handleSignUp}>
            <div className="mb-4 opacity-95 text-slate-700">
              <label htmlFor="email" className="block text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="mb-4 opacity-95 text-slate-700">
              <label htmlFor="password" className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="mb-4 opacity-95 text-slate-700">
              <label htmlFor="confirmPassword" className="block text-sm font-semibold mb-2">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                placeholder="Confirm your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-pink-500 bg-opacity-80 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 transition duration-300 flex items-center justify-center"
            >
              {loading ? 'Signing up...' : 'Sign Up'} {/* Change made here */}
            </button>
            {/* {success && <p className="text-green-500 mt-4 text-center">{success}</p>} */}
          </form>
          <p className="mt-4 text-center text-slate-700">
            Already have an account? <Link href="/login" className="text-pink-500 hover:text-pink-700">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
