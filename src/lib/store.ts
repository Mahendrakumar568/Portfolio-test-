import "server-only";
import { promises as fs } from "fs";
import path from "path";
import type { Post, SiteSettings } from "./types";

/*
 * File-backed content store. Content lives in /content as JSON so the site
 * runs with no database or third-party account. Swap this module for a hosted
 * adapter (Vercel Blob, a database, or a Git-backed store) before deploying to
 * a read-only host.
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const SETTINGS_FILE = path.join(CONTENT_DIR, "settings.json");

const readJson = async <T>(file: string): Promise<T> =>
  JSON.parse(await fs.readFile(file, "utf8")) as T;

const writeJson = async (file: string, data: unknown) => {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
};

export const getSettings = async (): Promise<SiteSettings> => {
  const settings = await readJson<SiteSettings>(SETTINGS_FILE);
  return withExpiredSignalOff(settings);
};

const withExpiredSignalOff = (settings: SiteSettings): SiteSettings => {
  const { endsOn } = settings.signal;
  if (!endsOn) return settings;
  const today = new Date().toISOString().slice(0, 10);
  if (endsOn >= today) return settings;
  return { ...settings, signal: { ...settings.signal, mode: "off" } };
};

export const getRawSettings = () => readJson<SiteSettings>(SETTINGS_FILE);

export const saveSettings = async (settings: SiteSettings) => {
  await writeJson(SETTINGS_FILE, { ...settings, updatedAt: new Date().toISOString() });
};

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

export const listAllPosts = async (): Promise<Post[]> => {
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith(".json"));
  const posts = await Promise.all(files.map((f) => readJson<Post>(path.join(POSTS_DIR, f))));
  return posts.sort(byNewest);
};

export const listPublishedPosts = async () =>
  (await listAllPosts()).filter((p) => p.published);

export const getPostBySlug = async (slug: string) =>
  (await listPublishedPosts()).find((p) => p.slug === slug) ?? null;

export const getPostById = async (id: string) =>
  (await listAllPosts()).find((p) => p.id === id) ?? null;

export const savePost = async (post: Post) => {
  await writeJson(path.join(POSTS_DIR, `${post.id}.json`), {
    ...post,
    updatedAt: new Date().toISOString(),
  });
};

export const deletePost = async (id: string) => {
  await fs.rm(path.join(POSTS_DIR, `${id}.json`), { force: true });
};
