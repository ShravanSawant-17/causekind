"use client";

import React, { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";

// ─── Types ────────────────────────────────────────────────────────────────────

type CertRequestStatus =
  | "Requested"
  | "Under Review"
  | "Approved"
  | "Issued"
  | "Rejected";

interface CertificateRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  requestedAt: string; // ISO string
  status: CertRequestStatus;
  certificateId?: string;
  adminNotes?: string;
  eligibilitySnapshot: {
    trackADeliverable: boolean;
    fieldRegistrations: boolean;
    bothTracks: boolean;
    complianceClearance: boolean;
    workRecorded: boolean;
  };
}

// ─── Eligibility Config ───────────────────────────────────────────────────────
// NOTE: These thresholds are configurable and preliminary.
// Final values subject to confirmation by Sahas Charitable Trust.
const ELIGIBILITY_CONFIG = {
  FIELD_REGISTRATIONS_REQUIRED: 5, // Stage 2 (Verified) or above
  MIN_COMPLETED_TASKS_BOTH_TRACKS: 3, // approximating "both tracks"
  MIN_WORK_RECORDED_TASKS: 3, // completedTasks threshold
} as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(isoString: string): string {
  const d = new Date(isoString);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EligibilityRow({
  passed,
  label,
  description,
}: {
  passed: boolean;
  label: string;
  description: string;
}) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
        passed
          ? "border-emerald-200 bg-emerald-50/60"
          : "border-[#f4c8a8] bg-[#fff8f3]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
          passed
            ? "bg-emerald-100 text-emerald-700"
            : "bg-[#f8e7d8] text-[#ad5127]"
        }`}
      >
        {passed ? "✓" : "✗"}
      </span>
      <div className="min-w-0">
        <p className={`text-sm font-semibold ${passed ? "text-emerald-800" : "text-[#211b17]"}`}>
          {label}
        </p>
        <p className={`text-xs mt-0.5 ${passed ? "text-emerald-600" : "text-[#796c62]"}`}>
          {description}
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: CertRequestStatus }) {
  const map: Record<CertRequestStatus, { color: string; label: string }> = {
    Requested: { color: "bg-blue-100 text-blue-700 border-blue-200", label: "Requested" },
    "Under Review": { color: "bg-amber-100 text-amber-700 border-amber-200", label: "Under Review" },
    Approved: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Approved" },
    Issued: { color: "bg-emerald-100 text-emerald-700 border-emerald-200", label: "Issued" },
    Rejected: { color: "bg-red-100 text-red-700 border-red-200", label: "Rejected" },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CertificatesPage() {
  const {
    currentUser,
    tasks,
    completedTasks,
    accounts,
    showToast,
  } = usePortal();

  // ── Local certificate request state (seeded empty) ──
  const [certRequests, setCertRequests] = useState<CertificateRequest[]>([]);

  // ── Modal state ──
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null); // requestId
  const [rejectNotes, setRejectNotes] = useState("");

  // ── Eligibility computation ──────────────────────────────────────────────

  // Rule 1: Track A Deliverable — at least one task in "Documentation" or "Digital Advocacy" is Completed
  const trackADeliverable = useMemo(() => {
    return tasks.some(
      (t) =>
        (t.category === "Documentation" || t.category === "Digital Advocacy") &&
        t.status === "Completed"
    );
  }, [tasks]);

  // Rule 2: Field Registrations — hardcoded demo value for USER-001 = 2, others = 0
  const fieldRegistrationsAchieved = currentUser?.id === "USER-001" ? 2 : 0;
  const fieldRegistrationsRequired = ELIGIBILITY_CONFIG.FIELD_REGISTRATIONS_REQUIRED;
  const fieldRegistrationsPassed = fieldRegistrationsAchieved >= fieldRegistrationsRequired;

  // Rule 3: Both Tracks — at least 3 completed tasks (approximating both tracks)
  const bothTracksPassed = completedTasks >= ELIGIBILITY_CONFIG.MIN_COMPLETED_TASKS_BOTH_TRACKS;

  // Rule 4: Compliance Clearance — verificationStatus === "VERIFIED"
  const compliancePassed = currentUser?.verificationStatus === "VERIFIED";

  // Rule 5: Work Recorded — completedTasks >= 3
  const workRecordedPassed = completedTasks >= ELIGIBILITY_CONFIG.MIN_WORK_RECORDED_TASKS;

  const eligibilityRules = [
    {
      passed: trackADeliverable,
      label: "Track A Deliverable",
      description: trackADeliverable
        ? `At least one Documentation or Digital Advocacy task completed`
        : "No Documentation or Digital Advocacy task marked Completed yet",
    },
    {
      passed: fieldRegistrationsPassed,
      label: "Field Registrations",
      description: fieldRegistrationsPassed
        ? `${fieldRegistrationsAchieved} verified field registrations (≥ ${fieldRegistrationsRequired})`
        : `${fieldRegistrationsAchieved}/${fieldRegistrationsRequired} verified registrations (Stage 2+) — need ${fieldRegistrationsRequired}`,
    },
    {
      passed: bothTracksPassed,
      label: "Both Tracks Completion",
      description: bothTracksPassed
        ? `${completedTasks} tasks completed (≥ ${ELIGIBILITY_CONFIG.MIN_COMPLETED_TASKS_BOTH_TRACKS} required)`
        : `${completedTasks}/${ELIGIBILITY_CONFIG.MIN_COMPLETED_TASKS_BOTH_TRACKS} tasks completed — complete more tasks`,
    },
    {
      passed: compliancePassed,
      label: "Compliance Clearance",
      description: compliancePassed
        ? "Account verified by CauseKind admin"
        : `Verification status: ${currentUser?.verificationStatus ?? "Unknown"} — admin approval required`,
    },
    {
      passed: workRecordedPassed,
      label: "Work Recorded",
      description: workRecordedPassed
        ? `${completedTasks} completed tasks on record (≥ ${ELIGIBILITY_CONFIG.MIN_WORK_RECORDED_TASKS})`
        : `${completedTasks}/${ELIGIBILITY_CONFIG.MIN_WORK_RECORDED_TASKS} completed tasks — keep working!`,
    },
  ];

  const passedCount = eligibilityRules.filter((r) => r.passed).length;
  const isEligible = passedCount === eligibilityRules.length;

  // ── Current user's request ──
  const myRequest = useMemo(
    () => certRequests.find((r) => r.userId === currentUser?.id) ?? null,
    [certRequests, currentUser]
  );

  // ── Submit certificate request ──
  function handleSubmitRequest() {
    if (!currentUser) return;
    const newRequest: CertificateRequest = {
      id: `CERT-REQ-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.profile.name,
      userEmail: currentUser.email,
      requestedAt: new Date().toISOString(),
      status: "Requested",
      eligibilitySnapshot: {
        trackADeliverable,
        fieldRegistrations: fieldRegistrationsPassed,
        bothTracks: bothTracksPassed,
        complianceClearance: compliancePassed,
        workRecorded: workRecordedPassed,
      },
    };
    setCertRequests((prev) => [newRequest, ...prev]);
    setShowRequestModal(false);
    showToast("Certificate request submitted! Admin will review shortly.", "success");
  }

  // ── Admin: approve ──
  function handleApprove(reqId: string) {
    const certId = `CK-CERT-2026-${Date.now().toString().slice(-3)}`;
    setCertRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: "Issued", certificateId: certId }
          : r
      )
    );
    showToast(`Certificate approved & issued — ID: ${certId}`, "success");
  }

  // ── Admin: reject ──
  function handleReject(reqId: string) {
    if (!rejectNotes.trim()) {
      showToast("Please enter rejection notes before rejecting.", "warning");
      return;
    }
    setCertRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, status: "Rejected", adminNotes: rejectNotes.trim() }
          : r
      )
    );
    setShowRejectDialog(null);
    setRejectNotes("");
    showToast("Certificate request rejected. Notes saved.", "info");
  }

  // ── Download simulation ──
  function handleDownload() {
    showToast(
      "PDF download simulated — backend integration required.",
      "info"
    );
  }

  const isAdmin = currentUser?.role === "ADMIN";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <PortalLayout>
      {/* ── Header ── */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Recognition &amp; Credentials
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Internship Certificates
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Track eligibility, request your certificate, and download issued certificates.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
              isEligible
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-[#f4c8a8] bg-[#fff8f3] text-[#ad5127]"
            }`}
          >
            {isEligible ? "✓ Eligible" : `${passedCount}/5 Requirements Met`}
          </span>
        </div>
      </div>

      {/* ── Preliminary Notice Banner ── */}
      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-200 text-xs font-bold text-amber-800">
          ⚠
        </span>
        <div>
          <p className="text-sm font-semibold text-amber-800">
            Preliminary Eligibility Criteria
          </p>
          <p className="mt-0.5 text-xs text-amber-700 leading-relaxed">
            Certificate eligibility criteria are subject to final confirmation by{" "}
            <strong>Sahas Charitable Trust</strong>. Current rules shown below are
            preliminary and may be revised before the final issuance date (November 2026).
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* ── Left Column: Eligibility Checker ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Eligibility Checker Card */}
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#211b17] font-serif">
                Your Certificate Eligibility
              </h2>
              <span className="text-xs text-[#796c62] font-medium">
                {passedCount} / {eligibilityRules.length} passed
              </span>
            </div>

            {/* Rules list */}
            <div className="space-y-3">
              {eligibilityRules.map((rule) => (
                <EligibilityRow
                  key={rule.label}
                  passed={rule.passed}
                  label={rule.label}
                  description={rule.description}
                />
              ))}
            </div>

            {/* Overall verdict */}
            <div
              className={`mt-5 rounded-xl border px-4 py-4 ${
                isEligible
                  ? "border-emerald-200 bg-emerald-50"
                  : "border-[#f4c8a8] bg-[#fff8f3]"
              }`}
            >
              {isEligible ? (
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white text-sm font-bold">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-bold text-emerald-800">
                      You are eligible to request a certificate!
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      All 5 requirements are satisfied. Submit your request below.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8e7d8] text-[#ad5127] text-sm font-bold shrink-0">
                    {passedCount}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-[#211b17]">
                      {passedCount} of 5 requirements met
                    </p>
                    <p className="text-xs text-[#796c62] mt-0.5">
                      Complete the remaining{" "}
                      {eligibilityRules.length - passedCount} requirement
                      {eligibilityRules.length - passedCount !== 1 ? "s" : ""}{" "}
                      to become eligible for a certificate.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Certificate Request / Status Section ── */}
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-[#211b17] font-serif mb-4">
              Certificate Request
            </h2>

            {/* No request yet */}
            {!myRequest && (
              <>
                {isEligible ? (
                  <div className="text-center py-6">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f8e7d8]">
                      <span className="text-2xl">🎓</span>
                    </div>
                    <p className="text-sm font-semibold text-[#211b17] mb-1">
                      Ready to request your certificate
                    </p>
                    <p className="text-xs text-[#796c62] mb-5">
                      Your eligibility has been verified. Submit your request for admin review.
                    </p>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#ad5127] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#8f4120] transition-colors"
                    >
                      🎓 Request Certificate
                    </button>
                  </div>
                ) : (
                  <div className="rounded-xl border border-[#eee2d7] bg-[#faf7f3] px-4 py-5 text-center">
                    <p className="text-sm text-[#796c62]">
                      Complete all 5 eligibility requirements before submitting a certificate request.
                    </p>
                    <p className="text-xs text-[#ad5127] mt-1 font-medium">
                      {eligibilityRules.length - passedCount} requirement
                      {eligibilityRules.length - passedCount !== 1 ? "s" : ""} remaining
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Request submitted / under review */}
            {myRequest &&
              (myRequest.status === "Requested" ||
                myRequest.status === "Under Review") && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-200 text-blue-700 text-base">
                      ⏳
                    </span>
                    <div>
                      <p className="text-sm font-bold text-blue-800">
                        Certificate request submitted
                      </p>
                      <p className="text-xs text-blue-600">
                        Submitted on {formatDateTime(myRequest.requestedAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-blue-700 font-medium">Status:</span>
                    <StatusBadge status={myRequest.status} />
                  </div>
                  <p className="mt-3 text-xs text-blue-600 leading-relaxed">
                    Your eligibility is being verified against our records. You will be
                    notified once the review is complete.
                  </p>
                </div>
              )}

            {/* Approved / Issued */}
            {myRequest &&
              (myRequest.status === "Approved" ||
                myRequest.status === "Issued") && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-5">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-200 text-emerald-700 text-lg">
                        🏆
                      </span>
                      <div>
                        <p className="text-sm font-bold text-emerald-800">
                          Certificate Issued!
                        </p>
                        <p className="text-xs text-emerald-600">
                          Approved on {formatDateTime(myRequest.requestedAt)}
                        </p>
                      </div>
                    </div>
                    {myRequest.certificateId && (
                      <div className="mt-3 rounded-lg border border-emerald-200 bg-white px-4 py-3">
                        <p className="text-xs text-[#796c62] font-medium uppercase tracking-wider">
                          Certificate ID
                        </p>
                        <p className="text-base font-bold text-[#211b17] font-mono mt-0.5">
                          {myRequest.certificateId}
                        </p>
                      </div>
                    )}
                    <button
                      onClick={handleDownload}
                      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
                    >
                      ⬇ Download Certificate (PDF)
                    </button>
                  </div>

                  {/* Verify section */}
                  {myRequest.certificateId && (
                    <div className="rounded-xl border border-[#eee2d7] bg-[#faf7f3] px-5 py-4">
                      <p className="text-xs font-bold text-[#211b17] uppercase tracking-wider mb-2">
                        Verify Certificate
                      </p>
                      <p className="text-xs text-[#796c62] mb-2">
                        Share this unique ID to allow third parties to verify your internship
                        certificate with Sahas Charitable Trust.
                      </p>
                      <code className="block rounded-lg border border-[#eee2d7] bg-white px-3 py-2 text-sm font-mono text-[#ad5127]">
                        {myRequest.certificateId}
                      </code>
                      <p className="text-xs text-[#796c62] mt-2">
                        ✦ Certificate verification portal will be available at{" "}
                        <span className="font-medium text-[#211b17]">
                          verify.causekind.org
                        </span>{" "}
                        upon backend integration.
                      </p>
                    </div>
                  )}
                </div>
              )}

            {/* Rejected */}
            {myRequest && myRequest.status === "Rejected" && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-200 text-red-700 text-sm font-bold">
                    ✗
                  </span>
                  <div>
                    <p className="text-sm font-bold text-red-800">
                      Certificate request rejected
                    </p>
                    <p className="text-xs text-red-500">
                      Reviewed on {formatDateTime(myRequest.requestedAt)}
                    </p>
                  </div>
                </div>
                {myRequest.adminNotes && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-white px-4 py-3">
                    <p className="text-xs font-semibold text-red-700 mb-1">Admin Notes:</p>
                    <p className="text-sm text-[#211b17]">{myRequest.adminNotes}</p>
                  </div>
                )}
                <p className="text-xs text-red-600 mt-3">
                  Please resolve the issues mentioned and contact your coordinator to reapply.
                </p>
              </div>
            )}
          </div>

          {/* ── Issuance History ── */}
          {certRequests.filter((r) => r.userId === currentUser?.id).length > 0 && (
            <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-[#211b17] font-serif mb-4">
                Request History
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#eee2d7]">
                      <th className="pb-2 text-left text-xs font-semibold text-[#796c62] uppercase tracking-wider">
                        Request ID
                      </th>
                      <th className="pb-2 text-left text-xs font-semibold text-[#796c62] uppercase tracking-wider">
                        Date
                      </th>
                      <th className="pb-2 text-left text-xs font-semibold text-[#796c62] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="pb-2 text-left text-xs font-semibold text-[#796c62] uppercase tracking-wider">
                        Certificate ID
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5ede5]">
                    {certRequests
                      .filter((r) => r.userId === currentUser?.id)
                      .map((r) => (
                        <tr key={r.id}>
                          <td className="py-3 font-mono text-xs text-[#796c62]">
                            {r.id}
                          </td>
                          <td className="py-3 text-xs text-[#796c62]">
                            {formatDate(r.requestedAt)}
                          </td>
                          <td className="py-3">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="py-3 font-mono text-xs text-[#ad5127]">
                            {r.certificateId ?? "—"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Info Cards ── */}
        <div className="space-y-5">
          {/* Progress summary */}
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-bold text-[#211b17] mb-4">Eligibility Summary</h3>
            <div className="space-y-3">
              {eligibilityRules.map((r) => (
                <div key={r.label} className="flex items-center justify-between gap-2">
                  <span className="text-xs text-[#796c62] truncate">{r.label}</span>
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      r.passed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-[#f8e7d8] text-[#ad5127]"
                    }`}
                  >
                    {r.passed ? "✓" : "✗"}
                  </span>
                </div>
              ))}
            </div>
            {/* progress bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#796c62] mb-1">
                <span>Progress</span>
                <span>{passedCount}/{eligibilityRules.length}</span>
              </div>
              <div className="h-2 w-full rounded-full bg-[#f0e5da] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#ad5127] transition-all duration-500"
                  style={{ width: `${(passedCount / eligibilityRules.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Configurable rules note */}
          <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdf9] p-5">
            <h3 className="text-xs font-bold text-[#211b17] uppercase tracking-wider mb-3">
              📋 Eligibility Rules
            </h3>
            <ul className="space-y-2">
              <li className="text-xs text-[#796c62]">
                <span className="font-semibold text-[#211b17]">Track A Deliverable</span> —
                ≥1 Documentation/Digital Advocacy task completed
              </li>
              <li className="text-xs text-[#796c62]">
                <span className="font-semibold text-[#211b17]">Field Registrations</span> —
                ≥{fieldRegistrationsRequired} Stage 2+ verified registrations
              </li>
              <li className="text-xs text-[#796c62]">
                <span className="font-semibold text-[#211b17]">Both Tracks</span> —
                ≥{ELIGIBILITY_CONFIG.MIN_COMPLETED_TASKS_BOTH_TRACKS} tasks completed
              </li>
              <li className="text-xs text-[#796c62]">
                <span className="font-semibold text-[#211b17]">Compliance Clearance</span> —
                Admin-verified account
              </li>
              <li className="text-xs text-[#796c62]">
                <span className="font-semibold text-[#211b17]">Work Recorded</span> —
                ≥{ELIGIBILITY_CONFIG.MIN_WORK_RECORDED_TASKS} completed tasks on record
              </li>
            </ul>
            <p className="mt-3 text-xs text-amber-700 leading-relaxed">
              ⚠ These thresholds are preliminary and subject to change by Sahas Charitable Trust.
            </p>
          </div>

          {/* Certificate info */}
          <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdf9] p-5">
            <h3 className="text-xs font-bold text-[#211b17] uppercase tracking-wider mb-3">
              🎓 About Certificates
            </h3>
            <ul className="space-y-2 text-xs text-[#796c62]">
              <li>• Issued by Sahas Charitable Trust</li>
              <li>• Unique certificate ID for verification</li>
              <li>• Downloadable PDF (upon backend integration)</li>
              <li>• Includes internship period &amp; track details</li>
              <li>• Eligible for LinkedIn &amp; resume upload</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Admin Panel ── */}
      {isAdmin && (
        <div className="mt-10 rounded-2xl border-2 border-dashed border-[#f4c8a8] bg-[#fffaf5] p-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f8e7d8] text-[#ad5127] font-bold text-sm">
              ⚙
            </span>
            <div>
              <h2 className="text-lg font-bold text-[#211b17] font-serif">
                Admin Panel — Certificate Requests
              </h2>
              <p className="text-xs text-[#796c62]">
                Review, approve, or reject intern certificate requests.
              </p>
            </div>
          </div>

          {certRequests.length === 0 ? (
            <div className="rounded-xl border border-[#eee2d7] bg-white px-6 py-8 text-center">
              <p className="text-sm text-[#796c62]">No certificate requests submitted yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {certRequests.map((req) => {
                const intern = accounts.find((a) => a.id === req.userId);
                return (
                  <div
                    key={req.id}
                    className="rounded-xl border border-[#eee2d7] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-[#211b17]">
                          {req.userName}
                        </p>
                        <p className="text-xs text-[#796c62]">{req.userEmail}</p>
                        <p className="text-xs text-[#796c62] mt-0.5">
                          Requested: {formatDateTime(req.requestedAt)}
                        </p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    {/* Eligibility snapshot */}
                    <div className="mt-3 rounded-lg border border-[#f0e5da] bg-[#faf7f3] px-4 py-3">
                      <p className="text-xs font-semibold text-[#796c62] mb-2 uppercase tracking-wider">
                        Eligibility Snapshot
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Object.entries(req.eligibilitySnapshot).map(([key, val]) => (
                          <div key={key} className="flex items-center gap-1.5">
                            <span
                              className={`text-xs font-bold ${
                                val ? "text-emerald-600" : "text-red-500"
                              }`}
                            >
                              {val ? "✓" : "✗"}
                            </span>
                            <span className="text-xs text-[#796c62] capitalize">
                              {key.replace(/([A-Z])/g, " $1")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {req.certificateId && (
                      <p className="mt-2 text-xs text-emerald-700">
                        Certificate ID:{" "}
                        <span className="font-mono font-bold">{req.certificateId}</span>
                      </p>
                    )}
                    {req.adminNotes && (
                      <p className="mt-2 text-xs text-red-600">
                        Notes: {req.adminNotes}
                      </p>
                    )}

                    {/* Admin actions */}
                    {(req.status === "Requested" || req.status === "Under Review") && (
                      <div className="mt-4 flex gap-3">
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                        >
                          ✓ Approve &amp; Issue
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectDialog(req.id);
                            setRejectNotes("");
                          }}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-red-300 bg-red-50 px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-100 transition-colors"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    )}

                    {/* Inline reject notes dialog */}
                    {showRejectDialog === req.id && (
                      <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-xs font-semibold text-red-800 mb-2">
                          Rejection Notes <span className="text-red-500">*</span>
                        </p>
                        <textarea
                          rows={3}
                          value={rejectNotes}
                          onChange={(e) => setRejectNotes(e.target.value)}
                          placeholder="Enter the reason for rejection (shown to intern)..."
                          className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-[#211b17] placeholder-[#c4a895] focus:outline-none focus:ring-2 focus:ring-red-300 resize-none"
                        />
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleReject(req.id)}
                            className="rounded-lg bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                          >
                            Confirm Rejection
                          </button>
                          <button
                            onClick={() => {
                              setShowRejectDialog(null);
                              setRejectNotes("");
                            }}
                            className="rounded-lg border border-[#eee2d7] bg-white px-4 py-1.5 text-xs font-semibold text-[#796c62] hover:bg-[#faf7f3]"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Request Confirm Modal ── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8e7d8] text-[#ad5127] text-xl">
                🎓
              </span>
              <div>
                <h3 className="text-base font-bold text-[#211b17]">
                  Submit Certificate Request
                </h3>
                <p className="text-xs text-[#796c62]">Admin review required</p>
              </div>
            </div>

            <p className="text-sm text-[#796c62] leading-relaxed mb-4">
              This will submit a certificate request for admin review. Your eligibility will
              be verified against CauseKind records before the certificate is issued.{" "}
              <strong className="text-[#211b17]">Proceed?</strong>
            </p>

            {/* Snapshot preview */}
            <div className="rounded-xl border border-[#eee2d7] bg-[#faf7f3] px-4 py-3 mb-5">
              <p className="text-xs text-[#796c62] font-semibold mb-2">
                Eligibility at time of request:
              </p>
              <div className="space-y-1">
                {eligibilityRules.map((r) => (
                  <div key={r.label} className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold ${
                        r.passed ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {r.passed ? "✓" : "✗"}
                    </span>
                    <span className="text-xs text-[#796c62]">{r.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmitRequest}
                className="flex-1 rounded-xl bg-[#ad5127] py-2.5 text-sm font-semibold text-white hover:bg-[#8f4120] transition-colors"
              >
                ✓ Submit Request
              </button>
              <button
                onClick={() => setShowRequestModal(false)}
                className="flex-1 rounded-xl border border-[#eee2d7] bg-white py-2.5 text-sm font-semibold text-[#796c62] hover:bg-[#faf7f3] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
