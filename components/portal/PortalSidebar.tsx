"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { usePortal } from "@/lib/portal-context";

interface PortalSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export function PortalSidebar({
  mobileOpen = false,
  onCloseMobile,
}: PortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, completionPercentage } = usePortal();

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "My Tasks",
      href: "/tasks",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      ),
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "My Profile",
      href: "/profile",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      name: "Onboarding Kit",
      href: "/onboarding",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      ),
    },
    {
      name: "Achievements",
      href: "/achievements",
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
  ];

  const handleLogout = () => {
    router.push("/");
  };

  const content = (
    <div className="flex h-full flex-col justify-between">
      <div>
        {/* CauseKind Logo on mobile drawer */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 lg:hidden">
          <Link
            href="/dashboard"
            onClick={onCloseMobile}
            className="flex items-center gap-2 text-xl font-extrabold"
          >
            <span className="text-2xl text-[#b45a2b]">♡</span>
            <span>
              Cause<span className="text-[#b45a2b]">Kind</span>
            </span>
          </Link>
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#eee2d7] text-[#796c62]"
              aria-label="Close menu"
            >
              ✕
            </button>
          )}
        </div>

        {/* Intern Status Summary */}
        <div className="mx-4 mt-4 mb-5 rounded-2xl border border-[#eedfd2] bg-[#fffaf5] p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#ad5127] font-serif text-base font-bold text-white shadow-sm">
              {profile.initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#211b17]">
                {profile.name}
              </p>
              <p className="truncate text-xs text-[#796c62]">{profile.role}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] font-semibold text-[#89796d]">
              <span>Internship Progress</span>
              <span className="text-[#ad5127]">{completionPercentage}%</span>
            </div>
            <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#eee2d7]">
              <div
                className="h-full rounded-full bg-[#ad5127] transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="px-3">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9f9184]">
            Portal Menu
          </p>
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onCloseMobile}
                  className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#faf0e8] text-[#ad5127] font-bold shadow-sm"
                      : "text-[#6c5f54] hover:bg-[#faf7f3] hover:text-[#211b17]"
                  }`}
                >
                  <span
                    className={`transition ${
                      isActive
                        ? "text-[#ad5127]"
                        : "text-[#948477] group-hover:text-[#211b17]"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom actions & Organization disclaimer */}
      <div className="p-4 border-t border-[#eee5dc] space-y-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ead9ca] bg-white py-2.5 text-xs font-bold text-[#ad5127] shadow-sm transition hover:bg-[#faf0e8]"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Log Out
        </button>

        <p className="text-center text-[10px] leading-4 text-[#a39487]">
          CauseKind Internship Portal
          <br />
          <span className="text-[#b65329]">causekind.com</span>
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-[#eee5dc] lg:bg-white/80 lg:backdrop-blur-sm lg:min-h-[calc(100vh-74px)]">
        {content}
      </aside>

      {/* Mobile Drawer Backdrop & Modal */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-[#211b17]/40 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
