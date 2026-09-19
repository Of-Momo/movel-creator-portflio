import type { Metadata } from "next";
import { SectionShell } from "@/components/ui/SectionShell";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How MOVEL handles the information you send through the contact form.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <SectionShell background="paper" className="pt-28 sm:pt-32">
      <div className="prose-editorial max-w-2xl">
        <h1 className="font-headline text-3xl italic sm:text-4xl">Privacy</h1>
        <p className="mt-6 leading-relaxed">
          This site collects only what you choose to send me through the contact form: your
          name, brand, contact details and project info. I use it to reply to you and prepare a
          quote. Nothing else.
        </p>
        <p className="mt-4 leading-relaxed">I don&rsquo;t sell or share your details with anyone.</p>
        <p className="mt-4 leading-relaxed">
          The site uses Cloudflare Web Analytics to count visits. It doesn&rsquo;t use cookies or
          track you across other sites.
        </p>
        <p className="mt-4 leading-relaxed">
          Form emails are delivered through a secure email service, and spam protection is
          provided by Cloudflare.
        </p>
        <p className="mt-4 leading-relaxed">
          I handle personal data in line with the Nigeria Data Protection Act 2023. If
          you&rsquo;d like me to delete anything you&rsquo;ve sent, email{" "}
          <a href="mailto:hello@movelstudio.com" className="underline">
            hello@movelstudio.com
          </a>
          .
        </p>
        <p className="mt-8 text-sm opacity-60">Last updated: [date of launch — set this in SETUP.md when you go live]</p>
      </div>
    </SectionShell>
  );
}
