import Link from "next/link";
import { listAllPosts } from "@/lib/store";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const posts = await listAllPosts();
  const drafts = posts.filter((p) => !p.published).length;
  return (
    <div className="max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-[-0.02em]">Writing</h1>
          <p className="mt-2 text-ink-soft">
            {posts.length} pieces, {drafts} {drafts === 1 ? "draft" : "drafts"}. Published pieces appear on the site straight away.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/posts/new?kind=edition" className="rounded-full bg-rising px-5 py-2.5 text-sm text-paper hover:bg-ink">
            New edition
          </Link>
          <Link href="/admin/posts/new?kind=essay" className="rounded-full border border-ink/20 px-5 py-2.5 text-sm hover:border-ink">
            New essay
          </Link>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-ink/10 bg-white/50">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-ink-soft">
            <tr>
              <th className="px-5 py-3 font-medium">Title</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Type</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-b border-ink/5 last:border-0 hover:bg-paper-deep/50">
                <td className="px-5 py-4">
                  <Link href={`/admin/posts/${post.id}`} className="font-medium hover:text-rising">
                    {post.title}
                  </Link>
                  <span className="mt-0.5 block text-ink-soft">{post.topic}{post.featured ? ", featured" : ""}</span>
                </td>
                <td className="hidden px-5 py-4 md:table-cell">
                  {post.kind === "edition" ? `Edition${post.editionNumber ? ` ${post.editionNumber}` : ""}` : "Essay"}
                </td>
                <td className="tabular hidden px-5 py-4 text-ink-soft md:table-cell">{formatDate(post.date)}</td>
                <td className="px-5 py-4">
                  <span className={`rounded-full px-2.5 py-1 text-xs ${post.published ? "bg-emerald-100 text-emerald-800" : "bg-ink/10 text-ink-soft"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
