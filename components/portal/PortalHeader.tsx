"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePortal } from "@/lib/portal-context";

export function PortalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    profile,
    notifications,
    markNotificationRead,
    switchDemoRole,
    logout,
  } = usePortal();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isTeamLeader = currentUser?.role === "TEAM_LEADER" || currentUser?.teamRole === "LEADER";
  const isAdmin = currentUser?.role === "ADMIN";

  // Dynamic Navigation items based on role
  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    ...(isTeamLeader ? [{ label: "My Team", href: "/team" }] : []),
    { label: "My Tasks", href: "/tasks" },
    { label: "Calendar", href: "/calendar" },
    { label: "Verification", href: "/verification" },
    { label: "Onboarding Kit", href: "/onboarding" },
    { label: "Achievements", href: "/achievements" },
    { label: "Profile", href: "/profile" },
    ...(isAdmin ? [{ label: "Admin Portal", href: "/admin", isSpecial: true }] : []),
  ];

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#eee5dc] bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-4 sm:px-8">
        {/* Brand / Logo + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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
                d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>

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

          {currentUser?.role === "TEAM_LEADER" && (
            <span className="hidden rounded-full bg-[#f8e7d8] px-2.5 py-0.5 text-[10px] font-bold text-[#ad5127] md:inline-block">
              TEAM LEADER
            </span>
          )}

          {isAdmin && (
            <span className="hidden rounded-full bg-[#211b17] px-2.5 py-0.5 text-[10px] font-bold text-white md:inline-block">
              ADMIN
            </span>
          )}
        </div>

        {/* Primary Desktop Navigation Bar (Top Only) */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  link.isSpecial
                    ? "bg-[#211b17] text-white hover:bg-[#332b25] ml-1"
                    : isActive
                    ? "bg-[#faf0e8] text-[#ad5127] font-bold"
                    : "text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions & Profile */}
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
              {unreadNotifications.length > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#ad5127] text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#eee2d7] bg-white p-4 shadow-xl z-50">
                <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                    Notifications ({unreadNotifications.length} unread)
                  </h3>
                  <span className="rounded-full bg-[#faf0e8] px-2 py-0.5 text-[10px] font-bold text-[#ad5127]">
                    Live
                  </span>
                </div>

                <div className="mt-3 space-y-2 text-xs max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`cursor-pointer rounded-xl p-3 border transition ${
                        n.read
                          ? "bg-white border-[#f0e7df] opacity-75"
                          : "bg-[#fffaf5] border-[#f5d9c5]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-[#211b17]">{n.title}</p>
                        {!n.read && (
                          <span className="h-2 w-2 rounded-full bg-[#ad5127]" />
                        )}
                      </div>
                      <p className="mt-1 text-[#796c62] leading-relaxed">{n.message}</p>
                      <span className="mt-1.5 block text-[10px] text-[#a4968a]">
                        {n.createdAt}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 text-center border-t border-[#f0e7df]">
                  <Link
                    href="/tasks"
                    onClick={() => setShowNotifications(false)}
                    className="text-xs font-bold text-[#ad5127] hover:underline"
                  >
                    View assigned tasks →
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
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ad5127] text-xs font-bold text-white overflow-hidden">
                {profile.avatarUrl ? (
                  <img
                    src={profile.avatarUrl}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  profile.initials
                )}
              </div>
              <div className="hidden text-left text-xs md:block">
                <p className="max-w-[120px] truncate font-bold text-[#211b17]">
                  {profile.name}
                </p>
                <p className="text-[10px] text-[#796c62] truncate">
                  {currentUser?.role === "ADMIN"
                    ? "Administrator"
                    : currentUser?.role === "TEAM_LEADER"
                    ? "Team Leader"
                    : "Volunteer"}
                </p>
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
              <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-[#eee2d7] bg-white p-2 shadow-xl z-50">
                <div className="border-b border-[#f0e7df] px-3 py-2.5">
                  <p className="truncate text-xs font-bold text-[#211b17]">
                    {profile.name}
                  </p>
                  <p className="truncate text-[11px] text-[#796c62]">
                    {profile.email}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        currentUser?.verificationStatus === "VERIFIED"
                          ? "bg-[#f8e7d8] text-[#ad5127]"
                          : "bg-[#fff2e6] text-[#d97736]"
                      }`}
                    >
                      {currentUser?.verificationStatus === "VERIFIED"
                        ? "✓ Verified"
                        : "⏳ Pending Verification"}
                    </span>
                  </div>
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
                    href="/verification"
                    onClick={() => setShowUserMenu(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#211b17] hover:bg-[#faf3ed]"
                  >
                    <span>📑</span> Verification & Documents
                  </Link>

                  {isTeamLeader && (
                    <Link
                      href="/team"
                      onClick={() => setShowUserMenu(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#ad5127] hover:bg-[#faf3ed]"
                    >
                      <span>👥</span> Manage Team
                    </Link>
                  )}

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-[#211b17] bg-[#faf0e8] hover:bg-[#f6e4d6]"
                    >
                      <span>⚙️</span> Admin Portal
                    </Link>
                  )}
                </div>

                {/* Role Switcher for instant testing */}
                <div className="mt-2 border-t border-[#f0e7df] pt-2 px-2">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#9a897c] px-1 pb-1">
                    Quick Role Switcher (Demo)
                  </p>
                  <div className="grid grid-cols-3 gap-1 text-[10px]">
                    <button
                      onClick={() => switchDemoRole("VOLUNTEER")}
                      className={`rounded-lg py-1 px-1.5 font-bold transition ${
                        currentUser?.role === "VOLUNTEER"
                          ? "bg-[#ad5127] text-white"
                          : "bg-[#faf5f0] text-[#796c62] hover:bg-[#f3ece4]"
                      }`}
                    >
                      Volunteer
                    </button>
                    <button
                      onClick={() => switchDemoRole("TEAM_LEADER")}
                      className={`rounded-lg py-1 px-1.5 font-bold transition ${
                        currentUser?.role === "TEAM_LEADER"
                          ? "bg-[#ad5127] text-white"
                          : "bg-[#faf5f0] text-[#796c62] hover:bg-[#f3ece4]"
                      }`}
                    >
                      Leader
                    </button>
                    <button
                      onClick={() => switchDemoRole("ADMIN")}
                      className={`rounded-lg py-1 px-1.5 font-bold transition ${
                        currentUser?.role === "ADMIN"
                          ? "bg-[#211b17] text-white"
                          : "bg-[#faf5f0] text-[#796c62] hover:bg-[#f3ece4]"
                      }`}
                    >
                      Admin
                    </button>
                  </div>
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

      {/* Mobile Menu Dropdown (When Hamburger is clicked) */}
      {mobileMenuOpen && (
        <div className="border-t border-[#eee5dc] bg-white px-4 py-4 lg:hidden animate-in slide-in-from-top-2 duration-200">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    link.isSpecial
                      ? "bg-[#211b17] text-white"
                      : isActive
                      ? "bg-[#faf0e8] text-[#ad5127] font-bold"
                      : "text-[#6c5f54] hover:bg-[#faf7f3]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
