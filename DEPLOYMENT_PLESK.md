# DEPLOYMENT_PLESK.md — Hosting SPEAK on the TU Dortmund Plesk server

> Handoff file for Claude Code. Read this together with `CLAUDE.md`.
> SRS prevails over the design document wherever they conflict.

---

## 1. Why this file exists

SPEAK will be deployed to an existing **Plesk hosting account run by TU Dortmund ITMC**, not to Hetzner with Docker as described in section 10 of the design document. The client previously used this account and has handed it over to me (Pawan) so that I can put the new SPEAK platform on it.

This change is allowed by the SRS:
- NFR01 / TR10 (EU hosting): satisfied. The server is a German university server.
- TR03 (Node.js + Express): satisfied. Plesk has a Node.js extension (Phusion Passenger).
- Docker is only named in the design document, not in the SRS, so dropping it for this deployment does not break a requirement.

**Action for later:** design document section 10 (Deployment and Operations) needs updating to reflect this. Do not edit the PDFs; just note it in `CLAUDE.md` under open items.

---

## 2. What the server looks like right now

- **Domain:** `speak.ifs.tu-dortmund.de`
- **Panel:** Plesk (German UI), account provided by ITMC
- **PHP 8.4, Git, Composer, Node.js extension** are available. No Docker. **SSH access: assume none** (not confirmed).
- **Node.js page (not yet activated)** shows auto-detected, *wrong* values:
  - Node.js version: 23.11.1 (non-LTS, end of life → must change to 22 or 24 LTS)
  - App root: `/httpdocs/moodle`, document root: `/httpdocs/moodle/public`, startup file: `app.js`
  - These point at Moodle, not SPEAK. They must be changed.
- **`/httpdocs` currently contains a live Moodle installation:**
  ```
  /httpdocs/
  ├── moodle/        ← Moodle (PHP), installed Nov 2025, public/ modified Sep 2026
  ├── moodledata/    ← Moodle data (may contain personal data)
  └── public/
  ```
  Moodle is most likely what the domain serves today.
- **Git** is already connected in Plesk (last commit `66c419f`). Repo, branch and deployment path still need checking.
- **Database:** Plesk "Datenbanken". Could be MySQL or **MariaDB** (not yet confirmed).

---

## 3. Target setup

One Node.js app serves **both** the API and the built React frontend. That gives one domain, no CORS and one deployment.

```
/httpdocs/
├── moodle/          ← left untouched (rollback option), removed later
├── moodledata/      ← left untouched, removed later
└── speak/           ← Git deployment path
    ├── client/      ← React/Vite source
    └── server/      ← Plesk "App root"
        ├── app.js   ← Plesk "Startup file"
        ├── package.json
        └── public/  ← Plesk "Document root" = copy of client/dist
```

Plesk Node.js settings (entered manually by me in the panel):

| Setting | Value |
|---|---|
| Node.js-Version | 22 LTS or 24 LTS |
| Anwendungsstamm (app root) | `/httpdocs/speak/server` |
| Dokumentenstamm (document root) | `/httpdocs/speak/server/public` |
| Anwendungsstartdatei | `app.js` |
| Anwendungsmodus | `production` |
| Umgebungsvariablen | see section 5 |

How Passenger works: it starts `app.js` itself and forwards requests to it. Files that exist in `public/` are served directly; everything else goes to Express.

---

## 4. Tasks for Claude Code (code changes in the repo)

**Before starting:** check the actual repo layout. If it differs from `client/` + `server/`, adapt the paths in this file and tell me first. Do not restructure the repo without asking.

### 4.1 Express entry point (`server/app.js`)
- [ ] Startup file must be called `app.js` in the server package root (or tell me the real name so I set it in Plesk).
- [ ] Listen on `process.env.PORT || 3000`. Never hard-code a port; Passenger controls it.
- [ ] `app.set('trust proxy', 1)`. The app runs behind Plesk's proxy, so this is needed for correct client IPs (rate limiting later, NFR11).
- [ ] Mount the API under `/api`.
- [ ] Serve the React build with `express.static(path.join(__dirname, 'public'))`.
- [ ] Add a SPA fallback **after** the API routes: any non-`/api` GET returns `public/index.html`, so React Router deep links like `/login` survive a reload.
- [ ] Unknown `/api/*` routes must return a JSON 404, **not** `index.html`.
- [ ] The existing safe error handler (NFR14) stays last in the chain.

### 4.2 Build step: React → `server/public`
- [ ] Add a root-level (or client-level) npm script, e.g. `build:deploy`, that runs `vite build` and copies `client/dist/*` into `server/public/`.
- [ ] Decide with me whether `server/public/` is committed (simplest without SSH: build locally, commit on a `deploy` branch) or built on the server via Plesk Git "additional deployment actions". **Default: build locally and commit.**
- [ ] Vite `base` must be `/` (the app runs at the domain root).
- [ ] Frontend API calls use relative URLs (`/api/...`), no hard-coded host.

### 4.3 Configuration
- [ ] All config comes from environment variables. Add or update `server/.env.example`:
  ```
  NODE_ENV=production
  DB_HOST=localhost
  DB_PORT=3306
  DB_NAME=
  DB_USER=
  DB_PASSWORD=
  JWT_SECRET=
  JWT_EXPIRES_IN=
  ```
- [ ] `.env` stays git-ignored. In production the values are set in the Plesk panel, not in a file.
- [ ] The app must fail fast with a clear log message (no secrets in the message) if a required variable is missing.

### 4.4 Database scripts (no SSH → run through Plesk)
Plesk has a tab **"Node.js-Befehle ausführen"** that runs npm scripts in the app root. So everything needed on the server must be an npm script in `server/package.json`:
- [ ] `migrate`: creates or updates the schema.
- [ ] `seed`: the existing small seed script (test teacher, admin, student access code) for end-to-end login testing.
- [ ] Both must be safe to run twice (idempotent).
- [ ] Check that the SQL and migrations also work on **MariaDB** (avoid MySQL-8-only features, or flag them to me).

### 4.5 Security reminders for this environment
- [ ] Nothing sensitive in `server/public/`. Anything in there can be downloaded by anyone.
- [ ] Future media (images, audio, recordings) must live **outside** `public/` and be served through the media controller (NFR13, TR08). This is not in the current scope; just don't design against it.
- [ ] Logs must not contain access codes, tokens or passwords.

### 4.6 Scope discipline
- Current phase is **auth only** (see `CLAUDE.md`). This deployment work supports testing auth end-to-end on the real server (Phase 1: "deployed to staging").
- **Do not** pull forward deferred items: `requireOwnership`, content importer, task engine, dashboards, account-management UI, rate limiting.

---

## 5. Manual steps in the Plesk panel (done by me, not by Claude Code)

Listed here so the code matches what the server expects.

**Before the switch**
1. Get written confirmation from the client (email) that Moodle may be taken offline and replaced.
2. Back up Moodle: Backup Manager, or zip `moodle` and `moodledata` in the file manager, plus a database dump. Keep the backup on the server or give it to the client (possible personal data → GDPR).
3. Disable (don't delete) the Moodle cron job under "Geplante Aufgaben".

**Switch**
4. Create a **new** database for SPEAK under "Datenbanken". Don't reuse Moodle's.
5. Point Git deployment to `/httpdocs/speak` and pull.
6. Set the Node.js values from section 3 and the environment variables from 4.3.
7. Click "Node.js aktivieren", then "NPM install", then "Restart App".
8. In "Node.js-Befehle ausführen", run `run migrate` and then `run seed`.
9. Under Sicherheit → SSL/TLS: Let's Encrypt certificate, HTTP→HTTPS 301 redirect, HSTS (NFR06).

**Verify**
- `https://speak.ifs.tu-dortmund.de` loads the React app.
- Reloading `/login` works (SPA fallback).
- `/api/unknown` returns a JSON 404.
- Teacher/admin login and student access-code login work with the seeded accounts.
- Errors show up under "Protokolle".

**Rollback:** "Node.js deaktivieren" and set the document root back to `/httpdocs/moodle/public`.

**Cleanup (weeks later, after client OK):** delete `moodle`, `moodledata` and the Moodle database.

---

## 6. Open questions (track in `CLAUDE.md`)
- MySQL or MariaDB, and which version?
- Is SSH available? If yes, building on the server becomes an option.
- Which repo and branch is the Plesk Git integration connected to?
- Is this server staging, production, or both? Design doc says staging holds synthetic data only. Clarify with the client before real children's data is entered.
- Update design document section 10 to reflect Plesk instead of Hetzner/Docker.

---

## 7. When done
- Update the "Current status" section in `CLAUDE.md` with what was changed, the npm scripts added, and the open questions above.
- Cite requirement IDs in commit messages (e.g. `TR03`, `NFR06`, `NFR14`).
