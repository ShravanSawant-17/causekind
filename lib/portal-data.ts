import { InternProfile, TaskItem, Achievement, OnboardingSection } from "./types";

export const initialInternProfile: InternProfile = {
  id: "INT-2026-084",
  name: "Shravan S Sawant",
  email: "shravan.sawant17@gmail.com",
  phone: "+91 98765 43210",
  institution: "Fr. Conceicao Rodrigues College of Engineering",
  course: "B.E. Computer Engineering",
  year: "3rd Year",
  bio: "Passionate about combining community-driven civic action with digital tools to create tangible grassroots impact. Focusing on education outreach and digital literacy programs.",
  skills: [
    "Community Outreach",
    "Field Surveying",
    "Data Analysis",
    "Team Coordination",
    "Digital Storytelling",
  ],
  interests: [
    "Education Equity",
    "Youth Empowerment",
    "Sustainable Communities",
    "Social Tech",
  ],
  joinedDate: "October 2026",
  role: "Community Engagement Intern",
  initials: "SS",
  location: "Mumbai, Maharashtra",
};

export const initialTasks: TaskItem[] = [
  {
    id: "TASK-101",
    title: "Complete intern profile & documentation",
    category: "Documentation",
    description:
      "Verify your personal information, college endorsement, emergency contact details, and signed internship declaration.",
    assignedDate: "2026-10-05",
    dueDate: "2026-10-09",
    priority: "High",
    status: "Completed",
    estimatedHours: 2,
    guidelines: [
      "Ensure official college email or roll number is accurate",
      "Upload identity confirmation document",
      "Acknowledge the CauseKind volunteer code of ethics",
    ],
    submission: {
      description: "Profile completed with college credentials and signed ethics declaration.",
      fileName: "Declaration_Signed_SS.pdf",
      fileSize: "1.2 MB",
      submittedAt: "2026-10-08 14:30",
      reviewerFeedback: "Verified by CauseKind Admin. Welcome aboard!",
    },
  },
  {
    id: "TASK-102",
    title: "Review the CauseKind onboarding kit & safety protocols",
    category: "Documentation",
    description:
      "Thoroughly review the 8 core onboarding modules, community interaction guidelines, and emergency contact directory.",
    assignedDate: "2026-10-06",
    dueDate: "2026-10-12",
    priority: "Medium",
    status: "Completed",
    estimatedHours: 4,
    guidelines: [
      "Read all modules in the Onboarding Kit tab",
      "Familiarise yourself with field conduct and consent policies",
      "Confirm understanding of reporting workflows",
    ],
    submission: {
      description: "Completed thorough reading of all 8 onboarding modules and safety handbook.",
      fileName: "Onboarding_Review_Checklist.pdf",
      fileSize: "840 KB",
      submittedAt: "2026-10-11 18:15",
      reviewerFeedback: "Module acknowledgement recorded.",
    },
  },
  {
    id: "TASK-103",
    title: "Community needs assessment survey (Bandra West)",
    category: "Research & Survey",
    description:
      "Conduct in-person demographic and resource gap interviews across 15 participating households in the target ward.",
    assignedDate: "2026-10-10",
    dueDate: "2026-10-18",
    priority: "High",
    status: "Completed",
    estimatedHours: 8,
    guidelines: [
      "Obtain verbal and signed consent prior to surveys",
      "Document key needs regarding study materials and clean water access",
      "Upload structured survey responses using the standard form template",
    ],
    submission: {
      description: "Surveyed 16 households. Compiled summary sheet with primary requirements in primary education supplies.",
      fileName: "Bandra_Needs_Assessment_Data.xlsx",
      fileSize: "2.4 MB",
      submittedAt: "2026-10-17 19:40",
      reviewerFeedback: "Excellent field documentation and clear summary tables.",
    },
  },
  {
    id: "TASK-104",
    title: "Submit field outreach report & beneficiary feedback",
    category: "Field Outreach",
    description:
      "Synthesise qualitative feedback collected during the weekend community distribution drive and identify bottlenecks.",
    assignedDate: "2026-10-18",
    dueDate: "2026-10-25",
    priority: "High",
    status: "In Progress",
    estimatedHours: 6,
    guidelines: [
      "Detail attendance, beneficiary distribution count, and volunteers present",
      "Highlight at least 3 actionable recommendations for the next cycle",
      "Attach geotagged photographic proof adhering to privacy consent rules",
    ],
  },
  {
    id: "TASK-105",
    title: "Digital advocacy campaign: Youth education awareness",
    category: "Digital Advocacy",
    description:
      "Draft two informative social media carousel briefs highlighting local volunteer opportunities and student study drives.",
    assignedDate: "2026-10-20",
    dueDate: "2026-10-28",
    priority: "Medium",
    status: "In Progress",
    estimatedHours: 5,
    guidelines: [
      "Incorporate official CauseKind typography and color scheme",
      "Include authentic quotes from local mentors",
      "Ensure accessible contrast and clear call to action",
    ],
  },
  {
    id: "TASK-106",
    title: "Collate school supply donation inventory",
    category: "Community Engagement",
    description:
      "Categorise, count, and log newly received stationery and study kit donations in the central warehouse ledger.",
    assignedDate: "2026-10-22",
    dueDate: "2026-10-31",
    priority: "Medium",
    status: "Not Started",
    estimatedHours: 4,
    guidelines: [
      "Sort items into primary, middle, and high school buckets",
      "Flag any damaged or incomplete bundles",
      "Submit final count sheet signed by warehouse coordinator",
    ],
  },
  {
    id: "TASK-107",
    title: "Conduct volunteer orientation session",
    category: "Community Engagement",
    description:
      "Co-host a 45-minute virtual onboarding session for the incoming batch of 12 community volunteers.",
    assignedDate: "2026-10-24",
    dueDate: "2026-11-04",
    priority: "Low",
    status: "Not Started",
    estimatedHours: 3,
    guidelines: [
      "Prepare presentation deck following CauseKind template",
      "Record attendance and answer attendee questions",
      "Send recap notes with links to the onboarding guide",
    ],
  },
  {
    id: "TASK-108",
    title: "End-of-month internship reflection & impact log",
    category: "Documentation",
    description:
      "Compile a 500-word reflective summary of your learning curve, community interactions, and personal milestones.",
    assignedDate: "2026-10-25",
    dueDate: "2026-11-08",
    priority: "Low",
    status: "Not Started",
    estimatedHours: 3,
    guidelines: [
      "Reflect on technical and leadership skills practiced",
      "Quantify hours dedicated and direct beneficiaries reached",
      "Provide constructive suggestions for future cohort mentors",
    ],
  },
];

export const initialAchievements: Achievement[] = [
  {
    id: "ACH-1",
    title: "First Step Forward",
    description: "Completed your first CauseKind internship task and submission.",
    category: "Milestone",
    icon: "🌱",
    earned: true,
    earnedDate: "2026-10-08",
    currentProgress: 1,
    maxProgress: 1,
    progressUnit: "task",
  },
  {
    id: "ACH-2",
    title: "Knowledge Seeker",
    description: "Reviewed the complete onboarding kit and acknowledged the safety protocols.",
    category: "Milestone",
    icon: "📖",
    earned: true,
    earnedDate: "2026-10-11",
    currentProgress: 1,
    maxProgress: 1,
    progressUnit: "guide",
  },
  {
    id: "ACH-3",
    title: "Field Scout",
    description: "Conducted hands-on community assessment surveys reaching over 15 households.",
    category: "Impact",
    icon: "📍",
    earned: true,
    earnedDate: "2026-10-17",
    currentProgress: 16,
    maxProgress: 15,
    progressUnit: "surveys",
  },
  {
    id: "ACH-4",
    title: "Consistent Contributor",
    description: "Submit 5 completed tasks on schedule without deadline extensions.",
    category: "Consistency",
    icon: "⏱️",
    earned: false,
    currentProgress: 3,
    maxProgress: 5,
    progressUnit: "tasks",
  },
  {
    id: "ACH-5",
    title: "Community Champion",
    description: "Complete all assigned field outreach and advocacy tasks in your cohort.",
    category: "Excellence",
    icon: "⭐",
    earned: false,
    currentProgress: 3,
    maxProgress: 8,
    progressUnit: "tasks",
  },
  {
    id: "ACH-6",
    title: "Storyteller for Good",
    description: "Publish impactful digital advocacy content raising community awareness.",
    category: "Impact",
    icon: "✨",
    earned: false,
    currentProgress: 1,
    maxProgress: 2,
    progressUnit: "campaigns",
  },
];

export const onboardingSections: OnboardingSection[] = [
  {
    id: "welcome",
    title: "Welcome to CauseKind",
    category: "Introduction",
    readTime: "3 min read",
    summary:
      "Our mission is to empower communities through collective kindness, transparent grassroots action, and dedicated youth participation.",
    content: [
      "CauseKind was founded on a simple conviction: small, intentional acts of compassion aggregate into transformative community change.",
      "As an intern, you are the heartbeat of our outreach initiatives. Whether you are conducting field surveys, organising learning drives, or crafting advocacy campaigns, your dedication touches genuine lives.",
      "We value transparency, empathy, accountability, and continuous learning. Approach every community member with humility and respect.",
    ],
    tips: [
      "Wear your CauseKind badge or volunteer identification during all field visits.",
      "Always listen first before proposing solutions to community elders and families.",
    ],
  },
  {
    id: "internship-overview",
    title: "Internship Structure & Expectations",
    category: "Program Guide",
    readTime: "5 min read",
    summary:
      "Understand the key phases, hours commitments, mentorship touchpoints, and completion requirements.",
    content: [
      "The CauseKind internship spans 8 to 12 weeks of structured experiential learning divided into three distinct phases: Induction & Research, Active Field Outreach, and Impact Synthesis.",
      "Expected weekly commitment is approximately 10–12 hours, allowing flexibility alongside college schedules.",
      "You will be paired with a Senior Program Coordinator who conducts bi-weekly 1-on-1 check-ins and reviews all task submissions.",
    ],
    tips: [
      "Maintain active communication on cohort channels if college exams require scheduled leaves.",
      "Track your tasks directly through this portal to ensure timely milestone approvals.",
    ],
  },
  {
    id: "roles-responsibilities",
    title: "Roles & Responsibilities",
    category: "Operations",
    readTime: "4 min read",
    summary:
      "Clarity on what is expected of community engagement interns, and where boundaries exist.",
    content: [
      "Direct Outreach: Facilitating survey interviews, distributing learning kits, and interacting with partner schools.",
      "Data Integrity: Collecting accurate demographic records without exaggerating beneficiary counts.",
      "Team Camaraderie: Supporting fellow cohort members during large weekend field activations.",
      "Ethical Representation: You represent CauseKind in every public interaction. Foster trust and openness.",
    ],
    tips: [
      "Never solicit direct cash donations from beneficiaries or private donors independently.",
      "Report any discrepancies or issues to your supervisor within 24 hours.",
    ],
  },
  {
    id: "task-submission-guide",
    title: "Task Submission & Evidence Instructions",
    category: "Workflows",
    readTime: "4 min read",
    summary:
      "Step-by-step instructions on documenting your contributions, writing summaries, and attaching acceptable evidence.",
    content: [
      "Every task assigned in your 'My Tasks' view contains specific guidelines and expected outcomes.",
      "When beginning work, transition the status to 'In Progress' so your coordinator knows you are actively working on it.",
      "Upon completion, provide a concise qualitative summary (100–300 words) detailing what was accomplished, obstacles faced, and measurable outcomes.",
      "Attach supporting evidence such as spreadsheet logs, survey summaries, or event photos. Allowed file formats include PDF, PNG, JPG, and DOCX (up to 10 MB).",
    ],
    tips: [
      "Double-check that all uploaded images respect participant privacy.",
      "Submissions are evaluated by coordinators within 48 to 72 hours.",
    ],
  },
  {
    id: "field-safety-conduct",
    title: "Field Outreach & Safety Protocols",
    category: "Safety & Ethics",
    readTime: "6 min read",
    summary:
      "Essential personal safety, buddy systems, emergency escalation, and ethical conduct during community visits.",
    content: [
      "The Buddy System: Never conduct door-to-door surveys or community visits alone. Always pair up with at least one other CauseKind intern.",
      "Daylight Hours: Standard field outreach must be conducted between 9:00 AM and 5:30 PM. No night visits are permitted.",
      "Weather & Hydration: Carry personal water bottles, caps, and basic first-aid supplies during warm weather drives.",
      "Emergency Protocol: In the unlikely event of hostility, medical urgency, or unsafe terrain, disengage immediately and contact the CauseKind Emergency Helpline.",
    ],
    tips: [
      "Keep your mobile phone fully charged before departing for any field site.",
      "Share your live location with your assigned cohort lead during field hours.",
    ],
  },
  {
    id: "privacy-consent",
    title: "Privacy, Photography & Informed Consent",
    category: "Compliance",
    readTime: "5 min read",
    summary:
      "Crucial ethical rules regarding participant anonymity, child protection, and photography permissions.",
    content: [
      "Child Protection Policy: CauseKind strictly adheres to POCSO and international child safeguarding standards. Never photograph or record minors without documented parental/guardian consent.",
      "Consent is Voluntary: Explain the purpose of any interview or survey clearly in the respondent's primary language. Community members may decline any question at any time.",
      "Data Storage: Do not post raw survey data, personal phone numbers, or residential addresses on public social media accounts.",
    ],
    tips: [
      "When in doubt about photo consent, capture activity shots from behind or focus on the hands/materials rather than identifiable faces.",
    ],
  },
  {
    id: "faqs",
    title: "Frequently Asked Questions",
    category: "Support",
    readTime: "4 min read",
    summary:
      "Common questions regarding attendance, evaluation, certificates, and college credit endorsements.",
    content: [
      "Browse our most frequent queries below. For individual issues, reach out through the intern support channel.",
    ],
    faqs: [
      {
        question: "How do I earn my official CauseKind Internship Certificate?",
        answer:
          "Official certificates and letters of recommendation are issued upon successfully completing at least 80% of assigned cohort tasks and receiving satisfactory review from your mentor.",
      },
      {
        question: "Can I adjust a deadline if I have university examinations?",
        answer:
          "Yes! Submit an advance deadline extension request through your coordinator at least 3 days prior. Academic commitments are always accommodated.",
      },
      {
        question: "What if a community survey participant refuses to answer certain questions?",
        answer:
          "Respect their choice immediately and mark those fields as 'Skipped / Declined'. Consent is strictly voluntary.",
      },
      {
        question: "Does CauseKind provide college project or credit evaluation forms?",
        answer:
          "Yes. Provide your college's official appraisal form to your mentor towards the end of your term, and the team will fill and stamp it.",
      },
    ],
  },
];
