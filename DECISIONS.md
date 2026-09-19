# DECISIONS

Every assumption or choice made while building this that wasn't spelled out in the brief, in the order you'd hit them.

## Placeholder media — the big one

The build sandbox this site was made in has no network access to Pexels, Unsplash, or Google Fonts' file CDN (organisation policy blocks those hosts). So the "real stock photography" the brief asked for doesn't exist in this build — instead, every photo/video placeholder is an abstract generated graphic in the site's palette (see `CREDITS.md` for the full explanation and exactly where to find real replacements). This is genuinely the most important thing to fix before launch, and it's first on the CONFIRM list in `SETUP.md`.

## Stack

- **Next.js 15 (App Router)**, not Astro — needed for Sanity's draft-mode preview API and React Server Components made the section-builder pattern (server-rendered sections, client islands only where there's real interactivity) straightforward.
- **Hosting: Cloudflare Workers via `@opennextjs/cloudflare`**, not Cloudflare Pages. Pages' framework support for full Next.js (API routes, dynamic rendering, ISR) is more limited than the OpenNext adapter, which Cloudflare now recommends for Next.js. Both are free-tier options with no auto-billing.
- **The contact form** is a Next.js Route Handler (`src/app/api/contact/route.ts`), not a separate Cloudflare Pages Function. On the OpenNext/Workers deploy target this runs as Worker code either way — one deploy target is simpler for Mo than managing two.
- **Sanity Studio v3** (not v4/beta) for stability; embedded at `/admin` via `next-sanity`'s `NextStudio` component rather than a separate deploy.

## Ordering, drafts, and the write path

- **Projects use `@sanity/orderable-document-list`** (a proper drag-and-drop `orderRank` field) instead of a manual "order" number, matching the brief's "drag-and-drop in the admin" requirement. `/post`'s server route replicates the same lexorank algorithm (`src/lib/orderRank.ts`) so posts from the phone sort correctly alongside drags made in the Studio.
- **`/post` never puts a Sanity write token in the browser.** The client compresses files locally, then uploads the compressed result to a session-gated server route (`/api/post/upload-asset`), which holds the token and returns only the resulting asset ID. Publishing goes through a second gated route (`/api/post/publish`).
- **`/post` login is a passcode, not Google sign-in.** The first build used NextAuth with Google OAuth, which needed a whole extra Google Cloud Console setup (consent screen, redirect URIs, client secret) just to gate one internal screen. Swapped it for a simple signed-cookie session (`src/lib/postSession.ts`): `OWNER_PASSCODE` gets full publish rights, an optional `ASSISTANT_PASSCODE` gets draft-only rights exactly as the brief describes, and both live in server-side environment variables — never in Sanity, so they're never exposed through the public dataset API. One less account to create, same functionality. Sanity Studio's own login (`/admin`) is untouched and still Google-based — that one's Sanity's own hosted auth, not something this app manages.

## Live preview

The first build fetched Sanity content with a plain published-only client and never actually wired up draft-mode preview, despite the brief's hard requirement that every change previews before publishing. Fixed by adding Sanity's Presentation tool (`sanity/presentation`) to the Studio, a `/api/draft-mode/enable` and `/api/draft-mode/disable` route pair, and making every page fetch check Next's `draftMode()` and switch to an authenticated drafts-perspective client when it's on. A small banner on the live site ("Previewing unpublished changes… Exit preview") makes it obvious when you're looking at a draft instead of the real thing.

## Media pipeline

- **ffmpeg.wasm's core loads from a public CDN (unpkg) at runtime**, not self-hosted in the repo. The single-threaded core is ~31MB — committing that into git felt worse than a CDN fetch that costs nothing and only happens once per device (cached by the browser after). If this ever needs to be fully self-hosted (e.g. a strict CSP), see the comment in `src/lib/compression/video.ts`.
- **No separate JPG fallback upload for images.** Sanity's image pipeline serves whatever format the requesting browser supports from a single source file (`urlForImage(...).auto('format')`), so the "keep a JPG fallback" requirement is satisfied without doubling every image upload.
- Video orientation is detected client-side (`videoWidth`/`videoHeight`) at the moment of upload in `/post`. The Studio field stays manually editable in case Mo ever needs to correct it.

## Design system

- **Fonts load via a Google Fonts `<link>` built dynamically** from whatever's saved in Site Style, rather than static `next/font` imports. This lets Mo switch fonts from the curated shortlist without a code change or redeploy — the trade-off is a small runtime request to Google Fonts instead of Next's built-in self-hosting/optimization. Given the shortlist is fixed and small, this felt like the right trade for a non-developer admin.
- The Cover's "depth effect" cutout layer is, for now, an abstract silhouette shape rather than a real photo cutout (see placeholder media note above). The mechanism (two image layers with the masthead sandwiched between them, plus parallax) is fully built and will work correctly the moment Mo uploads her real cutout.

## SEO / structured data

- `robots.txt` (via `src/app/robots.ts`) explicitly allows all crawlers, including AI bots — this is separate from Cloudflare's own dashboard-level bot-blocking toggle, which needs to be turned off there too (see SETUP.md).
- `/llms.txt` is generated on request from live Sanity content (Site Settings + FAQ), not a static file, so it stays in sync automatically.

## CONFIRM items — how they were seeded

Where the brief showed `[CONFIRM]` as literal inline copy (the two "2 rounds of revisions" bullets, the homepage pull quote, two FAQ answers), it's seeded exactly as written, tag included, so it's visibly obvious on the live site until Mo edits it. Where a literal `[CONFIRM]` tag would have broken something functional (the WhatsApp number used in `wa.me` links, social handles used as real URLs), an obviously-fake placeholder was used instead and flagged in `SETUP.md`'s CONFIRM checklist rather than baked into the field.

## What wasn't tested live

This build environment can run `next build` and type-check the whole project, but can't run a real mobile browser, deploy to Cloudflare, or create Mo's Sanity project. Every page was reviewed carefully for responsive behaviour and correctness, but `TESTING.md` is written as a checklist for a human (Mo or a developer) to actually walk through once it's deployed — that step genuinely hasn't happened yet.
