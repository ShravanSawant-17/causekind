"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { usePortal } from "@/lib/portal-context";
import { Team } from "@/lib/types";

type RegistrationMode = "SELECT" | "INDIVIDUAL" | "TEAM_LEADER" | "JOIN_TEAM";

const collegesList = [
  "Fr. Conceicao Rodrigues College of Engineering (CRCE), Mumbai",
  "St. Xavier's College, Mumbai",
  "Veermata Jijabai Technological Institute (VJTI), Mumbai",
  "Sardar Patel Institute of Technology (SPIT), Mumbai",
  "K.J. Somaiya College of Engineering, Mumbai",
  "D.J. Sanghvi College of Engineering, Mumbai",
  "H.R. College of Commerce & Economics, Mumbai",
  "Jai Hind College, Mumbai",
  "Other / Outside Maharashtra (Enter Manually)",
];

const availableSkills = [
  "Community Outreach",
  "Field Surveying",
  "Data Analysis",
  "Team Coordination",
  "Digital Storytelling",
  "Social Media Campaigns",
  "Event Management",
  "First Aid & Safety",
  "Teaching & Tutoring",
];

const availableCauses = [
  "Childhood Education",
  "Digital Literacy",
  "Youth Mentorship",
  "Women Empowerment",
  "Environmental Cleanliness",
  "Healthcare & Nutrition",
];

export default function RegisterPage() {
  const router = useRouter();
  const { registerIndividual, registerTeamLeader, joinTeamWithCode, teams } = usePortal();

  // Wizard Mode & Step
  const [mode, setMode] = useState<RegistrationMode>("SELECT");
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // College & Education
  const [institution, setInstitution] = useState(collegesList[0]);
  const [manualInstitution, setManualInstitution] = useState("");
  const [course, setCourse] = useState("B.E. Computer Engineering");
  const [department, setDepartment] = useState("Information Technology");
  const [year, setYear] = useState("3rd Year");
  const [graduationYear, setGraduationYear] = useState("2027");
  const [studentId, setStudentId] = useState("");

  // Volunteer Profile
  const [bio, setBio] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([
    "Community Outreach",
    "Field Surveying",
  ]);
  const [selectedCauses, setSelectedCauses] = useState<string[]>([
    "Childhood Education",
    "Digital Literacy",
  ]);
  const [availability, setAvailability] = useState("10-12 hours / week (Weekends)");
  const [city, setCity] = useState("Mumbai");
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  // Team Leader specific fields
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamSize, setTeamSize] = useState(6);
  const [invitedEmailInput, setInvitedEmailInput] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);

  // Join Team specific fields
  const [joinInviteCode, setJoinInviteCode] = useState("");
  const [foundTeamPreview, setFoundTeamPreview] = useState<Team | null>(null);

  // UI status
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdSummary, setCreatedSummary] = useState<{
    name: string;
    email: string;
    role: string;
    teamName?: string;
    inviteCode?: string;
  } | null>(null);

  // Photo Upload Handler with preview, type and size validation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Profile photo exceeds 5 MB. Please select a smaller image.");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload a valid image file (PNG, JPG, JPEG).");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setAvatarPreview("");
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleCause = (cause: string) => {
    setSelectedCauses((prev) =>
      prev.includes(cause) ? prev.filter((c) => c !== cause) : [...prev, cause]
    );
  };

  const handleAddInvitedEmail = () => {
    if (!invitedEmailInput.trim()) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmailInput.trim())) {
      setError("Please enter a valid email address to invite.");
      return;
    }
    setInvitedEmails((prev) => [...prev, invitedEmailInput.trim()]);
    setInvitedEmailInput("");
    setError("");
  };

  const removeInvitedEmail = (idx: number) => {
    setInvitedEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  // Step 1 Validation
  const validateStep1 = () => {
    setError("");
    if (!fullName.trim()) return "Full name is required.";
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "A valid email address is required.";
    if (!phone.trim() || phone.trim().length < 8)
      return "Please enter a valid mobile number.";
    if (!password || password.length < 8)
      return "Password must be at least 8 characters long.";
    if (password !== confirmPassword) return "Passwords do not match.";
    if (!agreeTerms)
      return "You must accept the CauseKind volunteer terms and privacy policy.";
    return null;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    setError("");
    const finalCollege =
      institution.includes("Other") ? manualInstitution.trim() : institution;
    if (!finalCollege) return "Please specify your college or institution.";
    if (!course.trim()) return "Degree / Course name is required.";
    if (!year.trim()) return "Current academic year is required.";
    return null;
  };

  // Step 3 Validation
  const validateStep3 = () => {
    setError("");
    if (!city.trim()) return "Volunteering city / area is required.";
    if (mode === "TEAM_LEADER") {
      if (!teamName.trim()) return "Please enter a team name.";
      if (!teamDescription.trim()) return "Please enter a brief team description.";
    }
    return null;
  };

  const handleNextStep = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) return setError(err);
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) return setError(err);
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) return setError(err);
      setStep(4);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const finalCollege = institution.includes("Other")
      ? manualInstitution.trim()
      : institution;

    if (mode === "INDIVIDUAL") {
      const account = registerIndividual({
        fullName,
        email,
        password,
        phone,
        institution: finalCollege,
        course,
        department,
        year,
        graduationYear,
        studentId,
        bio,
        skills: selectedSkills,
        interests: selectedCauses,
        preferredCauses: selectedCauses,
        availability,
        city,
        avatarUrl: avatarPreview,
      });

      setCreatedSummary({
        name: account.profile.name,
        email: account.email,
        role: "Individual Volunteer",
      });
      setIsSubmitted(true);
    } else if (mode === "TEAM_LEADER") {
      const { account, team } = registerTeamLeader({
        fullName,
        email,
        password,
        phone,
        institution: finalCollege,
        course,
        department,
        year,
        graduationYear,
        studentId,
        bio,
        skills: selectedSkills,
        interests: selectedCauses,
        preferredCauses: selectedCauses,
        availability,
        city,
        avatarUrl: avatarPreview,
        teamName,
        teamDescription,
        teamSize,
        invitedEmails,
      });

      setCreatedSummary({
        name: account.profile.name,
        email: account.email,
        role: "Team Leader",
        teamName: team.name,
        inviteCode: team.inviteCode,
      });
      setIsSubmitted(true);
    }
  };

  // Join Existing Team Flow
  const handleCheckTeamCode = (code: string) => {
    setJoinInviteCode(code);
    const clean = code.trim().toUpperCase();
    const found = teams.find(
      (t) => t.inviteCode.toUpperCase() === clean || t.id.toUpperCase() === clean
    );
    if (found) {
      setFoundTeamPreview(found);
      setError("");
    } else {
      setFoundTeamPreview(null);
    }
  };

  const handleJoinTeamSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const err = validateStep1();
    if (err) return setError(err);

    if (!foundTeamPreview) {
      setError("Please enter a valid Team Invitation Code (e.g. CK-BANDRA-26).");
      return;
    }

    // Register user first
    const account = registerIndividual({
      fullName,
      email,
      password,
      phone,
      institution: foundTeamPreview.college,
      course,
      department,
      year,
      graduationYear,
      studentId,
      bio,
      skills: selectedSkills,
      interests: selectedCauses,
      preferredCauses: selectedCauses,
      availability,
      city,
      avatarUrl: avatarPreview,
    });

    // Then join team
    const joinRes = joinTeamWithCode(joinInviteCode);
    if (!joinRes.success) {
      setError(joinRes.error || "Failed to join team.");
      return;
    }

    setCreatedSummary({
      name: account.profile.name,
      email: account.email,
      role: `Team Member (${foundTeamPreview.name})`,
      teamName: foundTeamPreview.name,
    });
    setIsSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#faf7f3] text-[#211b17]">
      <header className="flex h-[82px] items-center justify-between border-b border-[#eee5dc] bg-white/80 px-6 sm:px-12">
        <Link
          href="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span className="text-3xl text-[#b45a2b]">♡</span>
          <span>
            Cause<span className="text-[#b45a2b]">Kind</span>
          </span>
        </Link>
        <span className="rounded-full border border-[#ead9ca] px-4 py-2 text-xs font-bold tracking-[0.18em] text-[#a95128]">
          VOLUNTEER REGISTRATION
        </span>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-8">
        {/* Success Screen after Account Creation */}
        {isSubmitted && createdSummary ? (
          <div className="mx-auto max-w-xl rounded-[28px] border border-[#eee2d7] bg-white p-8 shadow-xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f8e7d8] text-3xl text-[#ad5127]">
              ✓
            </div>

            <span className="mt-4 inline-block rounded-full bg-[#f8e7d8] px-3 py-1 text-xs font-bold text-[#ad5127]">
              REGISTRATION COMPLETE
            </span>

            <h2 className="mt-3 font-serif text-3xl font-bold text-[#211b17]">
              Welcome to CauseKind, {createdSummary.name.split(" ")[0]}!
            </h2>

            <p className="mt-2 text-xs text-[#796c62] leading-relaxed">
              Your account has been created and initialized. All your typed details (name, college, course, bio, and profile photo) have been saved to your intern profile.
            </p>

            <div className="mt-6 rounded-2xl border border-[#ede1d5] bg-[#faf6f1] p-5 text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-[#f0e7df] pb-2">
                <span className="text-[#796c62]">Registered Name:</span>
                <span className="font-bold text-[#211b17]">{createdSummary.name}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0e7df] pb-2">
                <span className="text-[#796c62]">Email Address:</span>
                <span className="font-bold text-[#211b17]">{createdSummary.email}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0e7df] pb-2">
                <span className="text-[#796c62]">Assigned Role:</span>
                <span className="font-bold text-[#ad5127]">{createdSummary.role}</span>
              </div>
              <div className="flex justify-between border-b border-[#f0e7df] pb-2">
                <span className="text-[#796c62]">Account Status:</span>
                <span className="font-bold text-[#d97736]">PENDING_VERIFICATION</span>
              </div>
              {createdSummary.inviteCode && (
                <div className="flex justify-between pt-1">
                  <span className="text-[#796c62]">Team Invite Code:</span>
                  <span className="font-bold text-[#ad5127]">{createdSummary.inviteCode}</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <button
                onClick={() =>
                  router.push(mode === "TEAM_LEADER" ? "/team" : "/dashboard")
                }
                className="w-full rounded-full bg-[#ad5127] py-3.5 text-xs font-bold text-white shadow-md hover:bg-[#93421e] transition"
              >
                Go to Portal Dashboard →
              </button>
              <Link
                href="/verification"
                className="block text-center text-xs font-semibold text-[#ad5127] hover:underline"
              >
                Upload College Verification Documents Now →
              </Link>
            </div>
          </div>
        ) : mode === "SELECT" ? (
          /* Selection Screen: Choose Role / Workflow */
          <div className="text-center">
            <span className="inline-flex rounded-full border border-[#efd8c7] bg-[#f7e9dd] px-4 py-2 text-xs font-bold tracking-[0.2em] text-[#ad5026]">
              START YOUR JOURNEY
            </span>
            <h1 className="mt-4 font-serif text-4xl sm:text-5xl font-bold tracking-tight text-[#211b17]">
              Choose Your Registration Pathway
            </h1>
            <p className="mt-3 text-sm text-[#796c62] max-w-xl mx-auto">
              Select how you would like to participate in the CauseKind internship cohort.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3 text-left">
              {/* Option 1: Individual Volunteer */}
              <div
                onClick={() => {
                  setMode("INDIVIDUAL");
                  setStep(1);
                }}
                className="group cursor-pointer rounded-3xl border border-[#eee2d7] bg-white p-7 shadow-sm transition hover:border-[#ad5127] hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#ad5127] group-hover:scale-105 transition">
                    🌱
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-[#211b17]">
                    Individual Volunteer
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#796c62]">
                    Register as an independent student volunteer. Track your personal outreach hours, survey submissions, and earn verified milestone certificates.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#f0e7df] flex items-center justify-between text-xs font-bold text-[#ad5127]">
                  <span>Register as Individual</span>
                  <span>→</span>
                </div>
              </div>

              {/* Option 2: Team Leader */}
              <div
                onClick={() => {
                  setMode("TEAM_LEADER");
                  setStep(1);
                }}
                className="group cursor-pointer rounded-3xl border border-[#eed8c5] bg-[#fffaf5] p-7 shadow-sm transition hover:border-[#ad5127] hover:shadow-lg flex flex-col justify-between ring-1 ring-[#ad5127]/10"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#ad5127] text-2xl text-white group-hover:scale-105 transition">
                    👑
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-[#211b17]">
                    Team Leader
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#796c62]">
                    Form a college delegation or student club cohort. Generate team invitation codes, invite peers, and coordinate joint community campaigns.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#f0e7df] flex items-center justify-between text-xs font-bold text-[#ad5127]">
                  <span>Create New Team</span>
                  <span>→</span>
                </div>
              </div>

              {/* Option 3: Join Existing Team */}
              <div
                onClick={() => {
                  setMode("JOIN_TEAM");
                  setStep(1);
                }}
                className="group cursor-pointer rounded-3xl border border-[#eee2d7] bg-white p-7 shadow-sm transition hover:border-[#ad5127] hover:shadow-lg flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8e7d8] text-2xl text-[#ad5127] group-hover:scale-105 transition">
                    🤝
                  </div>
                  <h3 className="mt-5 font-serif text-xl font-bold text-[#211b17]">
                    Join Existing Team
                  </h3>
                  <p className="mt-2 text-xs leading-6 text-[#796c62]">
                    Have an invitation code or link from your college cohort lead? Enter your team code to register and automatically join your squad.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#f0e7df] flex items-center justify-between text-xs font-bold text-[#ad5127]">
                  <span>Enter Team Code</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            <p className="mt-10 text-xs text-[#796c62]">
              Already registered?{" "}
              <Link href="/" className="font-bold text-[#ad5127] hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        ) : (
          /* Multi-Step Registration Wizard */
          <div className="rounded-[28px] border border-[#eee2d7] bg-white p-6 sm:p-10 shadow-lg">
            {/* Top Back & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee5dc] pb-6">
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (step > 1) setStep(step - 1);
                    else setMode("SELECT");
                  }}
                  className="text-xs font-bold text-[#ad5127] hover:underline flex items-center gap-1 mb-2"
                >
                  ← {step > 1 ? "Back to Previous Step" : "Change Registration Type"}
                </button>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#211b17]">
                  {mode === "TEAM_LEADER"
                    ? "Team Leader Registration"
                    : mode === "JOIN_TEAM"
                    ? "Join Existing College Team"
                    : "Individual Volunteer Registration"}
                </h2>
                <p className="mt-1 text-xs text-[#796c62]">
                  Fill in your academic and contact details to generate your verified intern profile.
                </p>
              </div>

              {/* Visual Step Indicator */}
              {mode !== "JOIN_TEAM" && (
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} className="flex items-center gap-1.5">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition ${
                          step === s
                            ? "bg-[#ad5127] text-white ring-4 ring-[#ad5127]/15"
                            : step > s
                            ? "bg-[#f8e7d8] text-[#ad5127]"
                            : "bg-[#f4eee7] text-[#9a897c]"
                        }`}
                      >
                        {step > s ? "✓" : s}
                      </div>
                      {s < 4 && <div className="h-0.5 w-4 bg-[#eee2d7]" />}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mt-6 rounded-2xl border border-[#f0c9bc] bg-[#fff3ee] p-4 text-xs leading-5 text-[#a33d25]">
                {error}
              </div>
            )}

            {/* STEP 1: Account Details */}
            {step === 1 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#211b17]">
                  Step 1: Account & Credentials
                </h3>

                {mode === "JOIN_TEAM" && (
                  <div className="rounded-2xl border border-[#ecd9c7] bg-[#fffaf5] p-5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Team Invitation Code or Team ID *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinInviteCode}
                        onChange={(e) => handleCheckTeamCode(e.target.value)}
                        placeholder="e.g. CK-BANDRA-26 or CK-TEAM-8921"
                        className="w-full rounded-xl border border-[#e4d8cc] bg-white px-4 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                      />
                    </div>

                    {foundTeamPreview ? (
                      <div className="mt-3 rounded-xl bg-white p-3 border border-[#e8ddd3] text-xs">
                        <span className="font-bold text-[#ad5127]">✓ Team Verified: </span>
                        <strong>{foundTeamPreview.name}</strong> • Leader: {foundTeamPreview.leaderName} ({foundTeamPreview.college})
                      </div>
                    ) : joinInviteCode ? (
                      <p className="mt-2 text-[11px] text-[#a63d23]">
                        No active team found with code &quot;{joinInviteCode}&quot;.
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Shravan Sawant"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Password (min 8 chars) *
                    </label>
                    <div className="flex items-center rounded-xl border border-[#e8ddd3] bg-[#fffdfa] pr-4">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent px-4 py-3 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-xs font-semibold text-[#8b796d]"
                      >
                        {showPassword ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Confirm Password *
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer pt-2 text-xs leading-5 text-[#6c5e53]">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-[#ad5127]"
                  />
                  <span>
                    I confirm that I am a bonafide student and agree to the CauseKind volunteer terms, ethical code of conduct, and privacy notice.
                  </span>
                </label>

                <div className="pt-4 flex justify-end">
                  {mode === "JOIN_TEAM" ? (
                    <button
                      type="button"
                      onClick={handleJoinTeamSubmit}
                      className="rounded-full bg-[#ad5127] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                    >
                      Join Team & Create Account →
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="rounded-full bg-[#ad5127] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                    >
                      Continue to Education Details →
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: College & Education Details */}
            {step === 2 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-serif text-lg font-bold text-[#211b17]">
                  Step 2: College & Academic Endorsement
                </h3>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                    College / Institution *
                  </label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                  >
                    {collegesList.map((col, idx) => (
                      <option key={idx} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                {institution.includes("Other") && (
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Enter College / University Name *
                    </label>
                    <input
                      type="text"
                      value={manualInstitution}
                      onChange={(e) => setManualInstitution(e.target.value)}
                      placeholder="e.g. Mumbai University Affiliated College"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Degree / Course Name *
                    </label>
                    <input
                      type="text"
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      placeholder="e.g. B.E. Computer Engineering"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Department / Branch
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Information Technology"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Current Academic Year *
                    </label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Postgraduate">Postgraduate</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Expected Graduation Year
                    </label>
                    <input
                      type="text"
                      value={graduationYear}
                      onChange={(e) => setGraduationYear(e.target.value)}
                      placeholder="e.g. 2027"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Student ID / Roll Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. CRCE-2023-IT-084"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-3 text-sm outline-none focus:border-[#ad5127]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="rounded-full border border-[#d8c8b9] px-6 py-2.5 text-xs font-semibold text-[#796c62]"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-full bg-[#ad5127] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                  >
                    Continue to Profile & Photo →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Volunteer Profile & Team Setup */}
            {step === 3 && (
              <div className="mt-6 space-y-6">
                <h3 className="font-serif text-lg font-bold text-[#211b17]">
                  Step 3: Volunteer Profile & Community Interests
                </h3>

                {/* Profile Photo Uploader with Preview, Validation, and Removal */}
                <div className="rounded-2xl border border-[#eee2d7] bg-[#faf6f1] p-5">
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-2">
                    Profile Photograph (Optional)
                  </span>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="h-20 w-20 rounded-2xl bg-white border border-[#e2d5c7] flex items-center justify-center overflow-hidden shadow-sm">
                      {avatarPreview ? (
                        <img
                          src={avatarPreview}
                          alt="Avatar preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-[#b5a395]">📷</span>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="photoUpload"
                        className="cursor-pointer inline-block rounded-full bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e]"
                      >
                        {avatarPreview ? "Replace Photo" : "Upload Photograph"}
                      </label>
                      <input
                        id="photoUpload"
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={removePhoto}
                          className="ml-3 text-xs font-bold text-[#a63d23] hover:underline"
                        >
                          Remove Photo
                        </button>
                      )}
                      <p className="mt-1.5 text-[11px] text-[#86776b]">
                        Max 5 MB. PNG or JPG format.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Team Leader Specific Details */}
                {mode === "TEAM_LEADER" && (
                  <div className="rounded-2xl border border-[#ecd9c7] bg-[#fffaf5] p-5 space-y-4">
                    <h4 className="font-serif text-base font-bold text-[#ad5127]">
                      👥 Team Details & Member Invitations
                    </h4>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                          Team Name *
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="e.g. Bandra Youth Pioneers"
                          className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                          Max Team Size
                        </label>
                        <input
                          type="number"
                          min={2}
                          max={20}
                          value={teamSize}
                          onChange={(e) => setTeamSize(Number(e.target.value))}
                          className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                          Team Mission / Description *
                        </label>
                        <input
                          type="text"
                          value={teamDescription}
                          onChange={(e) => setTeamDescription(e.target.value)}
                          placeholder="e.g. Student squad conducting education drives and community surveys."
                          className="w-full rounded-xl border border-[#e4d8cc] bg-white px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                        />
                      </div>
                    </div>

                    {/* Member Emails to invite */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                        Invite Team Members via Email
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={invitedEmailInput}
                          onChange={(e) => setInvitedEmailInput(e.target.value)}
                          placeholder="peer@example.com"
                          className="flex-1 rounded-xl border border-[#e4d8cc] bg-white px-3.5 py-2 text-xs outline-none focus:border-[#ad5127]"
                        />
                        <button
                          type="button"
                          onClick={handleAddInvitedEmail}
                          className="rounded-xl bg-[#ad5127] px-4 py-2 text-xs font-bold text-white hover:bg-[#93421e]"
                        >
                          Add Invite
                        </button>
                      </div>

                      {invitedEmails.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {invitedEmails.map((inv, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 rounded-full bg-white border border-[#e0d2c4] px-3 py-1 text-xs text-[#211b17]"
                            >
                              <span>{inv}</span>
                              <button
                                type="button"
                                onClick={() => removeInvitedEmail(idx)}
                                className="text-[#a63d23] font-bold"
                              >
                                ✕
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                    Short Introduction / Volunteer Motivation
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us why you want to intern with CauseKind and what community causes you care about..."
                    className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] p-3 text-xs outline-none focus:border-[#ad5127]"
                  />
                </div>

                {/* Skills Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-2">
                    Key Strengths & Skills
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button
                          type="button"
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            selected
                              ? "bg-[#ad5127] text-white shadow-sm"
                              : "bg-[#faf5f0] border border-[#e4d8cc] text-[#6b5d51] hover:bg-[#f3ebe2]"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Causes Multi-select */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-2">
                    Preferred Causes & Campaigns
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableCauses.map((cause) => {
                      const selected = selectedCauses.includes(cause);
                      return (
                        <button
                          type="button"
                          key={cause}
                          onClick={() => toggleCause(cause)}
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                            selected
                              ? "bg-[#ad5127] text-white shadow-sm"
                              : "bg-[#faf5f0] border border-[#e4d8cc] text-[#6b5d51] hover:bg-[#f3ebe2]"
                          }`}
                        >
                          {selected ? "✓ " : "+ "}
                          {cause}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Weekly Availability
                    </label>
                    <input
                      type="text"
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                      placeholder="e.g. 10 hours / week (Weekends)"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1.5">
                      Volunteering City / Area *
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Mumbai, Bandra West"
                      className="w-full rounded-xl border border-[#e8ddd3] bg-[#fffdfa] px-4 py-2.5 text-xs outline-none focus:border-[#ad5127]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="rounded-full border border-[#d8c8b9] px-6 py-2.5 text-xs font-semibold text-[#796c62]"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="rounded-full bg-[#ad5127] px-8 py-3 text-xs font-bold text-white shadow-md hover:bg-[#93421e]"
                  >
                    Review Application Summary →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: Review and Submit Summary */}
            {step === 4 && (
              <form onSubmit={handleFinalSubmit} className="mt-6 space-y-6">
                <div className="flex items-center justify-between border-b border-[#eee5dc] pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#211b17]">
                    Step 4: Review and Confirm Registration
                  </h3>
                  <span className="text-xs font-bold text-[#ad5127]">
                    Role: {mode === "TEAM_LEADER" ? "Team Leader" : "Individual Volunteer"}
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Account Summary */}
                  <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdfa] p-5 text-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-[#f0e7df] pb-2">
                      <h4 className="font-bold text-[#211b17] uppercase tracking-wider">
                        Personal & Account Details
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="text-xs font-bold text-[#ad5127] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 text-[#695d52]">
                      <div>
                        <strong>Full Name:</strong> {fullName}
                      </div>
                      <div>
                        <strong>Email Address:</strong> {email}
                      </div>
                      <div>
                        <strong>Mobile:</strong> {phone}
                      </div>
                      <div>
                        <strong>Area / City:</strong> {city}
                      </div>
                    </div>
                  </div>

                  {/* Education Summary */}
                  <div className="rounded-2xl border border-[#eee2d7] bg-[#fffdfa] p-5 text-xs">
                    <div className="flex items-center justify-between mb-3 border-b border-[#f0e7df] pb-2">
                      <h4 className="font-bold text-[#211b17] uppercase tracking-wider">
                        College & Academic Information
                      </h4>
                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="text-xs font-bold text-[#ad5127] hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2 text-[#695d52]">
                      <div className="sm:col-span-2">
                        <strong>Institution:</strong>{" "}
                        {institution.includes("Other") ? manualInstitution : institution}
                      </div>
                      <div>
                        <strong>Degree & Year:</strong> {course} ({year})
                      </div>
                      <div>
                        <strong>Department:</strong> {department}
                      </div>
                      <div>
                        <strong>Graduation Year:</strong> {graduationYear}
                      </div>
                      <div>
                        <strong>Student ID:</strong> {studentId || "Not specified"}
                      </div>
                    </div>
                  </div>

                  {/* Team Summary if Leader */}
                  {mode === "TEAM_LEADER" && (
                    <div className="rounded-2xl border border-[#eed8c5] bg-[#fffaf5] p-5 text-xs">
                      <div className="flex items-center justify-between mb-3 border-b border-[#f0e7df] pb-2">
                        <h4 className="font-bold text-[#ad5127] uppercase tracking-wider">
                          Team Information
                        </h4>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="text-xs font-bold text-[#ad5127] hover:underline"
                        >
                          Edit
                        </button>
                      </div>
                      <div className="space-y-1.5 text-[#695d52]">
                        <div>
                          <strong>Team Name:</strong> {teamName}
                        </div>
                        <div>
                          <strong>Max Capacity:</strong> {teamSize} members
                        </div>
                        <div>
                          <strong>Description:</strong> {teamDescription}
                        </div>
                        <div>
                          <strong>Initial Invites:</strong>{" "}
                          {invitedEmails.length > 0 ? invitedEmails.join(", ") : "None added"}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Verification Notice */}
                  <div className="rounded-2xl border border-[#ebd7c6] bg-[#faf3ed] p-4 text-xs text-[#7d6c60]">
                    <p className="font-bold text-[#ad5127]">
                      Next Step: Verification & Document Upload
                    </p>
                    <p className="mt-1 leading-5">
                      Upon submission, your account will be activated with status{" "}
                      <strong className="text-[#211b17]">PENDING_VERIFICATION</strong>. You can sign in immediately, explore tasks, and upload your college ID to earn full verification.
                    </p>
                  </div>
                </div>

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="rounded-full border border-[#d8c8b9] px-6 py-2.5 text-xs font-semibold text-[#796c62]"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#ad5127] px-10 py-3.5 text-xs font-bold text-white shadow-lg hover:bg-[#93421e] transition"
                  >
                    Submit Application & Create Account →
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
