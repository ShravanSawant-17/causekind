"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("Shravan S Sawant");
  const [email, setEmail] = useState("shravan.sawant17@gmail.com");
  const [institution, setInstitution] = useState("crce");
  const [password, setPassword] = useState("password123");
  const [confirmPassword, setConfirmPassword] = useState("password123");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const [error, setError] = useState("");
  const [successNotice, setSuccessNotice] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!institution.trim()) {
      setError("Please specify your college or educational institution.");
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!agreeTerms) {
      setError("Please accept the internship terms and privacy notice to continue.");
      return;
    }

    setLoading(true);
    setSuccessNotice(true);

    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 700);
  }

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
        {/* Left Hero Column matching screenshot */}
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full border border-[#efd8c7] bg-[#f7e9dd] px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#ad5026]">
            START YOUR JOURNEY
          </span>

          <h1 className="mt-7 max-w-xl font-serif text-6xl font-bold leading-[1.12] tracking-tight">
            Be part of
            <span className="block text-[#b65329]">something good.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-[#665a51]">
            Join CauseKind, develop your skills, contribute to meaningful work and
            make a difference in your community.
          </p>

          <div className="mt-10 space-y-4 max-w-md">
            <div className="flex items-center gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e7d8] text-xs font-bold text-[#b65329]">
                ✓
              </span>
              <p className="text-sm font-medium text-[#5c5046]">
                Track your internship tasks and progress
              </p>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e7d8] text-xs font-bold text-[#b65329]">
                ✓
              </span>
              <p className="text-sm font-medium text-[#5c5046]">
                Stay organised with deadlines and submissions
              </p>
            </div>
            <div className="flex items-center gap-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#f8e7d8] text-xs font-bold text-[#b65329]">
                ✓
              </span>
              <p className="text-sm font-medium text-[#5c5046]">
                Celebrate your contributions and achievements
              </p>
            </div>
          </div>
        </div>

        {/* Right Registration Card */}
        <div className="mx-auto w-full max-w-md">
          <div className="rounded-[28px] border border-[#eee2d7] bg-white p-7 shadow-[0_20px_70px_rgba(94,58,32,0.09)] sm:p-10">
            <div className="mb-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#b65329]">
                ♡
              </div>
              <p className="text-xs font-bold tracking-[0.2em] text-[#b65329]">
                INTERN REGISTRATION
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">
                Create Account
              </h2>
              <p className="mt-2 text-xs leading-5 text-[#796c62]">
                Join the CauseKind internship cohort and begin tracking your impact.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Full name
                </label>
                <input
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shravan Sawant"
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#b0a398] focus:border-[#b65329] focus:ring-4 focus:ring-[#b65329]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="regEmail"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Email address
                </label>
                <input
                  id="regEmail"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="shravan.sawant17@gmail.com"
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#b0a398] focus:border-[#b65329] focus:ring-4 focus:ring-[#b65329]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="institution"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  College / Institution
                </label>
                <input
                  id="institution"
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Fr. CRCE"
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#b0a398] focus:border-[#b65329] focus:ring-4 focus:ring-[#b65329]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="regPassword"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Password
                </label>
                <div className="flex items-center rounded-xl border border-[#e8ddd3] bg-[#fffdfa] pr-4 transition focus-within:border-[#b65329] focus-within:ring-4 focus-within:ring-[#b65329]/10">
                  <input
                    id="regPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 8 characters"
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

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Confirm password
                </label>
                <div className="flex items-center rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 transition focus-within:border-[#b65329] focus-within:ring-4 focus-within:ring-[#b65329]/10">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-[#b0a398]"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-start gap-2.5 pt-1 text-xs leading-5 text-[#71645a]">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#b65329]"
                />
                <span>
                  I agree to the applicable internship terms and privacy notice.
                </span>
              </label>

              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-[#f0c9bc] bg-[#fff3ee] p-3 text-xs leading-5 text-[#a33d25]"
                >
                  {error}
                </p>
              )}

              {successNotice && (
                <div className="rounded-xl border border-[#f5d5c5] bg-[#fff7f2] p-3.5 text-xs leading-5 text-[#a14821]">
                  Registration UI is working! Account creation will be enabled after backend integration.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-full bg-[#ad5127] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(173,81,39,0.2)] transition hover:bg-[#93421e] focus:outline-none focus:ring-4 focus:ring-[#ad5127]/25 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Creating Account..." : "Create Account →"}
              </button>
            </form>

            <div className="my-6 h-px bg-[#f0e7df]" />

            <p className="text-center text-xs text-[#796c62]">
              Already have an account?{" "}
              <Link
                href="/"
                className="font-bold text-[#b65329] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
