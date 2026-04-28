import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

const SignUpPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role: "client" }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      setTimeout(() => {
        router.push("/login");
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign up right now.");
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
              New client account
            </p>
            <h1 className="mt-6 text-5xl font-bold leading-tight text-slate-800">
              Create your account and start booking easily.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              A simple sign-up flow helps clients of all ages get to their
              appointments faster and with less confusion.
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
              Create Your Account
            </h2>
            <p className="mt-2 text-base text-slate-600">
              Sign up to book services and track appointments
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
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
            <div className="text-slate-700">
              <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-rose-200 px-4 py-4 text-base outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-100"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-rose-600 py-4 text-lg font-semibold text-white transition hover:bg-rose-700"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            {error && <p className="text-center text-red-600">{error}</p>}
          </form>

          <p className="mt-6 text-center text-slate-700">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-rose-600 hover:text-rose-700">
              Login
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
};

export default SignUpPage;
