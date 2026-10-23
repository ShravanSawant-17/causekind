"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  }

  return (
    <main className="min-h-screen bg-[#faf7f3] text-[#211b17] flex flex-col justify-between">
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

      <section className="mx-auto flex w-full max-w-md flex-1 items-center px-4 py-12">
        <div className="w-full rounded-[28px] border border-[#eee2d7] bg-white p-7 shadow-[0_20px_70px_rgba(94,58,32,0.09)] sm:p-10">
          <div className="mb-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#b65329]">
              🔑
            </div>
            <p className="text-xs font-bold tracking-[0.2em] text-[#b65329]">
              PASSWORD RECOVERY
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight">
              Reset Password
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#796c62]">
              Enter the registered email address associated with your CauseKind intern account.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="resetEmail"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#483c32]"
                >
                  Registered Email Address
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none transition placeholder:text-[#b0a398] focus:border-[#b65329] focus:ring-4 focus:ring-[#b65329]/10"
                />
              </div>

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
                className="flex w-full items-center justify-center gap-2 rounded-full bg-[#ad5127] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(173,81,39,0.2)] transition hover:bg-[#93421e] focus:outline-none focus:ring-4 focus:ring-[#ad5127]/25 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Send Reset Instructions →"}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#f4cfbf] bg-[#fff8f5] p-5 text-left">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8e7d8] text-sm font-bold text-[#b65329]">
                  ✓
                </span>
                <h3 className="mt-3 font-serif text-lg font-bold text-[#211b17]">
                  Password Recovery Requested
                </h3>
                <p className="mt-2 text-xs leading-5 text-[#6c5f55]">
                  Your request for <strong className="text-[#211b17]">{email}</strong> was processed by the frontend form.
                </p>
                <div className="mt-3 rounded-xl bg-white p-3 border border-[#ebd7c8] text-[11px] text-[#ad5127] font-medium leading-4">
                  Note: Automated password reset email dispatch requires backend email integration (e.g. Resend, SendGrid, or SMTP server).
                </div>
              </div>

              <button
                onClick={() => setSubmitted(false)}
                className="w-full text-center text-xs font-semibold text-[#8b7a6e] hover:text-[#211b17]"
              >
                Try another email
              </button>
            </div>
          )}

          <div className="my-6 h-px bg-[#f0e7df]" />

          <p className="text-center text-xs text-[#796c62]">
            Remember your credentials?{" "}
            <Link
              href="/"
              className="font-bold text-[#b65329] hover:underline"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </section>

      <footer className="py-6 text-center text-xs text-[#9b8b80]">
        CauseKind Internship Portal • Protecting volunteer security & privacy
      </footer>
    </main>
  );
}
