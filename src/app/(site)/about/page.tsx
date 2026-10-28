import type { Metadata } from "next";
import { listPublishedPosts } from "@/lib/store";
import { Lens } from "@/components/home/Lens";
import { Timeline } from "@/components/home/Timeline";
import type { Post } from "@/lib/types";

// Re-render hourly so the essays linked from the lens stay current.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "The four subjects Jithendra Sai Kilaru reads, and the path from SRM University to Founder's Office at openCT.",
};

/** The essay each lens panel points to, matched by a phrase in its slug. */
const LENS_ESSAY: Record<string, string> = {
  Startups: "founders-mindset",
  "Business models": "simple-idea-is-transforming",
  "Emerging technology": "wand-and-block-max",
  "Strategy and geopolitics": "putin-in-delhi",
};

const toLink = (post?: Post) => (post ? { title: post.title, href: `/writing/${post.slug}` } : undefined);

export default async function AboutPage() {
  const posts = await listPublishedPosts();
  const essayLinks = Object.fromEntries(
    Object.entries(LENS_ESSAY).map(([panel, phrase]) => [panel, toLink(posts.find((p) => p.slug.includes(phrase)))]),
  );

  return (
    <>
      <Lens essayLinks={essayLinks} />
      <Timeline />
    </>
  );
}
