import type { Metadata } from "next";
import { getSettings, listPublishedPosts } from "@/lib/store";
import { Lens } from "@/components/home/Lens";
import { BookHint } from "@/components/home/BookHint";
import type { Post } from "@/lib/types";

// Re-render hourly so the essays linked from the lens stay current.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About",
  description: "The four subjects Jithendra Sai Kilaru reads for the logic underneath: startups, business models, emerging technology, and strategy and geopolitics.",
};

const toLink = (post?: Post) => (post ? { title: post.title, href: `/writing/${post.slug}` } : undefined);

export default async function AboutPage() {
  const [posts, settings] = await Promise.all([listPublishedPosts(), getSettings()]);
  // Each subject links to the essay chosen for it in admin.
  const essayLinks = Object.fromEntries(
    settings.copy.lens.subjects.map((subject) => [
      subject.title,
      toLink(subject.essay ? posts.find((p) => p.slug === subject.essay) : undefined),
    ]),
  );

  return (
    <>
      <Lens essayLinks={essayLinks} subjects={settings.copy.lens.subjects} />
      <BookHint book={settings.copy.book} />
    </>
  );
}
