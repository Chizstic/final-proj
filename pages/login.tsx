import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user);
      } else {
        setError("Invalid email or password");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50">
      <div className="mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <section className="hidden lg:block">
          <div className="max-w-xl">
            <p className="inline-flex rounded-full bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700">
              Welcome back
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-800">
              Salon booking made simple and comfortable.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              Sign in to browse services, book appointments, and review your
              salon visits with a clear and friendly system.
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] bg-white p-6 shadow-sm sm:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <Image
              src="/logo.png"
              alt="Guys & Gals Salon"
              width={84}
              height={84}
              className="rounded-full border border-rose-200"
            />
            <h2 className="mt-4 text-3xl font-bold text-rose-700">
              Guys & Gals Salon
            </h2>
            <p className="mt-2 text-base text-slate-600">Login to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="text-slate-700">
              <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="text-slate-700">
              <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-rose-600 py-4 text-lg font-semibold text-white transition hover:bg-rose-700"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-center text-red-600">{error}</p>}
          </form>

          <p className="mt-6 text-center text-slate-700">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-rose-600 hover:text-rose-700">
              Create one here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
