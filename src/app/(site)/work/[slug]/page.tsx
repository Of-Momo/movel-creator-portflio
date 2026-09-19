import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjectsForFeed, getProjectBySlug } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { splitCaption } from "@/lib/caption";
import { ReelFeed } from "@/components/reel/ReelFeed";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  const { short } = splitCaption(project.caption || "");
  const image = urlForImage(project.thumbnail)?.width(1200).height(630).url();
  const title = `${project.brand?.name || "MOVEL"} × Mo`;
  return {
    title,
    description: short,
    openGraph: { title, description: short, images: image ? [image] : undefined },
    twitter: { card: "summary_large_image", title, description: short, images: image ? [image] : undefined },
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function ProjectFeedPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ reasoning?: string }>;
}) {
  const { slug } = await params;
  const { reasoning } = await searchParams;
  const [projects, project] = await Promise.all([getAllProjectsForFeed(), getProjectBySlug(slug)]);

  if (!project) notFound();

  const { short } = splitCaption(project.caption || "");
  const videoJsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: `${project.brand?.name} × Mo`,
    description: short,
    thumbnailUrl: urlForImage(project.thumbnail)?.width(800).url(),
    uploadDate: project._createdAt,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd) }} />
      <ReelFeed projects={projects} initialSlug={slug} openReasoningOnMount={reasoning === "1"} />
    </>
  );
}
