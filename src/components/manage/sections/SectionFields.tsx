"use client";

import { MediaUploadField } from "../fields/MediaUploadField";
import { StringListField } from "../fields/StringListField";
import { BtsClipsField } from "./BtsClipsField";
import { PricingRowsField } from "./PricingRowsField";
import { isSimpleBody, bodyToText, textToBody } from "@/lib/portableTextPlain";
import type { SectionType } from "@/lib/sectionTypes";

const inputClass = "w-full rounded border border-detail/40 bg-transparent px-3 py-2 text-sm outline-none focus:border-accent";

function Text({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} className={inputClass} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows} className={inputClass} />
    </label>
  );
}

function Num({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="opacity-70">{label}</span>
      <input type="number" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} className={inputClass} />
    </label>
  );
}

export function SectionFields({
  type,
  data,
  onChange,
}: {
  type: SectionType;
  data: Record<string, any>;
  onChange: (next: Record<string, any>) => void;
}) {
  const set = (patch: Record<string, any>) => onChange({ ...data, ...patch });

  switch (type) {
    case "sectionCover":
      return (
        <div className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Text label="Masthead" value={data.masthead} onChange={(v) => set({ masthead: v })} />
            <Text label="Issue line" value={data.issueLine} onChange={(v) => set({ issueLine: v })} />
            <Text label="Cover star name" value={data.coverStar} onChange={(v) => set({ coverStar: v })} />
            <Num label="Which cover line links to the intro? (1-based, blank = none)" value={data.introLinkLineIndex} onChange={(v) => set({ introLinkLineIndex: v })} />
          </div>
          <StringListField label="Cover lines" values={data.coverLines || []} onChange={(v) => set({ coverLines: v })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaUploadField label="Cover photo — mobile" kind="image" currentAssetRef={data.imageMobile?.asset?._ref} onUploaded={(ref) => set({ imageMobile: { asset: { _ref: ref }, alt: data.imageMobile?.alt || "" } })} />
            <MediaUploadField label="Cover photo — desktop" kind="image" currentAssetRef={data.imageDesktop?.asset?._ref} onUploaded={(ref) => set({ imageDesktop: { asset: { _ref: ref }, alt: data.imageDesktop?.alt || "" } })} />
            <MediaUploadField label="Mo cutout — mobile (transparent PNG)" kind="image" currentAssetRef={data.cutoutMobile?.asset?._ref} onUploaded={(ref) => set({ cutoutMobile: { asset: { _ref: ref } } })} />
            <MediaUploadField label="Mo cutout — desktop (transparent PNG)" kind="image" currentAssetRef={data.cutoutDesktop?.asset?._ref} onUploaded={(ref) => set({ cutoutDesktop: { asset: { _ref: ref } } })} />
          </div>
          <label className="flex items-center gap-1.5 text-xs">
            <input type="checkbox" checked={Boolean(data.livingCoverEnabled)} onChange={(e) => set({ livingCoverEnabled: e.target.checked })} />
            Living cover (looping video instead of a photo)
          </label>
          {data.livingCoverEnabled && (
            <div className="grid gap-4 sm:grid-cols-2">
              <MediaUploadField label="Living cover video — mobile" kind="video" currentAssetRef={data.livingCoverVideoMobile?.asset?._ref} onUploaded={(ref) => set({ livingCoverVideoMobile: { asset: { _ref: ref } } })} />
              <MediaUploadField label="Living cover video — desktop" kind="video" currentAssetRef={data.livingCoverVideoDesktop?.asset?._ref} onUploaded={(ref) => set({ livingCoverVideoDesktop: { asset: { _ref: ref } } })} />
            </div>
          )}
        </div>
      );

    case "sectionIntroVideo":
      return (
        <div className="flex flex-col gap-4">
          <Text label="Label" value={data.label} onChange={(v) => set({ label: v })} />
          <TextArea label="Text beside the video (desktop)" value={data.sideText} onChange={(v) => set({ sideText: v })} />
          <p className="text-xs opacity-60">Plays the video set in the Intro Video collection — nothing to upload here.</p>
        </div>
      );

    case "sectionServicesSpread":
      return (
        <div className="flex flex-col gap-4">
          <Text label="Section label" value={data.sectionLabel} onChange={(v) => set({ sectionLabel: v })} />
          {(["leftPage", "rightPage"] as const).map((side) => (
            <div key={side} className="flex flex-col gap-3 rounded border border-detail/20 p-3">
              <span className="text-xs uppercase tracking-widest opacity-60">{side === "leftPage" ? "Left page" : "Right page"}</span>
              <Text label="Heading" value={data[side]?.heading} onChange={(v) => set({ [side]: { ...data[side], heading: v } })} />
              <TextArea label="Intro paragraph" value={data[side]?.intro} onChange={(v) => set({ [side]: { ...data[side], intro: v } })} rows={3} />
              <StringListField label="Included" values={data[side]?.included || []} onChange={(v) => set({ [side]: { ...data[side], included: v } })} />
            </div>
          ))}
        </div>
      );

    case "sectionFeaturedWork":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <Text label="Subline" value={data.subline} onChange={(v) => set({ subline: v })} />
          <Num label="How many projects to show" value={data.maxItems} onChange={(v) => set({ maxItems: v })} />
          <Text label='Link label ("See all work →")' value={data.linkLabel} onChange={(v) => set({ linkLabel: v })} />
          <p className="col-span-full text-xs opacity-60">Automatically pulls projects marked &ldquo;Show on homepage&rdquo;, in their set order.</p>
        </div>
      );

    case "sectionBrandStrip":
      return (
        <div className="flex flex-col gap-2">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <p className="text-xs opacity-60">Pulls every brand marked &ldquo;Show on site&rdquo; from the Brands page.</p>
        </div>
      );

    case "sectionPullQuote":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <TextArea label="Quote" value={data.quote} onChange={(v) => set({ quote: v })} rows={3} />
          <div className="flex flex-col gap-4">
            <Text label="Name" value={data.name} onChange={(v) => set({ name: v })} />
            <Text label="Role / brand" value={data.role} onChange={(v) => set({ role: v })} />
          </div>
        </div>
      );

    case "sectionQuickAnswers":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <Text label="Link label" value={data.linkLabel} onChange={(v) => set({ linkLabel: v })} />
          <p className="col-span-full text-xs opacity-60">Pulls FAQ items marked &ldquo;Show on homepage&rdquo;.</p>
        </div>
      );

    case "sectionFullFaq":
      return (
        <div className="flex flex-col gap-2">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <p className="text-xs opacity-60">Pulls FAQ items marked &ldquo;Show on About&rdquo;, in order.</p>
        </div>
      );

    case "sectionClosingLine":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Line" value={data.line} onChange={(v) => set({ line: v })} />
          <Text label="Button label" value={data.buttonLabel} onChange={(v) => set({ buttonLabel: v })} />
          <label className="flex flex-col gap-1 text-sm">
            <span className="opacity-70">Button goes to</span>
            <select value={data.buttonLink || "/contact"} onChange={(e) => set({ buttonLink: e.target.value })} className={inputClass}>
              <option value="/contact">Contact</option>
              <option value="/work">Work</option>
              <option value="/about">About</option>
            </select>
          </label>
        </div>
      );

    case "sectionRichText": {
      const simple = isSimpleBody(data.body || []);
      return (
        <div className="flex flex-col gap-4">
          <Text label="Heading (optional)" value={data.heading} onChange={(v) => set({ heading: v })} />
          {simple ? (
            <TextArea
              label="Body (separate paragraphs with a blank line)"
              value={bodyToText(data.body || [])}
              onChange={(v) => set({ body: textToBody(v) })}
              rows={10}
            />
          ) : (
            <div className="rounded border border-detail/30 bg-detail/5 p-3 text-sm opacity-70">
              This section has photos, clips, or pull quotes embedded in the text — those can&rsquo;t be edited here
              yet. Use Sanity Studio (<code>/admin</code>) for this specific section for now; nothing here will be
              lost by editing the heading or other fields.
            </div>
          )}
          <Text label="Signature sign-off (Pinyon Script)" value={data.signatureText} onChange={(v) => set({ signatureText: v })} />
        </div>
      );
    }

    case "sectionPhotoText":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <MediaUploadField label="Photo" kind="image" currentAssetRef={data.image?.asset?._ref} onUploaded={(ref) => set({ image: { asset: { _ref: ref }, alt: data.image?.alt || "" } })} />
          <div className="flex flex-col gap-4">
            <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
            <TextArea label="Text" value={data.text} onChange={(v) => set({ text: v })} rows={4} />
            <label className="flex flex-col gap-1 text-sm">
              <span className="opacity-70">Image side (desktop)</span>
              <select value={data.imageSide || "left"} onChange={(e) => set({ imageSide: e.target.value })} className={inputClass}>
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </label>
          </div>
        </div>
      );

    case "sectionBtsGallery":
      return (
        <div className="flex flex-col gap-4">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <BtsClipsField clips={data.clips || []} onChange={(v) => set({ clips: v })} />
        </div>
      );

    case "sectionContactForm":
      return (
        <div className="flex flex-col gap-4">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <TextArea label="Subline" value={data.subline} onChange={(v) => set({ subline: v })} rows={2} />
          <p className="text-xs opacity-60">Field labels, options, WhatsApp number and email live in Contact Form Settings.</p>
        </div>
      );

    case "sectionReasoningGallery":
      return (
        <div className="grid gap-4 sm:grid-cols-2">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <Text label="Subline" value={data.subline} onChange={(v) => set({ subline: v })} />
        </div>
      );

    case "sectionPricing":
      return (
        <div className="flex flex-col gap-4">
          <Text label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} />
          <PricingRowsField rows={data.rows || []} onChange={(v) => set({ rows: v })} />
        </div>
      );
  }
}
