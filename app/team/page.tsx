"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";

export default function TeamPage() {
  const {
    currentUser,
    myTeam,
    createTeam,
    inviteToTeam,
    revokeInvitation,
    leaveTeam,
    joinTeamWithCode,
    showToast,
  } = usePortal();

  // Modal / Form states
  const [inviteEmail, setInviteEmail] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamDesc, setNewTeamDesc] = useState("");
  const [newTeamSize, setNewTeamSize] = useState(6);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState("");

  const isLeader =
    currentUser?.role === "TEAM_LEADER" || myTeam?.leaderId === currentUser?.id;

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim())) {
      showToast("Please enter a valid email address.", "warning");
      return;
    }
    const success = inviteToTeam(inviteEmail.trim());
    if (success) {
      setInviteEmail("");
    }
  };

  const handleCopyInvite = () => {
    if (!myTeam) return;
    const textToCopy = `Join my CauseKind volunteer squad "${myTeam.name}"! Use team code: ${myTeam.inviteCode} at https://causekind.com/register`;
    navigator.clipboard?.writeText(textToCopy);
    showToast(`Copied invitation text with code: ${myTeam.inviteCode}`, "success");
  };

  const handleCreateTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      showToast("Team name is required.", "warning");
      return;
    }
    createTeam(newTeamName, newTeamDesc, newTeamSize);
    setShowCreateModal(false);
    setNewTeamName("");
    setNewTeamDesc("");
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setJoinError("");
    const res = joinTeamWithCode(joinCodeInput);
    if (!res.success) {
      setJoinError(res.error || "Failed to join team.");
      return;
    }
    setShowJoinModal(false);
    setJoinCodeInput("");
  };

  return (
    <PortalLayout>
      {/* Top Banner & Title */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Collaborative Outreach
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            {myTeam ? myTeam.name : "Team Collaboration Hub"}
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            {myTeam
              ? `Team ID: ${myTeam.id} • Coordinated by ${myTeam.leaderName}`
              : "Form or join a student delegation to participate in group outreach drives."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {myTeam ? (
            <>
              <button
                onClick={handleCopyInvite}
                className="inline-flex items-center gap-2 rounded-full bg-[#f8e7d8] px-4 py-2 text-xs font-bold text-[#ad5127] hover:bg-[#fadbc3] transition"
              >
                <span>📋</span> Copy Team Code ({myTeam.inviteCode})
              </button>
              <button
                onClick={leaveTeam}
                className="rounded-full border border-[#e4d8cc] bg-white px-4 py-2 text-xs font-semibold text-[#8a7a6f] hover:text-[#a63d23] hover:border-[#f0c9bc]"
              >
                Leave Team
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowJoinModal(true)}
                className="rounded-full border border-[#d8c8b9] bg-white px-4 py-2 text-xs font-bold text-[#211b17] hover:bg-[#faf7f3]"
              >
                Join with Code
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-[#ad5127] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#93421e]"
              >
                + Create Team
              </button>
            </div>
          )}
        </div>
      </div>

      {myTeam ? (
        <div className="mt-8 space-y-8">
          {/* Team Overview Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                Team ID
              </span>
              <p className="mt-2 font-serif text-2xl font-bold text-[#ad5127]">
                {myTeam.id}
              </p>
              <p className="mt-1 text-[11px] text-[#86776b]">
                Code: <strong className="text-[#211b17]">{myTeam.inviteCode}</strong>
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                Members Active
              </span>
              <p className="mt-2 font-serif text-2xl font-bold text-[#211b17]">
                {myTeam.members.length} / {myTeam.maxSize}
              </p>
              <p className="mt-1 text-[11px] text-[#86776b]">
                {myTeam.maxSize - myTeam.members.length} slots remaining
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                Verification Status
              </span>
              <div className="mt-2">
                <span className="inline-flex rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
                  {myTeam.verificationStatus === "VERIFIED"
                    ? "✓ Verified Team"
                    : "⏳ Pending Verification"}
                </span>
              </div>
              <p className="mt-2 text-[11px] text-[#86776b]">
                {myTeam.college}
              </p>
            </div>

            <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-[#796c62]">
                Pending Invites
              </span>
              <p className="mt-2 font-serif text-2xl font-bold text-[#ad5127]">
                {myTeam.invitations.filter((i) => i.status === "PENDING").length}
              </p>
              <p className="mt-1 text-[11px] text-[#86776b]">
                Awaiting student confirmation
              </p>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Left 2 Columns: Members List & Invites */}
            <div className="space-y-6 lg:col-span-2">
              {/* Member List */}
              <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-[#f0e7df] pb-4">
                  <h2 className="font-serif text-lg font-bold text-[#211b17]">
                    Active Squad Members ({myTeam.members.length})
                  </h2>
                  <span className="text-xs text-[#796c62]">
                    Capacity: {myTeam.maxSize} max
                  </span>
                </div>

                <div className="mt-4 divide-y divide-[#f2e9e1]">
                  {myTeam.members.map((m) => (
                    <div
                      key={m.userId}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f8e7d8] font-bold text-xs text-[#ad5127]">
                          {m.name
                            .split(" ")
                            .map((p) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-[#211b17]">
                              {m.name}
                            </h4>
                            {m.role === "LEADER" && (
                              <span className="rounded-full bg-[#211b17] px-2 py-0.5 text-[9px] font-bold text-white">
                                Leader
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#796c62]">{m.email}</p>
                          <p className="text-[10px] text-[#9a897c]">{m.college}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            m.verificationStatus === "VERIFIED"
                              ? "bg-[#f8e7d8] text-[#ad5127]"
                              : "bg-[#fff2e6] text-[#d97736]"
                          }`}
                        >
                          {m.verificationStatus === "VERIFIED"
                            ? "✓ Verified"
                            : "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pending Invitations Table */}
              <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
                <h3 className="font-serif text-base font-bold text-[#211b17] border-b border-[#f0e7df] pb-3">
                  Pending Invitations ({myTeam.invitations.length})
                </h3>

                {myTeam.invitations.length > 0 ? (
                  <div className="mt-4 divide-y divide-[#f2e9e1] text-xs">
                    {myTeam.invitations.map((inv) => (
                      <div
                        key={inv.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-3"
                      >
                        <div>
                          <p className="font-semibold text-[#211b17]">{inv.email}</p>
                          <span className="text-[10px] text-[#9a897c]">
                            Dispatched on: {inv.sentAt}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              inv.status === "PENDING"
                                ? "bg-[#fff5e8] text-[#d97736]"
                                : inv.status === "ACCEPTED"
                                ? "bg-[#f8e7d8] text-[#ad5127]"
                                : "bg-[#f0e8e0] text-[#796c62]"
                            }`}
                          >
                            {inv.status}
                          </span>
                          {inv.status === "PENDING" && isLeader && (
                            <button
                              onClick={() => revokeInvitation(inv.id)}
                              className="text-[11px] font-bold text-[#a63d23] hover:underline"
                            >
                              Revoke
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-xs text-[#86776b]">
                    No pending invitations. Use the invite box on the right to add peers.
                  </p>
                )}
              </div>
            </div>

            {/* Right Column: Invite Form & Team Shareable Card */}
            <div className="space-y-6">
              {/* Invite Member Box */}
              <div className="rounded-2xl border border-[#eee2d7] bg-[#fffaf5] p-6 shadow-sm">
                <h3 className="font-serif text-base font-bold text-[#211b17]">
                  Invite a College Peer
                </h3>
                <p className="mt-1 text-xs text-[#796c62]">
                  Send an official invite to their email address.
                </p>

                <form onSubmit={handleSendInvite} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#483c32] mb-1">
                      Peer Student Email
                    </label>
                    <input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="student@college.edu"
                      className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-full bg-[#ad5127] py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#93421e] transition"
                  >
                    Send Team Invitation →
                  </button>
                </form>
              </div>

              {/* Shareable Link Card */}
              <div className="rounded-2xl border border-[#eedfd2] bg-white p-6 shadow-sm">
                <h3 className="font-serif text-base font-bold text-[#211b17]">
                  Shareable Team Code
                </h3>
                <p className="mt-1 text-xs text-[#796c62]">
                  Peers can type this code during registration or from their dashboard.
                </p>

                <div className="mt-4 flex items-center justify-between rounded-xl bg-[#faf5f0] p-3 border border-[#eedfd2]">
                  <span className="font-mono text-base font-bold text-[#ad5127]">
                    {myTeam.inviteCode}
                  </span>
                  <button
                    onClick={handleCopyInvite}
                    className="rounded-lg bg-white px-3 py-1 text-xs font-bold text-[#ad5127] border border-[#e4d8cc] hover:bg-[#faf3ed]"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State: User is not yet part of any team */
        <div className="mt-12 mx-auto max-w-xl text-center rounded-[28px] border border-[#eee2d7] bg-white p-8 sm:p-12 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8e7d8] text-3xl text-[#ad5127]">
            👥
          </div>
          <h2 className="mt-4 font-serif text-2xl font-bold text-[#211b17]">
            You have not joined a team yet
          </h2>
          <p className="mt-2 text-xs leading-6 text-[#796c62]">
            Collaborate on larger community drives with college peers! You can either form a brand new team as Leader, or join an existing squad using an invitation code.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="w-full sm:w-auto rounded-full border border-[#d6c7b9] bg-white px-6 py-3 text-xs font-bold text-[#211b17] hover:bg-[#faf7f3]"
            >
              Enter Invitation Code
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="w-full sm:w-auto rounded-full bg-[#ad5127] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
            >
              + Create a New Team
            </button>
          </div>
        </div>
      )}

      {/* CREATE TEAM MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[#eee2d7] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Create a New Team
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#89796d] text-xs font-bold hover:text-[#211b17]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTeamSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  placeholder="e.g. CRCE Social Impact Squad"
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Team Purpose / Description
                </label>
                <textarea
                  rows={3}
                  value={newTeamDesc}
                  onChange={(e) => setNewTeamDesc(e.target.value)}
                  placeholder="Focusing on Bandra survey campaigns and primary school learning kit assembly."
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] p-3 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Maximum Team Members
                </label>
                <input
                  type="number"
                  min={2}
                  max={20}
                  value={newTeamSize}
                  onChange={(e) => setNewTeamSize(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#796c62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  Create Team & Generate Code →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOIN TEAM MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/50 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-[#eee2d7] bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-3">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Join an Existing Team
              </h3>
              <button
                onClick={() => setShowJoinModal(false)}
                className="text-[#89796d] text-xs font-bold hover:text-[#211b17]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleJoinTeamSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Team Invitation Code or Team ID *
                </label>
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value)}
                  placeholder="e.g. CK-BANDRA-26 or CK-TEAM-8921"
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                />
              </div>

              {joinError && (
                <p className="rounded-xl border border-[#f2c7b8] bg-[#fff3ef] p-3 text-xs text-[#a6381e]">
                  {joinError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#796c62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                >
                  Join Team Now →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
