import React, { useEffect, useState } from 'react';
import { Bookings } from './api/type';
import Footer from './components/footer';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { User, Calendar, Clock, Briefcase, Users, CreditCard } from 'lucide-react';
import { HiHashtag } from 'react-icons/hi';
import { BiWorld } from 'react-icons/bi';
import { BsGenderAmbiguous } from 'react-icons/bs';

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
    setIsEditing(true);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 to-pink-500">
      <header className="sticky top-0 z-50 shadow-md bg-white">
        <nav className="flex items-center justify-between flex-wrap p-6 h-24">
          <div className="header-background flex items-center flex-shrink-0 text-white mr-6">
            <Image src="/logo.png" alt="" className="rounded-full" width={60} height={60} />
            <div className="flex flex-row ml-6 items-center">
              <span className="font-bold text-2xl tracking-tight" style={{ color: '#D20062', fontFamily: 'Serif' }}>Guys & Gals</span>
              <span className="font-bold text-2xl tracking-tight ml-2" style={{ color: '#D6589F', fontFamily: 'Serif' }}>Salon</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 relative">
            <button onClick={toggleDropdown} className="flex items-center text-rose-600 text-xl py-2 px-4 rounded-md font-semibold hover:text-rose-500 transition duration-300">
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
        <div className="bg-white shadow-lg overflow-hidden">
          <div className="bg-pink-500 text-white p-5 h-44">
            <div className="flex items-center justify-start">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mr-5">
                <User size={64} className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold">{profileInfo?.name || ''}</h2>
                <p className="text-pink-200 text-lg">{email}</p>
                <button onClick={handleEditProfile} className="bg-pink-600 text-white p-2 rounded mt-4">Edit Profile</button>
              </div>
            </div>
          </div>

          <div className="p-10">
            {isEditing ? (
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-pink-600">Edit Profile</h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Name"
                    value={name || ''}
                    onChange={(e) => setName(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={age || ''}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Sex"
                    value={sex || ''}
                    onChange={(e) => setSex(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <input
                    type="text"
                    placeholder="Address"
                    value={address || ''}
                    onChange={(e) => setAddress(e.target.value)}
                    className="border p-2 w-full"
                  />
                 <input
                  type="text"
                  value={contactNumber || ''}
                  onChange={(e) => setContactNumber(e.target.value)}
                  className="border border-gray-300 p-2 rounded w-full"
                  maxLength={11} // Limit the input to 11 characters
                  placeholder="Enter 11-digit contact number"
                />
                  <button onClick={handleSaveProfile} className="bg-pink-600 text-white p-2 rounded">Save</button>
                  <button onClick={handleCancelEdit} className="bg-gray-300 text-white p-2 rounded ml-3">Cancel</button>
                </div>
              </div>
            ) : (
              <div>
              <h3 className="text-2xl font-semibold text-pink-600">Profile Information</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Users size={24} className="text-pink-600 mr-2" />
                  <span className="font-medium">Name:</span> {profileInfo?.name}
                </div>
                <div className="flex items-center">
                  <Clock size={24} className="text-pink-600 mr-2" />
                  <span className="font-medium">Age:</span> {profileInfo?.age}
                </div>
                <div className="flex items-center">
                  <BsGenderAmbiguous size={24} className="text-pink-600 mr-2" />
                  <span className="font-medium">Sex:</span> {profileInfo?.sex}
                </div>
                <div className="flex items-center">
                  <BiWorld size={24} className="text-pink-600 mr-2" />
                  <span className="font-medium">Address:</span> {profileInfo?.address}
                </div>
                <div className="flex items-center">
                  <HiHashtag size={24} className="text-pink-600 mr-2" />
                  <span className="font-medium">Contact Number:</span> {profileInfo?.contact_number}
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
        <div className="p-10">
  <h3 className="text-2xl font-semibold mb-6 text-pink-600">Your Bookings</h3>
  {bookings.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bookings.map((booking) => (
        <div key={booking.bookingID} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition duration-300">
          <div className="flex items-center mb-4">
            <Calendar size={20} className="text-pink-600 mr-2" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-pink-600 mr-2" />
            <span>{booking.time}</span>
          </div>
          <div className="flex items-center mb-4">
            <Briefcase size={20} className="text-pink-600 mr-2" />
            <span>{booking.services}</span>
          </div>
          <div className="flex items-center mb-4">
            <Users size={20} className="text-pink-600 mr-2" />
            <span>{booking.staffname}</span>
          </div>
          <div className="flex items-center mb-4">
            <CreditCard size={20} className="text-pink-600 mr-2" />
            <span>{booking.paymentmethod}</span>
          </div>
          <div className="flex items-center mb-4">
            <Clock size={20} className="text-pink-600 mr-2" />
            <span>Created at: {new Date(booking.created_at).toLocaleString()}</span>
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