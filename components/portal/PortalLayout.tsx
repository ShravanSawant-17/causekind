"use client";

import React, { useState } from "react";
import { PortalHeader } from "./PortalHeader";
import { PortalSidebar } from "./PortalSidebar";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf7f3] text-[#211b17] flex flex-col">
      {/* Top Header */}
      <PortalHeader onToggleMobileMenu={() => setMobileMenuOpen(true)} />

      {/* Main Body with Sidebar + Page Content */}
      <div className="flex flex-1">
        <PortalSidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        <main className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10 max-w-7xl mx-auto w-full">
          {children}

          {/* Educational Demo Banner */}
          <footer className="mt-16 rounded-2xl border border-[#eedfd2] bg-[#fffaf5] p-5 text-center text-xs text-[#7d6e64]">
            <p className="font-semibold text-[#ad5127]">
              CauseKind Internship Portal — Frontend Prototype
            </p>
            <p className="mt-1 leading-relaxed">
              All task submissions, status progressions, and profile edits are fully interactive within this browser session. Real file uploads, account databases, and certificate issuance will activate upon backend API integration.
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
