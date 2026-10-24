"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";
import { DocumentRecord } from "@/lib/types";

export default function VerificationPage() {
  const { currentUser, documents, templates, uploadDocument, removeDocument, showToast } =
    usePortal();

  const [selectedType, setSelectedType] =
    useState<DocumentRecord["documentType"]>("COLLEGE_ID");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [declarationAgreed, setDeclarationAgreed] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);

  const verificationStatus = currentUser?.verificationStatus || "PENDING_VERIFICATION";

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        setUploadError("File is too large. Maximum size is 10 MB.");
        return;
      }
      const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
      if (!allowed.includes(file.type)) {
        setUploadError("Please upload a PDF, PNG, or JPG file.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError("");

    if (!selectedFile) {
      setUploadError("Please select a document file to upload.");
      return;
    }

    if (!declarationAgreed) {
      setUploadError("Please confirm the document accuracy declaration.");
      return;
    }

    setUploading(true);

    setTimeout(() => {
      const fileSize =
        selectedFile.size > 1024 * 1024
          ? `${(selectedFile.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(selectedFile.size / 1024)} KB`;

      uploadDocument(selectedType, selectedFile.name, fileSize);
      setUploading(false);
      setSelectedFile(null);
      setDeclarationAgreed(false);
    }, 500);
  };

  const handleDownloadTemplate = (templateTitle: string, fileName: string) => {
    showToast(`Downloading template: "${templateTitle}" (${fileName})`, "info");
  };

  return (
    <PortalLayout>
      {/* Page Title */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Compliance & Identity
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Volunteer Verification & Documents
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Upload required college proof and signed agreements to earn verified intern status.
          </p>
        </div>

        {/* Current Verification Status Pill */}
        <div className="flex items-center gap-3 rounded-2xl border border-[#eedfd2] bg-white p-3.5 shadow-sm">
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold ${
              verificationStatus === "VERIFIED"
                ? "bg-[#f8e7d8] text-[#ad5127]"
                : verificationStatus === "CORRECTIONS_REQUESTED"
                ? "bg-[#fff2e8] text-[#d97736]"
                : "bg-[#f4eee7] text-[#786a5f]"
            }`}
          >
            {verificationStatus === "VERIFIED" ? "✓" : "⏳"}
          </div>
          <div>
            <p className="text-xs font-bold text-[#211b17]">Verification Status</p>
            <p
              className={`text-[11px] font-bold ${
                verificationStatus === "VERIFIED"
                  ? "text-[#ad5127]"
                  : verificationStatus === "CORRECTIONS_REQUESTED"
                  ? "text-[#d97736]"
                  : "text-[#796c62]"
              }`}
            >
              {verificationStatus === "VERIFIED"
                ? "Officially Verified Intern"
                : verificationStatus === "CORRECTIONS_REQUESTED"
                ? "Corrections Requested by Reviewer"
                : "Pending Admin Document Review"}
            </p>
          </div>
        </div>
      </div>

      {/* Verification Notice Banner */}
      <div
        className={`mt-6 rounded-2xl border p-5 text-xs leading-relaxed ${
          verificationStatus === "VERIFIED"
            ? "border-[#eed8c5] bg-[#fffaf5] text-[#7d6c60]"
            : "border-[#f4cfbf] bg-[#fff8f5] text-[#8e3914]"
        }`}
      >
        <p className="font-bold text-sm">
          {verificationStatus === "VERIFIED"
            ? "✓ Your credentials have been officially endorsed by CauseKind Administration."
            : "⚠️ Verification In Progress — Access Permitted under Provisional Status"}
        </p>
        <p className="mt-1">
          {verificationStatus === "VERIFIED"
            ? "Your college endorsement and internship declaration are on file. You are fully eligible for field outreach leadership and the final Certificate of Completion."
            : "Upload your valid college ID card and signed declaration below. Our compliance team verifies submissions within 24 to 48 hours."}
        </p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column (7 cols): Document Upload Form */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm sm:p-8">
            <h2 className="font-serif text-xl font-bold text-[#211b17]">
              Submit New Verification Document
            </h2>
            <p className="mt-1 text-xs text-[#796c62]">
              Select document type, review guidelines, and attach your file.
            </p>

            <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                  Document Category *
                </label>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as DocumentRecord["documentType"])
                  }
                  className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                >
                  <option value="COLLEGE_ID">College Student ID Card (Front & Back)</option>
                  <option value="INTERNSHIP_DECLARATION">Signed Internship Declaration Form</option>
                  <option value="STUDENT_VERIFICATION">Bonafide / Enrollment Certificate</option>
                  <option value="CONSENT_FORM">Field Safety & Parental Consent Form</option>
                  <option value="CAMPAIGN_EVIDENCE">Outreach Photographic Evidence</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                  Select Document File (PDF, PNG, JPG up to 10 MB) *
                </label>
                <div className="rounded-2xl border-2 border-dashed border-[#dbcab8] bg-[#fffdfa] p-6 text-center">
                  {selectedFile ? (
                    <div className="flex items-center justify-between rounded-xl bg-[#faf5f0] p-3 text-left">
                      <div className="truncate">
                        <p className="text-xs font-bold text-[#211b17] truncate">
                          📄 {selectedFile.name}
                        </p>
                        <p className="text-[10px] text-[#86776b]">
                          {(selectedFile.size / 1024).toFixed(1)} KB • Ready to submit
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="ml-3 text-xs font-bold text-[#a63d23] hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <svg
                        className="mx-auto h-8 w-8 text-[#b5a394]"
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
                        htmlFor="docFileInput"
                        className="mt-2 inline-block cursor-pointer rounded-full bg-[#f8e7d8] px-5 py-2 text-xs font-bold text-[#ad5127] hover:bg-[#fadbc3] transition"
                      >
                        Browse File
                      </label>
                      <input
                        id="docFileInput"
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <p className="mt-2 text-[11px] text-[#938478]">
                        High resolution scan or clear photograph required.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Declaration Checkbox */}
              <label className="flex items-start gap-3 cursor-pointer pt-2 text-xs leading-5 text-[#6c5e53]">
                <input
                  type="checkbox"
                  checked={declarationAgreed}
                  onChange={(e) => setDeclarationAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 accent-[#ad5127]"
                />
                <span>
                  I declare under penalty of disqualification that this document is genuine and represents my bonafide enrollment at{" "}
                  <strong>{currentUser?.profile.institution}</strong>.
                </span>
              </label>

              {uploadError && (
                <p className="rounded-xl border border-[#f0c9bc] bg-[#fff3ee] p-3 text-xs text-[#a33d25]">
                  {uploadError}
                </p>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={uploading}
                  className="w-full rounded-full bg-[#ad5127] py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e] disabled:opacity-60 transition"
                >
                  {uploading ? "Submitting Document..." : "Submit for Verification →"}
                </button>
              </div>
            </form>
          </div>

          {/* Submitted Documents History */}
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#211b17] border-b border-[#f0e7df] pb-3">
              Submitted Documents on Record ({documents.length})
            </h3>

            {documents.length > 0 ? (
              <div className="mt-4 space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#ede3d8] bg-[#fffaf5] p-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#211b17]">{doc.title}</span>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            doc.status === "APPROVED"
                              ? "bg-[#f8e7d8] text-[#ad5127]"
                              : doc.status === "REJECTED"
                              ? "bg-[#fee2e2] text-[#991b1b]"
                              : "bg-[#fff2e8] text-[#d97736]"
                          }`}
                        >
                          {doc.status}
                        </span>
                      </div>
                      <p className="mt-1 text-[#796c62]">
                        📎 {doc.fileName} ({doc.fileSize}) • Uploaded: {doc.uploadedAt}
                      </p>
                      {doc.reviewerNotes && (
                        <p className="mt-1.5 text-[11px] text-[#ad5127] font-medium bg-white p-2 rounded-lg border border-[#edd7c4]">
                          <strong>Reviewer Note:</strong> {doc.reviewerNotes}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeDocument(doc.id)}
                      className="text-xs font-bold text-[#a63d23] hover:underline shrink-0"
                    >
                      Delete / Replace
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-xs text-[#86776b]">
                No documents uploaded yet. Submit your college ID above.
              </p>
            )}
          </div>
        </div>

        {/* Right Column (5 cols): Downloadable Official Templates */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#211b17] border-b border-[#f0e7df] pb-3">
              Official Downloadable Templates
            </h3>
            <p className="mt-2 text-xs text-[#796c62]">
              Download and print official CauseKind templates. Sign and upload them for milestone compliance.
            </p>

            <div className="mt-5 space-y-3">
              {templates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  className="rounded-xl border border-[#ede3d8] bg-[#fffdfa] p-4 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#ad5127]">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] text-[#9a897c]">{tmpl.fileSize}</span>
                  </div>
                  <h4 className="font-bold text-[#211b17]">{tmpl.title}</h4>
                  <p className="text-[#695d52] leading-5">{tmpl.description}</p>
                  <div className="pt-2 flex items-center justify-between border-t border-[#f2e9e1]">
                    <span className="text-[10px] text-[#86776b]">
                      For: {tmpl.requiredFor}
                    </span>
                    <button
                      onClick={() => handleDownloadTemplate(tmpl.title, tmpl.fileName)}
                      className="rounded-lg bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127] hover:bg-[#fadbc3] transition"
                    >
                      Download PDF ↓
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Legal disclaimer */}
          <div className="rounded-2xl border border-[#ebd7c6] bg-[#faf3ed] p-5 text-xs text-[#7d6c60] leading-relaxed">
            <p className="font-bold text-[#211b17]">🔒 Privacy & Secure Storage</p>
            <p className="mt-1">
              Documents are processed securely solely for student verification. CauseKind never publishes personal student ID numbers or college registration marks publicly.
            </p>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}
