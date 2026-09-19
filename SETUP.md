# SETUP.md — MOVEL, in plain English

This is your step-by-step guide to getting movelstudio.com live. You don't need to know how to code for any of this — just where to click. If you get stuck on a step, that's normal; each one says exactly what you're looking for.

---

## Everything you need to confirm before launch (CONFIRM checklist)

Go through this list before telling anyone the site is live. Each item links to where it lives.

1. **Every placeholder photo and video.** This build couldn't reach Pexels/Unsplash to source real stock media (see `CREDITS.md`), so every photo and video on the site right now is an abstract placeholder graphic, not a real photo. This is the most important thing to fix — see "Replacing placeholders" below.
2. **Business WhatsApp number** — currently a fake placeholder (`+234 000 000 0000`). Set the real one in `/admin` → Contact Form Settings, or the "Send on WhatsApp" button and the "Prefer to skip the form" link will send messages to a fake number.
3. **hello@movelstudio.com** — confirm this is the inbox you want enquiries going to (Contact Form Settings), and see step 8 below for setting it up to actually receive mail.
4. **TikTok and LinkedIn handles** — placeholders in the Socials list (`/admin` → Socials). Instagram (`@_.momo.inreallife`) is already real.
5. **"2 rounds of revisions"** — appears twice on the homepage (Services spread, both columns). Confirm this is your real revision policy, or change the number.
6. **FAQ: "How long does a project take?"** — currently says "[CONFIRM: X working days]". Fill in a real number.
7. **FAQ: "How many revisions do I get?"** — same as #5, confirm and remove the bracket.
8. **The homepage pull quote** is a placeholder testimonial and is switched **OFF**. Don't turn it on until you've replaced it with a real one (`/admin` → Homepage → Pull quote section).
9. **CIG Motors Nigeria, LagRide, TechSoma Africa** — added to the Brands list but switched **OFF**, since the brief flagged these need your permission before appearing publicly. Only switch one on once you've confirmed you can list them.
10. **The Editor's Letter** on the About page is a first draft written for you — rewrite it in your own words whenever you're ready (`/admin` → About → Editor's Letter section).
11. **Privacy page** — the "Last updated" date needs a real date once you launch (`/admin` → Contact page isn't it — this one's in the Privacy page text, which currently lives in `src/app/(site)/privacy/page.tsx`; ask your developer to update it, or mention it and it can be moved into the admin).

---

## Part 1 — Accounts you need to create

All of these have free plans that comfortably cover this site, and none of them start charging automatically if you go over — they just stop or ask you to upgrade. Section "Free plan limits" below has the specifics.

### 1. GitHub (holds the website's code)

1. Go to github.com and sign up (or use the existing account this code was pushed to).
2. Nothing else to do here — your developer handles code updates. You'll only ever need `/admin` and `/post`.

### 2. Sanity (your admin/content system)

1. Go to sanity.io and sign up — **use "Continue with Google"** and sign in with the Google account you want to use for the admin.
2. Once in, create a new project. Call it "MOVEL" (or anything you like).
3. Choose the **free plan**.
4. When asked for a dataset name, use `production`.
5. In your project's settings on sanity.io/manage, find your **Project ID** — you'll need to give this to your developer (or paste it into the `.env` file yourself if you're comfortable with that — see Part 3).
6. Still in sanity.io/manage → API → Tokens, create a new token with **Editor** permissions. Copy it somewhere safe immediately — Sanity only shows it once. This is your `SANITY_API_WRITE_TOKEN`.
7. **Turn on 2-step verification on this Google account.** This protects your entire content system. On google.com/account → Security → 2-Step Verification → follow the prompts.

### 3. Vercel (hosts the website)

The site's code lives on GitHub. Vercel is what actually runs it and serves it to visitors.

1. Go to vercel.com → sign up (using the same GitHub account this code is on makes this easiest — "Continue with GitHub").
2. **Add New → Project** → pick this repository from the list → Vercel auto-detects it's a Next.js app, you don't need to change any build settings.
3. Before clicking Deploy, add your environment variables — same values as your `.env` file (Part 3 below covers what each one is): open the "Environment Variables" section on that same screen and paste in each one (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_WRITE_TOKEN`, `OWNER_PASSCODE`, etc.).
4. Click **Deploy**. First deploy takes a couple of minutes. You'll get a `*.vercel.app` URL to test on immediately.
5. **Connect your domain:** Project → Settings → Domains → add `movelstudio.com`. Vercel shows you a DNS record to add (usually an A record for the root domain and a CNAME for `www`). Since your domain's DNS lives at Cloudflare (see next section), add that record there: Cloudflare dashboard → your site → DNS → Records → Add record, matching exactly what Vercel shows you.
6. Free plan note: Vercel's free "Hobby" tier is meant for personal/non-commercial projects. It's extremely common to run a small business site on it anyway and it's rarely an issue, but if Vercel ever flags it, the fix is upgrading to Pro ($20/month) — just something to know going in.
7. **Re-deploying after a code change:** if you're comfortable with git, `git push` to the connected branch and Vercel redeploys automatically — no command to remember. If someone else (a developer) maintains the code, this happens automatically whenever they push.

### 4. Cloudflare (domain DNS, spam protection, analytics)

1. Go to cloudflare.com and sign up (a personal email + password is fine, or Google sign-in).
2. Choose the **Free plan**.
3. **Move your domain's DNS to Cloudflare:**
   - In the Cloudflare dashboard, click "Add a site" and enter `movelstudio.com`.
   - Cloudflare will scan your current DNS records and show you a set of nameservers (two addresses like `xxx.ns.cloudflare.com`).
   - Go to wherever you bought movelstudio.com (your registrar — GoDaddy, Namecheap, etc.), find the DNS or Nameserver settings, and replace the existing nameservers with the two Cloudflare gives you.
   - This can take a few hours to a day to fully switch over. Cloudflare will email you once it's done.
5. **Turn off AI crawler blocking.** Cloudflare blocks some AI bots by default on new sites, which would stop ChatGPT, Perplexity, etc. from being able to read about you. In the dashboard: your site → Security → Bots (or "AI Crawl Control" if you see it) → make sure "Block AI Bots" is switched **off**, or set the AI crawlers rule to Allow.
6. **Turnstile (spam protection):** dashboard → Turnstile → Add a site → enter `movelstudio.com` → choose "Invisible" widget. You'll get a **Site Key** and a **Secret Key** — both go in your `.env` file (see Part 3).
7. **Web Analytics:** dashboard → Analytics & Logs → Web Analytics → Add a site → `movelstudio.com`. You'll get a token — put it in `.env` as `NEXT_PUBLIC_CF_BEACON_TOKEN`.
   - **Where to see your numbers:** same place, Analytics & Logs → Web Analytics, any time. No login needed for anyone but you.
8. **Optional — hello@movelstudio.com inbox:** dashboard → your site → Email → Email Routing → follow the setup (it asks you to add a couple of DNS records, which it does for you automatically since your domain is already on Cloudflare) → add a routing rule forwarding `hello@movelstudio.com` to whatever inbox you actually check (Gmail, etc.). Free, no new inbox to check separately.

### 5. Resend (sends the contact form emails)

1. Go to resend.com and sign up.
2. Free plan.
3. Domains → Add Domain → enter `movelstudio.com` → it'll show you a couple of DNS records to add. Since your domain is on Cloudflare, add these in Cloudflare's DNS settings (dashboard → your site → DNS → Add record, copy each one exactly as Resend shows it).
4. Once verified (can take a few minutes to a few hours), go to API Keys → Create API Key → copy it into `.env` as `RESEND_API_KEY`.

### 6. Choose your `/post` passcodes (no account needed)

`/post`, the quick-post screen for your phone, is protected by a passcode instead of a login system — one less account to set up. You just make these up yourself:

1. Pick a passcode for yourself — anything memorable, like a short phrase or PIN. This goes in `.env` as `OWNER_PASSCODE`.
2. Optional: pick a second passcode for an assistant, if you ever want someone to be able to post drafts for you to review. This goes in `.env` as `ASSISTANT_PASSCODE`. Leave it blank to keep assistant access off.
3. Generate one more random string for `POST_SESSION_SECRET` (this just keeps your sign-in secure — it's not something you type in). Any long random text works; if you're comfortable with a terminal, `openssl rand -base64 32` generates one.

You (or your developer) can change either passcode any time by editing these values in Vercel's dashboard (your project → Settings → Environment Variables) and redeploying — no need to come back to this guide.

---

## Part 2 — Free plan limits, and what happens if you hit them

| Service | Free limit (check the provider's site for the current number — these change) | What happens if you go over |
|---|---|---|
| Sanity | ~5GB of assets (images/video), 100k API requests/month, 3 admin users | Sanity pauses uploads/requests until you upgrade or the month resets — it does not silently start billing you. |
| Vercel (Hobby plan) | 100GB bandwidth/month, generous function usage for a site this size | Vercel emails you before anything's blocked. Hobby is meant for personal/non-commercial use — see the note in Part 1 about running a business site on it. |
| Resend | 3,000 emails/month, 100/day | Extra emails simply fail to send until the next day/month — no surprise bill. |
| Cloudflare Turnstile, Web Analytics, Email Routing, DNS | No meaningful free-tier limit for a site this size | — |

**None of these bill automatically.** If you ever outgrow a free tier, each service will tell you clearly and ask you to opt into a paid plan — nothing happens behind your back.

---

## Part 3 — Filling in `.env`

Your developer will do this if they're setting it up, but if you're doing it yourself:

1. Find the file called `.env.example` in the project folder.
2. Make a copy of it, name the copy `.env`.
3. Open `.env` in any text editor and fill in each value using what you collected in Part 1 (Sanity project ID and token, your `/post` passcodes, Resend API key, Turnstile keys).

---

## Part 4 — Seeding your content

This fills your Sanity project with all the starter text, pages, and placeholder media described in the brief, so the site looks complete from day one.

1. Make sure `.env` is filled in (Part 3).
2. Open a terminal in the project folder and run: `npm install` (only needed once), then `npm run seed`.
3. It'll take a few minutes — it's uploading every placeholder photo and video. You'll see it print progress as it goes.
4. Once done, visit `/admin` on your local site (or the deployed one) and you'll see everything: pages, projects, brands, FAQ, all editable.

---

## Part 5 — Deploying the site

This is covered in Part 1, section 3 (Vercel) above — connect the GitHub repo, paste in your environment variables, deploy, then add `movelstudio.com` as a domain in Vercel's project settings and point the DNS record it gives you from Cloudflare's DNS tab. Once that's done once, every future code change just needs a `git push` and Vercel redeploys automatically.

---

## Part 6 — Everyday use

### Editing content

Go to `movelstudio.com/manage`, sign in with your **owner passcode** (the same one you use for `/post`, not a Google sign-in). This is a custom editor built to match the site's own look, covering everything: Site Style, Homepage, About, Work, Contact, Projects, Brands, FAQ, Socials, and Contact Form Settings.

**Important difference from a typical CMS: there's no draft/preview step in `/manage`.** Hitting Save publishes immediately — there's no "preview it first, then publish" pause. If you want to see a big change (like a full page's sections) before it's real, the safest approach is to make the change, check the live site right after, and fix anything off from there — most edits are quick to reverse.

**One thing `/manage` can't do yet:** if a "Rich text" section already has photos, BTS clips, pull quotes, or logo rows woven into the paragraphs (the Editor's Letter on About is the one that might), `/manage` shows a notice instead of an editable box for that section's body, to avoid silently deleting those embedded items. For that specific case only, use the old editor:

Go to `movelstudio.com/admin`, sign in with Google (this one's Sanity's own hosted login, separate from your owner passcode). Find the page → the Rich text section → edit the body there as normal, including a **Presentation** preview before you publish, which `/manage` doesn't have. Everything else on the site is fine to edit from `/manage`.

### Posting new work from your phone

Go to `movelstudio.com/post` and enter your passcode (the one you set as `OWNER_PASSCODE`). Follow the steps on screen: pick a video (it compresses automatically on your phone — this can take a minute or two for a longer clip, keep the screen open), pick or type a brand, write your caption, optionally add a reasoning video, pick a thumbnail (or let it grab one automatically), decide if it should show on the homepage, preview it, then Publish. It appears at the top of the feed immediately.

### Letting someone else post for you (optional)

Give them the `ASSISTANT_PASSCODE` you set in `.env`. They sign into `/post` with it and can upload videos and write captions — but everything they submit saves as a **draft**. Nothing goes live until you open `/admin`, find it under Projects, review it, and publish it yourself. To turn this off later, just remove `ASSISTANT_PASSCODE` from your environment variables and redeploy.

### Replacing placeholders

- **Projects, reasoning videos, thumbnails:** `/admin` → Projects → open one → replace the video/thumbnail/reasoning fields, or just delete the placeholder projects and post real ones from `/post`.
- **Cover photo + cutout:** `/admin` → Homepage → Cover section. You need two things per device size (mobile and desktop): the full photo, and a "cutout" — just your figure with the background removed, saved as a transparent PNG.
- **Making a cover cutout on iPhone:** open the photo in the Photos app → touch and hold on yourself in the photo until it's outlined and lifts off the background → tap "Copy" (or the share icon → "Save as image") → this gives you a transparent PNG of just you, ready to upload as the cutout.
- **Intro video:** `/admin` → Intro Video → replace the video and poster image.
- **Logos:** `/admin` → Brands → open a brand → upload a transparent PNG or SVG logo. It'll be automatically recoloured to match the site.
- Every placeholder Project and Brand is tagged "Placeholder" in the admin so you can find them all quickly.

### Changing the look

`/admin` → Site Style. Pick new colours, pick fonts from the shortlist, save your combination as a named preset, or switch between saved presets. "Reset to original" brings back the default Cherry Editorial look. Everything previews before it goes live.

---

## A note on placeholder media

Every photo and video seeded onto this site right now is an abstract graphic (soft gradients in the site's own colours), not a real photograph — see `CREDITS.md` for exactly why, and the search terms the brief suggested for sourcing real replacements from Pexels or Unsplash (free licences only). Swap them in using the steps above whenever you're ready; nothing about the site's structure needs to change when you do.
