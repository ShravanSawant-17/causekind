"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";
import { Achievement } from "@/lib/types";

export default function AchievementsPage() {
  const { achievements, completedTasks, totalTasks } = usePortal();
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null);

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;

  const milestones = [
    {
      step: 1,
      title: "Induction & Profile Setup",
      desc: "Complete documentation and verify academic institution credentials.",
      status: "Completed",
      date: "Oct 8, 2026",
    },
    {
      step: 2,
      title: "First Field Submission",
      desc: "Submit needs assessment survey proof and qualitative notes.",
      status: "Completed",
      date: "Oct 17, 2026",
    },
    {
      step: 3,
      title: "Mid-Term Milestone Check",
      desc: "Reach 50% task completion with positive coordinator evaluation.",
      status: completedTasks >= 4 ? "Completed" : "In Progress",
      date: "Expected Nov 2, 2026",
    },
    {
      step: 4,
      title: "Final Impact Synthesis & Certificate",
      desc: "Complete 100% assigned outreach tasks and receive peer feedback.",
      status: completedTasks === totalTasks ? "Completed" : "Upcoming",
      date: "Expected Nov 15, 2026",
    },
  ];

  return (
    <PortalLayout>
      {/* Page Title */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Recognition & Impact
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Internship Achievements & Badges
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Celebrate key learning milestones, field accomplishments, and community outreach records.
          </p>
        </div>

        {/* Earned Badge Count */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#eedfd2] bg-white p-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf0e8] text-[#ad5127] font-bold text-xs">
            {earnedCount}/{totalCount}
          </div>
          <div>
            <p className="text-xs font-bold text-[#211b17]">Badges Unlocked</p>
            <p className="text-[11px] text-[#796c62]">
              {totalCount - earnedCount} more in progress
            </p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <section className="mt-8">
        <h2 className="font-serif text-xl font-bold text-[#211b17]">
          Cohort Badges & Honors
        </h2>
        <p className="mt-1 text-xs text-[#796c62]">
          Click any badge to view unlocking criteria and milestone credits.
        </p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((badge) => {
            const isEarned = badge.earned;
            const percentage = Math.min(
              100,
              Math.round((badge.currentProgress / badge.maxProgress) * 100)
            );

            return (
              <div
                key={badge.id}
                onClick={() => setSelectedBadge(badge)}
                className={`cursor-pointer rounded-2xl p-6 border transition shadow-sm ${
                  isEarned
                    ? "border-[#eed8c5] bg-gradient-to-br from-[#fffdfb] to-[#faf3ed] hover:border-[#ad5127]"
                    : "border-[#e8ded5] bg-white/70 hover:border-[#cfbfb0]"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-sm ${
                      isEarned
                        ? "bg-[#f8e7d8] text-[#ad5127]"
                        : "bg-[#f3ede7] grayscale opacity-60"
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      isEarned
                        ? "bg-[#f8e7d8] text-[#ad5127]"
                        : "bg-[#f0e8e0] text-[#867669]"
                    }`}
                  >
                    {isEarned ? "✓ Earned" : "🔒 Locked"}
                  </span>
                </div>

                <div className="mt-4">
                  <h3 className="font-serif text-lg font-bold text-[#211b17]">
                    {badge.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#6c5e53]">
                    {badge.description}
                  </p>
                </div>

                {/* Progress bar inside badge */}
                <div className="mt-4 pt-3 border-t border-[#f2e7dd]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#867669]">
                    <span>Progress</span>
                    <span>
                      {badge.currentProgress} / {badge.maxProgress}{" "}
                      {badge.progressUnit}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#eee2d7]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isEarned ? "bg-[#ad5127]" : "bg-[#c5b5a7]"
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  {isEarned && badge.earnedDate && (
                    <p className="mt-2 text-[10px] text-[#ad5127] font-semibold">
                      Unlocked on: {badge.earnedDate}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Internship Milestones Pathway */}
      <section className="mt-12 rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-serif text-xl font-bold text-[#211b17]">
          Internship Journey Milestones
        </h2>
        <p className="mt-1 text-xs text-[#796c62]">
          Progressive checkpoints required before final internship appraisal and certificate dispatch.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((m) => (
            <div
              key={m.step}
              className="relative flex flex-col justify-between rounded-xl border border-[#f0e4d8] bg-[#fffaf5] p-5"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ad5127] text-xs font-bold text-white">
                    {m.step}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      m.status === "Completed"
                        ? "bg-[#f8e7d8] text-[#ad5127]"
                        : m.status === "In Progress"
                        ? "bg-[#fff2e8] text-[#d97736] border border-[#f5d9c5]"
                        : "bg-[#f0e8e0] text-[#796c62]"
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                <h3 className="mt-3 font-serif text-sm font-bold text-[#211b17]">
                  {m.title}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#695d52]">{m.desc}</p>
              </div>

              <p className="mt-4 pt-3 border-t border-[#eee0d2] text-[10px] font-semibold text-[#8b796d]">
                {m.date}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-[#eee2d7] bg-white p-6 shadow-2xl sm:p-8 text-center">
            <button
              onClick={() => setSelectedBadge(null)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-[#89796d] hover:bg-[#faf7f3]"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#f8e7d8] text-4xl shadow-sm">
              {selectedBadge.icon}
            </div>

            <span className="mt-4 inline-block rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
              {selectedBadge.category} Badge
            </span>

            <h3 className="mt-3 font-serif text-2xl font-bold text-[#211b17]">
              {selectedBadge.title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-[#695b50]">
              {selectedBadge.description}
            </p>

            <div className="mt-6 rounded-2xl bg-[#faf6f1] p-4 text-xs text-left border border-[#ede3d8]">
              <div className="flex justify-between font-bold text-[#211b17]">
                <span>Status:</span>
                <span className="text-[#ad5127]">
                  {selectedBadge.earned ? "Unlocked ✓" : "In Progress"}
                </span>
              </div>
              <div className="mt-2 flex justify-between text-[#796c62]">
                <span>Current progress:</span>
                <span>
                  {selectedBadge.currentProgress} of {selectedBadge.maxProgress}{" "}
                  {selectedBadge.progressUnit}
                </span>
              </div>
              {selectedBadge.earnedDate && (
                <div className="mt-1 flex justify-between text-[#796c62]">
                  <span>Earned date:</span>
                  <span>{selectedBadge.earnedDate}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedBadge(null)}
              className="mt-6 w-full rounded-full bg-[#ad5127] py-3 text-xs font-bold text-white hover:bg-[#93421e] shadow-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
