"use client";

import React, { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { StatusBadge } from "@/components/portal/StatusBadge";
import { usePortal } from "@/lib/portal-context";
import { TaskItem } from "@/lib/types";

export default function CalendarPage() {
  const { tasks } = usePortal();

  // Current viewed month: default to October 2026 (matching cohort tasks)
  const [currentDate, setCurrentDate] = useState(new Date(2026, 9, 23));
  const [selectedDateString, setSelectedDateString] = useState<string>("2026-10-25");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date(2026, 9, 23));
    setSelectedDateString("2026-10-23");
  };

  // Generate days in month
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days: {
      dayNumber: number;
      dateString: string;
      isCurrentMonth: boolean;
      tasks: TaskItem[];
    }[] = [];

    // Prev month padding
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, day);
      const dateString = `${prevDate.getFullYear()}-${String(
        prevDate.getMonth() + 1
      ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

      const dayTasks = tasks.filter((t) => t.dueDate === dateString);
      days.push({
        dayNumber: day,
        dateString,
        isCurrentMonth: false,
        tasks: dayTasks,
      });
    }

    // Current month days
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => t.dueDate === dateString);
      days.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: true,
        tasks: dayTasks,
      });
    }

    // Next month padding to fill grid to 35 or 42
    const totalCells = days.length <= 35 ? 35 : 42;
    const remaining = totalCells - days.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      const dateString = `${nextDate.getFullYear()}-${String(
        nextDate.getMonth() + 1
      ).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => t.dueDate === dateString);
      days.push({
        dayNumber: d,
        dateString,
        isCurrentMonth: false,
        tasks: dayTasks,
      });
    }

    return days;
  }, [year, month, tasks]);

  // Tasks for the selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDateString);
  }, [tasks, selectedDateString]);

  // All upcoming deadlines across all months
  const allUpcoming = useMemo(() => {
    return [...tasks]
      .filter((t) => t.status !== "Completed")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [tasks]);

  return (
    <PortalLayout>
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Schedule & Milestones
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Internship Task Calendar
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Track assignment submission dates, outreach events, and cohort milestones.
          </p>
        </div>

        {/* Calendar Nav Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToday}
            className="rounded-full border border-[#d6c7b9] bg-white px-3.5 py-1.5 text-xs font-bold text-[#ad5127] hover:bg-[#faf7f3]"
          >
            Today (Oct 23)
          </button>
          <div className="flex items-center rounded-full border border-[#d6c7b9] bg-white p-0.5">
            <button
              onClick={handlePrevMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
              aria-label="Previous month"
            >
              ◀
            </button>
            <span className="px-3 text-xs font-bold text-[#211b17] min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              className="flex h-8 w-8 items-center justify-center rounded-full text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
              aria-label="Next month"
            >
              ▶
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Calendar Grid (2 columns on large screen) */}
        <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm lg:col-span-2">
          {/* Day of week labels */}
          <div className="grid grid-cols-7 gap-1 text-center pb-3 border-b border-[#f0e7df]">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span
                key={day}
                className="text-[11px] font-bold uppercase tracking-wider text-[#9a897c]"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Month Day Cells */}
          <div className="grid grid-cols-7 gap-1.5 pt-3">
            {calendarDays.map((cell, idx) => {
              const isSelected = cell.dateString === selectedDateString;
              const isToday = cell.dateString === "2026-10-23";
              const hasTasks = cell.tasks.length > 0;

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedDateString(cell.dateString)}
                  className={`group relative min-h-[78px] sm:min-h-[92px] rounded-xl p-1.5 text-left transition flex flex-col justify-between border ${
                    isSelected
                      ? "border-[#ad5127] bg-[#fffaf5] shadow-sm ring-2 ring-[#ad5127]/20"
                      : isToday
                      ? "border-[#e0bba6] bg-[#fbf5f0]"
                      : cell.isCurrentMonth
                      ? "border-[#f0e6dc] bg-white hover:border-[#dfcebf] hover:bg-[#faf7f3]"
                      : "border-transparent bg-[#faf7f4]/40 text-[#b5a79c]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? "flex h-5 w-5 items-center justify-center rounded-full bg-[#ad5127] text-white"
                          : cell.isCurrentMonth
                          ? "text-[#211b17]"
                          : "text-[#b8aba0]"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                    {hasTasks && (
                      <span className="flex h-2 w-2 rounded-full bg-[#ad5127]" />
                    )}
                  </div>

                  {/* Task Pills on date cell */}
                  <div className="mt-1 space-y-1 overflow-hidden">
                    {cell.tasks.slice(0, 2).map((t) => (
                      <div
                        key={t.id}
                        className={`truncate rounded px-1.5 py-0.5 text-[9px] font-semibold ${
                          t.status === "Completed"
                            ? "bg-[#f8e7d8] text-[#8e3914]"
                            : t.status === "In Progress"
                            ? "bg-[#fff4ec] text-[#ad5127] border border-[#f5d9c5]"
                            : "bg-[#f1ebe3] text-[#695c52]"
                        }`}
                        title={t.title}
                      >
                        {t.title}
                      </div>
                    ))}
                    {cell.tasks.length > 2 && (
                      <span className="text-[8px] font-bold text-[#ad5127]">
                        +{cell.tasks.length - 2} more
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[#796c62] pt-4 border-t border-[#f0e7df]">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ad5127]" />
              Has Assigned Deadline
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#d97736]" />
              In Progress
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#b8aba0]" />
              Other Months
            </span>
          </div>
        </div>

        {/* Right Sidebar: Selected Date Details & Chronological Deadlines */}
        <div className="space-y-6">
          {/* Selected Date Detail Card */}
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
              Selected Date
            </span>
            <h3 className="mt-1 font-serif text-xl font-bold text-[#211b17]">
              {selectedDateString}
            </h3>

            {selectedDateTasks.length > 0 ? (
              <div className="mt-4 space-y-3">
                {selectedDateTasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-xl border border-[#ede3d8] bg-[#fffaf5] p-3.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#ad5127]">
                        {t.category}
                      </span>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                    <h4 className="mt-1 font-bold text-[#211b17]">{t.title}</h4>
                    <p className="mt-1 text-[#6e6055] leading-relaxed">
                      {t.description}
                    </p>
                    <div className="mt-2 text-[11px] text-[#8e7e72]">
                      Est. Effort: {t.estimatedHours} hrs • Priority: {t.priority}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-[#e4d8cc] bg-[#faf7f3] p-5 text-center text-xs text-[#897a6e]">
                No deadline scheduled for this date.
              </div>
            )}
          </div>

          {/* Chronological Deadlines */}
          <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdfa] p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#211b17] border-b border-[#f0e7df] pb-3">
              Upcoming Cohort Deadlines
            </h3>
            <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
              {allUpcoming.map((task) => (
                <div
                  key={task.id}
                  onClick={() => setSelectedDateString(task.dueDate)}
                  className="cursor-pointer rounded-xl border border-[#eee2d7] bg-white p-3 text-xs transition hover:border-[#ad5127]"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#ad5127]">
                      {task.dueDate}
                    </span>
                    <StatusBadge status={task.status} size="sm" />
                  </div>
                  <p className="mt-1 font-semibold text-[#211b17] truncate">
                    {task.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
