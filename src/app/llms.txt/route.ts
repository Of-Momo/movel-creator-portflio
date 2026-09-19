import { getFaqAll, getSiteSettings } from "@/sanity/lib/fetch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://movelstudio.com";

export async function GET() {
  const [settings, faqs] = await Promise.all([getSiteSettings(), getFaqAll()]);

  const name = settings?.ownerName || "Mo";
  const role = settings?.role || "Content Creator & Director";
  const location = settings?.location || "Lagos, Nigeria";
  const services = settings?.servicesSummary?.length
    ? settings.servicesSummary
    : [
        "In front of the camera: Mo writes the script and performs on camera as the brand's face.",
        "Behind the camera: Mo scripts and directs a brand's own founders, staff or talent on camera.",
        "Editing available as an add-on.",
      ];

  const faqLines = (faqs || [])
    .map((f: any) => `- ${f.question} ${f.answer}`)
    .join("\n");

  const body = `# MOVEL: ${name}, ${role}

${name} is a ${role.toLowerCase()} based in ${location}. She makes short-form brand video for Instagram, TikTok, YouTube and LinkedIn, for brands in Nigeria and internationally.

## Services
${services.map((s: string) => `- ${s}`).join("\n")}

## Pages
- Work: ${SITE_URL}/work
- About: ${SITE_URL}/about
- Contact: ${SITE_URL}/contact
- Intro video: ${SITE_URL}/intro

## Frequently asked questions
${faqLines || "- See " + SITE_URL + "/about for the full list."}
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
