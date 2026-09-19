# CREDITS

## Placeholder media

**None of the placeholder photos or videos in this build are real stock photography.** The brief asked for Pexels-licensed or standard-Unsplash-licensed media of young Black women in warm, editorial settings. The sandbox this site was built in has no access to `pexels.com`, `unsplash.com`, or their image/video CDNs (the outbound network policy blocks those hosts — confirmed by direct requests failing with a 403). So instead of guessing or faking a "stock photo," every placeholder is an **abstract, generated graphic** in the site's own colour palette (`scripts/generate_placeholder_media.py`, using Pillow + ffmpeg) — gradients, a soft vignette, and for video, a slow drifting/pulsing colour animation. Nothing pretends to be a real photo of a person.

This is the single biggest thing to finish before launch. It's listed first in `SETUP.md`'s CONFIRM checklist.

### Where to find real replacements

Use the search terms below on **pexels.com** or **unsplash.com** (standard/free licence only — never Unsplash+, Getty, iStock or Shutterstock), then upload the real files in `/admin` or `/post`, which will compress them automatically.

| Slot | Search terms |
|---|---|
| Cover (vertical) | "black woman editorial portrait beige", "african woman fashion portrait studio" |
| Cover (horizontal) | "black woman portrait wide studio" |
| Cover cutouts | Not sourced online — see "Making a cover cutout" in SETUP.md |
| Intro video | "woman talking to camera vertical", "vlogger speaking" |
| Project videos (8 vertical + 2 horizontal) | "vertical video woman product", "lifestyle vertical", "lagos city", "skincare vertical" |
| Reasoning videos | "woman explaining", "creative planning desk" |
| BTS clips | "filming with phone", "content creator setup" |
| About photos | "content creator working", "black woman laptop creative" |

Record the photographer and licence URL here as you replace each one, so this file stays a real credits list:

```
[slot] — [photographer name] — [Pexels/Unsplash URL]
```

## Placeholder brand logos

Six wordmark SVGs (`seed-media/logos/*.svg`) generated locally as plain text in the site's ink colour — no real brand's logo or trademark was used, per the brief's rule against using real brand assets.

## Fonts

Bodoni Moda, DM Sans, Pinyon Script and every font in the Site Style shortlist are loaded from **Google Fonts** at runtime (free, no attribution required beyond what Google Fonts itself asks).

## Icons

Line icons in the rich text editor and UI come from **Phosphor Icons** (MIT licence, free).
