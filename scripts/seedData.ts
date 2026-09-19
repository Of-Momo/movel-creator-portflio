// All seed text is transcribed from the build brief, section 7, as close to
// verbatim as possible. [CONFIRM] items are seeded exactly as the brief
// shows them (see SETUP.md's CONFIRM checklist) except where a literal
// [CONFIRM] tag would break a functional field (phone numbers, handles) —
// those get an obvious placeholder instead, flagged in SETUP.md.

export const brands = [
  { key: "fintech", name: "Sample Fintech", logo: "logos/sample-fintech.svg", showOnSite: true },
  { key: "skincare", name: "Sample Skincare Co.", logo: "logos/sample-skincare-co.svg", showOnSite: true },
  { key: "ride", name: "Sample Ride", logo: "logos/sample-ride.svg", showOnSite: true },
  { key: "foods", name: "Sample Foods", logo: "logos/sample-foods.svg", showOnSite: true },
  { key: "fashion", name: "Sample Fashion House", logo: "logos/sample-fashion-house.svg", showOnSite: true },
  { key: "tech", name: "Sample Tech", logo: "logos/sample-tech.svg", showOnSite: true },
  { key: "cig", name: "CIG Motors Nigeria", logo: null, showOnSite: false },
  { key: "lagride", name: "LagRide", logo: null, showOnSite: false },
  { key: "techsoma", name: "TechSoma Africa", logo: null, showOnSite: false },
];

export const faqs = [
  {
    question: "Do you write the scripts?",
    answer: "Yes. I write every script unless you'd rather send your own. If you do, I'll adapt it so it sounds natural on camera.",
    showOnHomepage: true, showOnAbout: true, order: 1,
  },
  {
    question: "Can you direct our team instead of being on camera yourself?",
    answer: "Yes. I can script and direct your founders, staff, or talent on camera, even if they've never done it before.",
    showOnHomepage: true, showOnAbout: true, order: 2,
  },
  {
    question: "Do you work with brands outside Nigeria?",
    answer: "Yes. I'm based in Lagos and work with brands locally and internationally. On-camera content is shot here and delivered digitally.",
    showOnHomepage: true, showOnAbout: true, order: 3,
  },
  {
    question: "How long does a project take?",
    answer: "It depends on how many videos you need. Most projects take [CONFIRM: X working days] from approved script to final delivery.",
    showOnHomepage: true, showOnAbout: true, order: 4,
  },
  {
    question: "Do you edit the videos?",
    answer: "Editing is available as an add-on. If you have an in-house editor, I'll send the raw footage with notes.",
    showOnHomepage: false, showOnAbout: true, order: 5,
  },
  {
    question: "How many revisions do I get?",
    answer: "[CONFIRM: Two rounds of revisions are included.] Extra rounds can be added.",
    showOnHomepage: false, showOnAbout: true, order: 6,
  },
  {
    question: "Which platforms do you create for?",
    answer: "Instagram, TikTok, YouTube and LinkedIn. Every video is delivered in the right format for where it's going.",
    showOnHomepage: false, showOnAbout: true, order: 7,
  },
  {
    question: "Who owns the content?",
    answer: "Usage rights are agreed in your quote. Tell me where and for how long you plan to use the content, and I'll price it in.",
    showOnHomepage: false, showOnAbout: true, order: 8,
  },
  {
    question: "How does pricing work?",
    answer: "Every project is quoted based on your deliverables. Send your brief through the contact page and I'll send you a rate document.",
    showOnHomepage: false, showOnAbout: true, order: 9,
  },
  {
    question: "How do we get started?",
    answer: "Fill in the contact form or message me on WhatsApp. I'll reply within 48 hours.",
    showOnHomepage: false, showOnAbout: true, order: 10,
  },
];

export const socials = [
  { platform: "Instagram", handle: "@_.momo.inreallife", url: "https://instagram.com/_.momo.inreallife", order: 1 },
  { platform: "TikTok", handle: "@momo [CONFIRM]", url: "https://tiktok.com/@momo", order: 2 },
  { platform: "LinkedIn", handle: "Mo [CONFIRM]", url: "https://linkedin.com/in/mo", order: 3 },
];

interface ProjectSeed {
  number: number;
  brandKey: string;
  orientation: "vertical" | "horizontal";
  showOnHomepage: boolean;
  hasReasoning: boolean;
  caption: string;
  videoFile: string;
  thumbFile: string;
  reasoningFile?: string;
}

export const projects: ProjectSeed[] = [
  {
    number: 1, brandKey: "fintech", orientation: "vertical", showOnHomepage: true, hasReasoning: true,
    videoFile: "projects/project-01.mp4", thumbFile: "projects/project-01-thumb.jpg", reasoningFile: "reasoning/reasoning-01.mp4",
    caption: `Saving money, explained like your smartest friend would. Scripted, shot and performed in one day.
---
The brief: make a savings feature feel exciting to people who've never trusted a bank app. I wrote it around one real moment everyone knows: payday, and the money disappearing by the 5th. Hook in the first two seconds, product by second eight.
Watch my reasoning →`,
  },
  {
    number: 2, brandKey: "skincare", orientation: "vertical", showOnHomepage: true, hasReasoning: false,
    videoFile: "projects/project-02.mp4", thumbFile: "projects/project-02-thumb.jpg",
    caption: `Morning routine, zero script-reading energy. Just me, good light, and a product I'd actually use.
---
Shot in natural window light to keep it honest. Scripted, but written to sound unscripted. That's the whole trick.`,
  },
  {
    number: 3, brandKey: "ride", orientation: "vertical", showOnHomepage: true, hasReasoning: true,
    videoFile: "projects/project-03.mp4", thumbFile: "projects/project-03-thumb.jpg", reasoningFile: "reasoning/reasoning-02.mp4",
    caption: `Directed their drivers for a series about the people behind the wheel. None of them had been on camera before.
---
Behind the camera for this one. I planned each shot around what the drivers were comfortable with, then pushed a little further each take. By the third video, they were directing me.
Watch my reasoning →`,
  },
  {
    number: 4, brandKey: "foods", orientation: "vertical", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-04.mp4", thumbFile: "projects/project-04-thumb.jpg",
    caption: `A launch video that makes you hungry by second three.
---
Short, fast, sound-on. Written for TikTok first, then cut down for Instagram.`,
  },
  {
    number: 5, brandKey: "fashion", orientation: "horizontal", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-05.mp4", thumbFile: "projects/project-05-thumb.jpg",
    caption: `A campaign film for their new collection. Directed, scripted, and styled around one idea: Lagos after dark.
---
Wide format for YouTube and their website. Directed their in-house models and shot over two evenings.`,
  },
  {
    number: 6, brandKey: "tech", orientation: "vertical", showOnHomepage: false, hasReasoning: true,
    videoFile: "projects/project-06.mp4", thumbFile: "projects/project-06-thumb.jpg", reasoningFile: "reasoning/reasoning-03.mp4",
    caption: `Turning a very technical product into a 30-second story anyone can follow.
---
The founder had 12 features to explain. We picked one. I scripted the rest into a series.
Watch my reasoning →`,
  },
  {
    number: 7, brandKey: "fintech", orientation: "vertical", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-07.mp4", thumbFile: "projects/project-07-thumb.jpg",
    caption: `Part two of the series. Same energy, new problem: splitting bills with friends.
---
Built as a recurring series so the audience knows what's coming and comes back for it.`,
  },
  {
    number: 8, brandKey: "skincare", orientation: "vertical", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-08.mp4", thumbFile: "projects/project-08-thumb.jpg",
    caption: `Staff content with their customer care team. Real people, real answers, no teleprompter.
---
Directed four team members through quick-fire customer questions. Warm, funny, and very them.`,
  },
  {
    number: 9, brandKey: "ride", orientation: "horizontal", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-09.mp4", thumbFile: "projects/project-09-thumb.jpg",
    caption: `A brand explainer for their website and LinkedIn. Clean, calm, and straight to the point.
---
Scripted and directed for a professional audience, with the same storytelling as the social content.`,
  },
  {
    number: 10, brandKey: "tech", orientation: "vertical", showOnHomepage: false, hasReasoning: false,
    videoFile: "projects/project-10.mp4", thumbFile: "projects/project-10-thumb.jpg",
    caption: `Launch day announcement. One take energy, three drafts of script.
---
Written to feel spontaneous, planned down to the second.`,
  },
];

export const contactSettings = {
  whatsappNumber: "+2340000000000",
  email: "hello@movelstudio.com",
  responseTimeHours: 48,
  labels: {
    name: "Name", brand: "Brand", contact: "Email or WhatsApp", service: "Service",
    videos: "How many videos", platforms: "Platforms", timeline: "Timeline",
    message: "Short message about the project", budget: "Budget in mind",
  },
  serviceOptions: ["On camera", "Behind the camera", "Both"],
  platformOptions: ["Instagram", "TikTok", "YouTube", "LinkedIn", "Other"],
  autoReply: {
    subject: "Got it. Your brief is with Mo.",
    body: "Hi {name},\n\nThanks for reaching out about {brand}. Your brief is in, and I'll get back to you within 48 hours with next steps and a quote.\n\nWhile you wait, the feed's still running: movelstudio.com/work\n\nMo\nMOVEL · movelstudio.com",
  },
  notifySubjectTemplate: "New enquiry: {brand} ({service})",
  thankYou: {
    heading: "Got it. Your brief is in.",
    body: "I'll get back to you within 48 hours. In the meantime, the feed's still running.",
    buttonLabel: "Back to the work",
  },
  whatsappTemplate:
    "Hi Mo! New project enquiry from movelstudio.com\n\nName: {name}\nBrand: {brand}\nContact: {contact}\nService: {service}\nVideos: {videos}\nPlatforms: {platforms}\nTimeline: {timeline}\nBudget: {budget}\n\n{message}",
};

export const editorsLetterMarkdown = `Hi, I'm Mo.

I've been writing since primary school. Somewhere along the way, the stories stopped staying on paper. Now I write them, direct them, and most days, I'm in them.

I make short-form video for brands. Sometimes I'm the face. Sometimes your team is, and I'm behind the camera getting your most camera-shy staff to relax and sound like themselves.

I've made content for cars, ride-hailing and tech. It taught me that every brand has a story more interesting than its ad. My job is finding it... and making people stop scrolling for it.

If you haven't watched my intro yet, {{INTRO_LINK:start there}}. It's one minute, and it says it better than this letter does.

Then have a look through the work. When you're ready, let's talk.

See you on the feed,`;
