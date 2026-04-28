import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import StaffList from "@/components/admin/StaffList";
import AdminBookings from "@/components/admin/AdminBookings";
import { Users, ClipboardList, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const AdminPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"staff" | "bookings">("staff");
  const [pageLoading, setPageLoading] = useState(true);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
        return;
      }

      if (user.role !== "admin") {
        router.push("/unauthorized");
        return;
      }

      setPageLoading(false);
    }
  }, [user, loading, router]);

  if (loading || pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-rose-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-600" />
      </div>
    );
  }

  const tabs = [
    { key: "staff", label: "Manage Staff", icon: Users },
    { key: "bookings", label: "Manage Bookings", icon: ClipboardList },
  ] as const;

  return (
    <div className="min-h-screen bg-rose-50">
      <header className="border-b border-rose-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-rose-100 px-3 py-1 text-sm font-semibold text-rose-700">
              <ShieldCheck size={16} />
              Admin Panel
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-800">
              Salon management dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Manage staff details and monitor customer bookings in one place.
            </p>
          </div>

          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : "border border-rose-200 bg-white text-slate-700 hover:bg-rose-50"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "staff" ? <StaffList staffList={[]} handleAddStaff={() => {}} handleDeleteStaff={() => {}} /> : <AdminBookings bookings={[]} editBooking={() => {}} email={user?.email ?? ""} />}
      </main>
    </div>
  );
};

export default AdminPage;
