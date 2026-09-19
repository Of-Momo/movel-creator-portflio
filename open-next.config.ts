import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config: no R2 incremental cache by default, so a first deploy
// doesn't require Mo to create an R2 bucket first. See SETUP.md for the
// optional upgrade once the basic site is live.
export default defineCloudflareConfig();
