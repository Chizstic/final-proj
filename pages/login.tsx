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
      localStorage.setItem('userName', data.user.name); // Use name from response

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
    <div className="flex min-h-screen bg-slate-100">
      {/* Left Side */}
      <div className="-mt-36 flex flex-col items-start justify-center w-1/2 p-8 ml-72">
        <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: 'Serif' }}>
          <span style={{ color: '#D20062' }}>Guys & Gals</span>
          <span style={{ color: '#D6589F' }}> Salon</span>
        </h1>
        <p className="text-2xl text-black mb-8 ml-2">Get ready to be served what you deserve.</p>
      </div>
      {/* Right Side */}
      <div className="flex items-center justify-end w-1/2 p-4 mr-48">
        <div className="w-full max-w-md bg-pink-300 bg-opacity-30 p-12 rounded-lg shadow-md">
          <div className='w-full flex flex-col mb-10'>
            <h3 className='text-4xl font-extrabold mb-2 text-center'>
              <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text">Login</span>
            </h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4 opacity-95">
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
            <div className="mb-4 opacity-95">
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
            <button
              type="submit"
              className={`w-full ${loading ? 'bg-gray-400' : 'bg-pink-500'} bg-opacity-80 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 transition duration-300`}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'LOG IN'}
            </button>
          </form>
          <p className="mt-4 text-center">
            Don&apos;t have an account? <Link href="/signup" className="text-pink-500 hover:text-pink-700">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
