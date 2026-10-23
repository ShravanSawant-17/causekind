import React from "react";
import { TaskStatus, TaskPriority } from "@/lib/types";

interface StatusBadgeProps {
  status: TaskStatus | TaskPriority | string;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const sizeClasses =
    size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs";

  switch (status) {
    case "Completed":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#f8e7d8] text-[#9c451d] border border-[#efd3bd] ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#b65329]" />
          Completed
        </span>
      );
    case "In Progress":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#fff4ec] text-[#ad5127] border border-[#f5d9c5] ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#d97736] animate-pulse" />
          In Progress
        </span>
      );
    case "Submitted":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-bold rounded-full bg-[#fdf5e6] text-[#996515] border border-[#f0debe] ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#cca028]" />
          Submitted
        </span>
      );
    case "Not Started":
      return (
        <span
          className={`inline-flex items-center gap-1.5 font-medium rounded-full bg-[#f4eee7] text-[#766a60] border border-[#e4d8cc] ${sizeClasses}`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-[#a3968b]" />
          Not Started
        </span>
      );
    case "High":
      return (
        <span
          className={`inline-flex items-center font-bold rounded-full bg-[#ffebe6] text-[#b43b1e] border border-[#ffd2c8] ${sizeClasses}`}
        >
          High Priority
        </span>
      );
    case "Medium":
      return (
        <span
          className={`inline-flex items-center font-semibold rounded-full bg-[#fff6e6] text-[#9e6212] border border-[#fae4bd] ${sizeClasses}`}
        >
          Medium Priority
        </span>
      );
    case "Low":
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#f3efe9] text-[#71655b] border border-[#e2d8cd] ${sizeClasses}`}
        >
          Low Priority
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-[#f7f2ed] text-[#6d6157] border border-[#e8ded3] ${sizeClasses}`}
        >
          {status}
        </span>
      );
  }
}
