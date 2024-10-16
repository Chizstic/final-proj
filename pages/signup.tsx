import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState('');

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

    // Send data to the backend
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, role: 'user' }), // Assume role as 'user' by default
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong'); // No error message will be displayed
      }

      // If registration is successful
      setSuccess('Sign up successful! You can now log in.');
      
      // Simulate a redirect to login after successful sign-up
      setTimeout(() => {
        router.push('/login');
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      console.error(err); // Error is logged but not shown to the user
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
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
          <div className="mb-4">
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
          <div className="mb-4">
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
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition duration-300"
          >
            Sign Up
          </button>
          {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
        </form>
        <p className="mt-4 text-center">
          Already have an account? <Link href="/login" className="text-teal-500 hover:text-teal-700">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
