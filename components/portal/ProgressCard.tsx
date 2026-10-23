import React from "react";
import Link from "next/link";

interface ProgressCardProps {
  completed: number;
  total: number;
  percentage: number;
  inProgress: number;
  submitted: number;
  notStarted: number;
}

export function ProgressCard({
  completed,
  total,
  percentage,
  inProgress,
  submitted,
  notStarted,
}: ProgressCardProps) {
  return (
    <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#211b17]">Your Progress</h2>
        <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
          {percentage}% Done
        </span>
      </div>

      <p className="mt-2 text-sm text-[#796c62]">
        You have completed{" "}
        <span className="font-bold text-[#211b17]">{completed}</span> out of{" "}
        <span className="font-bold text-[#211b17]">{total}</span> assigned tasks.
      </p>

      {/* Main Progress Bar */}
      <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#f1e6dc]">
        <div
          className="h-full rounded-full bg-[#ad5127] transition-all duration-700 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Breakdown Badges */}
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center justify-between rounded-xl bg-[#faf5f0] p-2.5">
          <span className="flex items-center gap-1.5 text-[#796c62]">
            <span className="h-2 w-2 rounded-full bg-[#ad5127]" />
            Completed
          </span>
          <span className="font-bold text-[#211b17]">{completed}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf5f0] p-2.5">
          <span className="flex items-center gap-1.5 text-[#796c62]">
            <span className="h-2 w-2 rounded-full bg-[#d97736]" />
            In Progress
          </span>
          <span className="font-bold text-[#211b17]">{inProgress}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf5f0] p-2.5">
          <span className="flex items-center gap-1.5 text-[#796c62]">
            <span className="h-2 w-2 rounded-full bg-[#cca028]" />
            Submitted
          </span>
          <span className="font-bold text-[#211b17]">{submitted}</span>
        </div>

        <div className="flex items-center justify-between rounded-xl bg-[#faf5f0] p-2.5">
          <span className="flex items-center gap-1.5 text-[#796c62]">
            <span className="h-2 w-2 rounded-full bg-[#a3968b]" />
            Not Started
          </span>
          <span className="font-bold text-[#211b17]">{notStarted}</span>
        </div>
      </div>

      {/* Motivational Tip Card */}
      <div className="mt-5 rounded-xl border border-[#f2e5d9] bg-[#faf3ed] p-4 text-xs leading-5 text-[#736357]">
        <p className="font-semibold text-[#ad5127]">Next Milestone:</p>
        <p className="mt-1">
          Complete 2 more tasks to unlock the{" "}
          <strong className="text-[#211b17]">Consistent Contributor</strong>{" "}
          badge!
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-[#f0e7df] text-center">
        <Link
          href="/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ad5127] hover:text-[#8e3914] hover:underline"
        >
          View all task instructions
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
