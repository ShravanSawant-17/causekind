export type UserRole = "VOLUNTEER" | "TEAM_LEADER" | "ADMIN";

export type AccountStatus = "ACTIVE" | "PENDING_VERIFICATION" | "SUSPENDED";

export type VerificationStatus =
  | "NOT_SUBMITTED"
  | "PENDING_VERIFICATION"
  | "VERIFIED"
  | "CORRECTIONS_REQUESTED"
  | "REJECTED";

export type TaskStatus = "Not Started" | "In Progress" | "Submitted" | "Completed";

export type TaskPriority = "High" | "Medium" | "Low";

export type TaskCategory =
  | "Field Outreach"
  | "Research & Survey"
  | "Documentation"
  | "Community Engagement"
  | "Digital Advocacy";

export interface TaskSubmission {
  description: string;
  fileName?: string;
  fileSize?: string;
  submittedAt: string;
  reviewerFeedback?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  category: TaskCategory;
  description: string;
  assignedDate: string;
  dueDate: string; // YYYY-MM-DD
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours: number;
  guidelines: string[];
  assignedTo?: string; // userId or teamId\r\n  trackLabel?: TrackLabel;\r\n  submission?: TaskSubmission;\r\n}

export interface InternProfile {
  id: string;
  name: string;
  email: string;
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
  joinedDate: string;
  role: string;
  initials: string;
  location: string;
  avatarUrl?: string;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string; // In-memory/local demo hash
  role: UserRole;
  status: AccountStatus;
  verificationStatus: VerificationStatus;
  createdAt: string;
  teamId?: string;
  teamRole?: "LEADER" | "MEMBER";
  profile: InternProfile;
  documents?: DocumentRecord[];
}

export interface TeamMember {
  userId: string;
  name: string;
  email: string;
  role: "LEADER" | "MEMBER";
  joinedAt: string;
  verificationStatus: VerificationStatus;
  college: string;
}

export interface TeamInvitation {
  id: string;
  email: string;
  token: string;
  status: "PENDING" | "ACCEPTED" | "REVOKED" | "EXPIRED";
  sentAt: string;
}

export interface Team {
  id: string; // e.g. "CK-TEAM-8921"
  name: string;
  description: string;
  college: string;
  leaderId: string;
  leaderName: string;
  leaderEmail: string;
  maxSize: number;
  inviteCode: string;
  verificationStatus: "VERIFIED" | "PENDING";
  members: TeamMember[];
  invitations: TeamInvitation[];
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  userId: string;
  documentType:
    | "COLLEGE_ID"
    | "STUDENT_VERIFICATION"
    | "INTERNSHIP_DECLARATION"
    | "CONSENT_FORM"
    | "CAMPAIGN_EVIDENCE";
  title: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  status: "NOT_SUBMITTED" | "SUBMITTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  reviewerNotes?: string;
}

export interface DocumentTemplate {
  id: string;
  title: string;
  category: string;
  description: string;
  fileName: string;
  fileSize: string;
  requiredFor: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  startDate: string;
  endDate: string;
  location: string;
  capacity: number;
  enrolledCount: number;
  status: "DRAFT" | "PUBLISHED" | "COMPLETED";
  eligibility: string;
  assignedTeams: string[];
  assignedVolunteers: string[];
}

export interface AuditEvent {
  id: string;
  actorEmail: string;
  actorName: string;
  action: string;
  targetType: "ACCOUNT" | "VERIFICATION" | "CAMPAIGN" | "TASK" | "TEAM";
  targetId: string;
  details: string;
  timestamp: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: "Milestone" | "Impact" | "Consistency" | "Excellence";
  icon: string;
  earned: boolean;
  earnedDate?: string;
  currentProgress: number;
  maxProgress: number;
  progressUnit: string;
}

export interface OnboardingSection {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string[];
  tips?: string[];
  faqs?: { question: string; answer: string }[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "URGENT";
  read: boolean;
  createdAt: string;
  link?: string;
}

// ============================================================
// TRACK LABELS
// ============================================================
export type TrackLabel = "Track A" | "Track B" | "Both";

// Extended TaskStatus matching spec
export type ExtendedTaskStatus = "Draft" | "Submitted" | "Under Review" | "Revision Required" | "Approved" | "Rejected" | "In Progress" | "Not Started" | "Completed";

// ============================================================
// FIELD OUTREACH
// ============================================================
export type OutreachStage = "Contacted" | "Verified" | "Matched" | "Donation Completed";
export type OutreachType = "Donor" | "Donee";
export type ConsentStatus = "Given" | "Pending" | "Withdrawn";

export interface OutreachRegistration {
  id: string;
  registeredByUserId: string;
  registeredByName: string;
  type: OutreachType;
  // Personal info — only shown to authorized parties
  fullName: string;
  age?: number;
  guardianName?: string; // required if under 18
  city: string;
  causeArea: string; // e.g. "Education", "Health", "Food Security"
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

export interface OutreachStageEvent {
  id: string;
  fromStage?: OutreachStage;
  toStage: OutreachStage;
  changedByUserId: string;
  changedByName: string;
  timestamp: string;
  notes?: string;
}

export interface OutreachEvidence {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  description?: string;
}

// ============================================================
// CONTRIBUTIONS / EVALUATIONS
// ============================================================
export interface ContributionWeights {
  portalDeliverablesQuality: number;   // 30%
  verifiedFieldRegistrations: number;  // 25%
  fieldStageProgression: number;       // 15%
  timelinessAndInitiative: number;     // 15%
  documentationAndReporting: number;   // 10%
  collaborationAndCommunication: number; // 5%
}

export interface EvaluationScore {
  id: string;
  internUserId: string;
  evaluatedByUserId: string;
  evaluatedByName: string;
  period: string; // e.g. "Week 3", "Midterm", "Final"
  scores: {
    portalDeliverablesQuality: number;   // 0-100
    verifiedFieldRegistrations: number;  // 0-100
    fieldStageProgression: number;       // 0-100
    timelinessAndInitiative: number;     // 0-100
    documentationAndReporting: number;   // 0-100
    collaborationAndCommunication: number; // 0-100
  };
  overallScore: number; // weighted calculation
  feedback: string;
  status: "Draft" | "Official";
  createdAt: string;
}

// ============================================================
// CERTIFICATES
// ============================================================
export type CertificateStatus = "Ineligible" | "Eligible" | "Requested" | "Under Review" | "Approved" | "Issued" | "Rejected" | "Revoked";

export interface CertificateEligibility {
  hasApprovedTrackADeliverable: boolean;
  hasMinFiveVerifiedOutreachStage2Plus: boolean;
  bothTracksCompleted: boolean;
  complianceClearance: boolean;
  requiredWorkRecorded: boolean;
  overallEligible: boolean;
}

export interface CertificateRequest {
  id: string;
  internUserId: string;
  internName: string;
  requestedAt: string;
  status: CertificateStatus;
  eligibilitySnapshot: CertificateEligibility;
  adminNotes?: string;
  reviewedByUserId?: string;
  reviewedAt?: string;
  certificateId?: string; // unique cert ID once issued
  issuedAt?: string;
  pdfUrl?: string;
}

// ============================================================
// REPORT / BATCH STATS
// ============================================================
export interface BatchReport {
  batchId: string;
  batchName: string;
  totalInterns: number;
  verifiedInterns: number;
  trackACompleted: number;
  trackBCompleted: number;
  totalTasksAssigned: number;
  totalTasksCompleted: number;
  totalOutreachRegistrations: number;
  totalVerifiedRegistrations: number;
  certificatesIssued: number;
  averageContributionScore: number;
}
