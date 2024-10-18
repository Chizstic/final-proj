import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setSuccess('Login successful! Redirecting...');
  
        const { role } = data.user; // Access role from data.user
        setTimeout(() => {
          if (role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/homepage');
          }
        }, 2000);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleLogin}>
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
          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 px-4 rounded-md font-semibold hover:bg-teal-600 transition duration-300"
          >
            Login
          </button>
          {success && <p className="text-green-500 mt-4 text-center">{success}</p>}
          {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        </form>
        <p className="mt-4 text-center">
          Don&#39;t have an account? <Link href="/signup" className="text-teal-500 hover:text-teal-700">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
