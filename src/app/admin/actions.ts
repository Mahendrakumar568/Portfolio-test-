"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";
import { deletePost, getPostById, getRawSettings, listAllPosts, savePost, saveSettings } from "@/lib/store";
import { slugify } from "@/lib/format";
import { TOPICS, type Post, type SignalMode, type Topic } from "@/lib/types";

export type FormState = { ok?: boolean; message?: string };

const text = (form: FormData, key: string) => String(form.get(key) ?? "").trim();
const number = (form: FormData, key: string) => {
  const value = Number(text(form, key));
  return Number.isFinite(value) && value >= 0 ? Math.round(value) : undefined;
};

const refreshSite = () => revalidatePath("/", "layout");

// Returns the storage error as a message for the form instead of an error page.
const saveFailure = async (save: () => Promise<void>): Promise<FormState | null> => {
  try {
    await save();
    return null;
  } catch (error) {
    return { message: error instanceof Error ? error.message : "Couldn't save. Try again." };
  }
};

export const signIn = async (_: FormState, form: FormData): Promise<FormState> => {
  if (!passwordMatches(text(form, "password"))) return { message: "That password isn't right. Try again." };
  await startSession();
  redirect("/admin");
};

export const signOut = async () => {
  await endSession();
  redirect("/admin/login");
};

export const savePostAction = async (_: FormState, form: FormData): Promise<FormState> => {
  await requireAdmin();
  const id = text(form, "id") || randomUUID();
  const existing = await getPostById(id);
  const title = text(form, "title");
  if (!title) return { message: "Add a title before saving." };

  const topic = text(form, "topic") as Topic;
  const slug = slugify(text(form, "slug") || title);
  const clash = (await listAllPosts()).find((p) => p.slug === slug && p.id !== id);
  if (clash) return { message: `Another piece already uses the address /writing/${slug}. Change the address.` };

  const kind = text(form, "kind") === "edition" ? "edition" : "essay";
  const post: Post = {
    id,
    slug,
    kind,
    title,
    editionNumber: kind === "edition" ? number(form, "editionNumber") : undefined,
    date: text(form, "date") || new Date().toISOString().slice(0, 10),
    topic: TOPICS.includes(topic) ? topic : "Business",
    excerpt: text(form, "excerpt"),
    body: String(form.get("body") ?? ""),
    pullQuote: text(form, "pullQuote") || undefined,
    coverImage: text(form, "coverImage") || undefined,
    externalUrl: text(form, "externalUrl") || undefined,
    externalLabel: text(form, "externalLabel") || undefined,
    featured: form.get("featured") === "on",
    published: form.get("published") === "on",
    updatedAt: existing?.updatedAt ?? new Date().toISOString(),
  };
  const failed = await saveFailure(() => savePost(post));
  if (failed) return failed;
  refreshSite();
  if (!existing) redirect(`/admin/posts/${id}?created=1`);
  return { ok: true, message: post.published ? "Published. It's live on the site." : "Saved as a draft." };
};

export const deletePostAction = async (form: FormData) => {
  await requireAdmin();
  await deletePost(text(form, "id"));
  refreshSite();
  redirect("/admin");
};

export const saveSignalAction = async (_: FormState, form: FormData): Promise<FormState> => {
  await requireAdmin();
  const settings = await getRawSettings();
  const mode = text(form, "mode") as SignalMode;
  const failed = await saveFailure(() =>
    saveSettings({
      ...settings,
      signal: {
        mode: ["off", "subtle", "featured"].includes(mode) ? mode : "off",
        message: text(form, "message") || settings.signal.message,
        ctaLabel: text(form, "ctaLabel") || "Start a conversation",
        endsOn: text(form, "endsOn") || undefined,
      },
    }),
  );
  if (failed) return failed;
  refreshSite();
  return { ok: true, message: mode === "off" ? "Signal switched off." : "Signal is live." };
};

export const saveVentureAction = async (_: FormState, form: FormData): Promise<FormState> => {
  await requireAdmin();
  const settings = await getRawSettings();
  const revealed = form.get("revealed") === "on";
  const name = text(form, "name");
  if (revealed && !name) return { message: "Add the venture's name before revealing it." };
  const failed = await saveFailure(() =>
    saveSettings({
      ...settings,
      stealth: {
        revealed,
        sector: text(form, "sector") || "Healthcare",
        teaser: text(form, "teaser") || settings.stealth.teaser,
        name,
        summary: text(form, "summary"),
        url: text(form, "url") || undefined,
      },
    }),
  );
  if (failed) return failed;
  refreshSite();
  return { ok: true, message: revealed ? "Revealed. The full card is live." : "Saved. The venture stays sealed." };
};

export const saveProfileAction = async (_: FormState, form: FormData): Promise<FormState> => {
  await requireAdmin();
  const settings = await getRawSettings();
  const failed = await saveFailure(() =>
    saveSettings({
      ...settings,
      headline: text(form, "headline") || settings.headline,
      thesis: text(form, "thesis"),
      bio: text(form, "bio"),
      portrait: text(form, "portrait") || settings.portrait,
      email: text(form, "email"),
      location: text(form, "location"),
      linkedinUrl: text(form, "linkedinUrl"),
      newsletterUrl: text(form, "newsletterUrl"),
      mediumUrl: text(form, "mediumUrl"),
      subscribers: number(form, "subscribers") ?? settings.subscribers,
      editions: number(form, "editions") ?? settings.editions,
    }),
  );
  if (failed) return failed;
  refreshSite();
  return { ok: true, message: "Profile saved." };
};
