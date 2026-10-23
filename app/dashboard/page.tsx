"use client";

import React from "react";
import Link from "next/link";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { StatCard } from "@/components/portal/StatCard";
import { ProgressCard } from "@/components/portal/ProgressCard";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/lib/portal-context";

export default function DashboardPage() {
  const {
    profile,
    tasks,
    totalTasks,
    completedTasks,
    inProgressTasks,
    notStartedTasks,
    submittedTasks,
    pendingTasks,
    completionPercentage,
    profileCompletion,
  } = usePortal();

  // Sort upcoming deadlines (tasks not yet completed)
  const upcomingTasks = [...tasks]
    .filter((t) => t.status !== "Completed")
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Recent tasks (top 5)
  const recentTasks = tasks.slice(0, 5);

  return (
    <PortalLayout>
      {/* Top Welcome Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold tracking-widest text-[#ad5127]">
              COHORT FALL 2026
            </span>
            <span className="text-xs font-semibold text-[#8b796d]">
              ID: {profile.id}
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#211b17] sm:text-4xl">
            Welcome back, {profile.name.split(" ")[0]}!
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            {profile.role} • {profile.institution}
          </p>
        </div>

        {/* Profile Completion Badge */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#eedfd2] bg-white p-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf0e8] text-[#ad5127] font-bold text-xs">
            {profileCompletion}%
          </div>
          <div>
            <p className="text-xs font-bold text-[#211b17]">Profile Status</p>
            <Link
              href="/profile"
              className="text-[11px] font-semibold text-[#ad5127] hover:underline"
            >
              {profileCompletion === 100
                ? "Profile fully updated ✓"
                : "Complete profile details →"}
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards (Calculated directly from context) */}
      <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Assigned"
          value={totalTasks}
          description="Internship milestone tasks"
          badge="Cohort"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          description="Verified and evaluated"
          badge={`${completionPercentage}%`}
          accent="orange"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
        <StatCard
          title="Active / Pending"
          value={pendingTasks}
          description={`${inProgressTasks} in progress, ${submittedTasks} under review`}
          accent="neutral"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Upcoming Deadlines"
          value={upcomingTasks.length}
          description="Due in next 14 days"
          badge="Urgent"
          accent="orange"
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </section>

      {/* Middle Grid: Recent Tasks & Progress Card */}
      <section className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column (2 spans): Recent Tasks Table / List */}
        <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-[#f0e7df] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#211b17]">
                Recent Tasks & Activities
              </h2>
              <p className="mt-0.5 text-xs text-[#796c62]">
                Your recent assignments and progress
              </p>
            </div>
            <Link
              href="/tasks"
              className="rounded-full bg-[#faf0e8] px-3.5 py-1.5 text-xs font-bold text-[#ad5127] transition hover:bg-[#f8e7d8]"
            >
              View all tasks ({totalTasks}) →
            </Link>
          </div>

          <div className="mt-4 divide-y divide-[#f2e9e1]">
            {recentTasks.map((t) => (
              <div
                key={t.id}
                className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                      {t.category}
                    </span>
                    <span className="text-xs text-[#a19285]">•</span>
                    <span className="text-xs text-[#7d6f64]">Due {t.dueDate}</span>
                  </div>
                  <h3 className="mt-1 font-bold text-sm text-[#211b17] hover:text-[#ad5127] transition">
                    <Link href="/tasks">{t.title}</Link>
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={t.status} size="sm" />
                  <Link
                    href="/tasks"
                    className="rounded-lg border border-[#e8ded3] px-3 py-1 text-xs font-medium text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
                  >
                    Action →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Progress Card */}
        <div className="space-y-6">
          <ProgressCard
            completed={completedTasks}
            total={totalTasks}
            percentage={completionPercentage}
            inProgress={inProgressTasks}
            submitted={submittedTasks}
            notStarted={notStartedTasks}
          />

          {/* Quick Action Buttons */}
          <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdfa] p-5">
            <h3 className="font-serif text-base font-bold text-[#211b17]">
              Quick Shortcuts
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <Link
                href="/tasks"
                className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#ede3d8] text-xs font-bold text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span>📝</span> Submit Work
              </Link>
              <Link
                href="/calendar"
                className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#ede3d8] text-xs font-bold text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span>📅</span> View Calendar
              </Link>
              <Link
                href="/onboarding"
                className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#ede3d8] text-xs font-bold text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span>📖</span> Safety Kit
              </Link>
              <Link
                href="/achievements"
                className="flex items-center gap-2 rounded-xl bg-white p-3 border border-[#ede3d8] text-xs font-bold text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span>🏅</span> Badges
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Section: Upcoming Deadlines & Community Outreach Spotlight */}
      <section className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Upcoming Deadlines */}
        <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#f0e7df] pb-4">
            <h2 className="font-serif text-lg font-bold text-[#211b17]">
              Upcoming Deadlines
            </h2>
            <Link
              href="/calendar"
              className="text-xs font-bold text-[#ad5127] hover:underline"
            >
              Open Full Calendar →
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {upcomingTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-[#f0e4d8] bg-[#fffaf5] p-3.5"
              >
                <div>
                  <span className="text-[10px] font-bold text-[#ad5127]">
                    Due: {task.dueDate}
                  </span>
                  <h4 className="font-bold text-xs text-[#211b17] mt-0.5">
                    {task.title}
                  </h4>
                  <p className="text-[11px] text-[#796c62] mt-0.5">
                    Category: {task.category}
                  </p>
                </div>
                <StatusBadge status={task.priority} size="sm" />
              </div>
            ))}
          </div>
        </div>

        {/* CauseKind Community Pulse */}
        <div className="rounded-2xl border border-[#eee2d7] bg-gradient-to-br from-[#fffdfa] to-[#faf3ed] p-6 shadow-sm">
          <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
            COMMUNITY HIGHLIGHT
          </span>
          <h2 className="mt-3 font-serif text-xl font-bold text-[#211b17]">
            Every Hour Makes A Tangible Difference
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#6e6055]">
            Last week, CauseKind interns documented 180+ household surveys across Mumbai and distributed 350 learning kits. Your outreach report for Bandra West directly informs the November resource allocation.
          </p>

          <div className="mt-4 flex items-center gap-3 pt-3 border-t border-[#ebd9ca]">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm text-[#ad5127] shadow-sm">
              ♡
            </div>
            <div className="text-xs">
              <p className="font-bold text-[#211b17]">Mentor: Ananya Rao</p>
              <p className="text-[#847467]">Program Lead, Community Outreach</p>
            </div>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
