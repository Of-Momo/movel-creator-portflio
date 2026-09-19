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
npm run cf:build && npm run cf:deploy   # deploy to Cloudflare Workers
```

Stack: Next.js 15 (App Router) · Sanity Studio v3 (embedded at `/admin`) · Tailwind CSS · Cloudflare Workers (via `@opennextjs/cloudflare`) · Resend · Cloudflare Turnstile · NextAuth (Google sign-in for `/post`).
