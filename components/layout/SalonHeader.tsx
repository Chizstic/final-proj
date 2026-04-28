import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, CalendarDays, LogOut } from "lucide-react";
import { useState } from "react";

interface SalonHeaderProps {
  active: "home" | "bookings" | "bookingform";
  onLogout: () => void;
}

function SalonHeader({ active, onLogout }: SalonHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "/homepage", label: "Home", key: "home", icon: Home },
    { href: "/user", label: "My Bookings", key: "bookings", icon: CalendarDays },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b border-rose-200 bg-white/90 backdrop-blur">
      <div className="bg-rose-100 px-4 py-2 text-center text-sm font-medium text-rose-700">
        Call Us: +63 998 9099 129 | Open Daily for salon and spa services
      </div>

      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/homepage" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="Guys & Gals Salon"
            width={56}
            height={56}
            className="rounded-full border border-rose-200"
          />
          <div className="leading-tight">
            <p className="text-xl font-bold text-rose-700 sm:text-2xl">
              Guys & Gals Salon
            </p>
            <p className="text-sm text-slate-600">
              Friendly beauty care for every age
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-rose-600 text-white"
                    : "border border-rose-200 bg-white text-slate-700 hover:bg-rose-50"
                }`}
              >
                <Icon size={16} />
                {item.label}
              </Link>
            );
          })}

          <button
            onClick={onLogout}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-rose-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-rose-200 bg-white text-rose-700 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-rose-100 bg-white px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = active === item.key;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-semibold ${
                    isActive
                      ? "bg-rose-600 text-white"
                      : "bg-rose-50 text-slate-700"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-left text-base font-semibold text-slate-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default SalonHeader;
