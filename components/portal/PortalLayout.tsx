"use client";

import React from "react";
import { PortalHeader } from "./PortalHeader";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="min-h-screen bg-[#faf7f3] text-[#211b17] flex flex-col">
      {/* Top Header - Single Primary Navigation */}
      <PortalHeader />

      {/* Main Body (Full Width, Centered Max-W-7xl without Sidebar) */}
      <main className="flex-1 px-4 py-8 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        {children}

        {/* Educational Demo Banner */}
        <footer className="mt-16 rounded-2xl border border-[#eedfd2] bg-[#fffaf5] p-5 text-center text-xs text-[#7d6e64]">
          <p className="font-semibold text-[#ad5127]">
            CauseKind Internship Portal — Frontend Prototype
          </p>
          <p className="mt-1 leading-relaxed">
            All task submissions, status progressions, verification states, and profile edits are fully interactive within this browser session. Real file uploads, account databases, and certificate issuance will activate upon backend Spring Boot API integration.
          </p>
        </footer>
      </main>
    </div>
  );
}
