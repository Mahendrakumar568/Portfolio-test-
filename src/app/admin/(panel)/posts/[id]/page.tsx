import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostById } from "@/lib/store";
import { PostEditor } from "@/components/admin/PostEditor";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params, searchParams }: PageProps<"/admin/posts/[id]">) {
  const { id } = await params;
  const { kind } = await searchParams;
  let post: Post | null;
  if (id === "new") {
    const isEdition = kind === "edition";
    post = {
      id: "",
      slug: "",
      kind: isEdition ? "edition" : "essay",
      title: "",
      date: new Date().toISOString().slice(0, 10),
      topic: "Business",
      excerpt: "",
      body: "",
      externalLabel: isEdition ? "LinkedIn" : "",
      featured: false,
      published: false,
      updatedAt: "",
    };
  } else {
    post = await getPostById(id);
    if (!post) notFound();
  }

  return (
    <div className="max-w-6xl">
      <Link href="/admin" className="text-sm text-ink-soft hover:text-ink">
        All writing
      </Link>
      <h1 className="font-display mt-2 text-4xl tracking-[-0.02em]">
        {id === "new" ? (post.kind === "edition" ? "New Rising Ideas edition" : "New essay") : post.title}
      </h1>
      <PostEditor post={post} />
    </div>
  );
}
