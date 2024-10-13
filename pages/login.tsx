import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send the email and password to the backend for authentication
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error response from the server (e.g., invalid credentials)
        return; // Just return and do nothing
      }

      // If login is successful, store user information in localStorage
      localStorage.setItem('userEmail', data.user.email);
      localStorage.setItem('userRole', data.user.role);

      // Redirect based on user role
      if (data.user.role === 'admin') {
        router.push('/admin'); // Redirect to admin page
      } else {
        router.push('/homepage'); // Redirect to homepage
      }
    } catch (error) {
      console.error('Login error:', error); // Log the error if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-100">
    {/* Left Side */}
    <div className="flex flex-col items-center lg:items-start justify-center w-full lg:w-1/2 p-8">
      <h1
        className="text-4xl lg:text-6xl font-bold mr-10 text-center lg:text-right select-none"
        style={{ fontFamily: 'Serif' }}
      >
        <span style={{ color: '#D20062' }}>Guys & Gals</span>
        <span style={{ color: '#D6589F' }}> Salon</span>
      </h1>
      <p className="text-lg lg:text-2xl text-black mb-8 text-center lg:text-left select-none"> 
        Get ready to be served what you deserve.
      </p>
    </div>
    {/* Right Side */}
    <div className="flex flex-1 items-center justify-center w-full lg:w-1/2 p-4">
      <div className="w-full max-w-md bg-pink-300 bg-opacity-30 p-8 lg:p-12 rounded-lg shadow-md">
        <h3 className="text-3xl lg:text-4xl font-extrabold mb-4 text-center">
          <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text select-none">
            Login
          </span>
        </h3>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-pink-500'} bg-opacity-80 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 transition duration-300`}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'LOG IN'}
          </button>
        </form>
        <p className="mt-4 text-center select-none">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-pink-500 hover:text-pink-700">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default LoginPage;
