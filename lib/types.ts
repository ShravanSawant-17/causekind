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
  submission?: TaskSubmission;
}

export interface InternProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  course: string;
  year: string;
  bio: string;
  skills: string[];
  interests: string[];
  joinedDate: string;
  role: string;
  initials: string;
  location: string;
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
