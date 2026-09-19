# MOVEL — movelstudio.com

Mo's creator portfolio: a magazine-style Next.js site with a Sanity-powered admin at `/admin` and a mobile quick-post screen at `/post`.

**Start here if you're setting this up:** [`SETUP.md`](./SETUP.md) — plain-English, step by step, no coding required.

Other docs:

- [`TESTING.md`](./TESTING.md) — a checklist to walk through on phone and laptop before calling it launched.
- [`DECISIONS.md`](./DECISIONS.md) — every assumption made while building this that wasn't spelled out in the brief.
- [`CREDITS.md`](./CREDITS.md) — where placeholder media came from (short version: it's generated, not real stock photography — see why in there).

## For developers

```bash
npm install
cp .env.example .env   # fill in Sanity/Google/Resend/Turnstile keys — see SETUP.md
npm run dev             # local dev server
npm run seed             # populate Sanity with all the brief's seed content + placeholder media
git push                # deploy — Vercel auto-deploys on push once the repo's connected, see SETUP.md
```

Stack: Next.js 15 (App Router) · Sanity Studio v3 (embedded at `/admin`) · Tailwind CSS · hosted on Vercel · Resend · Cloudflare (DNS, Turnstile, Web Analytics, Email Routing) · passcode auth for `/post`.

A Cloudflare Workers deploy path also exists (`npm run cf:build && npm run cf:deploy`, via `@opennextjs/cloudflare`) but isn't the one in use — the embedded Sanity Studio route is too heavy for the free Workers plan's CPU-time limit and intermittently throws a 1102 resource-limit error there.
