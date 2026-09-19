# TESTING.md

A walk-through checklist for once the site is deployed. Do the phone section on an actual phone over normal mobile data (not wifi) if you can — that's the real test.

## On your phone

- [ ] Open movelstudio.com. The cover loads straight away — no spinner, no loading animation.
- [ ] The cover shows your photo with the masthead sitting behind you, and a slow zoom as it loads.
- [ ] Scroll down slowly — the cover has a subtle parallax feel, and the nav bar (MOVEL / Work / About / Contact) fades in once you're past the cover.
- [ ] Tap "Watch the intro →" on the cover — it scrolls down and starts playing, muted, with a "tap for sound" icon.
- [ ] Scroll past the intro without tapping play — it should autoplay once, muted, the first time it enters view. Reload the page and scroll to it again — this time it should NOT autoplay, just show a poster with a play button.
- [ ] Tap the "tap for sound" icon — sound turns on. Keep scrolling/navigating — it should stay on.
- [ ] Read through Services, Featured Work, Brands, Quick Answers, and the closing line — everything readable, nothing overlapping oddly.
- [ ] Tap a Featured Work thumbnail — it opens the full-screen reel feed at that video.
- [ ] Swipe up — moves to the next video smoothly.
- [ ] Read a caption — only 3 lines show, with "more". Tap it — the full caption expands in a sheet from the bottom.
- [ ] On a project with a reasoning video, tap "Watch my reasoning →" inside the expanded caption — it plays as an overlay. Close it — you're back at the exact same spot in the feed.
- [ ] Tap Share on a video — your phone's share sheet opens (or the link copies).
- [ ] Tap "Work with Mo" on the right rail — goes to Contact.
- [ ] Swipe through to the very end — see the "You're all caught up" card with a Work with Mo button.
- [ ] Press your phone's back button/gesture from inside the feed — it closes the viewer and returns to the Work grid (not to some other page).
- [ ] Copy a video's URL from the address bar, paste it fresh in a new tab — it opens directly at that video.
- [ ] Go to About — the Editor's Letter reads well, photos and BTS clips sit naturally in the text, BTS clips autoplay muted only while in view.
- [ ] Tap the intro link inside the About text — the intro plays as an overlay, right there on the page (no redirect).
- [ ] Scroll to the FAQ on About — tap a question, it expands.
- [ ] Go to Contact, fill in the form, and try **both** send buttons:
  - [ ] "Send on WhatsApp" opens WhatsApp with a neatly pre-filled message.
  - [ ] "Send by email" shows the thank-you screen once it succeeds.
- [ ] Try submitting the form with a required field empty — it should stop you, not send a broken enquiry.
- [ ] Visit a URL that doesn't exist (e.g. movelstudio.com/nonsense) — see the "out of print" 404 page.
- [ ] Paste the homepage link into a WhatsApp chat to yourself — a preview card with an image, title and description should appear.
- [ ] Check the browser tab icon (favicon) — a small "M", no box or circle around it.
- [ ] In your phone's accessibility settings, turn on "Reduce Motion", then reload the homepage — the zoom/parallax effects should be gone or much stiller.

## On a laptop / desktop browser

- [ ] Same walk-through as above, checking layout at a wide window — the reel feed should be centred with dark space either side, not stretched full-width.
- [ ] In the reel feed, test scroll wheel, arrow up/down keys, and the on-screen up/down arrows.
- [ ] Tab through the homepage using only the keyboard — every link and button should be reachable and show a visible focus state.
- [ ] Open dev tools, throttle to "Slow 3G", reload the homepage — it should still be usable; videos shouldn't start downloading until you scroll to them.
- [ ] Switch your OS to dark mode and check the favicon in the browser tab — it should switch to a cream "M".

## The admin (`/admin`)

- [ ] Sign in with Google.
- [ ] Edit any piece of text (e.g. the closing line), then open **Presentation** and confirm you see the real site with your unpublished change showing and a "Previewing unpublished changes" bar at the top — and that the change is NOT visible yet on the real site in a normal (non-preview) browser tab.
- [ ] Click "Exit preview" in that bar — confirms you're back to seeing the normal published site.
- [ ] Publish the change — it now shows on the real site.
- [ ] Switch a homepage section off, save/publish — it disappears from the live site. Switch it back on — it reappears.
- [ ] Drag two Projects into a different order in the Projects list — the Work grid and feed order updates to match after publishing.
- [ ] Go to Site Style, change a colour, save as a new preset, then switch back to "Cherry Editorial" — the site's colours should change accordingly after publish.
- [ ] Use "Reset to original" — confirms the default look comes back.

## The quick-post screen (`/post`)

- [ ] Enter your passcode (`OWNER_PASSCODE`).
- [ ] Upload a video from your camera roll, including at least one `.mov` file straight from an iPhone — it should compress with a visible progress bar ("Compressing… X%" then "Uploading… X%") without you having to do anything else.
- [ ] Try scrubbing to pick a thumbnail frame, and separately try uploading a thumbnail image — both should work.
- [ ] Leave the thumbnail step alone entirely and publish — a frame should be grabbed automatically so the post never looks blank.
- [ ] Type a brand new brand name instead of picking one from the list — it should show up correctly in the Brands list in `/admin` afterwards.
- [ ] Preview the post before publishing — it should look like how it'll actually appear in the feed.
- [ ] Publish — it should appear at the very top of the Work grid and feed.
- [ ] If `ASSISTANT_PASSCODE` is set: sign out, sign back in with that passcode, and publish something — it should NOT appear live; check `/admin` → Projects to confirm it saved as a draft awaiting your review.

## Known limitation of this checklist

This checklist was written by the person who built the site, but couldn't be run on a real phone, a real deployment, or a real Sanity project during the build (no live accounts existed yet — see `DECISIONS.md`). Treat the first full run-through as part of testing, not just a formality.
