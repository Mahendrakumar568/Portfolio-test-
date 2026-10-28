"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/auth";
import { deletePost, getPostById, getRawSettings, listAllPosts, savePost, saveSettings } from "@/lib/store";
import { slugify } from "@/lib/format";
import { TOPIC_MAX_LENGTH, type Post, type SignalMode } from "@/lib/types";
import type { ExperienceEntry, LeadershipItem, MediaItem, PracticeItem, SiteCopy } from "@/lib/copy";

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

  const topic = text(form, "topic").slice(0, TOPIC_MAX_LENGTH);
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
    topic: topic || "Business",
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

export const saveTopicsAction = async (_: FormState, form: FormData): Promise<FormState> => {
  await requireAdmin();
  const settings = await getRawSettings();
  const topics = [
    ...new Set(
      String(form.get("topics") ?? "")
        .split("\n")
        .map((t) => t.trim().slice(0, TOPIC_MAX_LENGTH))
        .filter(Boolean),
    ),
  ];
  if (topics.length === 0) return { message: "Keep at least one topic." };
  const failed = await saveFailure(() => saveSettings({ ...settings, topics }));
  if (failed) return failed;
  refreshSite();
  return { ok: true, message: "Topics saved. The Writing page shows them straight away." };
};

/** Reads numbered form rows, such as exp0_role, and keeps the rows that have text. */
const rows = <T extends object>(count: number, read: (i: number) => T, filled: (row: T) => boolean): T[] =>
  Array.from({ length: count }, (_, i) => read(i)).filter(filled);

const saveCopy = async (update: (copy: SiteCopy) => SiteCopy): Promise<FormState> => {
  await requireAdmin();
  const settings = await getRawSettings();
  const failed = await saveFailure(() => saveSettings({ ...settings, copy: update(settings.copy) }));
  if (failed) return failed;
  refreshSite();
  return { ok: true, message: "Saved. The page is updated." };
};

const EXPERIENCE_SLOTS = 12;
const LEADERSHIP_SLOTS = 12;

export const saveCareerAction = async (_: FormState, form: FormData): Promise<FormState> => {
  const experience = rows<ExperienceEntry>(EXPERIENCE_SLOTS,
    (i) => ({
      year: text(form, `exp${i}_year`),
      when: text(form, `exp${i}_when`),
      role: text(form, `exp${i}_role`),
      org: text(form, `exp${i}_org`),
      note: text(form, `exp${i}_note`) || undefined,
      current: form.get(`exp${i}_current`) === "on" || undefined,
    }),
    (row) => Boolean(row.role || row.org),
  );
  const leadership = rows<LeadershipItem>(LEADERSHIP_SLOTS,
    (i) => ({ role: text(form, `lead${i}_role`), org: text(form, `lead${i}_org`), when: text(form, `lead${i}_when`) }),
    (row) => Boolean(row.role),
  );
  return saveCopy((copy) => ({
    ...copy,
    career: {
      experience,
      leadership,
      education: {
        degree: text(form, "edu_degree") || copy.career.education.degree,
        school: text(form, "edu_school"),
        years: text(form, "edu_years"),
      },
    },
  }));
};

export const saveWorkAction = async (_: FormState, form: FormData): Promise<FormState> => {
  const practice = rows<PracticeItem>(3,
    (i) => ({ title: text(form, `practice${i}_title`), text: text(form, `practice${i}_text`) }),
    (row) => Boolean(row.title),
  );
  return saveCopy((copy) => ({
    ...copy,
    work: { roleLine: text(form, "roleLine"), intro: text(form, "intro"), practice },
  }));
};

export const saveLensAction = async (_: FormState, form: FormData): Promise<FormState> =>
  saveCopy((copy) => ({
    ...copy,
    lens: {
      subjects: copy.lens.subjects.map((subject, i) => ({ ...subject, line: text(form, `line${i}`) || subject.line })),
    },
  }));

export const saveBookAction = async (_: FormState, form: FormData): Promise<FormState> =>
  saveCopy((copy) => ({
    ...copy,
    book: {
      label: text(form, "label") || copy.book.label,
      heading: text(form, "heading") || copy.book.heading,
      body: text(form, "body"),
    },
  }));

export const saveHomeAction = async (_: FormState, form: FormData): Promise<FormState> =>
  saveCopy((copy) => ({
    ...copy,
    home: {
      heroEditor: text(form, "heroEditor") || copy.home.heroEditor,
      heroRole: text(form, "heroRole") || copy.home.heroRole,
      statements: [0, 1, 2].map((i) => text(form, `statement${i}`) || copy.home.statements[i] || ""),
      risingIntro: text(form, "risingIntro") || copy.home.risingIntro,
      risingFrequency: text(form, "risingFrequency") || copy.home.risingFrequency,
      subscribeLabel: text(form, "subscribeLabel") || copy.home.subscribeLabel,
      contactHeadline: text(form, "contactHeadline") || copy.home.contactHeadline,
      contactHeadlineSignal: text(form, "contactHeadlineSignal") || copy.home.contactHeadlineSignal,
      contactLine: text(form, "contactLine"),
      readLabel: text(form, "readLabel") || copy.home.readLabel,
      writeLabel: text(form, "writeLabel") || copy.home.writeLabel,
      linkedinLabel: text(form, "linkedinLabel") || copy.home.linkedinLabel,
    },
  }));

const MEDIA_SLOTS = 12;

export const saveMediaAction = async (_: FormState, form: FormData): Promise<FormState> => {
  const media = rows<MediaItem>(MEDIA_SLOTS, (i) => ({
    label: text(form, `media${i}_label`),
    snippet: text(form, `media${i}_snippet`) || undefined,
    logo: text(form, `media${i}_logo`) || undefined,
    url: text(form, `media${i}_url`) || undefined,
  }), (row) => Boolean(row.label));
  return saveCopy((copy) => ({ ...copy, media }));
};
