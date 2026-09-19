import type { ContactSettings, Section } from "@/lib/types";
import { ContactForm } from "@/components/contact/ContactForm";

export function ContactFormSection({
  data,
  settings,
}: {
  data: Section;
  settings: ContactSettings | null;
}) {
  return (
    <div>
      <h2 className="font-headline text-3xl italic sm:text-5xl">{data.heading as string}</h2>
      {Boolean(data.subline) && <p className="mt-3 max-w-lg opacity-80">{data.subline as string}</p>}
      <div className="mt-10">
        <ContactForm settings={settings} />
      </div>
    </div>
  );
}
