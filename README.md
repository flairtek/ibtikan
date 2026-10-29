# Ibtikan Ibn Adams Properties Limited — Corporate Website

A complete, responsive real-estate website for **Ibtikan Ibn Adams Properties Limited** (Accra, Ghana): property catalogue, project portfolio, insights, enquiry workflows and a fully protected admin dashboard.

- **Motto:** People • Places • Possibilities
- **Vision:** Building Better Communities for a Brighter Tomorrow
- **Live domain (configured):** https://www.ibtikanproperties.com

---

## 1. Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript |
| Styling | Tailwind CSS v4, custom brand tokens in `app/globals.css` |
| Database | Cloudflare D1 (SQLite) via the `DB` binding — `lib/db.ts` |
| Object storage | Cloudflare R2 via the `FILES` binding — media library |
| Authentication | Sign in with Freebuff (OIDC + PKCE) — `lib/auth.ts`, no client secret |
| Email | Resend (optional, best-effort) — `lib/mail.ts` |
| Hosting | Freebuff Sites (Cloudflare Workers + OpenNext) |

## 2. Getting started

```bash
npm install          # install dependencies
npm run dev          # start the dev server on http://localhost:3000
```

`next.config.ts` calls `initOpenNextCloudflareForDev({ configPath: "./freebuff.wrangler.jsonc" })`, which wires the **local** D1/R2 bindings into `next dev`. The database schema is created automatically on first query (`ensureSchema()` in `lib/db.ts`), so no manual migration step is needed.

Other scripts:

```bash
npm run build        # production build (also runs TypeScript)
npm run lint         # ESLint (0 errors, 0 warnings)
npx tsc --noEmit     # type-check only
```

## 3. Configuration

### Public runtime variables

Injected automatically by Freebuff on deploy; locally they live in `.env.local` (git-ignored):

| Variable | Purpose |
|---|---|
| `FREEBUFF_CLIENT_ID` | Public OIDC client id (separate development client for localhost) |
| `FREEBUFF_ISSUER` | `https://freebuff.com/oidc` |
| `APP_ORIGIN` | Canonical site origin — used for CSRF origin checks, never derived from `Host` |
| `ADMIN_EMAILS` | Optional comma-separated admin allowlist (e.g. `info@ibtikanproperties.com`) |
| `RATE_LIMIT_SALT` | Salt for hashing client IPs in the enquiry rate-limit table |
| `RESEND_API_KEY` | Optional — enables enquiry e-mail notifications (set via **Sites → Secrets**) |
| `RESEND_FROM` | Optional — verified sender address once the domain is verified in Resend |
| `NEXT_PUBLIC_SITE_URL` | Optional — overrides the canonical URL used in metadata/sitemap |

> There is **no client secret**. Sign in with Freebuff is designed so that only public values live in configuration.

### Sign-in / auth registration

Auth is already registered for this project (development client for `http://localhost:3000`, production client for the deployed origin). Re-run registration whenever the canonical domain changes — callbacks must always be exactly `/auth/freebuff/callback` on the site origin.

### Environment variables checklist before launch

- [ ] `ADMIN_EMAILS` set to the company's real administrator address(es)
- [ ] `RATE_LIMIT_SALT` set to a unique random value (production)
- [ ] `RESEND_API_KEY` added in **Sites → Secrets** if e-mail notifications are wanted
- [ ] `NEXT_PUBLIC_SITE_URL` matches the final custom domain

## 4. Site structure

**Public routes** — `/`, `/about`, `/about/leadership`, `/about/ceo`, `/projects`, `/projects/[slug]`, `/properties`, `/properties/[slug]`, `/land-sales`, `/residential-properties`, `/commercial-properties`, `/luxury-homes`, `/property-development`, `/property-management`, `/gated-communities`, `/investment-opportunities`, `/diaspora-investment`, `/insights`, `/insights/[slug]`, `/contact`, `/enquire`, `/privacy-policy`, `/terms`, plus a custom `not-found` page.

**Admin routes** (server-side gated, `noindex`) — `/admin`, `/admin/properties` (+ `new`, `[id]`), `/admin/projects` (+ `new`, `[id]`), `/admin/enquiries`, `/admin/pages`, `/admin/team`, `/admin/media`, `/admin/settings`.

**Key modules**

- `lib/brand.ts` — company details, navigation, categories (single source of truth)
- `lib/repo.ts` — all D1 queries; only `published = 1` rows are ever read publicly
- `lib/guard.ts` — admin guard + client-IP helper for API routes
- `lib/seo.ts` — metadata builder + Schema.org JSON-LD generators
- `lib/content.ts` — editable page copy (overridable from **Admin → Pages & Articles**)
- `app/api/enquiries/route.ts` — the public enquiry endpoint (validation, honeypot, timing, rate limit, dedupe, CSRF)

## 5. Deployment checklist

1. **Build locally** — `npm run build`, `npm run lint`, `npx tsc --noEmit` all pass.
2. **Local Wrangler check** — exercise the app in `next dev` (which runs the OpenNext Cloudflare context) and confirm D1 reads/writes and R2 media upload work.
3. **Prepare** — `sites_prepare_next` generates `freebuff.wrangler.jsonc` and validates the Worker bundle (already present in this project).
4. **Storage** — provision the `DB` (D1) and `FILES` (R2) bindings in the target environment before the first deploy so they attach.
5. **Deploy** — `sites_deploy` with the manifest returned by `sites_prepare_next` (preview first).
6. **Secrets** — add `RESEND_API_KEY` (and `ADMIN_EMAILS`, `RATE_LIMIT_SALT`) through **Sites → Secrets**.
7. **Verify on the live origin** — every public route, `/sitemap.xml`, `/robots.txt`, `/.well-known`-free auth flow: sign in → dashboard → sign out; submit a test enquiry and confirm it appears in **Admin → Enquiries**.
8. **Custom domain** — add the domain to the site, re-run auth registration so the production callback matches it exactly, confirm `APP_ORIGIN` and canonical/`sitemap` URLs use it.
9. **Publish** — `sites_set_published` for the environment (production publishing requires explicit approval).
10. **Post-launch** — submit `https://www.ibtikanproperties.com/sitemap.xml` to Google Search Console; verify OG preview in the major social platforms.

## 6. Security checklist

- [x] **Admin pages gated server-side** — `app/admin/layout.tsx` renders the sign-in gate when there is no session; hiding UI is never used as authorization.
- [x] **Admin APIs return 401 when signed out** — verified: `POST /api/admin/properties` → `401`, settings → `401`.
- [x] **Authorization enforced in the API layer** — `guardAdminMutation()` / `requireAdmin()` on every mutating route, with an admin allowlist (`admins` table + `ADMIN_EMAILS`).
- [x] **CSRF protection** — `isSameOriginRequest(request, APP_ORIGIN)` on state-changing requests; foreign `Origin` verified to return `403`.
- [x] **Private data never public** — enquiries are only exposed through guarded admin APIs; responses set `Cache-Control: no-store`.
- [x] **Unpublished content excluded** — list/detail queries filter `published = 1` (and `status = 'published'` for articles) at the SQL level.
- [x] **Server-side validation** — the API re-validates everything the client sends (field rules, lengths, consent).
- [x] **Spam protection** — honeypot field (silently accepted, not stored), minimum time-on-form (≥1.5 s), per-IP daily rate limit, duplicate-submission dedupe.
- [x] **No secrets in client code** — auth uses public values only; no platform tokens, no session secrets in the repo. `.env.local` is git-ignored.
- [x] **`robots.txt`** disallows `/admin`, `/api/`, `/auth/`; admin pages send `robots: noindex, nofollow`.
- [x] **Public uploads validated** — image uploads are restricted by type/size and served through `/media/[key]`.
- [ ] Email provider key — set via **Sites → Secrets**, never committed.

## 7. Test report

Run on 26 October 2026 against the local dev server (OpenNext + local D1/R2).

| Check | Result |
|---|---|
| `npx tsc --noEmit` | ✅ 0 errors |
| `npm run lint` | ✅ 0 errors, 0 warnings |
| `npm run build` | ✅ exit 0, TypeScript phase included |
| All 20 public routes return 200 | ✅ verified by request |
| Unknown route → custom 404 | ✅ `/nonexistent-page-404` → 404 |
| Unknown property/project/article slug → 404 (no 500) | ✅ |
| Admin pages show sign-in gate when signed out | ✅ “Sign in required” + “Sign in with Freebuff” |
| Admin API signed out | ✅ `401 {"error":"Please sign in first."}` |
| Foreign `Origin` on enquiry POST | ✅ `403 Cross-origin request rejected.` |
| Browser-like same-origin request (`Sec-Fetch-Site: same-origin`) | ✅ passes origin check → 401 signed out |
| Sign-in redirect | ✅ `303` → `https://freebuff.com/oidc/authorize?...client_id=...&code_challenge_method=S256` |
| Enquiry persisted to D1 | ✅ row present in `enquiries` with `status = 'new'` |
| Enquiry validation errors | ✅ `400` with per-field messages |
| Too-fast submission | ✅ `400` |
| Duplicate submission | ✅ `409` |
| Honeypot | ✅ pretends success, nothing stored |
| Client-side form validation | ✅ inline + summary alerts rendered |
| Property filters via query string | ✅ `?category=land&sort=price-asc` renders filtered list / empty state |
| Mobile navigation | ✅ hamburger opens full menu with dropdowns, `aria-expanded` toggles |
| Console errors on homepage | ✅ none |
| `<title>` per page | ✅ unique, single brand suffix (duplicate suffix bug fixed) |
| Canonical + Open Graph tags | ✅ present and correct |
| `/sitemap.xml` | ✅ 200, all static public routes + published dynamic content |
| `/robots.txt` | ✅ 200, disallows admin/api/auth, references sitemap |
| `/manifest.webmanifest` + `/icon.svg` | ✅ 200 |

**Not verified (blocked, see §8):** full sign-in → admin → sign-out flow (requires a real Freebuff account login), admin CRUD round-trips behind auth, e-mail delivery, PWA install prompt.

## 8. Known limitations & remaining dependencies

1. **Sign-in flow end-to-end** — the OIDC redirect is verified, but completing login needs a real Freebuff account in a browser. Do this once before launch: sign in → create a property → publish → view it publicly → sign out.
2. **E-mail notifications** — dormant until `RESEND_API_KEY` is added as a site secret; enquiries are always stored in D1 regardless. Resend also requires the sending domain to be verified.
3. **Inventory content** — no property, project or article records ship with the site (nothing was invented). The company adds verified listings through the admin dashboard; empty states are intentional.
4. **CEO portrait** — no approved photograph was supplied; the site uses the neutral “AA” monogram placeholder. Add an approved portrait in **Admin → Team** when available.
5. **Legal copy** — `/privacy-policy` and `/terms` are drafts explicitly marked “Draft for company review”; they must be reviewed by the company before launch.
6. **Photography** — editorial stock imagery (Unsplash) is used as clearly-labelled illustrative material until the company supplies its own photography to the media library.
7. **WhatsApp button** — intentionally absent until the company confirms a WhatsApp-enabled number (then set it in **Admin → Settings**).
8. **Deployment/publishing** — the Freebuff Sites project and auth registration exist, but nothing has been deployed or published yet; that requires explicit approval.

---

### Project layout

```
app/                 # public + admin routes, API routes, sitemap/robots/manifest
components/
  site/              # header, footer, hero, cards, forms
  admin/             # dashboard editors (properties, projects, articles, team…)
lib/                 # db, repo, auth, guard, seo, brand, content, mail, model
freebuff.wrangler.jsonc   # local Worker config (D1/R2/DO) for `next dev`
freebuff.open-next.config.ts  # generated OpenNext build config
```
