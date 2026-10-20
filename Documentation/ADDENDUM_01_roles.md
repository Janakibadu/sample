# Addendum 01 — Administrator Role Removed

Date: 2026-07-18
Author: Janaki Badu (client direction, given directly in session)
Status: Approved — supersedes the sections of the SRS (07 July 2026) and the
Design Document (11 July 2026) listed below. Kept as a standalone addendum
because the source documents are PDFs; this file is the authoritative diff
against them until they are reissued.

## Decision

The system has **two roles**, not three: **Teacher** and **Student**. There is
no Administrator role in the first release. Every right previously held by
the Administrator is folded into the Teacher role.

- A teacher registers from the public homepage (name, email, password) and
  can log in immediately. There is no activation/approval gate (see below).
- Any registered teacher can import and update learning content (modules,
  tasks, trials, media) via the content-import screen. Content remains a
  single global, versioned store shared by all teachers and their students —
  it is not scoped per teacher. A content reimport is visible to every
  teacher's assignments, same as before.
- Any registered teacher can, in principle, see the system-wide list of other
  teacher accounts is **not** carried over — there is no cross-teacher account
  management screen. A teacher manages only their own classes and students
  (ownership rules unchanged, see below).
- `is_active` remains a column on the teacher record for future use
  (self-deactivation), defaulting to `true` on registration. Nothing reads or
  writes it yet in the first release.

## Requirements superseded

| Original ID | Original text (summary) | Disposition |
|---|---|---|
| R03 | Admin email/password login | Removed. Teachers already have R02. |
| R08 | Admin creates/activates/deactivates teacher accounts | Removed. Teachers self-register (R01) and are active immediately. |
| R09 | Admin imports/updates learning content | Reassigned: any Teacher may perform this action. |
| R42 | Admin imports a new week without code change | Reassigned: any Teacher may perform this action. |
| NFR04 | Restrict student data to student, owning teacher, **and administrator** | Amended: restrict to student and owning teacher only. |
| NFR05 | Audit log records acting user for admin actions | Amended: acting user is always a teacher; audit log still applies to student account create/delete. |
| R36–R41, R43–R46 | "Teacher dashboard" / admin oversight language | Unaffected — these were already teacher-scoped; no admin-only variants existed. |

R01, R02, R04–R07, R10–R41, R43–R50 and all NFR/TR items not listed above are
unchanged.

## Design consequences (Design Document, 11 July 2026)

- **Roles**: `users.role` enum collapses to a single value. Since there is
  only one non-student role left, the `role` column on `users` is dropped;
  the table is implicitly "teacher accounts." `requireRole` middleware now
  only distinguishes `TEACHER` (JWT) from `STUDENT` (code session) — it still
  exists because the distinction between the two auth types remains load-bearing.
- **Screens removed**: AdminDashboardPage, TeacherAccountsPage. Their
  functionality (content import) moves under the Teacher's own navigation as
  `ContentImportPage`.
- **Endpoints removed/moved**: `/api/admin/teachers*` removed entirely.
  `/api/admin/content/import` and `/api/admin/content/:version/publish` move
  to `/api/content/import` and `/api/content/:version/publish`, accessible to
  any authenticated Teacher.
- **Ownership**: `requireOwnership` is unaffected for student/class data —
  content routes have no ownership dimension (content is global), only
  `requireRole(TEACHER)`.
- **Delivery phases**: Phase 1 ("three roles") becomes "two roles, one
  credential type for staff." Phase 6 ("Dashboards and administration")
  drops the administrator-screen work; content import moves earlier since it
  no longer waits on a separate role's screens (still logically Phase 2,
  content model and importer).
- **Audit log**: still exists (NFR05 unaffected beyond wording) — it records
  teacher-performed account creation/deletion of student accounts.

## What did not change

- Server-is-authoritative, EU-by-construction, minimal-personal-data,
  content/learner-data separation, and the data-driven task engine are all
  untouched.
- Student login (access code only), the middleware chain shape
  (`verifyToken → requireRole → requireOwnership`), and the domain model
  (Module/Task/Trial) are unchanged other than the role vocabulary above.
