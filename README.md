# Bhishtam Tech — Cybersecurity Site, Security Dashboard + API

Three parts share one dark, red-accent design system:

- **Marketing site** (public): Home, About, Features, Contact, Pricing, 404. Built from the Figma **"Cybersecurity X"** file (`UTNEfO7Nizb5uS6SLwM2dN`) and rebranded as Bhishtam Tech.
- **Auth pages:** Login, Sign up, Forgot password, styled like the site.
- **Security dashboard** (`/dashboard/*`, needs login): security score, threats, incidents, vulnerabilities, assets, devices, services, access control, settings. It was originally the BankDash banking dashboard and was converted to cybersecurity.
- **API** (`server/`): an Express + TypeScript + Prisma (PostgreSQL) scaffold. See [server/README.md](server/README.md).

> **Folder layout status:** the plan is `client/` (Next.js frontend) + `server/` (Node.js backend).
> `server/` exists. The frontend still lives at the repository root, because moving it requires the dev server to be stopped. Once moved, the paths below change from `src/…` to `client/src/…`.

---

## Stack

| Concern | Choice |
|---|---|
| Frontend | Next.js 15 (App Router, React 19, TypeScript) |
| Styling | Tailwind CSS v4. Tokens in `src/app/globals.css` (`@theme`) |
| UI kit | shadcn/ui (dialogs, selects, popovers, command palette, sonner toasts, input-otp, …) |
| State | Zustand, persisted to localStorage (`src/lib/store.ts`, key `bhishtam-store`) |
| Charts | shadcn Chart + Recharts 3 |
| Animation | GSAP 3.15 + ScrollTrigger/SplitText (site), Three.js (site backgrounds), Framer Motion (dashboard and auth), CSS keyframes (loader and bug cursor) |
| Fonts | **Michroma** (headings, logo) + **Geist Mono** (body/UI), self-hosted from `public/fonts` |
| Icons | lucide-react |
| Backend | Express 5, TypeScript 6, Prisma 7 (PostgreSQL via `@prisma/adapter-pg`), zod, helmet |

---

## Getting started

```bash
# frontend (repo root for now)
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npm run lint

# backend
cd server
npm install            # also runs `prisma generate`
cp .env.example .env   # set DATABASE_URL
npm run dev            # http://localhost:4000/api/v1/health
```

Node 20+.

**Demo login:** any valid email plus a password of 6+ characters. Dashboard data is sample data stored in your browser. **Settings → Security → Reset demo data** restores it.

---

## Routes

### Site (public)

| Route | Page |
|---|---|
| `/` | Home |
| `/about` | About |
| `/features` | Features |
| `/contact` | Contact: info cards, validated form (`#form`), FAQ (`#faq`) |
| `/pricing` | Pricing (reachable from the footer; not in the header nav) |
| any unknown URL | 404 |

Header nav: **Home · About · Features · Contact**, plus Login and Get in touch.

### Auth

| Route | Page |
|---|---|
| `/login` | Sign in (redirects to `next` or `/dashboard`) |
| `/signup` | Sign up |
| `/forgot-password` | Email → 6-digit code → new password → done |

Signed-in users who open `/login` or `/signup` are sent to `/dashboard`.

### Dashboard (needs the `bd_session` cookie)

| Route | Page | What it does |
|---|---|---|
| `/dashboard` | Security Overview | KPI tiles, live security score ring, weekly threat activity, recent alerts, attack-type donut, quick scan, score trend, top attack origins |
| `/dashboard/threats` | Threats & Alerts | Status tabs, severity filter, search (`?q=`), CSV export, detail dialog: investigate / resolve / escalate to incident / download report |
| `/dashboard/incidents` | Incidents | Queue with progress, "Report incident" (`?new=1`), detail dialog with a 5-step response playbook, status and owner |
| `/dashboard/vulnerabilities` | Vulnerabilities | Severity KPIs, charts, CVE table (links to NVD), start remediation / mark patched / report |
| `/dashboard/assets` | Assets | Inventory with risk bars, risk-by-type chart, scan / edit / remove, "Add asset" (`?new=1`) |
| `/dashboard/devices` | Devices & Endpoints | Device cards, isolate/release, scan, remove, "Enroll device" (`?new=1`), OS donut |
| `/dashboard/services` | Security Services | Six services (SOC, pentest, cloud, email, endpoint, training): subscribe / cancel |
| `/dashboard/access` | Access Control | Members, inline roles, MFA status, invite (`?new=1`), suspend/remove, role permission matrix |
| `/dashboard/settings` | Settings | `?tab=` Edit Profile / Preferences (alert threshold, notifications) / Security (2FA, password, sessions, reset demo data) |

**Legacy redirects (308):** the old banking URLs redirect to their security equivalents, with or without the `/dashboard` prefix:

| Old | New |
|---|---|
| `transactions` | `threats` |
| `accounts` | `assets` |
| `investments` | `vulnerabilities` |
| `credit-cards` | `devices` |
| `loans` | `incidents` |
| `privileges` | `access` |

**Header:**
- **Search:** a ⌘K / Ctrl+K / `/` command palette over pages, quick actions, alerts, incidents, assets and devices.
- **Notifications:** a popover listing recent notifications.
- **Avatar:** a menu with a logout confirmation.

---

## Project structure

```
src/                              # frontend (→ client/src after the move)
├─ app/
│  ├─ layout.tsx                  # root: <PageSplash/> + providers
│  ├─ globals.css                 # theme tokens, fonts, cursor, loader keyframes
│  ├─ not-found.tsx
│  ├─ (site)/                     # marketing pages + loading.tsx
│  ├─ (auth)/                     # login, signup, forgot-password + layout (titles) + loading.tsx
│  └─ dashboard/                  # layout (sidebar/header), overview + 8 pages, loading.tsx
├─ components/
│  ├─ site/                       # site sections, GSAP/Three.js, logo, bug-cursor
│  ├─ auth/                       # AuthShell, fields, forms
│  ├─ layout/                     # dashboard sidebar, header, nav, notifications, search, user menu
│  ├─ shared/                     # Panel/Section, security kit, dialog kit, pagination,
│  │                              # form controls, motion, logo, loader, page-splash
│  ├─ overview/ threats/ incidents/ vulnerabilities/ assets/ devices/ services/ access/ settings/
│  └─ ui/                         # shadcn/ui primitives
├─ lib/                           # store.ts (data + actions), download.ts (CSV/report), utils
└─ middleware.ts                  # auth guard + legacy redirects
public/
├─ fonts/                         # Michroma, Geist Mono (woff2)
└─ site/                          # artwork; brand/ = logo.svg, logo-mark.svg, cursor SVGs
server/                           # backend, see server/README.md
design-reference/                 # original Figma screenshots
```

---

## Design system

All colours are tokens in `src/app/globals.css`. The original dashboard token names (`bd-*`) are kept, but they now hold the site palette, so everything shares one dark theme. There is no light mode.

| Token | Value | Use |
|---|---|---|
| `cx-accent` / `bd-royal` / `bd-blue` | `#e12632` | Brand accent: links, active nav, primary actions |
| `bd-page` / `cx-bg` | `#010101` | Page background |
| `bd-surface` / `cx-bg-2` | `#0c0c0c` | Cards, sidebar, dialogs |
| `bd-border` / `cx-line` | `#212121` | Card borders, dividers |
| `bd-primary` / `bd-text` / `bd-muted` | `#fff` / `#e6e6e6` / `#9c9c9c` | Text |
| `bd-red` | `#d14b4b` | Critical, errors |
| `bd-orange` | `#c9a03c` | Medium, warnings |
| `bd-teal` | `#3a9e94` | Low, secondary series |
| `bd-green` | `#3d9e7c` | Healthy, resolved |
| High severity | `#d17a3f` | Defined in `shared/security.tsx` |

Status colours are deliberately muted for the dark UI. Chart bars use a deeper red, `#c42a33`.

- **Type:** h1–h4 render in Michroma automatically, through a global rule; everything else is Geist Mono. Michroma is loaded with `size-adjust: 80%`, because it is about 38% wider than the original Mona Sans.
- **Shape:** cards use 8px radius with a 1px `#212121` border.
- **Primary buttons:** white, turning red on hover.

**Security UI kit** (`src/components/shared/security.tsx`) — every dashboard page builds from these:
- badges: `SeverityBadge`, `StatusBadge`, `Pill`
- display: `StatTile`, `ScoreRing`, `RiskBar`
- filtering: `FilterTabs`, `SearchBox`, `EmptyState`
- table class names

**Dialog kit** (`src/components/shared/dialog-kit.tsx`):
- dialogs: `BdDialog`, `ConfirmDialog`, `DetailRows`
- button classes: `primaryBtn`, `outlineBtn`, `dangerBtn`
- helpers: `Shake`, `useFakeSubmit`

---

## Data (`src/lib/store.ts`)

The store holds:
- `alerts`, `incidents`, `vulnerabilities`, `assets`, `devices`
- `members`, `services` (active subscriptions), `notifications`
- `user`, `preferences`, `security`

Every action is where a real API call would go. `securityScore()` derives the 0–100 posture score from open alerts, unpatched vulnerabilities, active incidents and devices at risk, so it updates live as you act.

The Prisma schema in `server/prisma/schema.prisma` mirrors these types, so the frontend can switch to the API one endpoint at a time.

---

## Changelog

### Rebrand and site
- The company is renamed **Bhishtam Tech** across the site, auth and dashboard. This covers visible text, tab titles (`%s · Bhishtam Tech`) and screen-reader labels.
- **New logo:** `public/site/brand/logo.svg`, a wordmark with mark and tagline, is used in the site header and footer, the auth pages and the dashboard. `logo-mark.svg` is the square mark shown in the collapsed sidebar.
- **Accent colour:** blue `#1e6aff` was replaced with red `#e12632` everywhere, including 35 illustrations and avatar backgrounds. Only the blue tones in those images were hue-shifted.
- **Fonts:** Mona Sans was replaced with **Michroma** (headings) and **Geist Mono** (body), self-hosted.
- **Header nav:** reduced to Home / About / Features / Contact. The "Pages" dropdown and the Cart were removed.
- **Removed:** the Password-protected page and the home-page blog section.
- **Footer:** links now point to real pages. It uses a balanced three-column grid, and the copyright moved to a bottom bar.
- **Animated bug cursor:** follows the mouse, faces its direction of travel, scuttles its legs, twitches its antennae, grows on links and squishes on click. Touch devices and reduced-motion users get a static bug.

### Auth
- Login, sign-up and forgot-password now use the site look: particle globe, lock and shield art, "Secure access" panel, dark fields, and white→red buttons.

### Dashboard: banking → cybersecurity
- **Pages:** all 9 pages were rebuilt as security pages (see Routes). The old banking routes redirect.
- **Theme:** one dark theme app-wide, matching the site. The light/dark toggle was removed.
- **Data and UI kits:** a new data model and seed data, plus the shared security UI kit and dialog kit.
- **Removed:** bank-only code — cards, transactions, loans, investments and privileges components, plus the old icon set, the Inter/Lato/Montserrat fonts, and the date/expiry pickers.

### Loader
- **First-load splash:** the logo mark sits inside a radar ring with a red sweep, pulse and scan line. Below it are "BHISHTAM TECH", a cycling terminal status line and a progress bar. It is server-rendered with pure CSS, so it shows before JavaScript loads.
- **Route loader:** a smaller version is shown by `loading.tsx` in the site, auth and dashboard segments.

### Backend
- **Scaffold:** `server/` was added with Express 5 + TypeScript.
- **Settings:** environment settings are checked at startup with zod.
- **Middleware:** helmet, CORS (for the frontend), request logging, and JSON 404 and error handlers.
- **Health check:** `GET /api/v1/health` reports the API and database status.
- **Database:** Prisma 7 is set up for PostgreSQL through `prisma.config.ts` and the pg adapter. It includes 11 models that mirror the dashboard data.

### Fixes
- Duplicate route-group pages (`(dashboard)` vs `dashboard`) caused a build error; the stale copy was removed.
- GSAP `ScrollTrigger` crashed with "reading 'end'" when `once: true` triggers killed themselves during refresh. They now use `toggleActions: "play none none none"`.
- Confirm-dialog buttons showed blank (white on white). `AlertDialogAction`/`Cancel` now merge classes with `cn()`.
- Quick Scan updated the store from inside a React state updater, causing the "Cannot update a component while rendering" error.
- Home and 404 tab titles fell back to "BankDash"; the dashboard tab title doubled "Bhishtam Tech".
- "Patched this month" is now exact (`patchedAt`).

---

## Known gaps

- Dashboard data is client-side demo data. The API has no business endpoints yet.
- Contact details on the site and the contact page (`info@cybersecurity.com`, phone, address) are placeholders.
- Site copy still contains template lorem ipsum in places.
- The favicon is still the Next.js default.
