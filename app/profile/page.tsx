"use client";

import React, { useState } from "react";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { usePortal } from "@/lib/portal-context";

export default function ProfilePage() {
  const { profile, updateProfile, profileCompletion, completedTasks, totalTasks } =
    usePortal();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: profile.name,
    email: profile.email,
    phone: profile.phone,
    institution: profile.institution,
    course: profile.course,
    year: profile.year,
    location: profile.location,
    bio: profile.bio,
    skills: profile.skills.join(", "),
    interests: profile.interests.join(", "),
  });
  const [formError, setFormError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Full name cannot be empty.");
      return;
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!formData.institution.trim()) {
      setFormError("Institution name cannot be empty.");
      return;
    }

    const parsedSkills = formData.skills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedInterests = formData.interests
      .split(",")
      .map((i) => i.trim())
      .filter(Boolean);

    updateProfile({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      institution: formData.institution.trim(),
      course: formData.course.trim(),
      year: formData.year.trim(),
      location: formData.location.trim(),
      bio: formData.bio.trim(),
      skills: parsedSkills,
      interests: parsedInterests,
    });

    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: profile.name,
      email: profile.email,
      phone: profile.phone,
      institution: profile.institution,
      course: profile.course,
      year: profile.year,
      location: profile.location,
      bio: profile.bio,
      skills: profile.skills.join(", "),
      interests: profile.interests.join(", "),
    });
    setFormError("");
    setIsEditing(false);
  };

  return (
    <PortalLayout>
      {/* Page Title */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee5dc] pb-6 sm:flex-row sm:items-center">
        <div>
          <span className="text-xs font-bold tracking-widest text-[#ad5127] uppercase">
            Intern Profile
          </span>
          <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#211b17]">
            Personal Details & Credentials
          </h1>
          <p className="mt-1 text-sm text-[#796c62]">
            Keep your academic and contact details updated for certificate issuance.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 rounded-full bg-[#ad5127] px-5 py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#93421e]"
            >
              <span>✏️</span> Edit Profile
            </button>
          ) : (
            <button
              onClick={handleCancel}
              className="rounded-full border border-[#d6c7b9] bg-white px-4 py-2 text-xs font-semibold text-[#796c62] hover:bg-[#faf7f3]"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Left Column: Avatar & Summary Card */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-[#ad5127] font-serif text-3xl font-bold text-white shadow-md">
              {profile.initials}
            </div>

            <h2 className="mt-4 font-serif text-xl font-bold text-[#211b17]">
              {profile.name}
            </h2>
            <p className="text-xs font-semibold text-[#ad5127]">{profile.role}</p>
            <p className="mt-1 text-xs text-[#796c62]">{profile.institution}</p>

            {/* Profile Completion Indicator */}
            <div className="mt-6 rounded-xl border border-[#eee3d7] bg-[#fffaf5] p-4 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-[#211b17]">
                <span>Profile Completion</span>
                <span className="text-[#ad5127]">{profileCompletion}%</span>
              </div>
              <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-[#eee2d7]">
                <div
                  className="h-full rounded-full bg-[#ad5127] transition-all duration-500"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
              <p className="mt-2 text-[11px] leading-4 text-[#89796d]">
                A 100% completed profile ensures your official certificate of completion matches your university record.
              </p>
            </div>

            {/* Key Cohort Stats */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-[#f0e7df] pt-6 text-left">
              <div className="rounded-xl bg-[#faf5f0] p-3">
                <span className="text-[10px] uppercase font-bold text-[#89796d]">
                  Tasks Finished
                </span>
                <p className="mt-1 text-lg font-bold text-[#211b17]">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
              <div className="rounded-xl bg-[#faf5f0] p-3">
                <span className="text-[10px] uppercase font-bold text-[#89796d]">
                  Joined
                </span>
                <p className="mt-1 text-xs font-bold text-[#211b17]">
                  {profile.joinedDate}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Note */}
          <div className="rounded-2xl border border-[#ede3d8] bg-[#fffcf9] p-5 text-xs leading-relaxed text-[#796c62]">
            <p className="font-bold text-[#211b17]">🔒 Privacy & Data Policy</p>
            <p className="mt-1">
              CauseKind never shares intern academic scores or contact numbers with third parties. This profile is maintained locally for this demo session.
            </p>
          </div>
        </div>

        {/* Right Column: Profile Information or Edit Form */}
        <div className="rounded-2xl border border-[#eee2d7] bg-white p-6 shadow-sm lg:col-span-2 sm:p-8">
          {!isEditing ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#211b17]">
                  About Me
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#5e5146]">
                  {profile.bio || "No biography provided yet."}
                </p>
              </div>

              <div className="border-t border-[#f0e7df] pt-6">
                <h3 className="font-serif text-lg font-bold text-[#211b17] mb-4">
                  Academic & Contact Information
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      Full Name
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.name}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      Email Address
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.email}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      College / Institution
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.institution}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      Course & Year
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.course} ({profile.year})
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      Contact Phone
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.phone}
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#faf7f3] p-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#8b7a6d]">
                      Location / Region
                    </span>
                    <p className="mt-1 text-sm font-semibold text-[#211b17]">
                      {profile.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="border-t border-[#f0e7df] pt-6">
                <h3 className="font-serif text-lg font-bold text-[#211b17] mb-3">
                  Core Skills & Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#f8e7d8] px-3.5 py-1 text-xs font-bold text-[#ad5127]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="border-t border-[#f0e7df] pt-6">
                <h3 className="font-serif text-lg font-bold text-[#211b17] mb-3">
                  Social Impact Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="rounded-full bg-[#faf0e8] border border-[#efd9c7] px-3.5 py-1 text-xs font-semibold text-[#7c6a5d]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Profile Form */
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className="font-serif text-xl font-bold text-[#211b17]">
                Edit Profile Information
              </h3>
              <p className="text-xs text-[#796c62]">
                Update your intern record. Changes reflect across the portal during this session.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    College / Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Course / Degree
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Academic Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Location / City
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                  Short Biography / Motivation
                </label>
                <textarea
                  rows={3}
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] p-3 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#483c32] mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-[#e4d8cc] bg-[#fffdfa] px-3.5 py-2.5 text-xs outline-none focus:border-[#ad5127] focus:ring-4 focus:ring-[#ad5127]/10"
                  />
                </div>
              </div>

              {formError && (
                <p className="rounded-xl border border-[#f2c7b8] bg-[#fff3ef] p-3 text-xs text-[#a6381e]">
                  {formError}
                </p>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#f0e7df]">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-[#796c62] hover:bg-[#faf7f3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#ad5127] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#93421e]"
                >
                  Save Profile Changes →
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
