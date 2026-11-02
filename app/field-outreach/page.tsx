"use client";

import React, { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";

// ─── Local Type Definitions ───────────────────────────────────────────────────
type OutreachStage = "Contacted" | "Verified" | "Matched" | "Donation Completed";
type OutreachType = "Donor" | "Donee";
type ConsentStatus = "Given" | "Pending" | "Withdrawn";

interface OutreachEvidence {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  description?: string;
}

interface OutreachStageEvent {
  id: string;
  fromStage?: OutreachStage;
  toStage: OutreachStage;
  changedByUserId: string;
  changedByName: string;
  timestamp: string;
  notes?: string;
}

interface OutreachRegistration {
  id: string;
  registeredByUserId: string;
  registeredByName: string;
  type: OutreachType;
  fullName: string;
  age?: number;
  guardianName?: string;
  city: string;
  causeArea: string;
  description: string;
  consentStatus: ConsentStatus;
  consentDate?: string;
  stage: OutreachStage;
  stageHistory: OutreachStageEvent[];
  evidenceFiles: OutreachEvidence[];
  createdAt: string;
  verifiedByUserId?: string;
  verifiedByName?: string;
  reviewerFeedback?: string;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────
const seedRegistrations: OutreachRegistration[] = [
  {
    id: "OR-001",
    registeredByUserId: "USER-001",
    registeredByName: "Shravan S Sawant",
    type: "Donor",
    fullName: "Rajesh Kumar",
    age: 42,
    city: "Bandra West, Mumbai",
    causeArea: "Education",
    description: "Local shop owner willing to donate stationery supplies for 50 children annually.",
    consentStatus: "Given",
    consentDate: "2026-10-12",
    stage: "Verified",
    stageHistory: [
      { id: "SH-001", toStage: "Contacted", changedByUserId: "USER-001", changedByName: "Shravan S Sawant", timestamp: "2026-10-11 10:00" },
      { id: "SH-002", fromStage: "Contacted", toStage: "Verified", changedByUserId: "USER-003", changedByName: "CauseKind Admin", timestamp: "2026-10-13 14:30", notes: "Documents checked. Verified donor." },
    ],
    evidenceFiles: [{ id: "EV-001", fileName: "donor_consent_rajesh.pdf", fileSize: "320 KB", uploadedAt: "2026-10-12 11:00", description: "Signed consent form" }],
    createdAt: "2026-10-11T10:00:00Z",
    verifiedByUserId: "USER-003",
    verifiedByName: "CauseKind Admin",
    reviewerFeedback: "Verified. Donor confirmed willing to donate stationery.",
  },
  {
    id: "OR-002",
    registeredByUserId: "USER-001",
    registeredByName: "Shravan S Sawant",
    type: "Donee",
    fullName: "Meena Patil",
    age: 16,
    guardianName: "Suresh Patil",
    city: "Dharavi, Mumbai",
    causeArea: "Education",
    description: "Class 10 student needing textbooks and exam preparation support.",
    consentStatus: "Given",
    consentDate: "2026-10-14",
    stage: "Matched",
    stageHistory: [
      { id: "SH-003", toStage: "Contacted", changedByUserId: "USER-001", changedByName: "Shravan S Sawant", timestamp: "2026-10-13 09:00" },
      { id: "SH-004", fromStage: "Contacted", toStage: "Verified", changedByUserId: "USER-003", changedByName: "CauseKind Admin", timestamp: "2026-10-15 11:00" },
      { id: "SH-005", fromStage: "Verified", toStage: "Matched", changedByUserId: "USER-003", changedByName: "CauseKind Admin", timestamp: "2026-10-17 13:30", notes: "Matched with donor OR-001." },
    ],
    evidenceFiles: [{ id: "EV-002", fileName: "donee_consent_meena.pdf", fileSize: "290 KB", uploadedAt: "2026-10-14 10:00", description: "Guardian consent (minor)" }],
    createdAt: "2026-10-13T09:00:00Z",
    verifiedByUserId: "USER-003",
    verifiedByName: "CauseKind Admin",
  },
  {
    id: "OR-003",
    registeredByUserId: "USER-002",
    registeredByName: "Ananya Rao",
    type: "Donor",
    fullName: "Priya Nair",
    age: 35,
    city: "Santacruz, Mumbai",
    causeArea: "Food Security",
    description: "Corporate employee organising monthly meal kit donation.",
    consentStatus: "Given",
    consentDate: "2026-10-18",
    stage: "Contacted",
    stageHistory: [
      { id: "SH-006", toStage: "Contacted", changedByUserId: "USER-002", changedByName: "Ananya Rao", timestamp: "2026-10-18 15:00" },
    ],
    evidenceFiles: [],
    createdAt: "2026-10-18T15:00:00Z",
  },
];

// ─── Stage Config ─────────────────────────────────────────────────────────────
const STAGES: OutreachStage[] = ["Contacted", "Verified", "Matched", "Donation Completed"];
const CAUSE_AREAS = ["Education", "Health", "Food Security", "Environment", "Skills Training"];

const STAGE_STYLES: Record<OutreachStage, { badge: string; dot: string; col: string }> = {
  "Contacted":          { badge: "bg-amber-50 text-amber-700 border-amber-200",         dot: "bg-amber-400",   col: "from-amber-400 to-orange-400" },
  "Verified":           { badge: "bg-blue-50 text-blue-700 border-blue-200",             dot: "bg-blue-500",    col: "from-blue-400 to-indigo-500" },
  "Matched":            { badge: "bg-orange-50 text-[#ad5127] border-orange-200",        dot: "bg-[#ad5127]",   col: "from-[#ad5127] to-[#b97a55]" },
  "Donation Completed": { badge: "bg-emerald-50 text-emerald-700 border-emerald-200",    dot: "bg-emerald-500", col: "from-emerald-500 to-teal-500" },
};

const nextStage = (s: OutreachStage): OutreachStage | null => {
  const idx = STAGES.indexOf(s);
  return idx < STAGES.length - 1 ? STAGES[idx + 1] : null;
};

// ─── Helper Components ────────────────────────────────────────────────────────
function StageBadge({ stage }: { stage: OutreachStage }) {
  const s = STAGE_STYLES[stage];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${s.badge}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {stage}
    </span>
  );
}

function TypeBadge({ type }: { type: OutreachType }) {
  return type === "Donor" ? (
    <span className="inline-flex items-center gap-1 rounded-full border border-[#e8d5c4] bg-[#fdf0e8] px-2.5 py-0.5 text-[11px] font-bold text-[#ad5127]">
      ♦ Donor
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
      ♣ Donee
    </span>
  );
}

function ConsentPill({ status }: { status: ConsentStatus }) {
  const map: Record<ConsentStatus, string> = {
    "Given":     "bg-emerald-50 text-emerald-700",
    "Pending":   "bg-amber-50 text-amber-700",
    "Withdrawn": "bg-red-50 text-red-600",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${map[status]}`}>
      {status === "Given" ? "✓ Consent Given" : status === "Pending" ? "⏳ Pending Consent" : "✗ Withdrawn"}
    </span>
  );
}

// ─── Register Modal ───────────────────────────────────────────────────────────
interface RegisterModalProps {
  onClose: () => void;
  onSubmit: (reg: OutreachRegistration) => void;
  currentUser: { id: string; profile: { name: string } } | null;
}

function RegisterModal({ onClose, onSubmit, currentUser }: RegisterModalProps) {
  const [type, setType] = useState<OutreachType>("Donor");
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [city, setCity] = useState("");
  const [causeArea, setCauseArea] = useState(CAUSE_AREAS[0]);
  const [description, setDescription] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");

  const showGuardian = age !== "" && Number(age) < 18;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { setError("Full name is required."); return; }
    if (!city.trim()) { setError("City is required."); return; }
    if (!description.trim()) { setError("Description is required."); return; }
    if (!consent) { setError("Consent is required before registering."); return; }
    if (showGuardian && !guardianName.trim()) { setError("Guardian name is required for minors."); return; }

    const now = new Date();
    const ts = now.toLocaleString("en-IN", { hour12: false }).replace(",", "");
    const newReg: OutreachRegistration = {
      id: `OR-${Date.now().toString().slice(-4)}`,
      registeredByUserId: currentUser?.id || "USER-001",
      registeredByName: currentUser?.profile.name || "Unknown",
      type,
      fullName: fullName.trim(),
      age: age !== "" ? Number(age) : undefined,
      guardianName: showGuardian ? guardianName.trim() : undefined,
      city: city.trim(),
      causeArea,
      description: description.trim(),
      consentStatus: "Given",
      consentDate: now.toISOString().split("T")[0],
      stage: "Contacted",
      stageHistory: [
        {
          id: `SH-${Date.now()}`,
          toStage: "Contacted",
          changedByUserId: currentUser?.id || "USER-001",
          changedByName: currentUser?.profile.name || "Unknown",
          timestamp: ts,
        },
      ],
      evidenceFiles: [],
      createdAt: now.toISOString(),
    };
    onSubmit(newReg);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-[#eee2d7] bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0e7df] px-6 py-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#211b17]">Register Outreach Contact</h2>
            <p className="text-xs text-[#796c62]">Add a new donor or donee to the pipeline</p>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee2d7] text-[#796c62] hover:bg-[#faf7f3]">✕</button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto px-6 py-5 space-y-4">
          {/* Type */}
          <div>
            <label className="block text-xs font-bold text-[#665a51] mb-2">Type *</label>
            <div className="flex gap-3">
              {(["Donor", "Donee"] as OutreachType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex-1 rounded-xl border py-2.5 text-sm font-bold transition ${
                    type === t
                      ? t === "Donor"
                        ? "border-[#ad5127] bg-[#fdf0e8] text-[#ad5127]"
                        : "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-[#eee2d7] text-[#796c62] hover:bg-[#faf7f3]"
                  }`}
                >
                  {t === "Donor" ? "♦ Donor" : "♣ Donee"}
                </button>
              ))}
            </div>
          </div>

          {/* Name + Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#665a51] mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contact's full name"
                className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-sm outline-none focus:border-[#ad5127] focus:ring-2 focus:ring-[#ad5127]/10"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#665a51] mb-1">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="e.g. 28"
                min={5} max={100}
                className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-sm outline-none focus:border-[#ad5127] focus:ring-2 focus:ring-[#ad5127]/10"
              />
            </div>
          </div>

          {/* Guardian Name (minor) */}
          {showGuardian && (
            <div>
              <label className="block text-xs font-bold text-amber-700 mb-1">Guardian Name * (required for minors)</label>
              <input
                type="text"
                value={guardianName}
                onChange={(e) => setGuardianName(e.target.value)}
                placeholder="Guardian / parent name"
                className="w-full rounded-xl border border-amber-300 bg-amber-50 px-3 py-2 text-sm outline-none focus:border-amber-500"
              />
            </div>
          )}

          {/* City + Cause */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#665a51] mb-1">City / Area *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Dharavi, Mumbai"
                className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-sm outline-none focus:border-[#ad5127] focus:ring-2 focus:ring-[#ad5127]/10"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#665a51] mb-1">Cause Area *</label>
              <select
                value={causeArea}
                onChange={(e) => setCauseArea(e.target.value)}
                className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-sm outline-none focus:border-[#ad5127]"
              >
                {CAUSE_AREAS.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-[#665a51] mb-1">Description *</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Describe what this person can donate / what they need..."
              className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-sm outline-none focus:border-[#ad5127] focus:ring-2 focus:ring-[#ad5127]/10 resize-none"
            />
          </div>

          {/* Consent */}
          <div className="rounded-xl border border-[#eedfd2] bg-[#fffaf5] p-3.5">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#ad5127]"
              />
              <span className="text-xs leading-relaxed text-[#665a51]">
                <span className="font-bold text-[#211b17]">I confirm consent has been obtained.</span>{" "}
                Personal contact details will only be shared after mutual acceptance. No continuous location tracking is performed by CauseKind.
              </span>
            </label>
          </div>

          {error && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600">{error}</p>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-[#f0e7df] px-6 py-4">
          <button onClick={onClose} className="rounded-xl border border-[#eee2d7] px-4 py-2 text-xs font-bold text-[#796c62] hover:bg-[#faf7f3]">
            Cancel
          </button>
          <button
            onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>}
            className="rounded-xl bg-[#ad5127] px-5 py-2 text-xs font-bold text-white hover:bg-[#93421e] transition"
          >
            Register Contact
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
interface DetailPanelProps {
  reg: OutreachRegistration;
  isAdmin: boolean;
  currentUserId: string;
  currentUserName: string;
  onClose: () => void;
  onAdvanceStage: (regId: string, newStage: OutreachStage, notes: string) => void;
  onAddEvidence: (regId: string, ev: OutreachEvidence) => void;
}

function DetailPanel({ reg, isAdmin, currentUserId, currentUserName, onClose, onAdvanceStage, onAddEvidence }: DetailPanelProps) {
  const [stageNotes, setStageNotes] = useState("");
  const [advanceTarget, setAdvanceTarget] = useState<OutreachStage | "">(nextStage(reg.stage) || "");
  const [evFileName, setEvFileName] = useState("");
  const [evDesc, setEvDesc] = useState("");

  const isSelfRegistered = reg.registeredByUserId === currentUserId && !isAdmin;
  const next = nextStage(reg.stage);
  const isDone = reg.stage === "Donation Completed";

  const handleAdvance = () => {
    if (!advanceTarget) return;
    onAdvanceStage(reg.id, advanceTarget as OutreachStage, stageNotes);
    setStageNotes("");
  };

  const handleEvidence = () => {
    if (!evFileName.trim()) return;
    const ev: OutreachEvidence = {
      id: `EV-${Date.now()}`,
      fileName: evFileName.trim(),
      fileSize: "Uploaded",
      uploadedAt: new Date().toLocaleString("en-IN", { hour12: false }),
      description: evDesc.trim() || undefined,
    };
    onAddEvidence(reg.id, ev);
    setEvFileName("");
    setEvDesc("");
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div
        className="h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-[#eee2d7] bg-white px-6 py-5">
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${STAGE_STYLES[reg.stage].col} text-white text-sm font-bold shadow`}>
              {reg.type === "Donor" ? "♦" : "♣"}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#796c62]">{reg.id}</p>
              <h2 className="font-serif text-lg font-bold text-[#211b17]">{reg.fullName}</h2>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <TypeBadge type={reg.type} />
                <StageBadge stage={reg.stage} />
              </div>
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-[#eee2d7] text-[#796c62] hover:bg-[#faf7f3]">✕</button>
        </div>

        <div className="space-y-6 px-6 py-5">
          {/* Details */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#796c62]">Registration Details</h3>
            <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdf9] p-4 space-y-2 text-sm">
              <Row label="City / Area" value={reg.city} />
              <Row label="Cause Area" value={reg.causeArea} />
              {reg.age !== undefined && <Row label="Age" value={String(reg.age)} />}
              {reg.guardianName && <Row label="Guardian" value={reg.guardianName} />}
              <Row label="Registered By" value={reg.registeredByName} />
              <Row label="Registered On" value={new Date(reg.createdAt).toLocaleDateString("en-IN")} />
              {reg.verifiedByName && <Row label="Verified By" value={reg.verifiedByName} />}
              <div className="pt-1"><ConsentPill status={reg.consentStatus} />{reg.consentDate && <span className="ml-2 text-[11px] text-[#796c62]">{reg.consentDate}</span>}</div>
            </div>
            <div className="mt-3 rounded-xl border border-[#eee2d7] bg-white p-3">
              <p className="text-xs font-bold text-[#665a51] mb-1">Description</p>
              <p className="text-sm leading-relaxed text-[#211b17]">{reg.description}</p>
            </div>
            {reg.reviewerFeedback && (
              <div className="mt-2 rounded-xl border border-blue-100 bg-blue-50 p-3">
                <p className="text-xs font-bold text-blue-700 mb-1">Reviewer Feedback</p>
                <p className="text-sm leading-relaxed text-blue-800">{reg.reviewerFeedback}</p>
              </div>
            )}
          </section>

          {/* Stage History */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#796c62]">Stage History</h3>
            <div className="relative space-y-0">
              {reg.stageHistory.map((ev, i) => (
                <div key={ev.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`h-3 w-3 flex-shrink-0 rounded-full border-2 border-white shadow ${STAGE_STYLES[ev.toStage].dot}`} />
                    {i < reg.stageHistory.length - 1 && <div className="w-0.5 flex-1 bg-[#eee2d7] my-1" />}
                  </div>
                  <div className={`pb-4 ${i < reg.stageHistory.length - 1 ? "" : ""}`}>
                    <div className="flex flex-wrap items-center gap-2">
                      <StageBadge stage={ev.toStage} />
                      {ev.fromStage && <span className="text-[10px] text-[#796c62]">from {ev.fromStage}</span>}
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#796c62]">by {ev.changedByName} · {ev.timestamp}</p>
                    {ev.notes && <p className="mt-1 text-xs italic text-[#665a51]">"{ev.notes}"</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Evidence Files */}
          <section>
            <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#796c62]">Evidence Files ({reg.evidenceFiles.length})</h3>
            {reg.evidenceFiles.length === 0 ? (
              <p className="rounded-xl border border-dashed border-[#d9ccbe] bg-[#fffcf9] p-4 text-center text-xs text-[#9a897c]">No evidence files attached yet.</p>
            ) : (
              <div className="space-y-2">
                {reg.evidenceFiles.map((f) => (
                  <div key={f.id} className="flex items-center gap-3 rounded-xl border border-[#eee2d7] bg-white p-3">
                    <span className="text-lg">📎</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-xs font-bold text-[#211b17]">{f.fileName}</p>
                      <p className="text-[10px] text-[#796c62]">{f.fileSize} · {f.uploadedAt}</p>
                      {f.description && <p className="text-[10px] italic text-[#9a897c]">{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Admin Controls */}
          {isAdmin && (
            <>
              {/* Add Evidence */}
              <section className="rounded-2xl border border-[#eee2d7] bg-[#faf7f3] p-4">
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#665a51]">Add Evidence File</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={evFileName}
                    onChange={(e) => setEvFileName(e.target.value)}
                    placeholder="File name (e.g. evidence_photo.jpg)"
                    className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-xs outline-none focus:border-[#ad5127]"
                  />
                  <input
                    type="text"
                    value={evDesc}
                    onChange={(e) => setEvDesc(e.target.value)}
                    placeholder="Description (optional)"
                    className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-xs outline-none focus:border-[#ad5127]"
                  />
                  <button
                    onClick={handleEvidence}
                    disabled={!evFileName.trim()}
                    className="rounded-xl bg-[#211b17] px-4 py-2 text-xs font-bold text-white hover:bg-[#332b25] disabled:opacity-40 transition"
                  >
                    Attach File
                  </button>
                </div>
              </section>

              {/* Advance Stage */}
              {!isDone ? (
                <section className="rounded-2xl border border-[#eee2d7] bg-[#faf7f3] p-4">
                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#665a51]">Advance Stage</h3>
                  {isSelfRegistered ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                      ⚠ You cannot verify your own registration.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <select
                        value={advanceTarget}
                        onChange={(e) => setAdvanceTarget(e.target.value as OutreachStage)}
                        className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-xs outline-none focus:border-[#ad5127]"
                      >
                        {STAGES.filter((_, i) => i > STAGES.indexOf(reg.stage)).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <textarea
                        value={stageNotes}
                        onChange={(e) => setStageNotes(e.target.value)}
                        placeholder="Notes for this stage transition (optional)"
                        rows={2}
                        className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3 py-2 text-xs outline-none focus:border-[#ad5127] resize-none"
                      />
                      <button
                        onClick={handleAdvance}
                        disabled={!advanceTarget}
                        className="rounded-xl bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e] disabled:opacity-40 transition"
                      >
                        Advance → {advanceTarget || next}
                      </button>
                    </div>
                  )}
                </section>
              ) : (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center text-xs font-bold text-emerald-700">
                  ✓ Donation Completed — Pipeline Closed
                </div>
              )}
            </>
          )}

          {/* Self-approval guard for non-admin */}
          {!isAdmin && isSelfRegistered && reg.stage === "Contacted" && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
              ⚠ You cannot verify your own registration. An Admin or another team member must advance this stage.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-2">
      <span className="text-[11px] text-[#796c62]">{label}</span>
      <span className="text-right text-xs font-medium text-[#211b17]">{value}</span>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FieldOutreachPage() {
  const { currentUser } = usePortal();

  const [registrations, setRegistrations] = useState<OutreachRegistration[]>(seedRegistrations);
  const [typeFilter, setTypeFilter] = useState<"All" | OutreachType>("All");
  const [stageFilter, setStageFilter] = useState<"All" | OutreachStage>("All");
  const [search, setSearch] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [selectedReg, setSelectedReg] = useState<OutreachRegistration | null>(null);

  const isAdmin = currentUser?.role === "ADMIN";

  // Stats
  const stats = useMemo(() => ({
    total: registrations.length,
    verified: registrations.filter((r) => r.stage === "Verified").length,
    matched: registrations.filter((r) => r.stage === "Matched").length,
    completed: registrations.filter((r) => r.stage === "Donation Completed").length,
  }), [registrations]);

  // Pipeline counts
  const pipelineCounts = useMemo(() =>
    Object.fromEntries(STAGES.map((s) => [s, registrations.filter((r) => r.stage === s).length])) as Record<OutreachStage, number>,
    [registrations]
  );

  // Filtered list
  const filtered = useMemo(() => {
    return registrations.filter((r) => {
      const matchType = typeFilter === "All" || r.type === typeFilter;
      const matchStage = stageFilter === "All" || r.stage === stageFilter;
      const q = search.trim().toLowerCase();
      const matchSearch = !q || r.fullName.toLowerCase().includes(q) || r.city.toLowerCase().includes(q) || r.causeArea.toLowerCase().includes(q);
      return matchType && matchStage && matchSearch;
    });
  }, [registrations, typeFilter, stageFilter, search]);

  const handleRegister = (reg: OutreachRegistration) => {
    setRegistrations((prev) => [reg, ...prev]);
    setShowRegister(false);
  };

  const handleAdvanceStage = (regId: string, newStage: OutreachStage, notes: string) => {
    const ts = new Date().toLocaleString("en-IN", { hour12: false }).replace(",", "");
    setRegistrations((prev) =>
      prev.map((r) => {
        if (r.id !== regId) return r;
        const newEvent: OutreachStageEvent = {
          id: `SH-${Date.now()}`,
          fromStage: r.stage,
          toStage: newStage,
          changedByUserId: currentUser?.id || "USER-001",
          changedByName: currentUser?.profile.name || "Admin",
          timestamp: ts,
          notes: notes.trim() || undefined,
        };
        return { ...r, stage: newStage, stageHistory: [...r.stageHistory, newEvent] };
      })
    );
    // Update selected panel
    setSelectedReg((prev) => {
      if (!prev || prev.id !== regId) return prev;
      const ts2 = new Date().toLocaleString("en-IN", { hour12: false }).replace(",", "");
      const newEvent: OutreachStageEvent = {
        id: `SH-${Date.now()}`,
        fromStage: prev.stage,
        toStage: newStage,
        changedByUserId: currentUser?.id || "USER-001",
        changedByName: currentUser?.profile.name || "Admin",
        timestamp: ts2,
        notes: notes.trim() || undefined,
      };
      return { ...prev, stage: newStage, stageHistory: [...prev.stageHistory, newEvent] };
    });
  };

  const handleAddEvidence = (regId: string, ev: OutreachEvidence) => {
    setRegistrations((prev) =>
      prev.map((r) => r.id === regId ? { ...r, evidenceFiles: [...r.evidenceFiles, ev] } : r)
    );
    setSelectedReg((prev) => prev?.id === regId ? { ...prev, evidenceFiles: [...prev.evidenceFiles, ev] } : prev);
  };

  return (
    <PortalLayout>
      {/* ── Page Header ── */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#ad5127]">Field Outreach</span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">Field Outreach Dashboard</h1>
          <p className="mt-1 text-sm text-[#796c62]">Sahas Charitable Trust — Donor &amp; Donee Management</p>
        </div>
        <span className="rounded-full bg-[#f8e7d8] px-4 py-2 text-xs font-bold text-[#ad5127]">
          {stats.total} Total Registrations
        </span>
      </div>

      {/* ── Stats Row ── */}
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Registrations", value: stats.total, icon: "📋", color: "bg-[#faf0e8] text-[#ad5127]" },
          { label: "Verified",            value: stats.verified, icon: "✅", color: "bg-blue-50 text-blue-700" },
          { label: "Matched",             value: stats.matched,  icon: "🔗", color: "bg-orange-50 text-orange-700" },
          { label: "Donation Completed",  value: stats.completed, icon: "🎉", color: "bg-emerald-50 text-emerald-700" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-[#eee2d7] bg-white p-4">
            <div className="flex items-center gap-2">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${s.color}`}>{s.icon}</span>
              <div>
                <p className="text-2xl font-extrabold text-[#211b17]">{s.value}</p>
                <p className="text-[10px] font-semibold text-[#796c62]">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Pipeline View ── */}
      <div className="mt-8">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#796c62]">Pipeline Overview</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {STAGES.map((stage, i) => {
            const s = STAGE_STYLES[stage];
            const isLast = stage === "Donation Completed";
            return (
              <div
                key={stage}
                className="min-w-[160px] flex-1 rounded-2xl border border-[#eee2d7] bg-white p-4 cursor-pointer hover:shadow-md transition"
                onClick={() => setStageFilter(stageFilter === stage ? "All" : stage)}
              >
                <div className={`mb-2 h-1.5 w-full rounded-full bg-gradient-to-r ${s.col} ${stageFilter === stage ? "opacity-100" : "opacity-50"}`} />
                <p className="text-xs font-bold text-[#211b17]">{stage}</p>
                <p className="mt-1 text-3xl font-extrabold text-[#211b17]">{pipelineCounts[stage]}</p>
                <p className="text-[10px] text-[#796c62]">registrations</p>
                {i < STAGES.length - 1 && (
                  <p className="mt-2 text-[10px] text-[#9a897c]">→ next: {STAGES[i + 1]}</p>
                )}
                {isLast && <p className="mt-2 text-[10px] font-bold text-emerald-600">✓ Final stage</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {/* Type filter */}
          {(["All", "Donor", "Donee"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                typeFilter === t
                  ? "border-[#ad5127] bg-[#ad5127] text-white"
                  : "border-[#eee2d7] bg-white text-[#796c62] hover:bg-[#faf7f3]"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="w-px bg-[#eee2d7]" />
          {/* Stage filter */}
          {(["All", ...STAGES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStageFilter(s as "All" | OutreachStage)}
              className={`rounded-full border px-4 py-1.5 text-xs font-bold transition ${
                stageFilter === s
                  ? "border-[#ad5127] bg-[#fdf0e8] text-[#ad5127]"
                  : "border-[#eee2d7] bg-white text-[#796c62] hover:bg-[#faf7f3]"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, city, cause..."
              className="w-56 rounded-full border border-[#e4d8cc] bg-white py-2 pl-9 pr-4 text-xs outline-none focus:border-[#ad5127] focus:ring-2 focus:ring-[#ad5127]/10"
            />
            <span className="absolute left-3 top-2.5 text-[#9a897c]">🔍</span>
          </div>
          {/* Register New */}
          <button
            onClick={() => setShowRegister(true)}
            className="rounded-full bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e] transition"
          >
            + Register New
          </button>
        </div>
      </div>

      {/* ── Registration Cards ── */}
      <div className="mt-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#d9ccbe] bg-[#fffcf9] p-12 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl">🌱</span>
            <h3 className="mt-4 font-serif text-lg font-bold text-[#211b17]">No registrations found</h3>
            <p className="mt-1 text-xs text-[#796c62]">Try adjusting your filters or register a new contact.</p>
            <button
              onClick={() => { setTypeFilter("All"); setStageFilter("All"); setSearch(""); }}
              className="mt-4 rounded-full bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((reg) => {
              const isSelf = reg.registeredByUserId === currentUser?.id;
              const next = nextStage(reg.stage);
              return (
                <div key={reg.id} className="group rounded-2xl border border-[#eee2d7] bg-white p-5 shadow-sm hover:shadow-md transition">
                  {/* Card Top */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${STAGE_STYLES[reg.stage].col} text-white text-sm font-bold shadow`}>
                        {reg.type === "Donor" ? "♦" : "♣"}
                      </div>
                      <div>
                        <p className="font-bold text-[#211b17]">{reg.fullName}</p>
                        <p className="text-[11px] text-[#796c62]">{reg.city}</p>
                      </div>
                    </div>
                    <TypeBadge type={reg.type} />
                  </div>

                  {/* Cause + Stage */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#faf0e8] px-2.5 py-0.5 text-[11px] font-bold text-[#665a51]">{reg.causeArea}</span>
                    <StageBadge stage={reg.stage} />
                  </div>

                  {/* Consent + Registered by */}
                  <div className="mt-3 flex items-center justify-between">
                    <ConsentPill status={reg.consentStatus} />
                    <span className="text-[10px] text-[#9a897c]">by {reg.registeredByName}</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedReg(reg)}
                      className="flex-1 rounded-xl border border-[#eee2d7] py-2 text-xs font-bold text-[#665a51] hover:bg-[#faf7f3] transition"
                    >
                      View Details
                    </button>
                    {isAdmin && next && (
                      <button
                        onClick={() => {
                          setSelectedReg(reg);
                        }}
                        className="rounded-xl bg-[#ad5127] px-3 py-2 text-xs font-bold text-white hover:bg-[#93421e] transition"
                        title={`Advance to ${next}`}
                      >
                        → {next.split(" ")[0]}
                      </button>
                    )}
                  </div>

                  {/* ID + self badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-[10px] text-[#bbb0a6]">{reg.id}</span>
                    {isSelf && <span className="rounded-full bg-[#faf0e8] px-2 py-0.5 text-[10px] font-bold text-[#ad5127]">Your registration</span>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      {showRegister && (
        <RegisterModal
          onClose={() => setShowRegister(false)}
          onSubmit={handleRegister}
          currentUser={currentUser}
        />
      )}

      {selectedReg && (
        <DetailPanel
          reg={selectedReg}
          isAdmin={isAdmin}
          currentUserId={currentUser?.id || ""}
          currentUserName={currentUser?.profile.name || ""}
          onClose={() => setSelectedReg(null)}
          onAdvanceStage={handleAdvanceStage}
          onAddEvidence={handleAddEvidence}
        />
      )}
    </PortalLayout>
  );
}
