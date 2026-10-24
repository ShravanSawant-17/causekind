"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { UserAccount, TaskItem } from "@/lib/types";

type AdminTab =
  | "DASHBOARD"
  | "VOLUNTEERS"
  | "TEAMS"
  | "CAMPAIGNS"
  | "TASKS"
  | "DOCUMENTS"
  | "AUDIT";

export default function AdminPage() {
  const {
    currentUser,
    accounts,
    teams,
    campaigns,
    tasks,
    templates,
    auditEvents,
    approveVerification,
    rejectVerification,
    requestCorrections,
    toggleAccountStatus,
    toggleCampaignPublish,
    createCampaign,
    createTask,
    reviewSubmission,
    showToast,
  } = usePortal();

  const [activeTab, setActiveTab] = useState<AdminTab>("DASHBOARD");

  // Volunteer Filter & Search
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("ALL");
  const [selectedAccountModal, setSelectedAccountModal] = useState<UserAccount | null>(null);
  const [reviewNotesInput, setReviewNotesInput] = useState("");

  // Campaign creation modal
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [newCampTitle, setNewCampTitle] = useState("");
  const [newCampDesc, setNewCampDesc] = useState("");
  const [newCampCat, setNewCampCat] = useState("Field Outreach");
  const [newCampLoc, setNewCampLoc] = useState("Mumbai");
  const [newCampStart, setNewCampStart] = useState("2026-11-01");
  const [newCampEnd, setNewCampEnd] = useState("2026-11-15");
  const [newCampCap, setNewCampCap] = useState(25);

  // Task creation modal
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskCat, setNewTaskCat] = useState<TaskItem["category"]>("Field Outreach");
  const [newTaskPriority, setNewTaskPriority] = useState<TaskItem["priority"]>("Medium");
  const [newTaskDue, setNewTaskDue] = useState("2026-11-10");
  const [newTaskHours, setNewTaskHours] = useState(4);

  // Task review modal
  const [reviewTaskModal, setReviewTaskModal] = useState<TaskItem | null>(null);
  const [taskFeedbackInput, setTaskFeedbackInput] = useState("");

  // Calculated Stats
  const totalAccounts = accounts.length;
  const pendingVerifications = accounts.filter(
    (a) => a.verificationStatus === "PENDING_VERIFICATION"
  ).length;
  const verifiedVolunteers = accounts.filter(
    (a) => a.verificationStatus === "VERIFIED"
  ).length;
  const totalTeamsCount = teams.length;
  const activeCampaignsCount = campaigns.filter((c) => c.status === "PUBLISHED").length;
  const pendingTaskSubmissions = tasks.filter((t) => t.status === "Submitted").length;

  // Filtered Volunteers
  const filteredVolunteers = useMemo(() => {
    return accounts.filter((acc) => {
      const matchQuery =
        volunteerSearch.trim() === "" ||
        acc.profile.name.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
        acc.email.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
        acc.profile.institution.toLowerCase().includes(volunteerSearch.toLowerCase());
      const matchStatus =
        verificationFilter === "ALL" || acc.verificationStatus === verificationFilter;
      return matchQuery && matchStatus;
    });
  }, [accounts, volunteerSearch, verificationFilter]);

  const handleCreateCampaignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampTitle.trim()) {
      showToast("Campaign title is required", "warning");
      return;
    }
    createCampaign({
      title: newCampTitle.trim(),
      description: newCampDesc.trim(),
      category: newCampCat,
      location: newCampLoc,
      startDate: newCampStart,
      endDate: newCampEnd,
      capacity: newCampCap,
      status: "PUBLISHED",
      eligibility: "Verified Cohort Interns",
    });
    setShowCreateCampaign(false);
    setNewCampTitle("");
    setNewCampDesc("");
  };

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      showToast("Task title is required", "warning");
      return;
    }
    createTask({
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim(),
      category: newTaskCat,
      priority: newTaskPriority,
      assignedDate: "2026-10-24",
      dueDate: newTaskDue,
      status: "Not Started",
      estimatedHours: newTaskHours,
      guidelines: [
        "Follow standard field outreach and consent procedures",
        "Submit evidence spreadsheet or photo proof before deadline",
      ],
    });
    setShowCreateTask(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
  };

  const handleApproveFromModal = (acc: UserAccount) => {
    approveVerification(acc.id, reviewNotesInput || "Document verified by CauseKind Admin.");
    setSelectedAccountModal(null);
    setReviewNotesInput("");
  };

  const handleRejectFromModal = (acc: UserAccount) => {
    rejectVerification(acc.id, reviewNotesInput || "Incomplete documentation or unverified institution.");
    setSelectedAccountModal(null);
    setReviewNotesInput("");
  };

  const handleRequestCorrectionsModal = (acc: UserAccount) => {
    requestCorrections(acc.id, reviewNotesInput || "Please upload a clearer scan of your student ID card.");
    setSelectedAccountModal(null);
    setReviewNotesInput("");
  };

  return (
    <div className="min-h-screen bg-[#faf7f3] text-[#211b17] flex flex-col">
      {/* Compact Dedicated Admin Header */}
      <header className="sticky top-0 z-40 border-b border-[#211b17]/10 bg-[#211b17] text-white">
        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
              <span className="text-2xl text-[#b45a2b]">♡</span>
              <span>
                Cause<span className="text-[#b45a2b]">Kind</span>
              </span>
            </Link>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold tracking-widest text-[#f8e7d8]">
              ADMINISTRATION PORTAL
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#f8e7d8] hover:bg-white/20 transition"
            >
              ← Back to Volunteer Portal
            </Link>
            <div className="flex items-center gap-2 pl-2 border-l border-white/20">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ad5127] text-xs font-bold text-white">
                AD
              </div>
              <span className="text-xs font-bold hidden sm:inline">Admin Workspace</span>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Subnav Menu */}
      <div className="border-b border-[#eee2d7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2 sm:px-8">
          {[
            { id: "DASHBOARD", label: "📊 Overview" },
            { id: "VOLUNTEERS", label: `👥 Volunteers (${pendingVerifications} Pending)` },
            { id: "TEAMS", label: `🤝 Teams (${totalTeamsCount})` },
            { id: "CAMPAIGNS", label: `🎯 Campaigns (${activeCampaignsCount})` },
            { id: "TASKS", label: `📋 Tasks & Submissions (${pendingTaskSubmissions} Review)` },
            { id: "DOCUMENTS", label: "📄 Document Templates" },
            { id: "AUDIT", label: "🔒 Audit Log & Security" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as AdminTab)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "bg-[#ad5127] text-white shadow-sm"
                  : "text-[#796c62] hover:bg-[#faf7f3] hover:text-[#211b17]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 sm:px-8">
        {/* A. ADMIN DASHBOARD OVERVIEW */}
        {activeTab === "DASHBOARD" && (
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#ad5127]">
                Program Administration
              </span>
              <h1 className="mt-1 font-serif text-3xl font-bold text-[#211b17]">
                Executive Cohort Metrics
              </h1>
              <p className="mt-1 text-sm text-[#796c62]">
                Real-time volunteer pipeline, team mobilizations, campaign engagement, and compliance approvals.
              </p>
            </div>

            {/* Metrics Cards */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                  Registered Accounts
                </span>
                <p className="mt-2 font-serif text-4xl font-bold text-[#211b17]">
                  {totalAccounts}
                </p>
                <p className="mt-1 text-xs text-[#89796d]">
                  Across 8 affiliated universities
                </p>
              </div>

              <div className="rounded-2xl border border-[#eed8c5] bg-[#fffaf5] p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ad5127]">
                  Pending Verification
                </span>
                <p className="mt-2 font-serif text-4xl font-bold text-[#ad5127]">
                  {pendingVerifications}
                </p>
                <button
                  onClick={() => setActiveTab("VOLUNTEERS")}
                  className="mt-1 text-xs font-bold text-[#ad5127] hover:underline"
                >
                  Review documents now →
                </button>
              </div>

              <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                  Verified Interns
                </span>
                <p className="mt-2 font-serif text-4xl font-bold text-[#211b17]">
                  {verifiedVolunteers}
                </p>
                <p className="mt-1 text-xs text-[#89796d]">
                  Active in field outreach & advocacy
                </p>
              </div>

              <div className="rounded-2xl border border-[#eed8c5] bg-[#fffaf5] p-5 shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-[#ad5127]">
                  Pending Submissions
                </span>
                <p className="mt-2 font-serif text-4xl font-bold text-[#ad5127]">
                  {pendingTaskSubmissions}
                </p>
                <button
                  onClick={() => setActiveTab("TASKS")}
                  className="mt-1 text-xs font-bold text-[#ad5127] hover:underline"
                >
                  Evaluate intern work →
                </button>
              </div>
            </div>

            {/* Middle Grid: Pending Verifications Quick List & Active Campaigns */}
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Urgent Verifications Queue */}
              <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#211b17]">
                    Verification Review Queue ({pendingVerifications})
                  </h3>
                  <button
                    onClick={() => setActiveTab("VOLUNTEERS")}
                    className="text-xs font-bold text-[#ad5127] hover:underline"
                  >
                    View All →
                  </button>
                </div>

                <div className="mt-4 divide-y divide-[#f2e9e1] text-xs">
                  {accounts
                    .filter((a) => a.verificationStatus === "PENDING_VERIFICATION")
                    .slice(0, 4)
                    .map((acc) => (
                      <div
                        key={acc.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <p className="font-bold text-[#211b17]">{acc.profile.name}</p>
                          <p className="text-[11px] text-[#796c62]">
                            {acc.profile.institution} • {acc.profile.course}
                          </p>
                          <span className="text-[10px] text-[#9a897c]">
                            {acc.documents?.length || 0} document(s) uploaded
                          </span>
                        </div>
                        <button
                          onClick={() => setSelectedAccountModal(acc)}
                          className="rounded-full bg-[#ad5127] px-3.5 py-1 text-xs font-bold text-white hover:bg-[#93421e]"
                        >
                          Review →
                        </button>
                      </div>
                    ))}
                  {pendingVerifications === 0 && (
                    <p className="py-4 text-center text-xs text-[#86776b]">
                      All pending volunteer verifications are cleared.
                    </p>
                  )}
                </div>
              </div>

              {/* Recent Audit Stream */}
              <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#211b17]">
                    Recent Administrative Actions
                  </h3>
                  <button
                    onClick={() => setActiveTab("AUDIT")}
                    className="text-xs font-bold text-[#ad5127] hover:underline"
                  >
                    Audit Log →
                  </button>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  {auditEvents.slice(0, 4).map((evt) => (
                    <div
                      key={evt.id}
                      className="rounded-xl border border-[#ede3d8] bg-[#fffaf5] p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#ad5127]">{evt.action}</span>
                        <span className="text-[10px] text-[#9a897c]">{evt.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[#5c4e43]">{evt.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* B. VOLUNTEERS & ACCOUNTS DIRECTORY */}
        {activeTab === "VOLUNTEERS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee5dc] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                  Volunteer Directory & Verification
                </h2>
                <p className="text-xs text-[#796c62]">
                  Inspect student records, review uploaded identity cards, approve or request corrections.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={volunteerSearch}
                  onChange={(e) => setVolunteerSearch(e.target.value)}
                  placeholder="Search name, email, college..."
                  className="rounded-full border border-[#e4d8cc] bg-white px-4 py-2 text-xs outline-none focus:border-[#ad5127]"
                />

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value)}
                  className="rounded-full border border-[#e4d8cc] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#ad5127]"
                >
                  <option value="ALL">All Verification States</option>
                  <option value="PENDING_VERIFICATION">Pending Verification</option>
                  <option value="VERIFIED">Verified</option>
                  <option value="CORRECTIONS_REQUESTED">Corrections Requested</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>

            {/* Volunteer Table */}
            <div className="overflow-x-auto rounded-2xl border border-[#eee2d7] bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#f0e7df] bg-[#faf6f1] text-[11px] font-bold uppercase tracking-wider text-[#796c62]">
                  <tr>
                    <th className="p-4">Intern Name & Email</th>
                    <th className="p-4">College / Institution</th>
                    <th className="p-4">Role & Status</th>
                    <th className="p-4">Verification</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9e1]">
                  {filteredVolunteers.map((acc) => (
                    <tr key={acc.id} className="hover:bg-[#fffaf5] transition">
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ad5127] text-xs font-bold text-white">
                            {acc.profile.initials}
                          </div>
                          <div>
                            <p className="font-bold text-[#211b17]">{acc.profile.name}</p>
                            <p className="text-[11px] text-[#796c62]">{acc.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-[#5f5146]">
                        <p className="font-medium text-[#211b17] truncate max-w-xs">
                          {acc.profile.institution}
                        </p>
                        <p className="text-[10px] text-[#9a897c]">
                          {acc.profile.course} ({acc.profile.year})
                        </p>
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-[#ad5127] block">
                          {acc.role}
                        </span>
                        <span
                          className={`inline-block mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                            acc.status === "ACTIVE"
                              ? "bg-[#eaf5ea] text-[#1b6e22]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {acc.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            acc.verificationStatus === "VERIFIED"
                              ? "bg-[#f8e7d8] text-[#ad5127]"
                              : acc.verificationStatus === "PENDING_VERIFICATION"
                              ? "bg-[#fff2e6] text-[#d97736]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {acc.verificationStatus}
                        </span>
                        <p className="text-[10px] text-[#9a897c] mt-0.5">
                          {acc.documents?.length || 0} doc(s)
                        </p>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedAccountModal(acc)}
                          className="rounded-lg bg-[#ad5127] px-3 py-1 text-xs font-bold text-white hover:bg-[#93421e]"
                        >
                          Review & Verify
                        </button>
                        <button
                          onClick={() => toggleAccountStatus(acc.id)}
                          className="rounded-lg border border-[#e4d8cc] px-2.5 py-1 text-xs text-[#796c62] hover:bg-[#faf7f3]"
                        >
                          {acc.status === "ACTIVE" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* C. TEAM MANAGEMENT */}
        {activeTab === "TEAMS" && (
          <div className="space-y-6">
            <div className="border-b border-[#eee5dc] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                Active Delegations & Teams ({teams.length})
              </h2>
              <p className="text-xs text-[#796c62]">
                Inspect student cohorts, leaders, member rosters, and college delegations.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {teams.map((t) => (
                <div
                  key={t.id}
                  className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                        Team ID: {t.id}
                      </span>
                      <h3 className="font-serif text-xl font-bold text-[#211b17]">
                        {t.name}
                      </h3>
                      <p className="text-xs text-[#796c62]">{t.college}</p>
                    </div>
                    <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
                      {t.verificationStatus}
                    </span>
                  </div>

                  <p className="text-xs text-[#695d52]">{t.description}</p>

                  <div className="rounded-xl bg-[#faf5f0] p-3 text-xs border border-[#eee2d7]">
                    <p className="font-bold text-[#211b17]">
                      Leader: {t.leaderName} ({t.leaderEmail})
                    </p>
                    <p className="mt-1 text-[#796c62]">
                      Invite Code: <strong>{t.inviteCode}</strong> • Members: {t.members.length}/{t.maxSize}
                    </p>
                  </div>

                  <div className="border-t border-[#f0e7df] pt-3">
                    <h4 className="text-xs font-bold text-[#211b17] mb-2">
                      Roster:
                    </h4>
                    <div className="flex flex-wrap gap-2 text-xs">
                      {t.members.map((m) => (
                        <span
                          key={m.userId}
                          className="rounded-full bg-white border border-[#e4d8cc] px-2.5 py-0.5 text-[11px] text-[#5c4f44]"
                        >
                          {m.name} ({m.role})
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* D. CAMPAIGN MANAGEMENT */}
        {activeTab === "CAMPAIGNS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee5dc] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                  Outreach Campaigns ({campaigns.length})
                </h2>
                <p className="text-xs text-[#796c62]">
                  Create and publish field outreach drives, assign cohort teams, and track participation.
                </p>
              </div>

              <button
                onClick={() => setShowCreateCampaign(true)}
                className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
              >
                + Create New Campaign
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {campaigns.map((camp) => (
                <div
                  key={camp.id}
                  className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="rounded-full bg-[#f8e7d8] px-2.5 py-0.5 text-[10px] font-bold text-[#ad5127]">
                        {camp.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          camp.status === "PUBLISHED"
                            ? "bg-[#eaf5ea] text-[#1b6e22]"
                            : "bg-[#f0e8e0] text-[#796c62]"
                        }`}
                      >
                        {camp.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-lg font-bold text-[#211b17]">
                      {camp.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#695d52] leading-relaxed">
                      {camp.description}
                    </p>

                    <div className="mt-4 space-y-1 text-xs text-[#86776b]">
                      <p>📍 Location: {camp.location}</p>
                      <p>
                        📅 Dates: {camp.startDate} to {camp.endDate}
                      </p>
                      <p>
                        👥 Enrolled: {camp.enrolledCount} / {camp.capacity} volunteers
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-3 border-t border-[#f0e7df] flex items-center justify-between">
                    <button
                      onClick={() => toggleCampaignPublish(camp.id)}
                      className="text-xs font-bold text-[#ad5127] hover:underline"
                    >
                      {camp.status === "PUBLISHED" ? "Unpublish Drive" : "Publish Drive"}
                    </button>
                    <span className="text-[10px] text-[#9a897c]">ID: {camp.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* E. TASKS & SUBMISSIONS */}
        {activeTab === "TASKS" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee5dc] pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                  Cohort Tasks & Evidence Evaluations
                </h2>
                <p className="text-xs text-[#796c62]">
                  Assign new milestones, review intern work submissions, and issue reviewer endorsements.
                </p>
              </div>

              <button
                onClick={() => setShowCreateTask(true)}
                className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
              >
                + Assign New Task
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#eee2d7] bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#f0e7df] bg-[#faf6f1] text-[11px] font-bold uppercase tracking-wider text-[#796c62]">
                  <tr>
                    <th className="p-4">Task Title & Category</th>
                    <th className="p-4">Due Date</th>
                    <th className="p-4">Priority</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Submission Summary</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9e1]">
                  {tasks.map((task) => (
                    <tr key={task.id} className="hover:bg-[#fffaf5] transition">
                      <td className="p-4">
                        <p className="font-bold text-[#211b17]">{task.title}</p>
                        <p className="text-[10px] text-[#ad5127] font-semibold">
                          {task.category}
                        </p>
                      </td>
                      <td className="p-4 text-[#695d52]">{task.dueDate}</td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            task.priority === "High"
                              ? "bg-[#fee2e2] text-[#991b1b]"
                              : "bg-[#fff5e8] text-[#d97736]"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-[#ad5127]">{task.status}</td>
                      <td className="p-4 text-[#695d52] max-w-xs truncate">
                        {task.submission ? (
                          <span>
                            📄 {task.submission.fileName || "Summary provided"}
                          </span>
                        ) : (
                          <span className="text-[#a4968a]">No submission yet</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {task.submission && (
                          <button
                            onClick={() => {
                              setReviewTaskModal(task);
                              setTaskFeedbackInput(task.submission?.reviewerFeedback || "");
                            }}
                            className="rounded-lg bg-[#ad5127] px-3 py-1 text-xs font-bold text-white hover:bg-[#93421e]"
                          >
                            Review Work
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* F. DOCUMENT TEMPLATES */}
        {activeTab === "DOCUMENTS" && (
          <div className="space-y-6">
            <div className="border-b border-[#eee5dc] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                Compliance Document Templates
              </h2>
              <p className="text-xs text-[#796c62]">
                Manage official downloadable templates provided to cohort interns.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm space-y-2 text-xs"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                    {tmpl.category}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#211b17]">
                    {tmpl.title}
                  </h3>
                  <p className="text-[#695d52] leading-5">{tmpl.description}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-[#f0e7df]">
                    <span className="text-[#9a897c]">
                      {tmpl.fileName} ({tmpl.fileSize})
                    </span>
                    <span className="rounded-full bg-[#f8e7d8] px-3 py-0.5 text-[10px] font-bold text-[#ad5127]">
                      Active Template
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* G. AUDIT LOG & COMPLIANCE */}
        {activeTab === "AUDIT" && (
          <div className="space-y-6">
            <div className="border-b border-[#eee5dc] pb-4">
              <h2 className="font-serif text-2xl font-bold text-[#211b17]">
                Security Audit Log & Activity Trail
              </h2>
              <p className="text-xs text-[#796c62]">
                Tamper-evident record of administrative approvals, verifications, campaign statuses, and suspensions.
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#eee2d7] bg-white shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#f0e7df] bg-[#faf6f1] text-[11px] font-bold uppercase tracking-wider text-[#796c62]">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Acting Administrator</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Target Type & ID</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f2e9e1]">
                  {auditEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-[#fffaf5] transition">
                      <td className="p-4 text-[#8b796d] whitespace-nowrap">{evt.timestamp}</td>
                      <td className="p-4 font-bold text-[#211b17]">{evt.actorName}</td>
                      <td className="p-4">
                        <span className="font-bold text-[#ad5127]">{evt.action}</span>
                      </td>
                      <td className="p-4 text-[#695d52]">
                        {evt.targetType} ({evt.targetId})
                      </td>
                      <td className="p-4 text-[#5c4e43] max-w-sm">{evt.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* VERIFICATION MODAL */}
      {selectedAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-[#eee2d7] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                  Volunteer Review
                </span>
                <h3 className="font-serif text-xl font-bold text-[#211b17]">
                  {selectedAccountModal.profile.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedAccountModal(null)}
                className="text-xs font-bold text-[#89796d]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div className="grid gap-3 sm:grid-cols-2 bg-[#faf6f1] p-4 rounded-xl border border-[#ede3d8]">
                <div>
                  <strong>Email:</strong> {selectedAccountModal.email}
                </div>
                <div>
                  <strong>Phone:</strong> {selectedAccountModal.profile.phone}
                </div>
                <div>
                  <strong>Institution:</strong> {selectedAccountModal.profile.institution}
                </div>
                <div>
                  <strong>Degree & Year:</strong> {selectedAccountModal.profile.course} ({selectedAccountModal.profile.year})
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#211b17] mb-2 uppercase tracking-wider">
                  Submitted Verification Documents ({selectedAccountModal.documents?.length || 0})
                </h4>
                {selectedAccountModal.documents && selectedAccountModal.documents.length > 0 ? (
                  <div className="space-y-2">
                    {selectedAccountModal.documents.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-[#e8ddd3] bg-white"
                      >
                        <div>
                          <p className="font-bold text-[#211b17]">{d.title}</p>
                          <p className="text-[10px] text-[#796c62]">
                            📄 {d.fileName} ({d.fileSize}) • Status: {d.status}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-[#ad5127]">
                          ✓ Attached
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[#86776b] italic">
                    No documents uploaded yet by this intern.
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Reviewer Feedback / Verification Notes
                </label>
                <textarea
                  rows={3}
                  value={reviewNotesInput}
                  onChange={(e) => setReviewNotesInput(e.target.value)}
                  placeholder="e.g. Valid college enrollment verified. Approved for Fall cohort field campaigns."
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2 pt-4 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => handleRejectFromModal(selectedAccountModal)}
                  className="rounded-full bg-[#fee2e2] px-4 py-2 text-xs font-bold text-[#991b1b] hover:bg-[#fecaca]"
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  onClick={() => handleRequestCorrectionsModal(selectedAccountModal)}
                  className="rounded-full bg-[#fff2e8] px-4 py-2 text-xs font-bold text-[#d97736] hover:bg-[#fde6d2]"
                >
                  Request Corrections
                </button>
                <button
                  type="button"
                  onClick={() => handleApproveFromModal(selectedAccountModal)}
                  className="rounded-full bg-[#ad5127] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  ✓ Approve Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCreateCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eee2d7] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Create New Outreach Campaign
              </h3>
              <button
                onClick={() => setShowCreateCampaign(false)}
                className="text-xs font-bold text-[#89796d]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCampaignSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={newCampTitle}
                  onChange={(e) => setNewCampTitle(e.target.value)}
                  placeholder="e.g. Bandra West Health & Nutrition Survey"
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Description & Deliverables
                </label>
                <textarea
                  rows={3}
                  value={newCampDesc}
                  onChange={(e) => setNewCampDesc(e.target.value)}
                  placeholder="Document survey gaps, distribute kits, and compile weekly beneficiary report."
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={newCampCat}
                    onChange={(e) => setNewCampCat(e.target.value)}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Location / Area
                  </label>
                  <input
                    type="text"
                    value={newCampLoc}
                    onChange={(e) => setNewCampLoc(e.target.value)}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={newCampStart}
                    onChange={(e) => setNewCampStart(e.target.value)}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={newCampEnd}
                    onChange={(e) => setNewCampEnd(e.target.value)}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Max Volunteer Capacity
                  </label>
                  <input
                    type="number"
                    value={newCampCap}
                    onChange={(e) => setNewCampCap(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => setShowCreateCampaign(false)}
                  className="rounded-full px-4 py-2 font-semibold text-[#796c62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ad5127] px-6 py-2 font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  Publish Campaign →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TASK MODAL */}
      {showCreateTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eee2d7] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Create & Assign Cohort Task
              </h3>
              <button
                onClick={() => setShowCreateTask(false)}
                className="text-xs font-bold text-[#89796d]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Task Title *
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="e.g. Conduct School Outreach Survey"
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Description & Deliverable Instructions
                </label>
                <textarea
                  rows={3}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  placeholder="Collect demographic data and upload spreadsheet proof."
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Category
                  </label>
                  <select
                    value={newTaskCat}
                    onChange={(e) => setNewTaskCat(e.target.value as TaskItem["category"])}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  >
                    <option value="Field Outreach">Field Outreach</option>
                    <option value="Research & Survey">Research & Survey</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Community Engagement">Community Engagement</option>
                    <option value="Digital Advocacy">Digital Advocacy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) => setNewTaskPriority(e.target.value as TaskItem["priority"])}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Submission Due Date
                  </label>
                  <input
                    type="date"
                    value={newTaskDue}
                    onChange={(e) => setNewTaskDue(e.target.value)}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Est. Effort (Hours)
                  </label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full rounded-xl border border-[#e4d8cc] p-3 outline-none focus:border-[#ad5127]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => setShowCreateTask(false)}
                  className="rounded-full px-4 py-2 font-semibold text-[#796c62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ad5127] px-6 py-2 font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  Assign Task →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TASK REVIEW MODAL */}
      {reviewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eee2d7] bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Evaluate Task Submission
              </h3>
              <button
                onClick={() => setReviewTaskModal(null)}
                className="text-xs font-bold text-[#89796d]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <p className="font-bold text-[#211b17]">{reviewTaskModal.title}</p>
                <p className="text-[11px] text-[#796c62]">{reviewTaskModal.description}</p>
              </div>

              <div className="rounded-xl border border-[#ebd7c6] bg-[#fffaf5] p-4 space-y-1">
                <p className="font-bold text-[#ad5127]">Submitted Evidence Summary:</p>
                <p className="text-[#5c4e43]">
                  {reviewTaskModal.submission?.description || "No text summary"}
                </p>
                {reviewTaskModal.submission?.fileName && (
                  <p className="font-medium text-[#211b17] pt-1">
                    📎 {reviewTaskModal.submission.fileName} ({reviewTaskModal.submission.fileSize})
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Evaluator Feedback
                </label>
                <textarea
                  rows={3}
                  value={taskFeedbackInput}
                  onChange={(e) => setTaskFeedbackInput(e.target.value)}
                  placeholder="e.g. Excellent survey methodology and structured documentation."
                  className="w-full rounded-xl border border-[#e4d8cc] p-3 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => {
                    reviewSubmission(reviewTaskModal.id, false, taskFeedbackInput || "Revision requested.");
                    setReviewTaskModal(null);
                  }}
                  className="rounded-full bg-[#fff2e8] px-4 py-2 text-xs font-bold text-[#d97736]"
                >
                  Request Revision
                </button>
                <button
                  type="button"
                  onClick={() => {
                    reviewSubmission(reviewTaskModal.id, true, taskFeedbackInput || "Approved with distinction.");
                    setReviewTaskModal(null);
                  }}
                  className="rounded-full bg-[#ad5127] px-6 py-2 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  ✓ Approve & Mark Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
