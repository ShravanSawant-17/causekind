"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = usePortal();

  // Inputs start clean and empty so the user can type!
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const res = login(email, password);

      if (!res.success) {
        setLoading(false);
        setError(res.error || "Authentication failed. Please verify credentials.");
        return;
      }

      setLoading(false);
      if (res.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 400);
  }

  // Quick fill helper for evaluator testing
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#faf7f3] text-[#211b17]">
      <header className="flex h-[82px] items-center justify-between border-b border-[#eee5dc] bg-white/80 px-6 sm:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-3xl text-[#b45a2b]">♡</span>
          <span>
            Cause<span className="text-[#b45a2b]">Kind</span>
          </span>
        </Link>
        <span className="rounded-full border border-[#ead9ca] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#a95128]">
          INTERN PORTAL
        </span>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-82px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:px-12">
        {/* Left Brand Promotional Column */}
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full border border-[#efd8c7] bg-[#f7e9dd] px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#ad5026]">
            MAKING LIVES BETTER
          </span>

          <h1 className="mt-7 max-w-xl font-serif text-6xl font-bold leading-[1.12] tracking-tight">
            Small actions.
            <span className="block text-[#b65329]">Meaningful impact.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[#665a51]">
            Welcome to your CauseKind internship journey. Learn, contribute, and
            make a tangible difference in the community around you.
          </p>

          <div className="mt-10 grid max-w-lg grid-cols-2 gap-4">
            <div className="rounded-2xl border border-[#eddfd2] bg-white p-5 shadow-sm">
              <span className="text-2xl text-[#b65329]">♡</span>
              <h2 className="mt-3 font-bold">Make an impact</h2>
              <p className="mt-1 text-sm leading-6 text-[#766a60]">
                Turn your everyday hours into structured community contributions.
              </p>
            </div>
            <div className="rounded-2xl border border-[#eddfd2] bg-white p-5 shadow-sm">
              <span className="text-2xl text-[#b65329]">✳</span>
              <h2 className="mt-3 font-bold">Grow together</h2>
              <p className="mt-1 text-sm leading-6 text-[#766a60]">
                Track tasks, submissions, milestone badges, and schedules.
              </p>
            </div>
          </div>

          <p className="mt-10 text-sm text-[#89796d]">
            Every contribution counts. Every person matters.
          </p>
        </div>

        {/* Right Sign-in Card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[28px] border border-[#eee2d7] bg-white p-7 shadow-[0_20px_70px_rgba(94,58,32,0.09)] sm:p-10">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#b65329]">
                ♡
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#b65329]">
                INTERN SIGN IN
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">
                Welcome back
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#796c62]">
                Sign in to access your volunteer, team, or admin portal.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#b0a398] focus:border-[#b65329] focus:ring-4 focus:ring-[#b65329]/10"
                />
              </div>

              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-xs font-bold uppercase tracking-wider text-[#483c32]"
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-[#b65329] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex items-center rounded-xl border border-[#e8ddd3] bg-[#fffdfa] pr-4 transition focus-within:border-[#b65329] focus-within:ring-4 focus-within:ring-[#b65329]/10">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-transparent px-4 py-3 text-sm outline-none placeholder:text-[#b0a398]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-xs font-semibold text-[#9a7965] hover:text-[#b65329]"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2.5 text-xs text-[#71645a]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 accent-[#b65329]"
                />
                Remember me on this browser
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#f0c9bc] bg-[#fff3ee] p-3 text-xs leading-5 text-[#a33d25]"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#ad5127] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(173,81,39,0.2)] transition hover:bg-[#93421e] focus:outline-none focus:ring-4 focus:ring-[#ad5127]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Signing in..." : "Log In"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            {/* Quick Demo Credentials Autofill Pill Bar */}
            <div className="mt-5 rounded-2xl border border-[#f0e4d7] bg-[#fffcf9] p-3 text-xs">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9f8d7f] mb-2 text-center">
                Quick-Fill Demo Credentials (Click to load)
              </p>
              <div className="grid grid-cols-3 gap-1.5 text-center">
                <button
                  type="button"
                  onClick={() => fillCredentials("shravan.sawant17@gmail.com", "password123")}
                  className="rounded-lg border border-[#e4d6c8] bg-white py-1.5 px-1 font-semibold text-[#ad5127] hover:bg-[#faf4ee] text-[11px]"
                >
                  Volunteer
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("ananya.team@causekind.com", "leader123")}
                  className="rounded-lg border border-[#e4d6c8] bg-white py-1.5 px-1 font-semibold text-[#ad5127] hover:bg-[#faf4ee] text-[11px]"
                >
                  Team Leader
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials("admin@causekind.com", "admin123")}
                  className="rounded-lg border border-[#e4d6c8] bg-white py-1.5 px-1 font-semibold text-[#211b17] hover:bg-[#faf4ee] text-[11px]"
                >
                  Admin
                </button>
              </div>
            </div>

            <div className="my-6 h-px bg-[#f0e7df]" />

            <p className="text-center text-xs text-[#796c62]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-[#b65329] hover:underline"
              >
                Create account
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs leading-6 text-[#928277]">
            By continuing, you agree to follow the CauseKind internship guidelines.
          </p>
        </div>
      </section>
    </main>
  );
}
