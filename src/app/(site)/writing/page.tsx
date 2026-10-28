import type { Metadata } from "next";
import { listPublishedPosts } from "@/lib/store";
import { WritingIndex } from "@/components/writing/WritingIndex";

// Re-render hourly so a signal with an end date switches itself off on time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Writing",
  description: "Rising Ideas editions and essays by Jithendra Sai Kilaru on technology, business, startups and geopolitics.",
};

export default async function WritingPage() {
  const posts = await listPublishedPosts();
  const items = posts.map((p) => ({
    slug: p.slug,
    kind: p.kind,
    title: p.title,
    date: p.date,
    topic: p.topic,
    excerpt: p.excerpt,
    editionNumber: p.editionNumber,
    source: p.body ? undefined : p.externalLabel,
  }));

  return (
    <div className="px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <div className="mx-auto max-w-[1440px]">
        <h1 className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-[-0.045em]">Writing</h1>
        <p className="mt-6 max-w-[52ch] text-xl leading-relaxed text-ink-soft">
          Rising Ideas editions and essays on technology, business, startups, geopolitics and politics. Newest first.
        </p>
        <div className="mt-16">
          <WritingIndex items={items} />
        </div>
      </div>
    </div>
  );
}
