# CauseKind Internship Portal

A polished, responsive frontend for the **CauseKind Internship Portal**, built with Next.js (App Router), TypeScript, and Tailwind CSS. The visual identity reflects the warm, mission-driven aesthetic of [CauseKind](https://causekind.com).

---

## 🎨 Design System

- **Background:** Warm cream `#FAF7F3`
- **Cards & Surfaces:** Clean white `#FFFFFF` and soft cream `#FFFDF9`
- **Primary Accent:** Burnt terracotta orange `#AD5127` / `#B65329`
- **Dark Typography:** `#211B17`
- **Muted Text:** `#796C62` / `#665A51`
- **Borders & Dividers:** Subtle taupe `#EEE2D7` / `#EEE5DC`
- **Peach Highlights:** `#F8E7D8` / `#FAF0E8`
- **Typography:** Elegant serif headings paired with clean, accessible sans-serif body text.

---

## 🚀 Key Features Implemented

1. **Clean Top-Only Navigation:**
   - Removed the duplicate left-side sidebar.
   - Primary navigation is consolidated in the top header (`Dashboard`, `My Tasks`, `Calendar`, `Verification`, `Onboarding Kit`, `Achievements`, `Profile`, and `My Team` for team leaders).
   - Fully responsive on mobile with a hamburger menu dropdown.

2. **Suppressed Floating Development Overlay:**
   - Disabled the black Next.js Turbopack dev indicator button via `devIndicators: false` in `next.config.ts` and fallback global CSS.

3. **Multi-Role Authentication & Clean Login:**
   - Login form inputs start clean and empty so users can type their own credentials.
   - Role-based redirection:
     - `VOLUNTEER` → Volunteer Dashboard (`/dashboard`)
     - `TEAM_LEADER` → Volunteer Dashboard & Team Hub (`/team`)
     - `ADMIN` → Administration Portal (`/admin`)
   - Convenient quick-fill buttons available for evaluators:
     - **Volunteer:** `shravan.sawant17@gmail.com` / `password123`
     - **Team Leader:** `ananya.team@causekind.com` / `leader123`
     - **Admin:** `admin@causekind.com` / `admin123`

4. **Multi-Pathway Account Creation Wizard (`/register`):**
   - **Individual Volunteer:** 4-step wizard collecting Account Details, College & Academic Endorsement, Profile Photo & Bio, and Review & Submit.
   - **Team Leader:** Generates unique Team ID (e.g. `CK-TEAM-8921`) and shareable invite code (e.g. `CK-BANDRA-26`), with peer email invites.
   - **Join an Existing Team:** Instant code verification and automatic assignment to college squads.
   - **Live Data Propagation:** Everything entered during registration (Full Name, College, Course, Department, Year, Student ID, Bio, Photo) is preserved in `UserAccount` and immediately populates the intern's dashboard and profile.

5. **Team Collaboration Hub (`/team`):**
   - Team status, capacity, and leader details.
   - Roster of active members with verification indicators.
   - Invitation dispatch, copyable invitation links, and revoke actions.
   - Leave-team and transfer-team workflows.

6. **Document Upload & Verification (`/verification`):**
   - Upload College ID, Student Verification, Signed Internship Declaration, and Consent forms.
   - File validation (PDF, PNG, JPG up to 10 MB), preview, and deletion/replacement.
   - Status tracking: `NOT_SUBMITTED`, `SUBMITTED`, `UNDER_REVIEW`, `APPROVED`, `REJECTED`.
   - Downloadable template library for official forms.

7. **Dedicated Admin Portal (`/admin`):**
   - Distinct, compact admin workspace (independent of volunteer nav).
   - Sections for Dashboard Overview, Volunteer Verification Directory, Team Management, Campaign Publishing, Task Evidence Evaluation, Document Templates, and Security Audit Log.

8. **Synchronized Volunteer Experience:**
   - Changes in `/tasks` dynamically update the `/dashboard` progress bar and `/calendar` markers.
   - Profile edits in `/profile` immediately update the top-right header and welcome banner.

---

## 📂 Route Directory

| Route | Description |
|---|---|
| `/` | Clean Sign In page with show/hide password toggle and demo helpers |
| `/login` | Redirects to `/` |
| `/register` | Multi-step registration wizard (Individual, Team Leader, Join Team) |
| `/forgot-password` | Password recovery form with feedback |
| `/dashboard` | Intern dashboard with task counts, recent assignments, deadlines |
| `/tasks` | Task list, category/status filters, evidence upload submission modal |
| `/calendar` | Interactive monthly calendar with deadline markers and selection details |
| `/verification` | College ID upload, compliance status, and downloadable templates |
| `/team` | Team delegation workspace, member list, code copying, invite management |
| `/onboarding` | 7-part handbook, safety protocols, FAQs, and progress tracker |
| `/achievements` | Milestone badges, unlock criteria, and internship checkpoints |
| `/profile` | Full intern credentials and in-session profile editor |
| `/admin` | Dedicated administration workspace |

---

## 🛠️ Development & Build Instructions

### Prerequisites
- Node.js 18+ or 20+
- npm or pnpm

### Run in Development
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Run Production Build
```bash
npm run build
npm start
```

### Run Linter
```bash
npm run lint
```

---

## 🔌 Java Spring Boot API Integration Contract

When connecting to the Java Spring Boot backend, set `NEXT_PUBLIC_API_URL=http://localhost:8080/api`:

- `POST /api/auth/login` — Authenticates credentials, returns session token and role.
- `POST /api/auth/register` — Creates user account and volunteer profile.
- `GET /api/volunteers/me` — Fetches profile and verified documents.
- `POST /api/documents` — Multi-part file upload for college ID and declarations.
- `POST /api/teams` — Creates college team and generates invitation codes.
- `POST /api/teams/join` — Joins team via invitation code.
- `POST /api/admin/verifications/{id}/approve` — Approves volunteer verification.
- `POST /api/admin/campaigns` — Publishes outreach campaigns.
- `POST /api/tasks/{id}/submissions` — Records intern task deliverables.
