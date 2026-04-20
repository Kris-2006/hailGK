# CDC Portal - Knowledge Base

## Project Overview

**CDC Recruitment Portal** for IIT (ISM) Dhanbad - A web platform for companies to submit JNF (Job Notification Form) and INF (Intern Notification Form) for campus placements.

| Component | Technology |
|-----------|------------|
| Frontend | Next.js (App Router), MUI v5, TanStack Query, Axios |
| Backend | Laravel 11, Sanctum |
| Database | SQLite (originally MySQL in spec) |
| Cache | Laravel Database Driver (`CACHE_STORE=database`) |
| Email | Log driver (`MAIL_MAILER=log`) — needs SMTP for production |

---

## ⚠️ ESSENTIAL — Frontend Styling (DO NOT CHANGE)

### Colour Palette

| Token | Value | Usage |
|-------|-------|-------|
| ISM Navy | `#0A1628` | Primary headers, sidebar, buttons |
| ISM Gold | `#C8922A` | JNF accent, active indicators |
| ISM Gold Light | `#E8B64A` | Hover on gold elements |
| ISM Teal | `#1B5E6B` | INF accent, links, checkboxes |
| ISM Teal Light | `#2A8A9E` | Teal hover states |
| ISM Grey Mid | `#5A6478` | Secondary text, field labels |
| ISM Grey Pale | `#F4F6F9` | Page backgrounds |
| ISM White | `#FEFEFE` | Cards, content areas |
| ISM Red | `#8B1A1A` | Error / suspended states |
| ISM Green | `#1d6b3a` | Success / active states |

### Typography

| Font | Usage |
|------|-------|
| `EB Garamond` (serif) | Section titles, headings, stats |
| `DM Sans` (sans-serif) | Body text, form labels, buttons |
| `JetBrains Mono` (monospace) | Reference numbers, badges |

### Component Patterns

- **Section boxes**: `bgcolor: '#FEFEFE'`, `borderRadius: 2`, `border: 1px solid rgba(10,22,40,0.06)`
- **Field labels**: `fontSize: '12px'`, `color: '#5A6478'`, `fontWeight: 500`
- **Primary buttons**: `bgcolor: '#0A1628'`, hover `#2C3345`
- **Gold buttons** (JNF submit): `bgcolor: '#C8922A'`, hover `#E8B64A`
- **Teal buttons** (INF submit): `bgcolor: '#1B5E6B'`, hover `#2A8A9E`
- **Theme file**: `src/lib/theme.ts`

---

## Key Discoveries & Gotchas

1. **Redis NOT required** — OTP works with database cache driver
2. **SQLite** — changed from MySQL (missing `pdo_mysql` ext). `personal_access_tokens` had missing `last_used_at` column — fixed manually
3. **Storage symlink** — Must run `php artisan storage:link` for logo/PDF uploads to be accessible
4. **Logo URLs** — Use `getStorageUrl()` helper from `src/lib/api.ts` to construct `http://localhost:8000/storage/{path}`
5. **PHP string interpolation** — Cannot use ternary (`===`) inside double-quoted strings. Extract to variables first
6. **Str facade** — Use `Illuminate\Support\Str` (not `Facades\Str`) to avoid autoload issues
7. **API paths** — Existing routes use double prefix (`/notifications/notifications`). Don't change to avoid breaking
8. **Onboarding flow** — Registration collects company info. Dashboard auto-navigates to Contacts & HR since company profile is pre-filled

---

## File Status — Frontend (`/cdc-portal-frontend`)

| File | Status |
|------|--------|
| `app/login/page.tsx` | ✅ Complete |
| `app/register/page.tsx` | ✅ Complete |
| `app/dashboard/page.tsx` | ✅ Complete (metrics, company card, onboarding stepper, JNF/INF create) |
| `app/dashboard/profile.tsx` | ✅ Complete (logo upload using `getStorageUrl()`) |
| `app/dashboard/contacts.tsx` | ✅ Complete (Head HR, PoC1, PoC2) |
| `app/admin/page.tsx` | ✅ Complete (submissions, recruiters with activate/suspend, analytics, audit) |
| `app/jnf/[id]/page.tsx` | ✅ Complete (5 tabs: Job Profile, Eligibility, Salary, Selection, Declaration) |
| `app/inf/[id]/page.tsx` | ✅ Complete (5 tabs: Intern Profile, Eligibility, Stipend, Selection, Declaration) |
| `app/jnf/[id]/preview/page.tsx` | ✅ Complete (read-only summary + submit + success screen) |
| `app/inf/[id]/preview/page.tsx` | ✅ Complete (read-only summary + submit + success screen) |
| `lib/api.ts` | ✅ All API methods + `getStorageUrl()` helper |
| `lib/theme.ts` | ✅ ISM design system |
| `types/index.ts` | ✅ All interfaces defined |

## File Status — Backend (`/cdc-portal-api`)

| File | Status |
|------|--------|
| `AuthController.php` | ✅ OTP, register, login, forgot/reset password, registration email |
| `NotificationController.php` | ✅ CRUD, auto-save per tab (job-profile, intern-profile, eligibility, salary, selection, declaration), submit with email, preview, JD PDF upload |
| `CompanyController.php` | ✅ Profile CRUD, logo upload, contacts CRUD |
| `AdminController.php` | ✅ List/update notifications, users CRUD (activate/suspend), analytics, audit logs, export |

---

## API Endpoints

### Auth (`/api/auth/`)
`POST send-otp` · `POST verify-otp` · `POST register` · `POST login` · `POST logout`

### Notifications (`/api/notifications/notifications/`)
`GET /` · `POST /` · `GET /{id}` · `GET /{id}/preview` · `POST /{id}/submit`
`PATCH /{id}/job-profile` · `PATCH /{id}/intern-profile` · `PATCH /{id}/eligibility`
`PATCH /{id}/salary` · `PATCH /{id}/selection` · `PATCH /{id}/declaration`
`POST /{id}/jd-pdf`

### Company (`/api/company/company/`)
`GET /` · `PATCH /` · `POST /logo` · `GET /contacts` · `PATCH /contacts`

### Admin (`/api/admin/`)
`GET notifications` · `PATCH notifications/{id}/status` · `GET export`
`GET users` · `POST users` · `PATCH users/{id}` · `DELETE users/{id}`
`GET analytics` · `GET audit-logs`

---

## Onboarding Flow

```
Register (company info saved) → Dashboard
 ↓ (auto-navigate if incomplete)
Company Profile (pre-filled from registration, just review/add logo)
 ↓
Contacts & HR (Head HR + PoC1 required)
 ↓ (buttons unlock)
Create JNF/INF → Fill 5 tabs → Preview → Submit
```

---

## Remaining Work

1. **End-to-End Testing** — Full submission flow
2. **Landing Page Stats** — Connect to backend analytics API
3. **Production Config** — SMTP email, file storage, rate limiting, CORS
4. **Pre-existing TS errors** — 45 errors in `company/page.tsx` (MUI Grid v2 `size` prop)
