"use client";

import React, { createContext, useContext, useState, useMemo } from "react";
import {
  InternProfile,
  TaskItem,
  TaskStatus,
  Achievement,
} from "./types";
import {
  initialInternProfile,
  initialTasks,
  initialAchievements,
} from "./portal-data";

interface Toast {
  id: number;
  type: "success" | "info" | "warning";
  text: string;
}

interface PortalContextType {
  profile: InternProfile;
  updateProfile: (updated: Partial<InternProfile>) => void;
  tasks: TaskItem[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  submitTask: (
    id: string,
    submission: { description: string; fileName?: string; fileSize?: string }
  ) => void;
  achievements: Achievement[];
  readOnboardingIds: string[];
  toggleOnboardingRead: (sectionId: string) => void;
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  submittedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  profileCompletion: number;
  toasts: Toast[];
  showToast: (text: string, type?: "success" | "info" | "warning") => void;
  dismissToast: (id: number) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<InternProfile>(initialInternProfile);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [readOnboardingIds, setReadOnboardingIds] = useState<string[]>([
    "welcome",
    "internship-overview",
  ]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const updateProfile = (updated: Partial<InternProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...updated };
      if (updated.name) {
        const parts = updated.name.trim().split(" ");
        const initials =
          parts.length >= 2
            ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
            : (parts[0]?.[0] || "I").toUpperCase();
        next.initials = initials;
      }
      return next;
    });
    showToast("Profile updated successfully (in-session demo data).", "success");
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
    showToast(`Task status changed to "${status}".`, "info");
  };

  const submitTask = (
    id: string,
    submissionData: { description: string; fileName?: string; fileSize?: string }
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: "Submitted",
            submission: {
              description: submissionData.description,
              fileName: submissionData.fileName || undefined,
              fileSize: submissionData.fileSize || undefined,
              submittedAt: formattedDate,
              reviewerFeedback: "Pending review by cohort coordinator.",
            },
          };
        }
        return t;
      })
    );

    // Update achievement progress dynamically
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === "ACH-4") {
          const newProg = Math.min(ach.maxProgress, ach.currentProgress + 1);
          return {
            ...ach,
            currentProgress: newProg,
            earned: newProg >= ach.maxProgress,
            earnedDate: newProg >= ach.maxProgress ? "Just now" : ach.earnedDate,
          };
        }
        return ach;
      })
    );

    showToast(
      "Task work submitted! Marked as 'Submitted' for coordinator review.",
      "success"
    );
  };

  const toggleOnboardingRead = (sectionId: string) => {
    setReadOnboardingIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  // Dynamic statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const notStartedTasks = tasks.filter((t) => t.status === "Not Started").length;
  const submittedTasks = tasks.filter((t) => t.status === "Submitted").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  const completionPercentage = useMemo(() => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 15;
    if (profile.email) score += 15;
    if (profile.phone) score += 10;
    if (profile.institution) score += 15;
    if (profile.course) score += 10;
    if (profile.year) score += 10;
    if (profile.bio) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 5;
    if (profile.interests && profile.interests.length > 0) score += 5;
    return Math.min(100, score);
  }, [profile]);

  return (
    <PortalContext.Provider
      value={{
        profile,
        updateProfile,
        tasks,
        updateTaskStatus,
        submitTask,
        achievements,
        readOnboardingIds,
        toggleOnboardingRead,
        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        submittedTasks,
        pendingTasks,
        completionPercentage,
        profileCompletion,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}

      {/* Floating Demo Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              toast.type === "success"
                ? "bg-[#fffdfa] border-[#ead5c3] text-[#211b17]"
                : toast.type === "warning"
                ? "bg-[#fff8f0] border-[#f4c8a8] text-[#8e3914]"
                : "bg-white border-[#eee2d7] text-[#211b17]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  toast.type === "success"
                    ? "bg-[#f8e7d8] text-[#b65329]"
                    : "bg-[#f0e7df] text-[#796c62]"
                }`}
              >
                {toast.type === "success" ? "✓" : "ℹ"}
              </span>
              <p className="text-sm font-medium leading-5">{toast.text}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#99887c] hover:text-[#211b17] text-xs font-bold ml-2 shrink-0"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
