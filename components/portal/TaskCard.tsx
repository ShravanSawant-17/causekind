"use client";

import React, { useState } from "react";
import { TaskItem } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { usePortal } from "@/lib/portal-context";

interface TaskCardProps {
  task: TaskItem;
}

export function TaskCard({ task }: TaskCardProps) {
  const { updateTaskStatus, submitTask } = usePortal();
  const [expanded, setExpanded] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Submission Form State
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleStartTask = () => {
    updateTaskStatus(task.id, "In Progress");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Max 10MB
      if (file.size > 10 * 1024 * 1024) {
        setFileError("File is too large. Maximum allowed size is 10 MB.");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (!allowedTypes.includes(file.type) && !file.name.endsWith(".docx") && !file.name.endsWith(".xlsx")) {
        setFileError("Please upload a PDF, PNG, JPG, DOCX, or XLSX file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionText.trim()) {
      setFileError("Please enter a short description or summary of your work.");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      const fileSizeString = selectedFile
        ? selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(selectedFile.size / 1024)} KB`
        : undefined;

      submitTask(task.id, {
        description: submissionText.trim(),
        fileName: selectedFile?.name,
        fileSize: fileSizeString,
      });

      setSubmitting(false);
      setShowSubmitModal(false);
      setSubmissionText("");
      setSelectedFile(null);
    }, 500);
  };

  return (
    <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm transition hover:border-[#dfcebf]">
      {/* Top row: Category, Priority, and Status */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
            {task.category}
          </span>
          <StatusBadge status={task.priority} size="sm" />
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Task Title & Description */}
      <div className="mt-4">
        <h3 className="font-serif text-lg font-bold text-[#211b17]">
          {task.title}
        </h3>
        <p className="mt-1 text-sm leading-relaxed text-[#6d6056]">
          {task.description}
        </p>
      </div>

      {/* Assigned Date, Due Date, and Hours */}
      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#89796d] border-t border-[#f4ede6] pt-3">
        <span className="flex items-center gap-1.5">
          <span>📅</span>
          <strong>Due:</strong> {task.dueDate}
        </span>
        <span className="flex items-center gap-1.5">
          <span>⏱️</span>
          <strong>Est:</strong> {task.estimatedHours} hrs
        </span>
        <span className="text-[#a4968a]">ID: {task.id}</span>
      </div>

      {/* Expandable Guidelines */}
      {expanded && (
        <div className="mt-4 rounded-xl border border-[#ede3d8] bg-[#faf6f1] p-4 text-xs">
          <h4 className="font-bold text-[#211b17] uppercase tracking-wide">
            Task Guidelines & Deliverables
          </h4>
          <ul className="mt-2 space-y-1.5 text-[#6c5f55]">
            {task.guidelines.map((g, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#ad5127] font-bold">•</span>
                <span>{g}</span>
              </li>
            ))}
          </ul>

          {/* If Task has prior submission */}
          {task.submission && (
            <div className="mt-4 border-t border-[#e8ded3] pt-3">
              <h5 className="font-bold text-[#211b17]">Submitted Work</h5>
              <p className="mt-1 text-[#665a51]">
                {task.submission.description}
              </p>
              {task.submission.fileName && (
                <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-1.5 border border-[#e2d5c8] text-[#ad5127] font-medium">
                  <span>📎</span>
                  <span>{task.submission.fileName}</span>
                  {task.submission.fileSize && (
                    <span className="text-[11px] text-[#938478]">
                      ({task.submission.fileSize})
                    </span>
                  )}
                </div>
              )}
              {task.submission.reviewerFeedback && (
                <div className="mt-2.5 rounded-lg bg-[#fdf5eb] p-2.5 border border-[#f5dfc9] text-[#8e451b]">
                  <strong>Reviewer Feedback:</strong>{" "}
                  {task.submission.reviewerFeedback}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Footer */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#f0e7df]">
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-[#8b7a6d] hover:text-[#211b17] flex items-center gap-1"
        >
          {expanded ? "Hide Details ▲" : "View Details ▼"}
        </button>

        <div className="flex items-center gap-2">
          {task.status === "Not Started" && (
            <button
              onClick={handleStartTask}
              className="rounded-full bg-[#f8e7d8] px-4 py-2 text-xs font-bold text-[#ad5127] transition hover:bg-[#fadbc3]"
            >
              Start Task →
            </button>
          )}

          {task.status === "In Progress" && (
            <button
              onClick={() => setShowSubmitModal(true)}
              className="rounded-full bg-[#ad5127] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#93421e]"
            >
              Submit Work →
            </button>
          )}

          {task.status === "Submitted" && (
            <button
              onClick={() => setExpanded(true)}
              className="rounded-full border border-[#e2d2be] bg-[#fbf5ee] px-3.5 py-1.5 text-xs font-semibold text-[#996515]"
            >
              Pending Review
            </button>
          )}

          {task.status === "Completed" && (
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ad5127]">
              <span>✓ Verified</span>
            </span>
          )}
        </div>
      </div>

      {/* Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#211b17]/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eee2d7] bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-center justify-between border-b border-[#f0e7df] pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                  {task.category}
                </span>
                <h3 className="font-serif text-xl font-bold text-[#211b17]">
                  Submit Task Work
                </h3>
              </div>
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#89796d] hover:bg-[#faf7f3]"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <p className="mt-3 text-xs leading-5 text-[#6c5f55]">
              Task: <strong>{task.title}</strong>
            </p>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor={`desc-${task.id}`}
                  className="block text-xs font-bold uppercase tracking-wider text-[#4d4036] mb-1.5"
                >
                  Work Description & Key Outcomes *
                </label>
                <textarea
                  id={`desc-${task.id}`}
                  rows={4}
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                  placeholder="Summarise what you accomplished, key data gathered, or participants reached..."
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] p-3 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                />
              </div>

              {/* File Attachment */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#4d4036] mb-1.5">
                  Evidence Attachment (Optional)
                </label>
                <div className="rounded-xl border border-dashed border-[#dbcab8] bg-[#fffdfa] p-4 text-center">
                  {selectedFile ? (
                    <div className="flex items-center justify-between rounded-lg bg-[#faf3ed] p-2.5 text-left">
                      <div className="truncate">
                        <p className="truncate text-xs font-bold text-[#211b17]">
                          📄 {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-[#86776b]">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="ml-3 shrink-0 text-xs font-bold text-[#a63b20] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="mx-auto h-7 w-7 text-[#b5a394]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.8}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      <label
                        htmlFor={`file-${task.id}`}
                        className="mt-2 inline-block cursor-pointer rounded-full bg-[#f8e7d8] px-4 py-1.5 text-xs font-bold text-[#ad5127] hover:bg-[#fadbc3]"
                      >
                        Select Evidence File
                      </label>
                      <input
                        id={`file-${task.id}`}
                        type="file"
                        onChange={handleFileChange}
                        accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx"
                        className="hidden"
                      />
                      <p className="mt-1.5 text-[11px] text-[#938478]">
                        PDF, PNG, JPG, DOCX, XLSX up to 10 MB
                      </p>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-[10px] text-[#9b8d81]">
                  Note: In this frontend preview, file selection is validated locally. Server storage will require backend integration.
                </p>
              </div>

              {fileError && (
                <p className="rounded-xl border border-[#f2c7b8] bg-[#fff3ef] p-2.5 text-xs text-[#a6381e]">
                  {fileError}
                </p>
              )}

              {/* Form buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#796c62] hover:bg-[#faf7f3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#93421e] disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Task Proof →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
