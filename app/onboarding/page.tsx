"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { onboardingSections } from "@/lib/portal-data";
import { usePortal } from "@/lib/portal-context";

export default function OnboardingPage() {
  const { readOnboardingIds, toggleOnboardingRead, showToast } = usePortal();
  const [activeSectionId, setActiveSectionId] = useState<string>("welcome");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const activeSection =
    onboardingSections.find((s) => s.id === activeSectionId) ||
    onboardingSections[0];

  const totalModules = onboardingSections.length;
  const readModules = readOnboardingIds.length;
  const progressPercent = Math.round((readModules / totalModules) * 100);

  const handleDownload = (name: string) => {
    showToast(`Downloading demo resource: "${name}"`, "info");
  };

  return (
    <PortalLayout>
      {/* Page Title */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Orientation & Guidelines
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Intern Onboarding Kit
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Comprehensive handbook covering community engagement, safety, ethics, and workflows.
          </p>
        </div>

        {/* Reading Progress */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#eedfd2] bg-white p-3.5 shadow-sm">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf0e8] text-[#ad5127] font-bold text-xs">
            {progressPercent}%
          </div>
          <div>
            <p className="text-xs font-bold text-[#211b17]">Modules Reviewed</p>
            <p className="text-[11px] text-[#796c62]">
              {readModules} of {totalModules} sections completed
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar for Modules (4 columns) */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-4 shadow-sm">
            <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#9a8a7e]">
              Handbook Modules
            </p>
            <div className="space-y-1">
              {onboardingSections.map((sec, idx) => {
                const isActive = sec.id === activeSectionId;
                const isRead = readOnboardingIds.includes(sec.id);

                return (
                  <button
                    key={sec.id}
                    onClick={() => setActiveSectionId(sec.id)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition ${
                      isActive
                        ? "bg-[#faf0e8] text-[#ad5127] font-bold shadow-sm"
                        : "text-[#62554a] hover:bg-[#faf7f3] hover:text-[#211b17]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 pr-2">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold bg-[#f1e6db] text-[#78695d]">
                        {idx + 1}
                      </span>
                      <span className="truncate text-xs font-semibold">
                        {sec.title}
                      </span>
                    </div>

                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleOnboardingRead(sec.id);
                      }}
                      title={isRead ? "Mark as unread" : "Mark as read"}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition ${
                        isRead
                          ? "bg-[#ad5127] text-white"
                          : "border border-[#d9cdbe] text-transparent hover:border-[#ad5127]"
                      }`}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Downloadable Reference Templates */}
          <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdfa] p-5">
            <h3 className="font-serif text-sm font-bold text-[#211b17]">
              Reference Templates
            </h3>
            <div className="mt-3 space-y-2">
              <button
                onClick={() => handleDownload("CauseKind_Outreach_Handbook.pdf")}
                className="flex w-full items-center justify-between rounded-xl border border-[#ede2d6] bg-white p-2.5 text-xs text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span className="truncate font-medium">📄 Outreach Handbook PDF</span>
                <span className="text-[11px] font-bold text-[#ad5127]">Download</span>
              </button>
              <button
                onClick={() => handleDownload("Field_Consent_Form_Template.docx")}
                className="flex w-full items-center justify-between rounded-xl border border-[#ede2d6] bg-white p-2.5 text-xs text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span className="truncate font-medium">📑 Field Consent Form Template</span>
                <span className="text-[11px] font-bold text-[#ad5127]">Download</span>
              </button>
              <button
                onClick={() => handleDownload("Task_Submission_Template.xlsx")}
                className="flex w-full items-center justify-between rounded-xl border border-[#ede2d6] bg-white p-2.5 text-xs text-[#211b17] hover:border-[#ad5127] hover:text-[#ad5127] transition"
              >
                <span className="truncate font-medium">📊 Activity Log Template</span>
                <span className="text-[11px] font-bold text-[#ad5127]">Download</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content Viewer (8 columns) */}
        <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm lg:col-span-8 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#f0e7df] pb-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
                {activeSection.category}
              </span>
              <span className="text-xs text-[#89796d]">
                ⏱️ {activeSection.readTime}
              </span>
            </div>

            <button
              onClick={() => toggleOnboardingRead(activeSection.id)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold transition ${
                readOnboardingIds.includes(activeSection.id)
                  ? "bg-[#faf0e8] text-[#ad5127] border border-[#f2d8c3]"
                  : "bg-[#ad5127] text-white hover:bg-[#93421e]"
              }`}
            >
              <span>
                {readOnboardingIds.includes(activeSection.id)
                  ? "✓ Marked as Read"
                  : "Mark as Read"}
              </span>
            </button>
          </div>

          <h2 className="mt-5 font-serif text-2xl font-bold text-[#211b17]">
            {activeSection.title}
          </h2>

          <p className="mt-3 text-sm font-medium leading-relaxed text-[#796c62] italic bg-[#faf7f3] p-4 rounded-xl border-l-4 border-[#ad5127]">
            {activeSection.summary}
          </p>

          <div className="mt-6 space-y-4 text-sm leading-7 text-[#52453b]">
            {activeSection.content.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>

          {/* Actionable Tips */}
          {activeSection.tips && activeSection.tips.length > 0 && (
            <div className="mt-8 rounded-2xl border border-[#edd7c4] bg-[#fffaf5] p-5">
              <h4 className="font-serif text-sm font-bold text-[#ad5127]">
                Key Outreach Takeaways:
              </h4>
              <ul className="mt-2.5 space-y-2 text-xs leading-5 text-[#6c5e53]">
                {activeSection.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#ad5127] font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* FAQs Accordion */}
          {activeSection.faqs && activeSection.faqs.length > 0 && (
            <div className="mt-8 border-t border-[#f0e7df] pt-6">
              <h4 className="font-serif text-lg font-bold text-[#211b17] mb-4">
                Frequently Asked Inquiries
              </h4>
              <div className="space-y-3">
                {activeSection.faqs.map((faq, idx) => {
                  const isOpen = expandedFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-[#ede3d8] bg-[#fffdfa] overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between p-4 text-left text-xs font-bold text-[#211b17] hover:bg-[#faf7f3]"
                      >
                        <span>{faq.question}</span>
                        <span className="text-[#ad5127] ml-2">
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="px-4 pb-4 text-xs leading-6 text-[#695b50] border-t border-[#f4ede6] pt-3">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
