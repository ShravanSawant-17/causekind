"use client";

import React, { createContext, useContext, useState, useMemo, useEffect } from "react";
import {
  InternProfile,
  TaskItem,
  TaskStatus,
  Achievement,
  UserAccount,
  UserRole,
  Team,
  DocumentRecord,
  DocumentTemplate,
  Campaign,
  AuditEvent,
  NotificationItem,
} from "./types";
import {
  initialSeedAccounts,
  initialTeams,
  initialDocumentTemplates,
  initialCampaigns,
  initialAuditEvents,
  initialNotifications,
  initialTasks,
  initialAchievements,
} from "./portal-data";

interface Toast {
  id: number;
  type: "success" | "info" | "warning";
  text: string;
}

interface RegisterIndividualData {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  institution: string;
  course: string;
  department?: string;
  year: string;
  graduationYear?: string;
  studentId?: string;
  bio: string;
  skills: string[];
  interests: string[];
  preferredCauses?: string[];
  availability?: string;
  city?: string;
  avatarUrl?: string;
}

interface RegisterTeamLeaderData extends RegisterIndividualData {
  teamName: string;
  teamDescription: string;
  teamSize: number;
  invitedEmails?: string[];
}

interface PortalContextType {
  // Auth & Current User
  currentUser: UserAccount | null;
  profile: InternProfile;
  accounts: UserAccount[];
  login: (email: string, password: string) => { success: boolean; role?: UserRole; error?: string };
  logout: () => void;
  switchDemoRole: (role: UserRole) => void;
  registerIndividual: (data: RegisterIndividualData) => UserAccount;
  registerTeamLeader: (data: RegisterTeamLeaderData) => { account: UserAccount; team: Team };
  joinTeamWithCode: (code: string) => { success: boolean; team?: Team; error?: string };
  updateProfile: (updated: Partial<InternProfile>) => void;

  // Teams
  teams: Team[];
  myTeam: Team | null;
  createTeam: (name: string, description: string, maxSize: number) => Team;
  inviteToTeam: (email: string) => boolean;
  revokeInvitation: (invId: string) => void;
  leaveTeam: () => void;

  // Documents & Verification
  documents: DocumentRecord[];
  templates: DocumentTemplate[];
  uploadDocument: (
    type: DocumentRecord["documentType"],
    fileName: string,
    fileSize: string
  ) => void;
  removeDocument: (docId: string) => void;
  approveVerification: (userId: string, notes?: string) => void;
  rejectVerification: (userId: string, reason: string) => void;
  requestCorrections: (userId: string, notes: string) => void;
  toggleAccountStatus: (userId: string) => void;

  // Campaigns
  campaigns: Campaign[];
  createCampaign: (data: Omit<Campaign, "id" | "enrolledCount" | "assignedTeams" | "assignedVolunteers">) => void;
  toggleCampaignPublish: (campId: string) => void;
  joinCampaign: (campId: string) => void;

  // Tasks
  tasks: TaskItem[];
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  submitTask: (
    id: string,
    submission: { description: string; fileName?: string; fileSize?: string }
  ) => void;
  createTask: (taskData: Omit<TaskItem, "id">) => void;
  reviewSubmission: (taskId: string, approved: boolean, feedback: string) => void;

  // Achievements & Onboarding
  achievements: Achievement[];
  readOnboardingIds: string[];
  toggleOnboardingRead: (sectionId: string) => void;

  // Notifications & Audit
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  auditEvents: AuditEvent[];

  // Dynamic Calculated Metrics
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  notStartedTasks: number;
  submittedTasks: number;
  pendingTasks: number;
  completionPercentage: number;
  profileCompletion: number;

  // Toasts
  toasts: Toast[];
  showToast: (text: string, type?: "success" | "info" | "warning") => void;
  dismissToast: (id: number) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  ACCOUNTS: "causekind_portal_accounts_v2",
  CURRENT_USER_ID: "causekind_portal_current_user_id_v2",
  TEAMS: "causekind_portal_teams_v2",
  TASKS: "causekind_portal_tasks_v2",
  CAMPAIGNS: "causekind_portal_campaigns_v2",
  AUDIT: "causekind_portal_audit_v2",
};

export function PortalProvider({ children }: { children: React.ReactNode }) {
  // Accounts
  const [accounts, setAccounts] = useState<UserAccount[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load accounts from storage", e);
      }
    }
    return initialSeedAccounts;
  });

  // Current User ID
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
        if (stored) return stored;
      } catch (e) {
        console.error("Failed to load current user ID", e);
      }
    }
    return "USER-001"; // Default Shravan Sawant
  });

  // Teams
  const [teams, setTeams] = useState<Team[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TEAMS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load teams from storage", e);
      }
    }
    return initialTeams;
  });

  // Tasks
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.TASKS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load tasks", e);
      }
    }
    return initialTasks;
  });

  // Campaigns
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load campaigns", e);
      }
    }
    return initialCampaigns;
  });

  // Audit Events
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEYS.AUDIT);
        if (stored) return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to load audit events", e);
      }
    }
    return initialAuditEvents;
  });

  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [readOnboardingIds, setReadOnboardingIds] = useState<string[]>([
    "welcome",
    "internship-overview",
  ]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Persist to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
      } catch {}
    }
  }, [accounts]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
      } catch {}
    }
  }, [currentUserId]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.TEAMS, JSON.stringify(teams));
      } catch {}
    }
  }, [teams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
      } catch {}
    }
  }, [tasks]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
      } catch {}
    }
  }, [campaigns]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditEvents));
      } catch {}
    }
  }, [auditEvents]);

  // Derived current user
  const currentUser = useMemo(() => {
    return accounts.find((a) => a.id === currentUserId) || accounts[0] || null;
  }, [accounts, currentUserId]);

  const profile = useMemo(() => {
    return currentUser?.profile || accounts[0]?.profile || initialSeedAccounts[0].profile;
  }, [currentUser, accounts]);

  const myTeam = useMemo(() => {
    if (!currentUser?.teamId) return null;
    return teams.find((t) => t.id === currentUser.teamId) || null;
  }, [teams, currentUser]);

  const documents = useMemo(() => {
    return currentUser?.documents || [];
  }, [currentUser]);

  // Toast Helpers
  const showToast = (text: string, type: "success" | "info" | "warning" = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAuditEvent = (
    action: string,
    targetType: AuditEvent["targetType"],
    targetId: string,
    details: string
  ) => {
    const newEvent: AuditEvent = {
      id: `AUD-${Date.now()}`,
      actorEmail: currentUser?.email || "system@causekind.com",
      actorName: currentUser?.profile.name || "System Admin",
      action,
      targetType,
      targetId,
      details,
      timestamp: new Date().toLocaleString(),
    };
    setAuditEvents((prev) => [newEvent, ...prev]);
  };

  // Auth Operations
  const login = (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const account = accounts.find((a) => a.email.toLowerCase() === normalizedEmail);

    if (!account) {
      return { success: false, error: "No account found with this email. Please check your credentials or create an account." };
    }

    if (account.passwordHash !== pass) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    if (account.status === "SUSPENDED") {
      return { success: false, error: "This account has been suspended by administration. Please contact support@causekind.com." };
    }

    setCurrentUserId(account.id);
    showToast(`Welcome back, ${account.profile.name.split(" ")[0]}!`, "success");
    return { success: true, role: account.role };
  };

  const logout = () => {
    // Keep accounts intact, but switch to unauthenticated state or default
    setCurrentUserId("");
    showToast("Signed out successfully.", "info");
  };

  const switchDemoRole = (role: UserRole) => {
    const found = accounts.find((a) => a.role === role);
    if (found) {
      setCurrentUserId(found.id);
      showToast(`Switched view to demo account (${role}: ${found.profile.name})`, "info");
    }
  };

  const registerIndividual = (data: RegisterIndividualData): UserAccount => {
    const parts = data.fullName.trim().split(" ");
    const initials =
      parts.length >= 2
        ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
        : (parts[0]?.[0] || "V").toUpperCase();

    const newId = `USER-${Date.now().toString().slice(-4)}`;
    const newProfile: InternProfile = {
      id: `INT-2026-${Date.now().toString().slice(-3)}`,
      name: data.fullName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      institution: data.institution.trim(),
      course: data.course.trim(),
      department: data.department || "General",
      year: data.year,
      graduationYear: data.graduationYear || "2027",
      studentId: data.studentId || `STU-${Date.now().toString().slice(-4)}`,
      bio: data.bio.trim() || "Eager to make an impact with CauseKind.",
      skills: data.skills.length > 0 ? data.skills : ["Community Outreach", "Teamwork"],
      interests: data.interests.length > 0 ? data.interests : ["Education Equity", "Youth Empowerment"],
      preferredCauses: data.preferredCauses || ["Field Outreach"],
      availability: data.availability || "10 hours / week",
      city: data.city || "Mumbai",
      joinedDate: "October 2026",
      role: "Community Engagement Intern",
      initials,
      location: data.city || "Mumbai, India",
      avatarUrl: data.avatarUrl || "",
    };

    const newAccount: UserAccount = {
      id: newId,
      email: data.email.trim().toLowerCase(),
      passwordHash: data.password,
      role: "VOLUNTEER",
      status: "ACTIVE",
      verificationStatus: "PENDING_VERIFICATION",
      createdAt: new Date().toISOString(),
      profile: newProfile,
      documents: [],
    };

    setAccounts((prev) => [newAccount, ...prev.filter((a) => a.email !== newAccount.email)]);
    setCurrentUserId(newId);

    logAuditEvent("USER_REGISTERED", "ACCOUNT", newId, `Individual volunteer account created for ${data.fullName}`);
    showToast(`Account created for ${data.fullName}! Welcome to CauseKind.`, "success");

    return newAccount;
  };

  const registerTeamLeader = (data: RegisterTeamLeaderData) => {
    const leaderAccount = registerIndividual(data);

    // Promote to Team Leader
    const teamId = `CK-TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const inviteCode = `CK-${data.teamName.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newTeam: Team = {
      id: teamId,
      name: data.teamName.trim(),
      description: data.teamDescription.trim(),
      college: data.institution.trim(),
      leaderId: leaderAccount.id,
      leaderName: leaderAccount.profile.name,
      leaderEmail: leaderAccount.email,
      maxSize: data.teamSize || 6,
      inviteCode,
      verificationStatus: "PENDING",
      members: [
        {
          userId: leaderAccount.id,
          name: leaderAccount.profile.name,
          email: leaderAccount.email,
          role: "LEADER",
          joinedAt: new Date().toISOString().split("T")[0],
          verificationStatus: "PENDING_VERIFICATION",
          college: data.institution.trim(),
        },
      ],
      invitations: (data.invitedEmails || []).map((email, idx) => ({
        id: `INV-${Date.now()}-${idx}`,
        email: email.trim().toLowerCase(),
        token: `tok_${Math.random().toString(36).substring(2, 9)}`,
        status: "PENDING",
        sentAt: new Date().toLocaleString(),
      })),
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Update account with role TEAM_LEADER and teamId
    const updatedAccount: UserAccount = {
      ...leaderAccount,
      role: "TEAM_LEADER",
      teamId,
      teamRole: "LEADER",
      profile: {
        ...leaderAccount.profile,
        role: `Team Leader — ${data.teamName.trim()}`,
      },
    };

    setAccounts((prev) => prev.map((a) => (a.id === leaderAccount.id ? updatedAccount : a)));
    setTeams((prev) => [newTeam, ...prev]);

    logAuditEvent("TEAM_CREATED", "TEAM", teamId, `Team created: ${data.teamName} by ${leaderAccount.profile.name}`);
    return { account: updatedAccount, team: newTeam };
  };

  const joinTeamWithCode = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const targetTeam = teams.find(
      (t) => t.inviteCode.toUpperCase() === cleanCode || t.id.toUpperCase() === cleanCode
    );

    if (!targetTeam) {
      return { success: false, error: "Invalid invitation code or Team ID. Please verify with your leader." };
    }

    if (targetTeam.members.length >= targetTeam.maxSize) {
      return { success: false, error: `Team "${targetTeam.name}" has reached its maximum size limit (${targetTeam.maxSize} members).` };
    }

    if (!currentUser) {
      return { success: false, error: "Please log in or register before joining a team." };
    }

    if (targetTeam.members.some((m) => m.userId === currentUser.id)) {
      return { success: false, error: "You are already an active member of this team." };
    }

    const newMember = {
      userId: currentUser.id,
      name: currentUser.profile.name,
      email: currentUser.email,
      role: "MEMBER" as const,
      joinedAt: new Date().toISOString().split("T")[0],
      verificationStatus: currentUser.verificationStatus,
      college: currentUser.profile.institution,
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === targetTeam.id ? { ...t, members: [...t.members, newMember] } : t
      )
    );

    setAccounts((prev) =>
      prev.map((a) =>
        a.id === currentUser.id
          ? { ...a, teamId: targetTeam.id, teamRole: "MEMBER" }
          : a
      )
    );

    logAuditEvent("TEAM_JOINED", "TEAM", targetTeam.id, `${currentUser.profile.name} joined team ${targetTeam.name}`);
    showToast(`You have successfully joined "${targetTeam.name}"!`, "success");
    return { success: true, team: targetTeam };
  };

  const createTeam = (name: string, description: string, maxSize: number): Team => {
    if (!currentUser) throw new Error("Must be logged in to create a team");

    const teamId = `CK-TEAM-${Math.floor(1000 + Math.random() * 9000)}`;
    const inviteCode = `CK-${name.replace(/[^a-zA-Z]/g, "").slice(0, 5).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;

    const newTeam: Team = {
      id: teamId,
      name: name.trim(),
      description: description.trim(),
      college: currentUser.profile.institution,
      leaderId: currentUser.id,
      leaderName: currentUser.profile.name,
      leaderEmail: currentUser.email,
      maxSize: maxSize || 6,
      inviteCode,
      verificationStatus: "PENDING",
      members: [
        {
          userId: currentUser.id,
          name: currentUser.profile.name,
          email: currentUser.email,
          role: "LEADER",
          joinedAt: new Date().toISOString().split("T")[0],
          verificationStatus: currentUser.verificationStatus,
          college: currentUser.profile.institution,
        },
      ],
      invitations: [],
      createdAt: new Date().toISOString().split("T")[0],
    };

    setTeams((prev) => [newTeam, ...prev]);
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === currentUser.id
          ? { ...a, role: "TEAM_LEADER", teamId, teamRole: "LEADER" }
          : a
      )
    );

    logAuditEvent("TEAM_CREATED", "TEAM", teamId, `New team created by ${currentUser.profile.name}`);
    showToast(`Team "${name}" created! Share code: ${inviteCode}`, "success");
    return newTeam;
  };

  const inviteToTeam = (email: string): boolean => {
    if (!myTeam) return false;
    const cleanEmail = email.trim().toLowerCase();

    if (myTeam.members.some((m) => m.email.toLowerCase() === cleanEmail)) {
      showToast(`${email} is already a member of this team.`, "warning");
      return false;
    }

    if (myTeam.invitations.some((i) => i.email.toLowerCase() === cleanEmail && i.status === "PENDING")) {
      showToast(`An active invitation has already been dispatched to ${email}.`, "info");
      return false;
    }

    const newInv = {
      id: `INV-${Date.now()}`,
      email: cleanEmail,
      token: `tok_${Math.random().toString(36).substring(2, 9)}`,
      status: "PENDING" as const,
      sentAt: new Date().toLocaleString(),
    };

    setTeams((prev) =>
      prev.map((t) =>
        t.id === myTeam.id ? { ...t, invitations: [...t.invitations, newInv] } : t
      )
    );

    showToast(`Invitation dispatched to ${email}`, "success");
    return true;
  };

  const revokeInvitation = (invId: string) => {
    if (!myTeam) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === myTeam.id
          ? {
              ...t,
              invitations: t.invitations.map((i) =>
                i.id === invId ? { ...i, status: "REVOKED" } : i
              ),
            }
          : t
      )
    );
    showToast("Invitation revoked.", "info");
  };

  const leaveTeam = () => {
    if (!myTeam || !currentUser) return;
    setTeams((prev) =>
      prev.map((t) =>
        t.id === myTeam.id
          ? { ...t, members: t.members.filter((m) => m.userId !== currentUser.id) }
          : t
      )
    );
    setAccounts((prev) =>
      prev.map((a) =>
        a.id === currentUser.id
          ? { ...a, teamId: undefined, teamRole: undefined, role: a.role === "TEAM_LEADER" ? "VOLUNTEER" : a.role }
          : a
      )
    );
    showToast(`You have left "${myTeam.name}".`, "info");
  };

  // Documents
  const uploadDocument = (
    type: DocumentRecord["documentType"],
    fileName: string,
    fileSize: string
  ) => {
    if (!currentUser) return;

    const titles: Record<string, string> = {
      COLLEGE_ID: "College Identification Card",
      STUDENT_VERIFICATION: "Student Bonafide Verification",
      INTERNSHIP_DECLARATION: "Signed Internship Declaration",
      CONSENT_FORM: "Field Consent Form",
      CAMPAIGN_EVIDENCE: "Field Outreach Evidence",
    };

    const newDoc: DocumentRecord = {
      id: `DOC-${Date.now()}`,
      userId: currentUser.id,
      documentType: type,
      title: titles[type] || "Verification Document",
      fileName,
      fileSize,
      uploadedAt: new Date().toLocaleString(),
      status: "SUBMITTED",
    };

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === currentUser.id) {
          const filtered = (a.documents || []).filter((d) => d.documentType !== type);
          return {
            ...a,
            verificationStatus: a.verificationStatus === "VERIFIED" ? "VERIFIED" : "PENDING_VERIFICATION",
            documents: [...filtered, newDoc],
          };
        }
        return a;
      })
    );

    showToast(`Uploaded "${fileName}". Submitted for administrative review.`, "success");
    logAuditEvent("DOCUMENT_UPLOADED", "ACCOUNT", currentUser.id, `Uploaded ${newDoc.title}`);
  };

  const removeDocument = (docId: string) => {
    if (!currentUser) return;
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === currentUser.id) {
          return {
            ...a,
            documents: (a.documents || []).filter((d) => d.id !== docId),
          };
        }
        return a;
      })
    );
    showToast("Document removed.", "info");
  };

  // Admin Verification Management
  const approveVerification = (userId: string, notes?: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === userId) {
          return {
            ...a,
            verificationStatus: "VERIFIED",
            documents: (a.documents || []).map((d) => ({
              ...d,
              status: "APPROVED",
              reviewerNotes: notes || "Verified by CauseKind Admin.",
            })),
          };
        }
        return a;
      })
    );

    logAuditEvent("VERIFICATION_APPROVED", "VERIFICATION", userId, notes || "Admin verified volunteer credentials");
    showToast("Volunteer verification approved!", "success");
  };

  const rejectVerification = (userId: string, reason: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === userId) {
          return {
            ...a,
            verificationStatus: "REJECTED",
            documents: (a.documents || []).map((d) => ({
              ...d,
              status: "REJECTED",
              reviewerNotes: reason,
            })),
          };
        }
        return a;
      })
    );

    logAuditEvent("VERIFICATION_REJECTED", "VERIFICATION", userId, `Reason: ${reason}`);
    showToast("Verification rejected. Notification recorded for intern.", "warning");
  };

  const requestCorrections = (userId: string, notes: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === userId) {
          return {
            ...a,
            verificationStatus: "CORRECTIONS_REQUESTED",
            documents: (a.documents || []).map((d) => ({
              ...d,
              status: "REJECTED",
              reviewerNotes: notes,
            })),
          };
        }
        return a;
      })
    );

    logAuditEvent("VERIFICATION_CORRECTIONS", "VERIFICATION", userId, `Requested corrections: ${notes}`);
    showToast("Correction request sent to volunteer.", "info");
  };

  const toggleAccountStatus = (userId: string) => {
    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === userId) {
          const next = a.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
          logAuditEvent("ACCOUNT_STATUS_TOGGLED", "ACCOUNT", userId, `Status changed to ${next}`);
          return { ...a, status: next };
        }
        return a;
      })
    );
    showToast("Account status updated.", "info");
  };

  // Campaigns
  const createCampaign = (data: Omit<Campaign, "id" | "enrolledCount" | "assignedTeams" | "assignedVolunteers">) => {
    const newCamp: Campaign = {
      ...data,
      id: `CAMP-${Math.floor(10 + Math.random() * 90)}`,
      enrolledCount: 0,
      assignedTeams: [],
      assignedVolunteers: [],
    };
    setCampaigns((prev) => [newCamp, ...prev]);
    logAuditEvent("CAMPAIGN_CREATED", "CAMPAIGN", newCamp.id, `Created campaign: ${data.title}`);
    showToast(`Campaign "${data.title}" created.`, "success");
  };

  const toggleCampaignPublish = (campId: string) => {
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campId) {
          const next = c.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
          logAuditEvent("CAMPAIGN_STATUS_TOGGLED", "CAMPAIGN", campId, `Status set to ${next}`);
          return { ...c, status: next };
        }
        return c;
      })
    );
    showToast("Campaign visibility updated.", "info");
  };

  const joinCampaign = (campId: string) => {
    if (!currentUser) return;
    setCampaigns((prev) =>
      prev.map((c) => {
        if (c.id === campId) {
          if (c.assignedVolunteers.includes(currentUser.id)) {
            showToast("You are already enrolled in this campaign.", "info");
            return c;
          }
          if (c.enrolledCount >= c.capacity) {
            showToast("This campaign has reached full capacity.", "warning");
            return c;
          }
          showToast(`Enrolled in "${c.title}"!`, "success");
          return {
            ...c,
            enrolledCount: c.enrolledCount + 1,
            assignedVolunteers: [...c.assignedVolunteers, currentUser.id],
          };
        }
        return c;
      })
    );
  };

  // Tasks Management
  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    showToast(`Task status changed to "${status}".`, "info");
  };

  const submitTask = (
    id: string,
    submissionData: { description: string; fileName?: string; fileSize?: string }
  ) => {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(
      now.getMonth() + 1
    ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
      now.getHours()
    ).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status: "Submitted",
            submission: {
              description: submissionData.description,
              fileName: submissionData.fileName || undefined,
              fileSize: submissionData.fileSize || undefined,
              submittedAt: formattedDate,
              reviewerFeedback: "Pending review by cohort coordinator.",
            },
          };
        }
        return t;
      })
    );

    // Update achievement progress dynamically
    setAchievements((prev) =>
      prev.map((ach) => {
        if (ach.id === "ACH-4") {
          const newProg = Math.min(ach.maxProgress, ach.currentProgress + 1);
          return {
            ...ach,
            currentProgress: newProg,
            earned: newProg >= ach.maxProgress,
            earnedDate: newProg >= ach.maxProgress ? "Just now" : ach.earnedDate,
          };
        }
        return ach;
      })
    );

    logAuditEvent("TASK_SUBMITTED", "TASK", id, `Submission recorded by ${currentUser?.profile.name}`);
    showToast("Task work submitted! Marked as 'Submitted' for coordinator review.", "success");
  };

  const createTask = (taskData: Omit<TaskItem, "id">) => {
    const newId = `TASK-${Math.floor(110 + Math.random() * 890)}`;
    const newTask: TaskItem = {
      ...taskData,
      id: newId,
    };
    setTasks((prev) => [newTask, ...prev]);
    logAuditEvent("TASK_CREATED", "TASK", newId, `Admin created task: ${taskData.title}`);
    showToast(`Task "${taskData.title}" created and assigned.`, "success");
  };

  const reviewSubmission = (taskId: string, approved: boolean, feedback: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          return {
            ...t,
            status: approved ? "Completed" : "In Progress",
            submission: t.submission
              ? {
                  ...t.submission,
                  reviewerFeedback: feedback,
                }
              : undefined,
          };
        }
        return t;
      })
    );

    logAuditEvent("TASK_REVIEWED", "TASK", taskId, `Evaluated: ${approved ? "Approved" : "Revision requested"}`);
    showToast(`Submission ${approved ? "approved as Completed" : "flagged for revision"}.`, "info");
  };

  const updateProfile = (updated: Partial<InternProfile>) => {
    if (!currentUser) return;

    const nextProfile = { ...currentUser.profile, ...updated };
    if (updated.name) {
      const parts = updated.name.trim().split(" ");
      const initials =
        parts.length >= 2
          ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
          : (parts[0]?.[0] || "I").toUpperCase();
      nextProfile.initials = initials;
    }

    setAccounts((prev) =>
      prev.map((a) => (a.id === currentUser.id ? { ...a, profile: nextProfile } : a))
    );
    showToast("Profile updated successfully.", "success");
  };

  const toggleOnboardingRead = (sectionId: string) => {
    setReadOnboardingIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId]
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Dynamic Statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const notStartedTasks = tasks.filter((t) => t.status === "Not Started").length;
  const submittedTasks = tasks.filter((t) => t.status === "Submitted").length;
  const pendingTasks = tasks.filter((t) => t.status !== "Completed").length;

  const completionPercentage = useMemo(() => {
    if (totalTasks === 0) return 0;
    return Math.round((completedTasks / totalTasks) * 100);
  }, [completedTasks, totalTasks]);

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.phone) score += 10;
    if (profile.institution) score += 15;
    if (profile.course) score += 10;
    if (profile.year) score += 10;
    if (profile.bio) score += 15;
    if (profile.skills && profile.skills.length > 0) score += 10;
    if (profile.interests && profile.interests.length > 0) score += 10;
    return Math.min(100, score);
  }, [profile]);

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        profile,
        accounts,
        login,
        logout,
        switchDemoRole,
        registerIndividual,
        registerTeamLeader,
        joinTeamWithCode,
        updateProfile,

        teams,
        myTeam,
        createTeam,
        inviteToTeam,
        revokeInvitation,
        leaveTeam,

        documents,
        templates: initialDocumentTemplates,
        uploadDocument,
        removeDocument,
        approveVerification,
        rejectVerification,
        requestCorrections,
        toggleAccountStatus,

        campaigns,
        createCampaign,
        toggleCampaignPublish,
        joinCampaign,

        tasks,
        updateTaskStatus,
        submitTask,
        createTask,
        reviewSubmission,

        achievements,
        readOnboardingIds,
        toggleOnboardingRead,

        notifications,
        markNotificationRead,
        auditEvents,

        totalTasks,
        completedTasks,
        inProgressTasks,
        notStartedTasks,
        submittedTasks,
        pendingTasks,
        completionPercentage,
        profileCompletion,

        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}

      {/* Floating Demo Toast Notifications */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start justify-between gap-3 p-4 rounded-2xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-300 ${
              toast.type === "success"
                ? "bg-[#fffdfa] border-[#ead5c3] text-[#211b17]"
                : toast.type === "warning"
                ? "bg-[#fff8f0] border-[#f4c8a8] text-[#8e3914]"
                : "bg-white border-[#eee2d7] text-[#211b17]"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  toast.type === "success"
                    ? "bg-[#f8e7d8] text-[#b65329]"
                    : "bg-[#f0e7df] text-[#796c62]"
                }`}
              >
                {toast.type === "success" ? "✓" : "ℹ"}
              </span>
              <p className="text-sm font-medium leading-5">{toast.text}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-[#99887c] hover:text-[#211b17] text-xs font-bold ml-2 shrink-0"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error("usePortal must be used within a PortalProvider");
  }
  return context;
}
