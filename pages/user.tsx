import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';
import Footer from './components/footer';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { Calendar, Clock, Briefcase, Users, CreditCard } from 'lucide-react';
import { HiHashtag } from 'react-icons/hi';
import { BiWorld } from 'react-icons/bi';
import { BsGenderAmbiguous } from 'react-icons/bs';
import Link from 'next/link';


const UserProfile: React.FC = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [age, setAge] = useState<number | null>(null);
  const [sex, setSex] = useState<string | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [contactNumber, setContactNumber] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileInfo, setProfileInfo] = useState<Profile | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  interface Profile {
    name: string;
    age: number;
    sex: string;
    address: string;
    contact_number: string;
  }


  
  const fetchProfile = async (email: string) => {
    try {
      const response = await fetch(`/api/profile?email=${email}`);
      if (response.ok) {
        const data = await response.json();
        setProfileInfo(data.profile);  // Assuming the response contains the profile data
      } else {
        throw new Error('Profile fetch failed');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    }
  };

 useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setEmail(storedEmail);
      fetchBookings(storedEmail);  // Pass the email here
      fetchProfile(storedEmail);    // Fetch the profile using the email
    }
  }, []);

  const toggleDetails = () => {
    setShowDetails((prevState) => !prevState);
  };

  const fetchBookings = async (userEmail: string) => { // Change here to accept email as a parameter
    setLoading(true);
    try {
      const response = await fetch('/api/booking');
      if (!response.ok) {
        throw new Error('Failed to fetch bookings: ' + response.statusText);
      }
      const data: Bookings[] = await response.json();
      console.log('All bookings:', data);

      // Use the provided userEmail instead of the component state
      const userBookings = data.filter(booking => booking.email === userEmail);
      console.log('User bookings:', userBookings);
      setBookings(userBookings);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching bookings:', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setDropdownVisible((prev) => !prev);
  };

  const handleProfileClick = () => {
    window.location.href = '/user';
  };

  const handleEditProfile = () => {
    // If profile is already in editing mode, toggle it off (hide edit form)
    setIsEditing((prevState) => !prevState);
  };

  const handleSaveProfile = async () => {
    const profileData = {
      email,
      name,
      age,
      sex,
      address,
      contact_number: contactNumber,
    };
  
    const response = await fetch(`/api/profile?email=${email}`);
    const data = await response.json();
  
    if (data && data.profile) {
      const updateResponse = await fetch(`/api/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (updateResponse.ok) {
        const updatedProfile = await updateResponse.json();
        setProfileInfo(updatedProfile.profile);
      } else {
        console.error('Failed to update profile');
      }
    } else {
      const createResponse = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });
      if (createResponse.ok) {
        const newProfile = await createResponse.json();
        setProfileInfo(newProfile.profile);
      } else {
        console.error('Failed to create profile');
      }
      if (contactNumber && contactNumber.length !== 11) {
        alert("Contact number must be exactly 11 digits.");
      }
    }

    // Close the edit form after saving
    setIsEditing(false);
  };  
  const handleCancelEdit = () => {
    // Close the edit form and reset the inputs to original profile data
    setName(profileInfo?.name || '');
    setAge(profileInfo?.age || 0);
    setSex(profileInfo?.sex || '');
    setAddress(profileInfo?.address || '');
    setContactNumber(profileInfo?.contact_number || '');
    setIsEditing(false);
  };

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-x-4 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-purple-100 to-indigo-100">
        <div className="text-red-500 text-center">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br bg-slate-100">
      <header className="sticky top-0 z-50 shadow-md" style={{ backgroundColor: 'rgba(251, 207, 232, 0.2)' }}>
  <nav className="flex items-center justify-between flex-wrap p-6 h-24">
    <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
      <Image src="/logo.png" alt="Logo" className="rounded-full" width={60} height={60} />
      <div className="flex flex-col sm:flex-row ml-6 items-center">
        <span className="font-bold text-xl sm:text-lg tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>
          Guys & Gals
        </span>
        <span className="font-bold text-xl sm:text-lg tracking-tight mt-2 sm:mt-0 ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>
          Salon
        </span>
      </div>
    </div>

    <div className="flex items-center space-x-4 relative">
      <div className="hidden sm:flex space-x-6 text-lg sm:text-xl">
      <Link href="/homepage" className="text-rose-600 hover:text-rose-500 font-semibold transition duration-300">
  Home
</Link>

      </div>

      <button onClick={toggleDropdown} className="flex items-center text-rose-600 text-lg sm:text-xl py-2 px-4 rounded-md font-semibold hover:text-rose-500 transition duration-300">
        <FaUser size={30} className="mr-2" />
      </button>

      {dropdownVisible && (
        <div className="absolute right-0 mt-32 w-48 bg-white rounded-md shadow-lg">
          <button
            onClick={handleProfileClick}
            className="block px-4 py-2 text-gray-800 hover:bg-rose-100 w-full text-left"
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="block px-4 py-2 text-gray-800 hover:bg-rose-100 w-full text-left"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  </nav>
</header>



<main>
  <div className="bg-rose-400 shadow-lg overflow-hidden">
  <div className="bg-rose-400 text-white p-5 sm:p-6 md:p-8  md:h-40 lg:h-40 sm:h-32 ">
  <div className="flex items-center justify-start">
    <div>
      <h2 className="text-3xl sm:text-2xl md:text-3xl font-semibold">{profileInfo?.name || ''}</h2>
      <p className="text-pink-200 text-lg sm:text-sm md:text-lg">{email}</p>
      <button
        onClick={toggleDetails}
        className="mt-2 bg-rose-600 bg-opacity-65 hover:bg-rose-500 text-white p-2 text-sm sm:text-base rounded">
        Details
      </button>

      <button 
        onClick={handleEditProfile} 
        className="mt-2 ml-2 bg-rose-600 hover:bg-rose-500 text-white p-2 text-sm sm:text-base rounded">
        Edit Profile
      </button>
    </div>
  </div>
</div>


    <div className="">
      {isEditing ? (
        <div className="bg-white w-full p-10">
          <h3 className="text-2xl font-semibold mb-6 text-pink-600">Edit Profile</h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name || ''}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full sm:w-2/3 md:w-1/2"
            />
            <input
              type="number"
              placeholder="Age"
              value={age || ''}
              onChange={(e) => setAge(Number(e.target.value))}
              className="border p-2 w-full sm:w-2/3 md:w-1/2"
            />
            <input
              type="text"
              placeholder="Sex"
              value={sex || ''}
              onChange={(e) => setSex(e.target.value)}
              className="border p-2 w-full sm:w-2/3 md:w-1/2"
            />
            <input
              type="text"
              placeholder="Address"
              value={address || ''}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-2 w-full sm:w-2/3 md:w-1/2"
            />
            <input
              type="text"
              value={contactNumber || ''}
              onChange={(e) => setContactNumber(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full sm:w-2/3 md:w-1/2"
              maxLength={11} // Limit the input to 11 characters
              placeholder="Enter 11-digit contact number"
            />
            <button onClick={handleSaveProfile} className="bg-pink-600 text-white p-2 rounded">Save</button>
            <button onClick={handleCancelEdit} className="bg-gray-300 text-white p-2 rounded ml-3">Cancel</button>
          </div>
        </div>
      ) : (
        showDetails && (
          <div className="bg-white w-full p-10 ">
            <h3 className="text-2xl font-semibold text-pink-600">Profile Information</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Users size={24} className="text-pink-600 mr-2" />
                <span className="font-medium">Name: </span>  {profileInfo?.name}
              </div>
              <div className="flex items-center">
                <Clock size={24} className="text-pink-600 mr-2" />
                <span className="font-medium">Age: </span> {profileInfo?.age}
              </div>
              <div className="flex items-center">
                <BsGenderAmbiguous size={24} className="text-pink-600 mr-2" />
                <span className="font-medium">Sex: </span> {profileInfo?.sex}
              </div>
              <div className="flex items-center">
                <BiWorld size={24} className="text-pink-600 mr-2" />
                <span className="font-medium">Address: </span> {profileInfo?.address}
              </div>
              <div className="flex items-center">
                <HiHashtag size={24} className="text-pink-600 mr-2" />
                <span className="font-medium">Contact Number: </span> {profileInfo?.contact_number}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  </div>

  <div className="p-10">
    <h3 className="text-2xl font-semibold mb-6 text-pink-600">Your Bookings</h3>
    {bookings.length > 0 ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
        {bookings.map((booking) => (
          <div key={booking.bookingid} className="bg-gray-50 p-6 rounded-lg shadow-inner shadow-rose-100">
            <div className="flex items-center mb-4">
              <span className="ml-2 text-gray-600 text-sm">
                {new Date(booking.created_at).toLocaleString('en-US', {
                  weekday: 'long', // Full weekday name (e.g. Monday)
                  year: 'numeric',
                  month: 'long', // Full month name (e.g. January)
                  day: 'numeric'
                })}
              </span>
            </div>
            {/* Separator Line */}
            <div className="border-t-2 border-gray-300 my-4"></div>
            <div className="flex items-center mb-4 text-slate-700">
              <Calendar size={20} className="text-pink-600 mr-2" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center mb-4 text-slate-700">
              <Clock size={20} className="text-pink-600 mr-2" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center mb-4 text-slate-700">
              <Briefcase size={20} className="text-pink-600 mr-2" />
              <span>{booking.services}</span>
            </div>
            <div className="flex items-center mb-4 text-slate-700">
              <Users size={20} className="text-pink-600 mr-2" />
              <span>{booking.staffname}</span>
            </div>
            <div className="flex items-center mb-4 text-slate-700">
              <CreditCard size={20} className="text-pink-600 mr-2" />
              <span>{booking.paymentmethod}</span>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500 text-xl">No bookings found.</p>
    )}
  </div>
</main>

      <Footer />
    </div>
  );
};

export default UserProfile;
