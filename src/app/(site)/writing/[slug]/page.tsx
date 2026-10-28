import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, listPublishedPosts, getSettings } from "@/lib/store";
import { renderMarkdown, estimateReadMinutes } from "@/lib/markdown";
import { formatDate } from "@/lib/format";
import { ReadingProgress } from "@/components/writing/ReadingProgress";

// Pre-render published pieces; new ones render on first visit and refresh hourly.
export const revalidate = 3600;

export const generateStaticParams = async () => (await listPublishedPosts()).map((post) => ({ slug: post.slug }));

export const generateMetadata = async ({ params }: PageProps<"/writing/[slug]">): Promise<Metadata> => {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date },
  };
};

export default async function PostPage({ params }: PageProps<"/writing/[slug]">) {
  const { slug } = await params;
  const [post, posts, settings] = await Promise.all([getPostBySlug(slug), listPublishedPosts(), getSettings()]);
  if (!post) notFound();

  const index = posts.findIndex((p) => p.slug === post.slug);
  const next = posts[index + 1] ?? posts[0];
  const minutes = post.body ? estimateReadMinutes(post.body) : null;

  return (
    <article className="px-5 pb-28 pt-36 md:px-10 md:pt-44">
      <ReadingProgress />
      <header className="mx-auto max-w-[1100px]">
        <p className="text-sm text-ink-soft">
          <Link href="/writing" className="underline-offset-4 hover:underline">
            Writing
          </Link>
          <span className="mx-2 text-rule">/</span>
          {post.kind === "edition" ? (
            <span className="font-display italic text-rising-ink">
              Rising Ideas{post.editionNumber ? ` No. ${post.editionNumber}` : ""}
            </span>
          ) : (
            post.topic
          )}
        </p>
        <h1 className="font-display mt-6 text-[clamp(2.4rem,6vw,5.6rem)] leading-[0.98] tracking-[-0.035em]">{post.title}</h1>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-ink/15 py-4 text-sm text-ink-soft">
          <span>By Jithendra Sai Kilaru</span>
          <time dateTime={post.date} className="tabular">
            {formatDate(post.date)}
          </time>
          {minutes && <span>{minutes} min read</span>}
        </div>
      </header>

      {post.coverImage && (
        <div className="relative mx-auto mt-12 aspect-[16/9] max-w-[1100px] overflow-hidden rounded-[2px]">
          <Image src={post.coverImage} alt="" fill sizes="(min-width: 1100px) 1100px, 100vw" className="object-cover" priority />
        </div>
      )}

      <div className="mx-auto mt-14 max-w-[68ch]">
        {post.body ? (
          <div className="prose-journal" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
        ) : (
          <div className="prose-journal">
            <p>{post.excerpt}</p>
            {post.pullQuote && <blockquote>&ldquo;{post.pullQuote}&rdquo;</blockquote>}
          </div>
        )}

        {post.externalUrl && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noreferrer"
            data-cursor="Open"
            className="mt-12 flex items-center justify-between gap-6 rounded-[3px] bg-ink px-7 py-6 text-paper transition-colors hover:bg-rising"
          >
            <span>
              <span className="block text-sm text-paper/60">{post.body ? "Also published on" : "Read the full piece on"}</span>
              <span className="font-display text-2xl">{post.externalLabel ?? "the original site"}</span>
            </span>
            <span aria-hidden className="text-3xl">
              &#8599;
            </span>
          </a>
        )}

        {post.kind === "edition" && (
          <p className="mt-10 text-ink-soft">
            Rising Ideas arrives every week on LinkedIn.{" "}
            <a href={settings.newsletterUrl} target="_blank" rel="noreferrer" className="text-rising underline underline-offset-4">
              Subscribe there
            </a>{" "}
            to get the next edition.
          </p>
        )}
      </div>

      {next && next.slug !== post.slug && (
        <nav aria-label="Next piece" className="mx-auto mt-28 max-w-[1100px] border-t border-ink/20 pt-10">
          <p className="text-sm text-ink-soft">Read next</p>
          <Link href={`/writing/${next.slug}`} data-cursor="Read" className="group mt-3 block">
            <span className="font-display text-[clamp(1.8rem,4vw,3.6rem)] leading-[1.02] tracking-[-0.025em] transition-colors group-hover:text-rising">
              {next.title}
            </span>
          </Link>
        </nav>
      )}
    </article>
  );
}
