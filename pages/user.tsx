import React, { useEffect, useState } from "react";
import { Bookings } from "@/types";
import Footer from "@/components/layout/Footer";
import SalonHeader from "@/components/layout/SalonHeader";
import { Calendar, Clock, Briefcase, Users, CreditCard, ClipboardList, UserCircle2, MapPin, Phone, PencilLine, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

interface UserProfileData {
  email: string;
  name: string;
  age: number;
  sex: string;
  address: string;
  contact_number: string;
}

const UserProfile: React.FC = () => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [profileForm, setProfileForm] = useState<UserProfileData>({
    email: "",
    name: "",
    age: 0,
    sex: "",
    address: "",
    contact_number: "",
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(false);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.email) return;

    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const response = await fetch(`/api/profile?email=${encodeURIComponent(user.email)}`);

        if (response.status === 404) {
          setProfile(null);
          setProfileForm((prev) => ({
            ...prev,
            email: user.email,
          }));
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        const loadedProfile: UserProfileData = {
          email: data.profile.email,
          name: data.profile.name ?? "",
          age: Number(data.profile.age ?? 0),
          sex: data.profile.sex ?? "",
          address: data.profile.address ?? "",
          contact_number: data.profile.contact_number ?? "",
        };

        setProfile(loadedProfile);
        setProfileForm(loadedProfile);
      } catch (fetchError) {
        console.error("Profile fetch error:", fetchError);
      } finally {
        setProfileLoading(false);
      }
    };

    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/booking");
        if (!response.ok) {
          throw new Error("Failed to fetch bookings: " + response.statusText);
        }
        const data: Bookings[] = await response.json();
        const userBookings = data.filter((booking) => booking.email === user.email);
        setBookings(userBookings);
      } catch (fetchError) {
        const errorMessage =
          fetchError instanceof Error ? fetchError.message : "An error occurred";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
    fetchBookings();
  }, [user]);

  const handleProfileInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const method = profile ? "PUT" : "POST";
      const response = await fetch("/api/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save profile");
      }

      setProfile(data.profile);
      setProfileForm({
        email: data.profile.email,
        name: data.profile.name ?? "",
        age: Number(data.profile.age ?? 0),
        sex: data.profile.sex ?? "",
        address: data.profile.address ?? "",
        contact_number: data.profile.contact_number ?? "",
      });
      setIsEditingProfile(false);
      setProfileMessage("Profile saved successfully.");
    } catch (saveError) {
      setProfileMessage(
        saveError instanceof Error ? saveError.message : "Unable to save profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rose-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rose-50 px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-red-600">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-rose-50">
      <SalonHeader active="bookings" onLogout={logout} />

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
                My Profile
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-800">
                User credentials and details
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Open this section only when you want to review or update your
                personal details.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowProfileSection((prev) => !prev);
                setProfileMessage(null);
                if (profile) {
                  setProfileForm(profile);
                }
                if (showProfileSection) {
                  setIsEditingProfile(false);
                }
              }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
            >
              <UserCircle2 size={16} />
              {showProfileSection ? "Hide Profile" : "Show Profile"}
            </button>
          </div>

          {showProfileSection ? (
            <div className="mt-6">
          {isEditingProfile || !profile ? (
            <form onSubmit={handleProfileSave} className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <UserCircle2 size={16} className="text-rose-600" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileInputChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  required
                  disabled={profileLoading || profileSaving}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <PencilLine size={16} className="text-rose-600" />
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={profileForm.age || ""}
                  onChange={handleProfileInputChange}
                  placeholder="Enter your age"
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  min={1}
                  max={150}
                  required
                  disabled={profileLoading || profileSaving}
                />
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Users size={16} className="text-rose-600" />
                  Sex
                </label>
                <select
                  name="sex"
                  value={profileForm.sex}
                  onChange={handleProfileInputChange}
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  required
                  disabled={profileLoading || profileSaving}
                >
                  <option value="">Select sex</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Phone size={16} className="text-rose-600" />
                  Contact Number
                </label>
                <input
                  type="text"
                  name="contact_number"
                  value={profileForm.contact_number}
                  onChange={handleProfileInputChange}
                  placeholder="Enter your contact number"
                  className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  required
                  disabled={profileLoading || profileSaving}
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin size={16} className="text-rose-600" />
                  Address
                </label>
                <textarea
                  name="address"
                  value={profileForm.address}
                  onChange={handleProfileInputChange}
                  placeholder="Enter your complete address"
                  className="min-h-[120px] w-full rounded-2xl border border-rose-200 px-4 py-4 text-slate-700 outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                  required
                  disabled={profileLoading || profileSaving}
                />
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  {profileMessage ? (
                    <span
                      className={
                        profileMessage.toLowerCase().includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {profileMessage}
                    </span>
                  ) : (
                    <span>
                      {profile ? "Update your saved profile anytime." : "Add your details to create your profile."}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  {profile && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setProfileMessage(null);
                        setProfileForm(profile);
                      }}
                      className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                      disabled={profileSaving}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={profileLoading || profileSaving}
                  >
                    <Save size={16} />
                    {profileSaving ? "Saving..." : profile ? "Update Profile" : "Save Profile"}
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-rose-50 p-5">
                <p className="mb-2 text-sm font-semibold text-slate-500">Full Name</p>
                <p className="text-base font-semibold text-slate-800">{profile.name}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5">
                <p className="mb-2 text-sm font-semibold text-slate-500">Age</p>
                <p className="text-base font-semibold text-slate-800">{profile.age}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5">
                <p className="mb-2 text-sm font-semibold text-slate-500">Sex</p>
                <p className="text-base font-semibold text-slate-800">{profile.sex}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5">
                <p className="mb-2 text-sm font-semibold text-slate-500">Contact Number</p>
                <p className="text-base font-semibold text-slate-800">{profile.contact_number}</p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5 md:col-span-2">
                <p className="mb-2 text-sm font-semibold text-slate-500">Address</p>
                <p className="text-base font-semibold text-slate-800">{profile.address}</p>
              </div>

              <div className="md:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-slate-600">
                  {profileMessage ? (
                    <span
                      className={
                        profileMessage.toLowerCase().includes("success")
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {profileMessage}
                    </span>
                  ) : (
                    <span>Your saved profile details are shown here.</span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(true);
                    setProfileMessage(null);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
                >
                  <PencilLine size={16} />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
            </div>
          ) : null}
        </section>

        <section className="rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
                My Booking History
              </p>
              <h1 className="mt-2 text-3xl font-bold text-slate-800">
                Keep track of your salon appointments.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Review your date, time, service, assigned staff, payment method,
                and current status in one clear place.
              </p>
            </div>

            <div className="rounded-2xl bg-rose-50 px-5 py-4 text-left">
              <p className="text-sm text-slate-500">Total bookings</p>
              <p className="text-3xl font-bold text-rose-700">{bookings.length}</p>
            </div>
          </div>
        </section>

        <section className="mt-8">
          {bookings.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {bookings.map((booking) => (
                <article
                  key={booking.bookingid}
                  className="rounded-3xl border border-rose-100 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Booking #{booking.bookingid}</p>
                      <p className="mt-1 text-lg font-bold text-slate-800">
                        {new Date(booking.created_at).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Ongoing"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="mt-6 space-y-4 text-slate-700">
                    <div className="flex items-start gap-3">
                      <Calendar size={18} className="mt-1 text-rose-600" />
                      <div>
                        <p className="text-sm text-slate-500">Appointment date</p>
                        <p className="font-medium">{booking.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="mt-1 text-rose-600" />
                      <div>
                        <p className="text-sm text-slate-500">Time</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase size={18} className="mt-1 text-rose-600" />
                      <div>
                        <p className="text-sm text-slate-500">Services</p>
                        <p className="font-medium">{booking.services}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users size={18} className="mt-1 text-rose-600" />
                      <div>
                        <p className="text-sm text-slate-500">Assigned staff</p>
                        <p className="font-medium">{booking.staffname}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CreditCard size={18} className="mt-1 text-rose-600" />
                      <div>
                        <p className="text-sm text-slate-500">Payment method</p>
                        <p className="font-medium">{booking.paymentmethod}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <ClipboardList className="mx-auto text-rose-500" size={32} />
              <h2 className="mt-4 text-2xl font-bold text-slate-800">
                No bookings yet
              </h2>
              <p className="mt-2 text-slate-600">
                Once you book a service, your appointment details will appear
                here.
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="mt-6 rounded-full bg-rose-600 px-6 py-3 font-semibold text-white transition hover:bg-rose-700"
              >
                Browse Services
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default UserProfile;
