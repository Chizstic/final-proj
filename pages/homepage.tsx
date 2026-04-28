import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { Scissors, Sparkles, HeartHandshake, Clock3, CheckCircle2 } from "lucide-react";
import Footer from "@/components/layout/Footer";
import SalonHeader from "@/components/layout/SalonHeader";
import Services from "@/components/services/Services";
import { useAuth } from "../context/AuthContext";

function Homepage() {
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const [showNotice, setShowNotice] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!showNotice) return;
    const timer = setTimeout(() => setShowNotice(false), 5000);
    return () => clearTimeout(timer);
  }, [showNotice]);

  const handleBookNowClick = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
      setShowNotice(true);
    }
  };

  const handleCategoryClick = () => {
    if (servicesRef.current) {
      servicesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const categories = [
    { title: "Hair Care", image: "/Hair_Care.png", icon: Scissors },
    { title: "Spa", image: "/Spa.png", icon: HeartHandshake },
    { title: "Hair & Make-up", image: "/HnM.jpg", icon: Sparkles },
    { title: "Nail Care", image: "/Nail Care.png", icon: Sparkles },
  ];

  const benefits = [
    "Relaxing and rejuvenating experience",
    "Skilled and certified professionals",
    "High-quality salon and spa products",
    "Comfortable service for young and older clients",
  ];

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800">
      <SalonHeader active="home" onLogout={logout} />

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-black/35" />
          <Image
            src="/coverphoto1.jpg"
            alt="Salon interior and beauty service"
            fill
            className="object-cover"
            priority
          />

          <div className="relative mx-auto flex min-h-[540px] max-w-6xl items-center justify-end px-4 py-20 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white lg:ml-auto">
              <p className="mb-4 inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur">
                Friendly beauty care for everyone
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                Feel fresh, confident, and cared for.
              </h1>
              <p className="mt-5 max-w-xl text-base text-rose-50 sm:text-lg">
                Simple booking, clear prices, and a warm salon experience for
                teens, adults, and older clients.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={handleBookNowClick}
                  className="rounded-full bg-rose-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-rose-700"
                >
                  Book a Service
                </button>
                <button
                  onClick={() => router.push("/user")}
                  className="rounded-full border border-white/60 bg-white/10 px-6 py-3 text-base font-semibold text-white backdrop-blur transition hover:bg-white/20"
                >
                  View My Bookings
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.title}
                  onClick={handleCategoryClick}
                  className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-rose-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full border border-rose-100">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">{category.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">
                    Tap to explore available services.
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-rose-500">
              Why clients choose us
            </p>
            <h2 className="text-3xl font-bold text-slate-800">
              Easy to understand, easy to book, easy to enjoy.
            </h2>
            <p className="mt-4 text-base leading-7 text-slate-600">
              Our salon offers hair care, spa services, make-up, and nail care
              in a calm, welcoming space. We keep the booking steps simple so
              every client can move through the system comfortably.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-rose-50 p-5">
                <Scissors className="mb-3 text-rose-600" size={22} />
                <p className="font-semibold text-slate-800">Beauty Services</p>
                <p className="mt-1 text-sm text-slate-600">
                  Hair, nails, spa, and special occasion care.
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5">
                <Clock3 className="mb-3 text-rose-600" size={22} />
                <p className="font-semibold text-slate-800">Simple Booking</p>
                <p className="mt-1 text-sm text-slate-600">
                  Pick services first, then continue to your appointment form.
                </p>
              </div>
              <div className="rounded-2xl bg-rose-50 p-5">
                <HeartHandshake className="mb-3 text-rose-600" size={22} />
                <p className="font-semibold text-slate-800">Warm Experience</p>
                <p className="mt-1 text-sm text-slate-600">
                  Comfortable support for first-time and returning clients.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-rose-700">Our Benefits</h2>
            <ul className="mt-5 space-y-4">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3 text-slate-700">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-rose-600" size={20} />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>

            <div className="mt-8 rounded-2xl border border-rose-100 bg-rose-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Helpful note</p>
              <p className="mt-2">
                Prices shown are minimum rates and may change depending on hair
                length or additional treatment needs.
              </p>
            </div>
          </div>
        </section>

        <section ref={servicesRef} className="scroll-mt-28">
          <Services />
        </section>

        {showNotice && (
          <div className="fixed bottom-6 right-6 z-50 max-w-xs rounded-2xl bg-rose-600 px-5 py-4 text-sm font-medium text-white shadow-xl">
            Please choose one or more services below before continuing.
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Homepage;
