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

### 3. Cloudflare (hosts the website, handles the domain, spam protection, analytics)

1. Go to cloudflare.com and sign up (a personal email + password is fine, or Google sign-in).
2. Choose the **Free plan**.
3. You'll set up the actual site hosting with your developer (it involves a command-line deploy step: `npm run cf:deploy`). Once deployed once, Cloudflare gives you a dashboard where you can see traffic, and re-deploys are just re-running that command.
4. **Move your domain's DNS to Cloudflare:**
   - In the Cloudflare dashboard, click "Add a site" and enter `movelstudio.com`.
   - Cloudflare will scan your current DNS records and show you a set of nameservers (two addresses like `xxx.ns.cloudflare.com`).
   - Go to wherever you bought movelstudio.com (your registrar — GoDaddy, Namecheap, etc.), find the DNS or Nameserver settings, and replace the existing nameservers with the two Cloudflare gives you.
   - This can take a few hours to a day to fully switch over. Cloudflare will email you once it's done.
5. **Turn off AI crawler blocking.** Cloudflare blocks some AI bots by default on new sites, which would stop ChatGPT, Perplexity, etc. from being able to read about you. In the dashboard: your site → Security → Bots (or "AI Crawl Control" if you see it) → make sure "Block AI Bots" is switched **off**, or set the AI crawlers rule to Allow.
6. **Turnstile (spam protection):** dashboard → Turnstile → Add a site → enter `movelstudio.com` → choose "Invisible" widget. You'll get a **Site Key** and a **Secret Key** — both go in your `.env` file (see Part 3).
7. **Web Analytics:** dashboard → Analytics & Logs → Web Analytics → Add a site → `movelstudio.com`. You'll get a token — put it in `.env` as `NEXT_PUBLIC_CF_BEACON_TOKEN`.
   - **Where to see your numbers:** same place, Analytics & Logs → Web Analytics, any time. No login needed for anyone but you.
8. **Optional — hello@movelstudio.com inbox:** dashboard → your site → Email → Email Routing → follow the setup (it asks you to add a couple of DNS records, which it does for you automatically since your domain is already on Cloudflare) → add a routing rule forwarding `hello@movelstudio.com` to whatever inbox you actually check (Gmail, etc.). Free, no new inbox to check separately.

### 4. Resend (sends the contact form emails)

1. Go to resend.com and sign up.
2. Free plan.
3. Domains → Add Domain → enter `movelstudio.com` → it'll show you a couple of DNS records to add. Since your domain is on Cloudflare, add these in Cloudflare's DNS settings (dashboard → your site → DNS → Add record, copy each one exactly as Resend shows it).
4. Once verified (can take a few minutes to a few hours), go to API Keys → Create API Key → copy it into `.env` as `RESEND_API_KEY`.

### 5. Google Cloud (lets you sign into `/post` with your Google account)

1. Go to console.cloud.google.com, sign in with the same Google account as your Sanity admin.
2. Create a new project (top left, "New Project"), call it "MOVEL".
3. Go to "APIs & Services" → "OAuth consent screen" → choose "External" → fill in the app name (MOVEL) and your email, save through the prompts.
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID" → Application type: "Web application".
5. Under "Authorized redirect URIs" add: `https://movelstudio.com/api/auth/callback/google`
6. Click Create. Copy the **Client ID** and **Client Secret** into `.env` as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

## Part 2 — Free plan limits, and what happens if you hit them

| Service | Free limit (check the provider's site for the current number — these change) | What happens if you go over |
|---|---|---|
| Sanity | ~5GB of assets (images/video), 100k API requests/month, 3 admin users | Sanity pauses uploads/requests until you upgrade or the month resets — it does not silently start billing you. |
| Cloudflare Workers | 100,000 requests/day | Requests over the limit are blocked for the rest of the day, not billed, unless you explicitly enable a paid plan. |
| Resend | 3,000 emails/month, 100/day | Extra emails simply fail to send until the next day/month — no surprise bill. |
| Cloudflare Turnstile, Web Analytics, Email Routing | No meaningful free-tier limit for a site this size | — |
| Google OAuth (sign-in) | No practical limit for a handful of users | — |

**None of these bill automatically.** If you ever outgrow a free tier, each service will tell you clearly and ask you to opt into a paid plan — nothing happens behind your back.

---

## Part 3 — Filling in `.env`

Your developer will do this if they're setting it up, but if you're doing it yourself:

1. Find the file called `.env.example` in the project folder.
2. Make a copy of it, name the copy `.env`.
3. Open `.env` in any text editor and fill in each value using what you collected in Part 1 (Sanity project ID and token, Google client ID/secret, Resend API key, Turnstile keys).

---

## Part 4 — Seeding your content

This fills your Sanity project with all the starter text, pages, and placeholder media described in the brief, so the site looks complete from day one.

1. Make sure `.env` is filled in (Part 3).
2. Open a terminal in the project folder and run: `npm install` (only needed once), then `npm run seed`.
3. It'll take a few minutes — it's uploading every placeholder photo and video. You'll see it print progress as it goes.
4. Once done, visit `/admin` on your local site (or the deployed one) and you'll see everything: pages, projects, brands, FAQ, all editable.

---

## Part 5 — Deploying the site

1. In the project folder: `npm run cf:build` then `npm run cf:deploy`. The first time, it'll ask you to log into Cloudflare in your browser.
2. Once deployed, Cloudflare gives you a `*.workers.dev` URL to test on immediately.
3. To connect it to `movelstudio.com`, go to the Cloudflare dashboard → Workers & Pages → your MOVEL project → Custom Domains → add `movelstudio.com`.

**Optional performance upgrade, once the basic site is live:** add an R2 bucket for faster repeat page loads. Run `npx wrangler r2 bucket create movel-portfolio-opennext-cache`, then uncomment the R2 section in `wrangler.jsonc` (or ask your developer to) and redeploy. Cloudflare's R2 free tier (10GB storage) comfortably covers this.

---

## Part 6 — Everyday use

### Editing content

Go to `movelstudio.com/admin`, sign in with Google. Everything — text, images, videos, colours, fonts, the FAQ, the sections on every page — is editable there. Changes show a **preview** before you publish; nothing goes live until you hit Publish, and the live site updates within a minute or two after.

### Posting new work from your phone

Go to `movelstudio.com/post`, sign in with Google. Follow the steps on screen: pick a video (it compresses automatically on your phone — this can take a minute or two for a longer clip, keep the screen open), pick or type a brand, write your caption, optionally add a reasoning video, pick a thumbnail (or let it grab one automatically), decide if it should show on the homepage, preview it, then Publish. It appears at the top of the feed immediately.

### Letting someone else post for you (optional)

`/admin` → Site Settings → Assistant Access. Switch it on, add their Google email address to the list. They can now sign into `/post` and upload videos and write captions — but everything they submit saves as a **draft**. Nothing goes live until you open `/admin`, find it under Projects, review it, and publish it yourself.

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
