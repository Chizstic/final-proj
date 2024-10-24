import React, { useEffect, useState } from 'react';

const UserProfile: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve user information from localStorage
    const storedEmail = localStorage.getItem('user_email');
    const storedName = localStorage.getItem('userName');
    const storedRole = localStorage.getItem('userRole');

    if (storedEmail) setEmail(storedEmail);
    if (storedName) setName(storedName);
    if (storedRole) setRole(storedRole);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user_email');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login'; // Redirect to login
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-6 shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hello, {name}</h1>
          <span className="text-lg">Welcome back, {name || 'Guest'}.</span>
        </div>
        <div className="flex items-center">
          <span className="mr-4">{email || 'Loading...'}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4 text-purple-600">User Profile</h2>
          {/* You can add more user details or functionality here */}
        </div>
      </main>

      <footer className="bg-gray-800 text-white p-6 mt-6 text-center">
        <p>&copy; 2024 Guys & Gals Salon. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default UserProfile;
