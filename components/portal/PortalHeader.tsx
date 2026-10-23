"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePortal } from "@/lib/portal-context";

interface PortalHeaderProps {
  onToggleMobileMenu?: () => void;
}

export function PortalHeader({ onToggleMobileMenu }: PortalHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, inProgressTasks } = usePortal();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "My Tasks", href: "/tasks" },
    { label: "Calendar", href: "/calendar" },
    { label: "Onboarding Kit", href: "/onboarding" },
    { label: "Achievements", href: "/achievements" },
    { label: "Profile", href: "/profile" },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#eee5dc] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee2d7] text-[#796c62] hover:bg-[#faf7f3] lg:hidden"
              aria-label="Toggle navigation menu"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}

          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-xl font-extrabold tracking-tight sm:text-2xl"
          >
            <span className="text-2xl text-[#b45a2b] sm:text-3xl">♡</span>
            <span>
              Cause<span className="text-[#b45a2b]">Kind</span>
            </span>
          </Link>

          <span className="hidden rounded-full border border-[#ead9ca] bg-[#faf3ed] px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-[#a95128] sm:inline-block">
            INTERN PORTAL
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#faf0e8] text-[#ad5127]"
                    : "text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserMenu(false);
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#eee2d7] text-[#796c62] transition hover:bg-[#faf7f3] hover:text-[#211b17]"
              aria-label="View notifications"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              {inProgressTasks > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ad5127] text-[10px] font-bold text-white ring-2 ring-white">
                  {inProgressTasks}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#eee2d7] bg-white p-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                    Cohort Notifications
                  </h3>
                  <span className="rounded-full bg-[#faf0e8] px-2 py-0.5 text-[10px] font-bold text-[#ad5127]">
                    Demo Alerts
                  </span>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="rounded-xl bg-[#faf5f0] p-3">
                    <p className="font-semibold text-[#211b17]">
                      Upcoming Deadline: Task #104
                    </p>
                    <p className="mt-1 text-[#796c62]">
                      Field outreach report is due on Oct 25. Submit your proof before 6 PM.
                    </p>
                  </div>
                  <div className="rounded-xl bg-white p-3 border border-[#f0e7df]">
                    <p className="font-semibold text-[#211b17]">
                      Mentor Feedback Available
                    </p>
                    <p className="mt-1 text-[#796c62]">
                      Survey Task #103 verified with distinction. Check your score!
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-2 text-center border-t border-[#f0e7df]">
                  <Link
                    href="/tasks"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#ad5127] hover:underline"
                  >
                    View active tasks →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Chip */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserMenu(!showUserMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 rounded-full border border-[#eee2d7] bg-[#fffdfa] py-1 pl-1 pr-3 text-left transition hover:border-[#dfcebf] hover:shadow-sm"
              aria-label="User account menu"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ad5127] text-xs font-bold text-white">
                {profile.initials}
              </div>
              <div className="hidden text-left text-xs md:block">
                <p className="max-w-[110px] truncate font-bold text-[#211b17]">
                  {profile.name}
                </p>
                <p className="text-[10px] text-[#796c62]">Intern</p>
              </div>
              <svg
                className="h-3.5 w-3.5 text-[#8f8073]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-[#eee2d7] bg-white p-2 shadow-xl">
                <div className="border-b border-[#f0e7df] px-3 py-2.5">
                  <p className="truncate text-xs font-bold text-[#211b17]">
                    {profile.name}
                  </p>
                  <p className="truncate text-[11px] text-[#796c62]">
                    {profile.email}
                  </p>
                  <p className="mt-1 text-[10px] text-[#ad5127] font-semibold">
                    {profile.institution}
                  </p>
                </div>

                <div className="mt-1 space-y-0.5">
                  <Link
                    href="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#211b17] hover:bg-[#faf3ed]"
                  >
                    <span>👤</span> My Profile
                  </Link>
                  <Link
                    href="/tasks"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#211b17] hover:bg-[#faf3ed]"
                  >
                    <span>📋</span> Task List
                  </Link>
                  <Link
                    href="/achievements"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#211b17] hover:bg-[#faf3ed]"
                  >
                    <span>🏅</span> Badges & Milestones
                  </Link>
                </div>

                <div className="mt-2 border-t border-[#f0e7df] pt-2">
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#ad5127] hover:bg-[#faf0e8]"
                  >
                    <span>🚪</span> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
