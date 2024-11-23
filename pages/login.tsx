import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';



const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { role, userId } = data.user; // Assume the API response contains userId

        // Store user-specific information in local storage
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userId', userId);

        setTimeout(() => {
          router.push(role === 'admin' ? '/admin' : '/homepage');
        }, 2000);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen justify-center items-center bg-slate-100 px-4">
  {/* Left Section (Text) - Hidden on mobile devices */}
  <div className="hidden md:flex flex-col items-center justify-center w-full md:w-1/2 p-6 md:p-8 text-center md:text-left">
    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
      <span className="text-[#D20062] font-serif">Guys & Gals</span>
      <span className="text-[#D6589F] font-serif"> Salon</span>
    </h1>
    <p className="text-base sm:text-lg md:text-2xl text-black mb-6 sm:mb-8">
      Get ready to be served what you deserve.
    </p>
  </div>

  {/* Right Section (Login Form) */}
  <div className="flex items-center justify-center w-full md:w-1/2">
    <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-pink-300 bg-opacity-30 p-6 sm:p-8 md:p-12 rounded-lg shadow-md">
      <div className="flex flex-col mb-6">
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-center">
          <span className="bg-gradient-to-r from-pink-400 to-pink-600 text-transparent bg-clip-text">
            Login
          </span>
        </h3>
      </div>
      <form onSubmit={handleLogin}>
        <div className="mb-4 text-slate-700">
          <label
            htmlFor="email"
            className="block text-sm font-semibold mb-2  "
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-4 text-slate-700">
          <label
            htmlFor="password"
            className="block text-sm font-semibold mb-2"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-400 focus:outline-none"
            placeholder="********"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-pink-500 bg-opacity-80 text-white py-2 px-4 rounded-md font-semibold hover:bg-pink-600 transition duration-300"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </form>
      <p className="mt-4 text-center text-slate-700">
        Don&apos;t have an account?{' '}
        <Link
          href="/signup"
          className="text-pink-500 hover:text-pink-700 transition duration-200"
        >
          Sign up for free!
        </Link>
      </p>
    </div>
  </div>
</div>

  );
};

export default LoginPage;
