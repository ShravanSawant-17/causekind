"use client";

import React, { useState, useMemo } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface CategoryScores {
  portalDeliverablesQuality: number;
  verifiedFieldRegistrations: number;
  fieldStageProgression: number;
  timelinessAndInitiative: number;
  documentationAndReporting: number;
  collaborationAndCommunication: number;
}

type EvaluationStatus = "Official" | "Draft";

interface Evaluation {
  id: string;
  internUserId: string;
  evaluatedByUserId: string;
  evaluatedByName: string;
  period: string;
  scores: CategoryScores;
  overallScore: number;
  feedback: string;
  status: EvaluationStatus;
  createdAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CONTRIBUTION_WEIGHTS: Record<keyof CategoryScores, number> = {
  portalDeliverablesQuality: 0.3,
  verifiedFieldRegistrations: 0.25,
  fieldStageProgression: 0.15,
  timelinessAndInitiative: 0.15,
  documentationAndReporting: 0.1,
  collaborationAndCommunication: 0.05,
};

const CATEGORY_META: {
  key: keyof CategoryScores;
  label: string;
  description: string;
}[] = [
  {
    key: "portalDeliverablesQuality",
    label: "Portal Deliverables Quality",
    description:
      "Task completion quality, submission thoroughness, and deliverable standards.",
  },
  {
    key: "verifiedFieldRegistrations",
    label: "Verified Field Registrations",
    description:
      "Successfully verified donor and donee registrations reaching Stage 2+.",
  },
  {
    key: "fieldStageProgression",
    label: "Field Stage Progression",
    description:
      "Advancement of registrations through pipeline stages.",
  },
  {
    key: "timelinessAndInitiative",
    label: "Timeliness & Initiative",
    description:
      "On-time submissions, proactive communication, and deadline adherence.",
  },
  {
    key: "documentationAndReporting",
    label: "Documentation & Reporting",
    description:
      "Report quality, evidence files, and audit trail completeness.",
  },
  {
    key: "collaborationAndCommunication",
    label: "Collaboration & Communication",
    description:
      "Team contribution, peer feedback, and communication clarity.",
  },
];

const STATIC_INTERN_LIST = [
  { id: "USER-001", label: "USER-001 — Shravan S Sawant" },
  { id: "USER-002", label: "USER-002 — Ananya Rao" },
];

const seedEvaluations: Evaluation[] = [
  {
    id: "EVAL-001",
    internUserId: "USER-001",
    evaluatedByUserId: "USER-003",
    evaluatedByName: "CauseKind Admin",
    period: "Week 1–2",
    scores: {
      portalDeliverablesQuality: 85,
      verifiedFieldRegistrations: 70,
      fieldStageProgression: 75,
      timelinessAndInitiative: 90,
      documentationAndReporting: 80,
      collaborationAndCommunication: 88,
    },
    overallScore: 80.6,
    feedback:
      "Strong start. Documentation and timeliness are excellent. Field registrations are growing well.",
    status: "Official",
    createdAt: "2026-10-18T10:00:00Z",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function calcWeightedScore(scores: CategoryScores): number {
  const raw = (Object.keys(CONTRIBUTION_WEIGHTS) as (keyof CategoryScores)[]).reduce(
    (acc, key) => acc + scores[key] * CONTRIBUTION_WEIGHTS[key],
    0
  );
  return Math.round(raw * 10) / 10;
}

function scoreColor(score: number): string {
  if (score >= 75) return "#16a34a";
  if (score >= 50) return "#d97706";
  return "#dc2626";
}

function scoreBg(score: number): string {
  if (score >= 75) return "#dcfce7";
  if (score >= 50) return "#fef9c3";
  return "#fee2e2";
}

function fmt(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function CircleScore({ score }: { score: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const dash = (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={70} cy={70} r={radius} fill="none" stroke="#EEE2D7" strokeWidth={12} />
      <circle
        cx={70}
        cy={70}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={12}
        strokeDasharray={`${dash} ${circumference - dash}`}
        strokeLinecap="round"
        strokeDashoffset={circumference / 4}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
      <text
        x={70}
        y={67}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize={24}
        fontWeight="700"
        fill={color}
      >
        {score}
      </text>
      <text
        x={70}
        y={87}
        textAnchor="middle"
        fontSize={11}
        fill="#796C62"
      >
        / 100
      </text>
    </svg>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EEE2D7]">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      />
    </div>
  );
}

function EvalRow({
  ev,
  expanded,
  onToggle,
}: {
  ev: Evaluation;
  expanded: boolean;
  onToggle: () => void;
}) {
  const color = scoreColor(ev.overallScore);
  const bg = scoreBg(ev.overallScore);

  return (
    <div className="rounded-xl border border-[#EEE2D7] bg-white overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-[#211B17] text-sm">{ev.period}</span>
          <span className="text-xs text-[#796C62]">
            By {ev.evaluatedByName} · {fmt(ev.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{ backgroundColor: bg, color }}
          >
            {ev.overallScore}/100
          </span>
          <span
            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide ${
              ev.status === "Official"
                ? "bg-[#eaf5ea] text-[#1b6e22]"
                : "bg-[#fff2e6] text-[#d97736]"
            }`}
          >
            {ev.status.toUpperCase()}
          </span>
          <button
            onClick={onToggle}
            className="rounded-lg border border-[#EEE2D7] px-3 py-1.5 text-xs font-medium text-[#AD5127] hover:bg-[#FAF0E8] transition-colors"
          >
            {expanded ? "Collapse ▲" : "Expand ▼"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#EEE2D7] px-5 py-4 bg-[#FFFDF9]">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mb-4">
            {CATEGORY_META.map((cat) => {
              const val = ev.scores[cat.key];
              return (
                <div key={cat.key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-[#211B17]">{cat.label}</span>
                    <span className="font-bold" style={{ color: scoreColor(val) }}>
                      {val}/100
                    </span>
                  </div>
                  <ProgressBar value={val} color={scoreColor(val)} />
                </div>
              );
            })}
          </div>
          {ev.feedback && (
            <div className="rounded-lg bg-[#F8E7D8] p-3 text-sm text-[#5a3820]">
              <span className="font-semibold">Evaluator Feedback: </span>
              {ev.feedback}
            </div>
          )}
          {ev.status === "Draft" && (
            <p className="mt-2 text-[11px] italic text-[#796C62]">
              ⚠ This evaluation is in Draft status and does not affect your score.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Add-Evaluation Form
// ─────────────────────────────────────────────────────────────────────────────

const EMPTY_SCORES: CategoryScores = {
  portalDeliverablesQuality: 50,
  verifiedFieldRegistrations: 50,
  fieldStageProgression: 50,
  timelinessAndInitiative: 50,
  documentationAndReporting: 50,
  collaborationAndCommunication: 50,
};

function AdminForm({ onAdd }: { onAdd: (ev: Evaluation) => void }) {
  const [internId, setInternId] = useState(STATIC_INTERN_LIST[0].id);
  const [period, setPeriod] = useState("");
  const [scores, setScores] = useState<CategoryScores>({ ...EMPTY_SCORES });
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState<EvaluationStatus>("Official");
  const [submitted, setSubmitted] = useState(false);

  const weighted = calcWeightedScore(scores);

  function handleSlider(key: keyof CategoryScores, val: number) {
    setScores((prev) => ({ ...prev, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!period.trim()) return;

    const newEval: Evaluation = {
      id: `EVAL-${Date.now()}`,
      internUserId: internId,
      evaluatedByUserId: "ADMIN",
      evaluatedByName: "CauseKind Admin",
      period: period.trim(),
      scores: { ...scores },
      overallScore: weighted,
      feedback: feedback.trim(),
      status,
      createdAt: new Date().toISOString(),
    };

    onAdd(newEval);
    setPeriod("");
    setScores({ ...EMPTY_SCORES });
    setFeedback("");
    setStatus("Official");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  }

  return (
    <div className="rounded-2xl border border-[#EEE2D7] bg-white p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F8E7D8]">
          <span className="text-base">🛡</span>
        </div>
        <div>
          <h3 className="font-semibold text-[#211B17]">Add Evaluation</h3>
          <p className="text-xs text-[#796C62]">Admin only · Self-evaluations are not permitted</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Intern selector */}
        <div>
          <label className="block text-xs font-semibold text-[#665A51] mb-1">
            Select Intern
          </label>
          <select
            value={internId}
            onChange={(e) => setInternId(e.target.value)}
            className="w-full rounded-lg border border-[#EEE2D7] bg-[#FFFDF9] px-3 py-2 text-sm text-[#211B17] focus:outline-none focus:ring-2 focus:ring-[#AD5127]/30"
          >
            {STATIC_INTERN_LIST.map((intern) => (
              <option key={intern.id} value={intern.id}>
                {intern.label}
              </option>
            ))}
          </select>
        </div>

        {/* Period */}
        <div>
          <label className="block text-xs font-semibold text-[#665A51] mb-1">
            Evaluation Period
          </label>
          <input
            type="text"
            placeholder="e.g. Week 3–4"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            required
            className="w-full rounded-lg border border-[#EEE2D7] bg-[#FFFDF9] px-3 py-2 text-sm text-[#211B17] placeholder-[#c4b4a8] focus:outline-none focus:ring-2 focus:ring-[#AD5127]/30"
          />
        </div>

        {/* Sliders */}
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[#665A51]">Category Scores (0–100)</p>
          {CATEGORY_META.map((cat) => {
            const val = scores[cat.key];
            return (
              <div key={cat.key}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#211B17]">
                    {cat.label}{" "}
                    <span className="text-[#796C62]">
                      ({Math.round(CONTRIBUTION_WEIGHTS[cat.key] * 100)}%)
                    </span>
                  </span>
                  <span className="font-bold" style={{ color: scoreColor(val) }}>
                    {val}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={val}
                  onChange={(e) => handleSlider(cat.key, Number(e.target.value))}
                  className="w-full accent-[#AD5127] h-1.5 cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Live weighted score */}
        <div className="flex items-center gap-3 rounded-xl bg-[#FAF0E8] px-4 py-3">
          <span className="text-sm font-semibold text-[#665A51]">Calculated Overall Score:</span>
          <span
            className="text-xl font-bold"
            style={{ color: scoreColor(weighted) }}
          >
            {weighted}/100
          </span>
        </div>

        {/* Feedback */}
        <div>
          <label className="block text-xs font-semibold text-[#665A51] mb-1">
            Evaluator Feedback (optional)
          </label>
          <textarea
            rows={3}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Qualitative notes about this intern's performance..."
            className="w-full rounded-lg border border-[#EEE2D7] bg-[#FFFDF9] px-3 py-2 text-sm text-[#211B17] placeholder-[#c4b4a8] focus:outline-none focus:ring-2 focus:ring-[#AD5127]/30 resize-none"
          />
        </div>

        {/* Status toggle */}
        <div>
          <p className="text-xs font-semibold text-[#665A51] mb-2">Status</p>
          <div className="flex gap-3">
            {(["Official", "Draft"] as EvaluationStatus[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={`rounded-lg border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  status === s
                    ? "border-[#AD5127] bg-[#AD5127] text-white"
                    : "border-[#EEE2D7] text-[#796C62] hover:bg-[#FAF0E8]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-xl bg-[#AD5127] py-2.5 text-sm font-bold text-white hover:bg-[#923f1c] transition-colors"
        >
          Submit Evaluation
        </button>

        {submitted && (
          <p className="text-center text-xs font-semibold text-[#16a34a]">
            ✓ Evaluation added successfully!
          </p>
        )}
      </form>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function ContributionsPage() {
  const { currentUser, profile } = usePortal();
  const isAdmin = currentUser?.role === "ADMIN";

  const [evaluations, setEvaluations] = useState<Evaluation[]>(seedEvaluations);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Only Official evals count toward score
  const officialEvals = useMemo(
    () => evaluations.filter((e) => e.status === "Official"),
    [evaluations]
  );

  const draftEvals = useMemo(
    () => evaluations.filter((e) => e.status === "Draft"),
    [evaluations]
  );

  // Overall score: average of all official overallScore values
  const overallScore = useMemo(() => {
    if (officialEvals.length === 0) return 0;
    const sum = officialEvals.reduce((acc, e) => acc + e.overallScore, 0);
    return Math.round((sum / officialEvals.length) * 10) / 10;
  }, [officialEvals]);

  // Per-category averages across official evals
  const categoryAverages = useMemo<Record<keyof CategoryScores, number>>(() => {
    const keys = Object.keys(CONTRIBUTION_WEIGHTS) as (keyof CategoryScores)[];
    if (officialEvals.length === 0) {
      return keys.reduce((acc, k) => ({ ...acc, [k]: 0 }), {} as Record<keyof CategoryScores, number>);
    }
    return keys.reduce((acc, key) => {
      const avg =
        officialEvals.reduce((s, e) => s + e.scores[key], 0) / officialEvals.length;
      return { ...acc, [key]: Math.round(avg * 10) / 10 };
    }, {} as Record<keyof CategoryScores, number>);
  }, [officialEvals]);

  function handleAddEval(ev: Evaluation) {
    setEvaluations((prev) => [ev, ...prev]);
  }

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <PortalLayout>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#EEE5DC] pb-6 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="text-xs font-bold tracking-widest text-[#AD5127] uppercase">
              Contributions &amp; Evaluation
            </span>
            <span className="rounded-full bg-[#F8E7D8] px-3 py-1 text-xs font-bold tracking-widest text-[#AD5127]">
              COHORT FALL 2026
            </span>
          </div>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#211B17] sm:text-4xl">
            My Contribution Score
          </h1>
          <p className="mt-1.5 text-sm text-[#796C62]">
            Internship performance evaluated across six weighted dimensions.
          </p>
          <p className="mt-1 text-xs italic text-[#796C62]">
            Evaluation weights are preliminary and subject to confirmation by Sahas Charitable Trust.
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className="text-xs font-semibold text-[#8b796d]">
            {profile.name}
          </span>
          {isAdmin && (
            <span className="rounded-full bg-[#AD5127] px-3 py-1 text-[10px] font-bold text-white tracking-wide">
              ADMIN
            </span>
          )}
        </div>
      </div>

      {/* ── Info Banner ────────────────────────────────────────────────────── */}
      <div className="mt-6 flex gap-3 rounded-xl border border-[#ffe59d] bg-[#fffbeb] px-4 py-3">
        <span className="text-lg">⚠️</span>
        <p className="text-xs leading-relaxed text-[#92400e]">
          <strong>Note:</strong> Weights are configurable and subject to final confirmation by the NGO.
          Only evaluations marked <strong>&quot;Official&quot;</strong> affect your displayed score.
        </p>
      </div>

      {/* ── Overall Score Card ─────────────────────────────────────────────── */}
      <div className="mt-6 rounded-2xl border border-[#EEE2D7] bg-white p-6 shadow-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex flex-col items-center">
            <CircleScore score={overallScore} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="font-serif text-2xl font-bold text-[#211B17]">
              Weighted Overall Score
            </h2>
            <p className="mt-1 text-sm text-[#796C62]">
              Based on{" "}
              <span className="font-semibold text-[#211B17]">
                {officialEvals.length} official evaluation{officialEvals.length !== 1 ? "s" : ""}
              </span>
            </p>
            {draftEvals.length > 0 && (
              <p className="mt-1.5 text-xs text-[#d97706]">
                ⏳ {draftEvals.length} pending evaluation{draftEvals.length !== 1 ? "s" : ""} (Draft — not yet counted)
              </p>
            )}
            {officialEvals.length === 0 && (
              <p className="mt-2 text-sm text-[#796C62] italic">
                No official evaluations yet. Your score will appear once an evaluator submits.
              </p>
            )}
          </div>

          {/* Score legend */}
          <div className="flex flex-col gap-1.5 text-xs">
            {[
              { range: "≥ 75", label: "Excellent", color: "#16a34a", bg: "#dcfce7" },
              { range: "50–74", label: "Satisfactory", color: "#d97706", bg: "#fef9c3" },
              { range: "< 50", label: "Needs Improvement", color: "#dc2626", bg: "#fee2e2" },
            ].map((item) => (
              <div
                key={item.range}
                className="flex items-center gap-2 rounded-full px-3 py-1"
                style={{ backgroundColor: item.bg }}
              >
                <span className="font-bold" style={{ color: item.color }}>
                  {item.range}
                </span>
                <span style={{ color: item.color }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Category Breakdown ─────────────────────────────────────────────── */}
      <div className="mt-8">
        <h2 className="font-serif text-xl font-bold text-[#211B17] mb-4">
          Category Breakdown
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_META.map((cat) => {
            const avg = categoryAverages[cat.key];
            const weight = Math.round(CONTRIBUTION_WEIGHTS[cat.key] * 100);
            const color = officialEvals.length > 0 ? scoreColor(avg) : "#c4b4a8";

            return (
              <div
                key={cat.key}
                className="rounded-xl border border-[#EEE2D7] bg-white p-5 flex flex-col gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-[#211B17] leading-snug">
                    {cat.label}
                  </h3>
                  <span className="shrink-0 rounded-full bg-[#F8E7D8] px-2 py-0.5 text-xs font-bold text-[#AD5127]">
                    {weight}%
                  </span>
                </div>
                <p className="text-xs text-[#796C62] leading-relaxed">{cat.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-[#796C62]">Avg. Score</span>
                    <span className="font-bold" style={{ color }}>
                      {officialEvals.length > 0 ? `${avg}/100` : "—"}
                    </span>
                  </div>
                  <ProgressBar
                    value={officialEvals.length > 0 ? avg : 0}
                    color={officialEvals.length > 0 ? scoreColor(avg) : "#EEE2D7"}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Evaluation History ─────────────────────────────────────────────── */}
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-xl font-bold text-[#211B17]">
            Evaluation History
          </h2>
          <span className="text-xs text-[#796C62]">
            {evaluations.length} total · {officialEvals.length} official
          </span>
        </div>

        {evaluations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#EEE2D7] bg-[#FFFDF9] py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-semibold text-[#211B17]">No official evaluations yet</p>
            <p className="mt-1 text-sm text-[#796C62] max-w-sm mx-auto">
              Evaluation scores are added by authorized evaluators only. Check back after
              your first evaluation period.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {evaluations.map((ev) => (
              <EvalRow
                key={ev.id}
                ev={ev}
                expanded={expandedId === ev.id}
                onToggle={() => toggleExpand(ev.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Admin Section ──────────────────────────────────────────────────── */}
      {isAdmin && (
        <div className="mt-10">
          <div className="mb-4 flex items-center gap-3">
            <h2 className="font-serif text-xl font-bold text-[#211B17]">
              Admin: Add New Evaluation
            </h2>
            <span className="rounded-full bg-[#AD5127] px-2.5 py-0.5 text-[10px] font-bold text-white">
              ADMIN ONLY
            </span>
          </div>
          <AdminForm onAdd={handleAddEval} />
        </div>
      )}
    </PortalLayout>
  );
}
