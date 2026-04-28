import React, { useEffect, useState } from "react";
import { Bookings } from "@/types";
import Footer from "@/components/layout/Footer";
import SalonHeader from "@/components/layout/SalonHeader";
import { Calendar, Clock, Briefcase, Users, CreditCard, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

const UserProfile: React.FC = () => {
  const [bookings, setBookings] = useState<Bookings[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (!user?.email) return;

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

    fetchBookings();
  }, [user]);

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
