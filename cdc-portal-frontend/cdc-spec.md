**IIT (ISM) DHANBAD**

Career Development Centre

**CDC Recruitment Portal**

Software Specification Document

*JNF + INF Portal · Version 1.0 · March 2025*

| **Property** | **Detail** |
|---|---|
| Document Type | Software Specification / HLD |
| Scope | JNF (Job Notification Form) + INF (Intern Notification Form) Portals |
| Client | Career Development Centre, IIT (ISM) Dhanbad |
| Frontend | Next.js · MUI · Auth.js |
| Backend | Laravel · Sanctum |
| Database | MySQL / MariaDB |
| Document Status | Initial Draft — for review and refinement |

---

**Table of Contents**

**1. Project Overview**

The CDC Recruitment Portal is a web-based platform for IIT (ISM) Dhanbad\'s Career Development Centre. It enables companies (recruiters) to submit structured Job Notification Forms (JNF) for campus placements and Intern Notification Forms (INF) for internships. The CDC admin team uses the platform to review, manage, and process these submissions.

The design is informed by a gap analysis of four peer IIT portals: IIT Indore, IIT Guwahati, IIT Delhi, and IIT Dharwad — incorporating the best features from each.

**1.1 Goals**

- Replace manual/email-based JNF and INF submission with a structured, validated web portal.
- Give recruiters a seamless multi-step form experience with auto-save, preview, and email confirmation.
- Give CDC admins a dashboard to review, approve, filter, and export submissions.
- Ensure NIRF/RTI compliance by collecting all requisite data fields.
- Build on a maintainable, modern stack owned by the institute\'s tech team.

**1.2 Portals in Scope**

| **Portal** | **Purpose** | **Key Differentiator from JNF** |
|---|---|---|
| JNF | Full-time job notifications for campus placements | Detailed salary/CTC structure: UG vs PG split, ESOP, bond, currency selector |
| INF | Internship notifications | Stipend (simpler than CTC); adds PPO provision field; no bond/ESOP |

**1.3 Out of Scope (v1.0)**

- Student-facing portal (student login, applications, shortlists)
- Automated shortlisting or AI matching
- Offer letter management
- Mobile app

> **NOTE:** Both portals share the same auth system, company profile, contact/HR details, eligibility module, and selection process module. Only the 'Job/Intern Profile' and 'Salary/Stipend' tabs differ meaningfully between JNF and INF. This has direct architectural implications — a shared base model is strongly recommended.

---

**2. Actors & User Roles**

| **Role** | **Description** | **Key Capabilities** |
|---|---|---|
| Recruiter (Guest) | Unregistered company representative landing on the portal | View landing page, stats, brochure; initiate registration |
| Recruiter (Registered) | Verified company rep with active account | Create / edit / submit JNF or INF; view submission status; receive email confirmations |
| CDC Admin | IIT (ISM) CDC staff | View all submissions; approve / reject / request changes; export data; manage recruiter accounts; view analytics |
| Super Admin | CDC head / IT admin | All CDC Admin rights plus system configuration, user management, audit logs |

---

**3. Functional Requirements**

**3.1 Landing Page (Public)**

- Hero section: headline, 'Register Now' and 'Recruiter Login' CTAs.
- Placement statistics: 500+ companies, placement %, highest CTC (₹48L), 32+ departments — dynamically fetched from DB.
- 'Why Recruit at IIT (ISM)' USP section: heritage, unique programmes, specialised talent.
- Quick Links: brochure download (PDF), past recruiters list, contact CDC.
- Search bar: filter by year, company name, discipline (borrowed from IIT Guwahati).
- Fully responsive / mobile-first design.

**3.2 Authentication & Registration**

**3-Step Registration Wizard**

1. Step 1 — Email OTP Verification: company email → Send OTP → 6-digit code with 5-minute expiry → reCAPTCHA on form (IIT Indore). Verify & Proceed unlocks step 2.
2. Step 2 — Recruiter Details: Full name\*, Designation\*, Contact (+91)\*, Alternative mobile, Password + Confirm Password.
3. Step 3 — Company Profile (see §3.3).

**Login**

- Email + password login with Sanctum session/token.
- Forgot password via email link.
- Session-based auth for web; token-based for any future API consumers.

**3.3 Company Profile**

Collected during registration (Step 3) and editable from the recruiter dashboard.

| **Field** | **Type** | **Source / Notes** |
|---|---|---|
| Company Name \* | Text | Existing field |
| Category / Org Type \* | Dropdown (PSU / Private / MNC / Startup / Govt / NGO) | IIT Indore, IIT Dharwad |
| Website \* | URL | Existing field |
| Postal Address | Textarea | Existing field |
| Sector \* | Dropdown + multi-tag | Existing; tags from IIT Indore / IIT Guwahati |
| Nature of Business | Dropdown | Existing field |
| No. of Employees | Dropdown (range) | Existing field |
| Date of Establishment | Date picker | IIT Delhi, IIT Dharwad |
| Annual Turnover (NIRF) \* | Dropdown (range) | IIT Delhi |
| Social Media / LinkedIn URL | URL | IIT Indore, IIT Delhi |
| Industry Sector Tags | Multi-select chip | IIT Indore, IIT Guwahati |
| If MNC — Parent HQ Country/City | Text (conditional) | IIT Dharwad |
| Company Logo \* | Image upload (JPG/PNG ≤ 2MB) | IIT Delhi |
| Company Description | Rich text (WYSIWYG) | IIT Guwahati |
| Autofill | Auto-populate from previous JNF/INF submissions | JNF portal specific |

**3.4 Contact & HR Details**

Three contact cards: Head HR (required, borrowed from IIT Delhi), Primary PoC (required), Secondary PoC (optional).

Each card collects: Full Name\*, Designation\*, Email\*, Mobile (+91)\*, Landline (optional). Character counters on text fields (IIT Indore). Landline per contact (IIT Indore, IIT Dharwad).

**3.5 JNF — Job Profile Tab**

| **Field** | **Notes** |
|---|---|
| Profile Name / Job Title \* | Display name for the role |
| Job Designation (formal) | Separate from title (IIT Dharwad) |
| Place of Posting \* | City / location; supports multiple |
| Work Location Mode | On-site / Remote / Hybrid (IIT Indore) |
| Expected Hires \* / Minimum Hires | Both fields (IIT Indore, IIT Dharwad) |
| Tentative Joining Month \* | Date picker (month/year) |
| Required Skills | Chip-style tag input (IIT Indore) |
| Job Description | WYSIWYG rich text editor + PDF upload alternative (IIT Guwahati) |
| Additional Job Info | Plain textarea, 1000 char limit (IIT Indore) |
| Bond Details | Retained from current form |
| Registration Link | Company\'s own link; retained from current form |
| Onboarding Procedure | Free text |

**3.6 INF — Intern Profile Tab**

Same structure as JNF Job Profile with the following differences:

- 'Internship Title' instead of 'Job Title / Profile Name'
- 'Expected Duration' instead of Joining Month
- 'PPO Provision on Performance' toggle (IIT Indore)
- No Bond Details field
- Upload JD as PDF (Intern JD)

**3.7 Eligibility & Courses**

Identical between JNF and INF. Checkbox grids per programme category with 'Select All' for each group (IIT Delhi).

| **Programme Category** | **Programmes** |
|---|---|
| B.Tech / Dual Degree (JEE Advanced) | Chemical, Civil, CSE, EE, ECE, Engg Physics, Environmental, Mechanical, Mech (Mining), Mineral & Metallurgical, Mining, Petroleum (12 branches) |
| Integrated M.Tech (JEE Advanced) | Mathematics & Computing, Applied Geology, Applied Geophysics |
| M.Tech GATE (2-year) | 23 specialisations incl. Earthquake Science, Data Analytics, Pharmaceutical Sc. & Engg, etc. |
| M.Sc JAM (2-yr) | Physics, Chemistry, Mathematics & Computing |
| M.Sc.Tech JAM (3-yr) | Applied Geology, Applied Geophysics |
| MBA (CAT) | Business Analytics, Finance, Marketing, HR, Operations |
| Ph.D (GATE/NET) | Yes/No toggle + specify departments |
| M.A. Digital Humanities & Social Sciences | Yes/No toggle |

Additional eligibility filters: Min. CGPA per programme (per-discipline CPI grid from IIT Guwahati); Backlogs allowed? (Yes/No); High school % criterion; Gender filter (All / Male / Female / Others); Specific requirement re. SLP.

**3.8 JNF — Salary Details**

Salary grid: rows = programme type (B.Tech/Dual, M.Tech, MBA, M.Sc/M.Sc.Tech, Ph.D), columns = CTC Annual / Base/Fixed / Monthly Take-home. Separate UG CTC and PG CTC sections. Currency selector: INR / USD / EUR. Toggle: same structure for all programmes vs. per-programme breakdown.

Additional components: Joining Bonus, Retention Bonus, Variable/Performance Bonus, ESOPs + vest period, Relocation Allowance, Medical Allowance, Deductions (free text), Bond Amount + Duration, First Year CTC, Stocks/Options, CTC Breakup (free text), Gross Salary.

**3.9 INF — Stipend Details**

Simpler than salary: Stipend amount per month, currency, CTC breakup notes. No ESOP/bond fields. PPO provision handled in the Intern Profile tab.

**3.10 Selection Process**

Existing stages retained: Pre-Placement Talk, Resume Shortlisting, Online/Written Test, Group Discussion, Personal/Technical Interview.

New additions: Selection mode per stage (Online/Offline/Hybrid); Test type dropdown (Aptitude/Technical/Written); Duration in minutes per test and interview; Interview mode (On-campus/Telephonic/Video Conferencing); Add up to 10 test rounds and 10 interview rounds; Infrastructure requirements (team members + rooms); Psychometric Test toggle; Medical Test toggle; Other Screening free text.

**3.11 Declaration & Submit**

- 5 checkboxes: AIPC guidelines agreement, shortlisting commitment, accuracy of profile, consent to share with ranking agencies, adherence to T&C.
- Self-declaration: authorised signatory Name, Designation, Date, typed signature field.
- Preview Before Submit: full form summary with edit links per section.
- Policy links: AIPC guidelines + IIT (ISM) Recruiter Policy inline.
- RTI/NIRF consent checkbox.
- Auto-email to recruiter on successful submission (IIT Guwahati).

**3.12 Recruiter Dashboard**

- List of all submitted JNFs/INFs with status (Draft / Submitted / Under Review / Approved / Rejected / Changes Requested).
- '+ New JNF / + New INF' button.
- Edit links for drafts.
- Status timeline per submission.

**3.13 CDC Admin Dashboard**

- Table of all submissions with filters (company, year, season, programme, status).
- Approve / Reject / Request Changes actions with notes.
- Export to Excel / CSV.
- Recruiter account management (activate, suspend, view history).
- Basic analytics: submissions per season, programme-wise interest, sector distribution.

---

**4. High-Level Architecture**

**4.1 System Layers**

| **Layer** | **Technology** | **Responsibility** |
|---|---|---|
| Client (Browser) | Next.js 14+ (App Router) + MUI v5 | SSR/SSG for public pages; CSR for the multi-step form; rich UI components |
| Auth | Auth.js (NextAuth v5) + Laravel Sanctum | Frontend session management via Auth.js; backend token issuance + validation via Sanctum |
| API | Laravel 11 REST API | Business logic, validation, OTP, email, file handling, admin operations |
| Database | MariaDB (MySQL 8+ compatible) | Relational data: companies, contacts, JNF/INF submissions, users, audit logs |
| File Storage | Local disk (dev) / S3-compatible object store (prod) | Company logos, uploaded JD PDFs |
| Email | Laravel Mail + SMTP (or Mailgun/SES) | OTP emails, submission confirmations, status change notifications |
| Cache / Queue | Redis + Laravel Queue | OTP TTL, job queues for emails and exports |

**4.2 Deployment Topology**

| **Component** | **Deployment** |
|---|---|
| Next.js frontend | Node.js server / Vercel / Nginx reverse proxy |
| Laravel API | PHP-FPM + Nginx on VPS or Docker container |
| MariaDB | Managed DB instance or self-hosted on VM |
| Redis | Managed Redis or self-hosted |
| File storage | MinIO (self-hosted S3-compatible) or AWS S3 |
| SSL | Let\'s Encrypt / institutional cert |

**4.3 Key Architectural Decisions**

**Shared Base Form Model (JNF / INF)**

JNF and INF share \~80% of their schema. The recommended approach is a single notifications table with a type column ('jnf' \| 'inf'), polymorphic relationships for type-specific data (salary vs stipend), and shared modules (company, contacts, eligibility, selection_process).

> **DECISION NEEDED:** Will JNF and INF be separate URL namespaces (/jnf/\* and /inf/\*) with shared components, or a unified /form/\* route driven by a type parameter? The former is cleaner for routing; the latter reduces duplication. Recommendation: separate namespaces with a shared component library.

**Auth Strategy**

Auth.js handles the frontend session (cookie-based, server-side). On login, Auth.js calls the Laravel /api/login endpoint which returns a Sanctum token; this token is stored in the Auth.js session and attached to all subsequent API requests as a Bearer token. This avoids CORS issues for SSR requests.

**Form State & Auto-Save**

Multi-tab form state is managed with Zustand (or React Context). Each tab\'s onBlur triggers a PATCH to the API, which persists a draft record. A toast notification confirms save. On browser close/refresh, the form is restored from the draft. Final submission changes the status from draft to submitted.

**OTP Flow**

On registration, the backend generates a 6-digit OTP, stores it in Redis with a 5-minute TTL, and sends it via email. The frontend polls nothing; the user submits the OTP, the backend verifies against Redis, deletes the key on success, and returns a short-lived verification token used to proceed to step 2.

---

**5. Data Model (Conceptual)**

| **Table** | **Key Columns** | **Notes** |
|---|---|---|
| users | id, email, password, role (recruiter\|admin\|super_admin), email_verified_at, company_id | Auth.js + Sanctum token owner |
| companies | id, name, category, website, sector, description, logo_path, ...(all company profile fields) | Shared between JNF and INF submissions |
| company_contacts | id, company_id, type (head_hr\|poc1\|poc2), name, designation, email, mobile, landline | |
| notifications | id, company_id, type (jnf\|inf), season, year, status, submitted_at, reviewed_by, review_notes | Master record for each JNF/INF submission |
| job_profiles | id, notification_id, title, designation, location, work_mode, expected_hires, min_hires, jd_text, jd_pdf_path, skills, bond_details, ... | JNF job tab data |
| intern_profiles | id, notification_id, title, duration, stipend_amount, currency, ppo_provision, ... | INF intern + stipend tab data |
| jnf_salaries | id, notification_id, programme, ctc_annual, base_fixed, monthly_takehome, joining_bonus, esop, bond_amount, ... | One row per programme; up to 5 rows per JNF |
| eligibility_criteria | id, notification_id, min_cgpa, backlogs_allowed, gender_filter, hs_percent, slp_requirement | Scalar eligibility filters |
| eligible_programmes | id, eligibility_criteria_id, programme_code, min_cpi | One row per programme checkbox ticked |
| selection_stages | id, notification_id, stage_type, mode, test_type, duration_mins, interview_mode, sort_order | Repeating; up to 20 stages |
| selection_infra | id, notification_id, team_members, rooms_required, psychometric_test, medical_test, other_screening | |
| declarations | id, notification_id, signatory_name, signatory_designation, signed_at, all_checkboxes_checked | |
| audit_logs | id, user_id, action, entity_type, entity_id, metadata, created_at | Admin actions |

---

**6. API Design (Laravel REST)**

**6.1 Auth Endpoints**

| **Method** | **Endpoint** | **Description** |
|---|---|---|
| POST | /api/auth/send-otp | Send OTP to company email |
| POST | /api/auth/verify-otp | Verify OTP → return verification token |
| POST | /api/auth/register | Complete registration (steps 2+3) using verification token |
| POST | /api/auth/login | Email + password → Sanctum token |
| POST | /api/auth/logout | Revoke Sanctum token |
| POST | /api/auth/forgot-password | Send password reset email |
| POST | /api/auth/reset-password | Reset password with token |

**6.2 Company & Profile Endpoints**

| **Method** | **Endpoint** | **Description** |
|---|---|---|
| GET/PATCH | /api/company | Get/update company profile (auth: recruiter) |
| POST | /api/company/logo | Upload company logo |
| GET/PATCH | /api/company/contacts | Get/update contact & HR details |

**6.3 JNF/INF Submission Endpoints**

| **Method** | **Endpoint** | **Description** |
|---|---|---|
| GET | /api/notifications | List all submissions for recruiter |
| POST | /api/notifications | Create new JNF or INF draft (body: type) |
| GET | /api/notifications/{id} | Get full submission data |
| PATCH | /api/notifications/{id}/job-profile | Auto-save job/intern profile tab |
| PATCH | /api/notifications/{id}/eligibility | Auto-save eligibility tab |
| PATCH | /api/notifications/{id}/salary | Auto-save salary/stipend tab |
| PATCH | /api/notifications/{id}/selection | Auto-save selection process tab |
| POST | /api/notifications/{id}/submit | Final submit (validates all tabs, sends email) |
| POST | /api/notifications/{id}/jd-pdf | Upload JD PDF for a submission |

**6.4 Admin Endpoints**

| **Method** | **Endpoint** | **Description** |
|---|---|---|
| GET | /api/admin/notifications | Paginated list with filters |
| PATCH | /api/admin/notifications/{id}/status | Approve / reject / request changes |
| GET | /api/admin/export | Export submissions as Excel/CSV |
| GET/PATCH/DELETE | /api/admin/users/{id} | Recruiter account management |

---

**7. Project Phases & Work Breakdown**

The project is divided into 5 phases. Each phase ends with an integration checkpoint. The work is split across three primary roles — Frontend (FE), Backend (BE), and Database/API (DB) — with minimal day-to-day overlap.

| **Phase** | **Duration (est.)** | **Theme** |
|---|---|---|
| Phase 1 | 2 weeks | Foundation — Infra, Schema, Auth |
| Phase 2 | 3 weeks | Core Forms — Company Profile + Contacts |
| Phase 3 | 4 weeks | JNF & INF Form Tabs |
| Phase 4 | 2 weeks | Admin Dashboard + Notifications |
| Phase 5 | 2 weeks | Polish, Testing & Deployment |

**Phase 1 — Foundation (Weeks 1–2)**

**Backend / DB (Week 1)**

- Set up Laravel 11 project with Sanctum, Telescope, queues.
- Design and migrate full DB schema (all tables from §5).
- Implement auth endpoints: send-otp, verify-otp, register, login, logout.
- Wire Redis for OTP TTL; wire email with queue worker.
- Write Postman collection / OpenAPI spec for auth endpoints.

**Frontend (Week 1–2)**

- Bootstrap Next.js 14 app with MUI theme (IIT ISM colour palette), ESLint, Prettier.
- Integrate Auth.js with credentials provider pointing to Laravel login.
- Build 3-step registration wizard shell (routing + state machine), no API calls yet.
- Build public Landing Page with static/mock data (stats, hero, quick links).

**Integration Checkpoint — end of Week 2**

- OTP flow works end-to-end; session persists across pages.
- Landing page live on staging.

**Phase 2 — Core Forms: Company Profile + Contacts (Weeks 3–5)**

**Backend / DB (Week 3)**

- CRUD endpoints: company profile (incl. logo upload), company contacts.
- File upload service: validate image type/size, store to disk/S3, return URL.
- Validation rules (Form Requests) for all company profile fields.
- Unit tests for company + contact endpoints.

**Frontend (Weeks 3–4)**

- Registration Step 3: Company Profile form — all fields from §3.3, rich text editor (Tiptap or Quill), multi-select industry tags, conditional MNC HQ field.
- Company Profile edit page (recruiter dashboard).
- Contact & HR details card UI: three contact cards with character counters.
- Connect forms to API with React Query; handle loading + error states.

**Backend / DB (Week 4–5)**

- Notifications CRUD: create draft, get, list by recruiter.
- Auto-save PATCH endpoints for each tab (idempotent upserts).
- Draft / submission state machine.

**Frontend (Week 5)**

- Recruiter dashboard: submission list table with status badges, '+ New JNF / + New INF' button.
- Tab shell for JNF/INF form (6 tabs, each with a 'Saved' indicator).

**Integration Checkpoint — end of Week 5**

- A recruiter can register, fill company profile + contacts, and see their dashboard.

**Phase 3 — JNF & INF Form Tabs (Weeks 6–9)**

**Backend (Week 6)**

- PATCH endpoints + validation for job profile tab (JNF) and intern profile tab (INF).
- JD PDF upload endpoint (validate PDF, store, return URL).
- Eligibility PATCH endpoint: upsert eligibility_criteria + eligible_programmes rows.

**Frontend (Weeks 6–7)**

- JNF Job Profile tab: all fields (§3.5) — skills tag input, WYSIWYG JD editor, PDF upload, work mode radio, date picker.
- INF Intern Profile tab: same but with PPO toggle, duration field (§3.6).
- Eligibility & Courses tab: checkbox grids by programme category with 'Select All'; CGPA per discipline grid.

**Backend (Week 7)**

- Salary PATCH endpoint (JNF): upsert up to 5 jnf_salaries rows; validate currency, numeric fields.
- Stipend PATCH endpoint (INF): simpler stipend fields.
- Selection process PATCH endpoint: upsert selection_stages + selection_infra.

**Frontend (Weeks 7–8)**

- JNF Salary tab: dynamic programme grid, additional components accordion, currency selector, toggle for uniform vs per-programme structure.
- INF Stipend tab: simplified stipend amount + notes.
- Selection Process tab: stage checkboxes, mode/type/duration fields per stage, dynamic 'Add Round' rows, infra fields, toggles for psychometric/medical.

**Backend (Week 8–9)**

- Final submission endpoint: validate all tabs are complete; change status to 'submitted'; dispatch email confirmation job.
- Declaration endpoint: save declaration record.
- Preview endpoint: return denormalised full-form summary JSON.

**Frontend (Week 8–9)**

- Declaration tab: 5 declaration checkboxes, signatory fields, typed signature.
- Preview page: full form read-only summary with 'Edit' link per section.
- Submit CTA + success screen with submission reference number.

**Integration Checkpoint — end of Week 9**

- A recruiter can complete a full JNF and INF end-to-end; receives confirmation email; sees submission in dashboard.

**Phase 4 — Admin Dashboard + Notifications (Weeks 10–11)**

**Backend (Week 10)**

- Admin-protected route group (middleware: role:admin,super_admin).
- Paginated submissions list endpoint with filter params (company, type, year, season, status).
- Status update endpoint (approve / reject / request changes) with email notification to recruiter.
- Export endpoint: generate Excel file via Laravel Excel, stream download.
- User management endpoints: list, activate, suspend.

**Frontend (Week 10–11)**

- Admin dashboard: submissions table with filter bar, status chips, action menu (Approve/Reject/Request Changes with notes modal).
- Admin recruiter detail view: company profile + all submissions.
- Export button (triggers download).
- Basic analytics cards: total submissions, by type, by status, by sector (Chart.js or Recharts).
- Separate admin login (or role-based redirect after shared login).

**Integration Checkpoint — end of Week 11**

- Admin can view, filter, action, and export all submissions.

**Phase 5 — Polish, Testing & Deployment (Weeks 12–13)**

**Both Roles**

- E2E tests with Playwright (registration flow, JNF submission, admin approval).
- Backend: feature tests for all endpoints (PHPUnit).
- Frontend: component tests for form tabs (React Testing Library).
- Security hardening: rate limiting on OTP and login, CSRF protection, input sanitisation.
- Accessibility audit (WCAG 2.1 AA): keyboard navigation, ARIA labels on form fields.
- Performance: image optimisation, Next.js static generation for landing page.
- Production deployment: Dockerise Laravel + Next.js; configure Nginx, Redis, cron for queue worker.
- User manual (PDF) for recruiters; CDC admin quick-start guide.
- UAT with CDC team; fix feedback.

---

**8. Role & Responsibility Matrix**

| **Module / Task** | **Frontend Dev** | **Backend Dev** | **Overlap Notes** |
|---|---|---|---|
| DB Schema design | Review only | Owner | FE reviews to align with form state shape |
| OpenAPI / Postman spec | Consumer | Owner | BE writes; FE uses to mock during dev |
| Landing Page | Owner | Stats API only | FE can use static data in Phase 1 |
| Auth.js integration | Owner | Sanctum endpoints | Agree on token format once; no ongoing overlap |
| OTP + Registration flow | UI + flow owner | OTP service + endpoint | Co-test during integration checkpoint |
| Company Profile form | UI owner | Endpoint + validation | Align on validation error format (once) |
| File uploads (logo, JD PDF) | Upload component | Storage + URL response | Agree on response shape once |
| JNF/INF tab forms | UI + state owner | PATCH endpoints per tab | Minimal; FE can mock endpoints |
| Salary/Stipend tab | UI owner | DB upsert logic | Agree on row structure once |
| Selection process tab | UI owner | DB upsert logic | Agree on array shape once |
| Preview & Submit | Preview render + CTA | Validation + status machine | Co-test submit flow |
| Recruiter Dashboard | UI owner | List + status endpoints | |
| Admin Dashboard | UI owner | Admin endpoints + export | |
| Email templates | Design/HTML template | Mail dispatch | FE designs HTML; BE integrates |
| Deployment | Next.js config + env | Laravel config + Docker | DevOps / both |
| E2E tests (Playwright) | Owner | Seed data / fixtures | Shared responsibility |

---

**9. Non-Functional Requirements**

| **Attribute** | **Target** |
|---|---|
| Performance | Landing page LCP \< 2.5s; form tab switch \< 300ms |
| Availability | 99.5% uptime during placement season (Aug–Nov, Jan–Mar) |
| Security | OWASP Top 10 mitigated; Sanctum CSRF; rate limiting; no PII in logs |
| Scalability | Support 500+ concurrent recruiter sessions during peak |
| Accessibility | WCAG 2.1 AA for all public and auth pages |
| Browser Support | Chrome, Firefox, Safari, Edge (last 2 major versions); iOS Safari 16+ |
| Data Retention | Submissions retained for minimum 5 years (NIRF compliance) |
| Audit Trail | All admin actions logged to audit_logs with user + timestamp |

---

**10. Open Decisions for Review**

| **#** | **Decision** | **Options** | **Recommendation** |
|---|---|---|---|
| D1 | JNF/INF URL namespace | Separate (/jnf/\*, /inf/\*) vs. unified (/form?type=jnf) | Separate — cleaner routing and easier type-specific logic |
| D2 | Admin auth separation | Same login with role-based redirect vs. separate /admin/login | Same login + role-based redirect — simpler auth flow |
| D3 | Rich text editor | Tiptap vs Quill vs CKEditor | Tiptap — best MUI integration; headless; active maintenance |
| D4 | File storage in production | Local disk vs MinIO vs AWS S3 | MinIO self-hosted for cost control; S3 if already on AWS |
| D5 | Email provider | SMTP relay vs Mailgun vs AWS SES | Institutional SMTP for Phase 1; switch to SES for scale |
| D6 | Export format | Excel (.xlsx) only vs Excel + CSV | Both — Excel for CDC, CSV for data imports |
| D7 | Recruitment seasons | Hard-coded (Placement/Internship Season + year) vs. configurable | Configurable enum via admin settings — future-proof |
| D8 | Form auto-save strategy | Per field on blur vs. per tab on tab switch vs. timed interval | Per tab on tab switch + timed 30s interval as fallback |

---

**11. Assumptions & Constraints**

- A single web server VM (or small cluster) is sufficient for v1.0 load.
- Laravel Mail / queue workers will be hosted on the same server as the API in Phase 1.
- The CDC team will provide official IIT (ISM) branding assets (logo, colour hex codes) before frontend work begins.
- reCAPTCHA v3 (invisible) will be used — the institution must register a reCAPTCHA site key.
- PDF uploads are limited to 10MB per file; company logos to 2MB.
- The OTP email must be deliverable to corporate (.com, .in) email domains — the institution\'s SMTP relay must not block these.
- Auth.js will handle Google OAuth as an optional future login method; the API must be ready to accept email-only logins without requiring password (OAuth token exchange) as a Phase 2 addition.

---

**12. Glossary**

| **Term** | **Definition** |
|---|---|
| CDC | Career Development Centre — the IIT (ISM) department managing placements and internships |
| JNF | Job Notification Form — submitted by companies for full-time campus placement roles |
| INF | Intern Notification Form — submitted by companies for internship positions |
| AIPC | Association of Indian Placement Committee — a consortium whose guidelines govern campus recruitment |
| CTC | Cost to Company — total annual compensation package offered to a student |
| PPO | Pre-Placement Offer — an offer extended to an intern for a full-time role based on performance |
| NIRF | National Institutional Ranking Framework — government ranking that requires specific data reporting |
| RTI | Right to Information — public data sharing mandated by law |
| SLP | Specific Learning Profile — academic criterion related to students with disabilities or special requirements |
| PoC | Point of Contact — the recruiter representative designated for a specific purpose |
| ESOP | Employee Stock Ownership Plan — equity-based compensation component |
| OTP | One-Time Password — a time-limited verification code sent to email |
| Sanctum | Laravel Sanctum — a lightweight authentication package for API tokens and session guards |

---

*— End of Document —*
