"use client";

import React, { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { TaskCard } from "@/components/portal/TaskCard";
import { usePortal } from "@/lib/portal-context";
import { TaskCategory } from "@/lib/types";

export default function TasksPage() {
  const {
    tasks,
    totalTasks,
    completedTasks,
    inProgressTasks,
    submittedTasks,
    notStartedTasks,
  } = usePortal();

  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"dueDate" | "priority" | "status">("dueDate");

  // Filtering and Searching
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        selectedStatus === "All" || task.status === selectedStatus;
      const matchesCategory =
        selectedCategory === "All" || task.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesStatus && matchesCategory && matchesQuery;
    }).sort((a, b) => {
      if (sortBy === "dueDate") {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === "priority") {
        const pOrder: Record<string, number> = { High: 1, Medium: 2, Low: 3 };
        return pOrder[a.priority] - pOrder[b.priority];
      }
      return a.status.localeCompare(b.status);
    });
  }, [tasks, selectedStatus, selectedCategory, searchQuery, sortBy]);

  const categories: TaskCategory[] = [
    "Field Outreach",
    "Research & Survey",
    "Documentation",
    "Community Engagement",
    "Digital Advocacy",
  ];

  const statusTabs: { label: string; value: string; count: number }[] = [
    { label: "All Tasks", value: "All", count: totalTasks },
    { label: "In Progress", value: "In Progress", count: inProgressTasks },
    { label: "Not Started", value: "Not Started", count: notStartedTasks },
    { label: "Submitted", value: "Submitted", count: submittedTasks },
    { label: "Completed", value: "Completed", count: completedTasks },
  ];

  return (
    <PortalLayout>
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Work Tracking
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Internship Tasks & Submissions
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Start assigned activities, log hours, and submit field deliverables.
          </p>
        </div>

        {/* Quick summary pill */}
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f8e7d8] px-4 py-2 text-xs font-bold text-[#ad5127]">
            {completedTasks} / {totalTasks} Completed
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#eee5dc] pb-3">
          {statusTabs.map((tab) => {
            const isSelected = selectedStatus === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatus(tab.value)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition ${
                  isSelected
                    ? "bg-[#ad5127] text-white shadow-sm"
                    : "bg-white text-[#796c62] border border-[#e8ddd3] hover:bg-[#faf7f3] hover:text-[#211b17]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-[#f4ebe1] text-[#796c62]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search and Secondary Category / Sorting Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, or task ID..."
              className="w-full rounded-full border border-[#e4d8cc] bg-white py-2.5 pl-10 pr-4 text-xs outline-none transition placeholder:text-[#a69688] focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
            />
            <span className="absolute left-3.5 top-3 text-[#9a897c]">
              🔍
            </span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-2.5 text-xs text-[#a69688] hover:text-[#211b17]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-full border border-[#e4d8cc] bg-white px-3.5 py-2 text-xs font-medium text-[#5c4f44] outline-none focus:border-[#ad5127]"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "dueDate" | "priority" | "status")}
              className="rounded-full border border-[#e4d8cc] bg-white px-3.5 py-2 text-xs font-medium text-[#5c4f44] outline-none focus:border-[#ad5127]"
            >
              <option value="dueDate">Sort: Due Date</option>
              <option value="priority">Sort: Priority</option>
              <option value="status">Sort: Status</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List Cards */}
      <div className="mt-6">
        {filteredTasks.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-[#d9ccbe] bg-[#fffcf9] p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#b65329]">
              📋
            </span>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#211b17]">
              No tasks match your filters
            </h3>
            <p className="mt-1 text-xs text-[#796c62]">
              Try adjusting your search query, status selection, or category filter.
            </p>
            <button
              onClick={() => {
                setSelectedStatus("All");
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 rounded-full bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
