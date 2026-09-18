import { urlForImage } from "@/sanity/lib/image";
import type { SanityImage } from "@/lib/types";

export function RecoloredLogo({
  logo,
  name,
  color = "currentColor",
  className = "",
}: {
  logo?: SanityImage;
  name: string;
  color?: string;
  className?: string;
}) {
  const src = urlForImage(logo)?.width(400).url();
  if (!src) {
    return (
      <span className={`font-headline text-sm uppercase tracking-[0.12em] ${className}`} style={{ color }}>
        {name}
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label={name}
      className={`inline-block ${className}`}
      style={{
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        maskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}
