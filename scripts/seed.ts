import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
import { paragraphsToBlocks } from "./portableText";
import * as seed from "./seedData";
import { DEFAULT_THEME } from "../src/sanity/schemaTypes/documents/siteStyle";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error(
    "\nMissing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN.\n" +
      "Copy .env.example to .env, fill in your Sanity project details (see SETUP.md), then run again.\n"
  );
  process.exit(1);
}

const client = createClient({
  projectId, dataset, token,
  apiVersion: "2025-01-01",
  useCdn: false,
});

const MEDIA_ROOT = path.join(__dirname, "..", "seed-media");
const assetCache = new Map<string, string>();

async function uploadImage(relPath: string, alt?: string) {
  const cacheKey = `image:${relPath}`;
  let assetId = assetCache.get(cacheKey);
  if (!assetId) {
    const filePath = path.join(MEDIA_ROOT, relPath);
    const asset = await client.assets.upload("image", fs.createReadStream(filePath), {
      filename: path.basename(relPath),
    });
    assetId = asset._id;
    assetCache.set(cacheKey, assetId);
    console.log("  uploaded image", relPath);
  }
  return { _type: "image" as const, asset: { _type: "reference" as const, _ref: assetId }, alt };
}

async function uploadFile(relPath: string) {
  const cacheKey = `file:${relPath}`;
  let assetId = assetCache.get(cacheKey);
  if (!assetId) {
    const filePath = path.join(MEDIA_ROOT, relPath);
    const asset = await client.assets.upload("file", fs.createReadStream(filePath), {
      filename: path.basename(relPath),
    });
    assetId = asset._id;
    assetCache.set(cacheKey, assetId);
    console.log("  uploaded file", relPath);
  }
  return { _type: "file" as const, asset: { _type: "reference" as const, _ref: assetId } };
}

async function uploadSvgAsImage(relPath: string, alt?: string) {
  return uploadImage(relPath, alt);
}

function rank(index: number) {
  // Simple descending lexorank-ish string so seeded projects sort by `number`.
  return `zzz-${String(1000 - index).padStart(4, "0")}`;
}

async function main() {
  console.log("Seeding MOVEL content into Sanity project", projectId, `(${dataset})\n`);

  console.log("Brands…");
  const brandIds: Record<string, string> = {};
  for (const b of seed.brands) {
    const logo = b.logo ? await uploadSvgAsImage(b.logo, `${b.name} logo`) : undefined;
    const doc = await client.createOrReplace({
      _id: `brand-${b.key}`,
      _type: "brand",
      name: b.name,
      showOnSite: b.showOnSite,
      isPlaceholder: true,
      ...(logo ? { logo } : {}),
    });
    brandIds[b.key] = doc._id;
  }

  console.log("FAQ…");
  for (const [i, f] of seed.faqs.entries()) {
    await client.createOrReplace({
      _id: `faq-${i + 1}`,
      _type: "faq",
      question: f.question,
      answer: f.answer,
      showOnHomepage: f.showOnHomepage,
      showOnAbout: f.showOnAbout,
      order: f.order,
    });
  }

  console.log("Socials…");
  for (const [i, s] of seed.socials.entries()) {
    await client.createOrReplace({
      _id: `social-${i + 1}`,
      _type: "social",
      platform: s.platform,
      handle: s.handle,
      url: s.url,
      order: s.order,
    });
  }

  console.log("Contact Form Settings…");
  await client.createOrReplace({ _id: "contactSettings", _type: "contactSettings", ...seed.contactSettings });

  console.log("Site Style…");
  await client.createOrReplace({
    _id: "siteStyle",
    _type: "siteStyle",
    colors: DEFAULT_THEME.colors,
    fonts: DEFAULT_THEME.fonts,
    presets: [{ _type: "themePreset", _key: "cherry-editorial", name: DEFAULT_THEME.name, colors: DEFAULT_THEME.colors, fonts: DEFAULT_THEME.fonts }],
  });

  console.log("Site Settings…");
  await client.createOrReplace({
    _id: "siteSettings",
    _type: "siteSettings",
    siteName: "MOVEL",
    ownerName: "Mo",
    role: "Content Creator & Director",
    location: "Lagos, Nigeria",
    servicesSummary: [
      "In front of the camera: Mo writes the script and performs on camera as the brand's face.",
      "Behind the camera: Mo scripts and directs a brand's own founders, staff or talent on camera.",
      "Editing available as an add-on.",
    ],
    defaultSeo: {
      title: "Mo | Content Creator & Director in Lagos | MOVEL",
      description:
        "Mo is a Lagos-based content creator and director making short-form brand video, in front of the camera or behind it, for brands in Nigeria and worldwide.",
    },
    assistantAccessNote: "Set on the server, not here — see SETUP.md.",
  });

  console.log("Intro Video…");
  const introVideoFile = await uploadFile("intro/intro.mp4");
  const introPoster = await uploadImage("intro/poster.jpg", "Mo introducing MOVEL");
  await client.createOrReplace({ _id: "introVideo", _type: "introVideo", video: introVideoFile, poster: introPoster });

  console.log("Projects…");
  for (const p of seed.projects) {
    const video = await uploadFile(p.videoFile);
    const thumbnail = await uploadImage(p.thumbFile, `${seed.brands.find((b) => b.key === p.brandKey)?.name} — project thumbnail`);
    const reasoningVideo = p.reasoningFile ? await uploadFile(p.reasoningFile) : undefined;
    await client.createOrReplace({
      _id: `project-${p.number}`,
      _type: "project",
      orderRank: rank(p.number),
      number: p.number,
      slug: { _type: "slug", current: `project-${p.number}` },
      brand: { _type: "reference", _ref: brandIds[p.brandKey] },
      caption: p.caption,
      thumbnail,
      video,
      ...(reasoningVideo ? { reasoningVideo } : {}),
      showOnHomepage: p.showOnHomepage,
      orientation: p.orientation,
      isPlaceholder: true,
    });
  }

  console.log("About photos + BTS clips (used in the Editor's Letter)…");
  const aboutPhotos = await Promise.all(
    [1, 2, 3].map((i) => uploadImage(`about/about-${String(i).padStart(2, "0")}.jpg`, "Mo working on content"))
  );
  const btsClips = await Promise.all(
    [1, 2, 3].map(async (i) => ({
      video: await uploadFile(`bts/bts-${String(i).padStart(2, "0")}.mp4`),
      poster: await uploadImage(`bts/bts-${String(i).padStart(2, "0")}-poster.jpg`),
    }))
  );

  console.log("Homepage…");
  await client.createOrReplace({
    _id: "homePage",
    _type: "homePage",
    seo: {
      title: "Mo | Content Creator & Director in Lagos | MOVEL",
      description:
        "Mo is a Lagos-based content creator and director making short-form brand video, in front of the camera or behind it, for brands in Nigeria and worldwide.",
    },
    sections: [
      {
        _type: "sectionCover", _key: "cover", enabled: true, background: "paper",
        masthead: "MOVEL",
        issueLine: "No. 01 · Lagos",
        coverStar: "Mo",
        coverLines: [
          "The Director Issue",
          "Brand content, in front of the camera or behind it",
          "Watch the intro →",
          "Inside: scripts, shoots & staff who swore they weren't camera people",
        ],
        introLinkLineIndex: 3,
        imageMobile: await uploadImage("covers/cover-mobile.jpg", "Editorial portrait placeholder — replace with Mo's cover photo"),
        cutoutMobile: await uploadImage("covers/cutout-mobile.png"),
        imageDesktop: await uploadImage("covers/cover-desktop.jpg", "Editorial portrait placeholder — replace with Mo's cover photo"),
        cutoutDesktop: await uploadImage("covers/cutout-desktop.png"),
        livingCoverEnabled: false,
      },
      {
        _type: "sectionIntroVideo", _key: "intro", enabled: true, background: "ink",
        label: "The Intro",
        sideText: "One minute. Everything I do, done the way I'd do it for you.",
      },
      {
        _type: "sectionServicesSpread", _key: "services", enabled: true, background: "paper",
        sectionLabel: "What I Make",
        leftPage: {
          heading: "In front of the camera",
          intro: "I'm the face. I write the script, show up, and shoot content that sounds like your brand and looks like it belongs on the feed. You get videos people actually finish watching.",
          included: ["Concept and script", "On-camera performance", "Shoot", "Editing (add-on, or I send raw footage to your in-house editor)", "[CONFIRM] 2 rounds of revisions"],
        },
        rightPage: {
          heading: "Behind the camera",
          intro: "Your people are the face. Your founder, your staff, the team who swear they're \"not camera people.\" I plan it, script it, and direct them until they are.",
          included: ["Concept and script", "Directing your team or talent on set", "Shot planning", "Editing (add-on, or I send raw footage to your in-house editor)", "[CONFIRM] 2 rounds of revisions"],
        },
      },
      {
        _type: "sectionFeaturedWork", _key: "featured", enabled: true, background: "paper",
        heading: "The Work", subline: "Three to start. The rest is in the feed.", maxItems: 3, linkLabel: "See all work →",
      },
      {
        _type: "sectionBrandStrip", _key: "brandstrip", enabled: true, background: "soft",
        heading: "Brands I've created for",
      },
      {
        _type: "sectionPullQuote", _key: "pullquote", enabled: false, background: "soft",
        quote: "[CONFIRM: placeholder testimonial] Mo got our team comfortable on camera in one afternoon. The videos did the rest.",
        name: "Name Surname", role: "Marketing Lead, Sample Brand",
      },
      {
        _type: "sectionQuickAnswers", _key: "quickanswers", enabled: true, background: "paper",
        heading: "Quick answers", linkLabel: "More answers →",
      },
      {
        _type: "sectionClosingLine", _key: "closing", enabled: true, background: "ink",
        line: "Let's make something they'll stop scrolling for.", buttonLabel: "Work with Mo", buttonLink: "/contact",
      },
    ],
  });

  console.log("About…");
  const logoRowBrandRefs = ["fintech", "skincare", "ride", "foods", "fashion", "tech"].map((k) => ({
    _type: "reference" as const, _ref: brandIds[k], _key: k,
  }));
  await client.createOrReplace({
    _id: "aboutPage",
    _type: "aboutPage",
    seo: { title: "About Mo", description: "Content creator and director based in Lagos, Nigeria." },
    sections: [
      {
        _type: "sectionRichText", _key: "letter", enabled: true, background: "paper",
        heading: "Editor's Letter",
        body: [
          ...paragraphsToBlocks(seed.editorsLetterMarkdown, "letter"),
          { ...aboutPhotos[0], _type: "blockFigureImage", _key: "photo1" },
          { _type: "blockLogoRow", _key: "logos1", brands: logoRowBrandRefs },
          { _type: "blockBtsClip", _key: "bts1", video: btsClips[0].video, poster: btsClips[0].poster, caption: "Setting up a shot" },
        ],
        signatureText: "Mo",
      },
      {
        _type: "sectionPhotoText", _key: "photo2", enabled: true, background: "soft",
        image: aboutPhotos[1], heading: "On set", text: "Every shoot starts with a script written to be said out loud, not read.", imageSide: "left",
      },
      {
        _type: "sectionBtsGallery", _key: "btsgallery", enabled: true, background: "paper",
        heading: "Behind the scenes",
        clips: [
          { _type: "blockBtsClip", _key: "b1", video: btsClips[1].video, poster: btsClips[1].poster, caption: "Ring light on, ready to go" },
          { _type: "blockBtsClip", _key: "b2", video: btsClips[2].video, poster: btsClips[2].poster, caption: "Filming on the move" },
        ],
      },
      {
        _type: "sectionBrandStrip", _key: "brandstrip2", enabled: true, background: "soft",
        heading: "Brands I've created for",
      },
      {
        _type: "sectionFullFaq", _key: "fullfaq", enabled: true, background: "paper",
        heading: "The Practical Bits",
      },
    ],
  });

  console.log("Work…");
  await client.createOrReplace({
    _id: "workPage",
    _type: "workPage",
    heading: "The Work",
    subline: "Tap anything. Swipe through everything.",
    seo: { title: "The Work", description: "Every project Mo has made for brands — tap anything, swipe through everything." },
    sections: [],
  });

  console.log("Contact…");
  await client.createOrReplace({
    _id: "contactPage",
    _type: "contactPage",
    seo: { title: "Contact", description: "Tell Mo what you need — she'll get back to you within 48 hours." },
    sections: [
      {
        _type: "sectionContactForm", _key: "form", enabled: true, background: "paper",
        heading: "Let's make yours.",
        subline: "Tell me what you need. I'll get back to you within 48 hours with next steps and a quote.",
      },
    ],
  });

  console.log("\nDone. Visit /admin to see everything, or /work to see the seeded feed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
