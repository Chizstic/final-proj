import React from "react";
import BookingForm from "@/components/booking/BookingForm";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";
import SalonHeader from "@/components/layout/SalonHeader";

const BookingFormPage: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  return (
    <div className="min-h-screen bg-rose-50">
      <SalonHeader active="bookingform" onLogout={logout} />
      <main className="px-4 py-10 sm:px-6">
        <BookingForm bookingid={0} email={user?.email ?? ""} servicePrice={0} />
      </main>
    </div>
  );
};

export default BookingFormPage;
