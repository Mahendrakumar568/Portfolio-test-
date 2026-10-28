import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import type { Post, SiteSettings } from "./types";

/*
 * Content storage. Locally, content lives in /content as JSON files, so the
 * site runs with no database or account. When Redis credentials are present
 * (Upstash, or Vercel's Redis integration), the same content is read from and
 * written to Redis instead, which works on read-only hosts such as Vercel.
 */

type Backend = {
  readSettings: () => Promise<SiteSettings>;
  writeSettings: (settings: SiteSettings) => Promise<void>;
  readPosts: () => Promise<Post[]>;
  writePost: (post: Post) => Promise<void>;
  removePost: (id: string) => Promise<void>;
};

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const SETTINGS_FILE = path.join(CONTENT_DIR, "settings.json");

const readJson = async <T>(file: string): Promise<T> => JSON.parse(await fs.readFile(file, "utf8")) as T;

const writeJson = async (file: string, data: unknown) => {
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2) + "\n", "utf8");
  await fs.rename(tmp, file);
};

const fileBackend: Backend = {
  readSettings: () => readJson<SiteSettings>(SETTINGS_FILE),
  writeSettings: (settings) => writeJson(SETTINGS_FILE, settings),
  readPosts: async () => {
    const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith(".json"));
    return Promise.all(files.map((f) => readJson<Post>(path.join(POSTS_DIR, f))));
  },
  writePost: (post) => writeJson(path.join(POSTS_DIR, `${post.id}.json`), post),
  removePost: (id) => fs.rm(path.join(POSTS_DIR, `${id}.json`), { force: true }),
};

const SETTINGS_KEY = "site:settings";
const POSTS_KEY = "site:posts";

const redisBackend = (redis: Redis): Backend => ({
  readSettings: async () => {
    const settings = await redis.get<SiteSettings>(SETTINGS_KEY);
    if (!settings) throw new Error("No settings in Redis yet. Run: node scripts/push-content.mjs");
    return settings;
  },
  writeSettings: async (settings) => void (await redis.set(SETTINGS_KEY, settings)),
  readPosts: async () => Object.values((await redis.hgetall<Record<string, Post>>(POSTS_KEY)) ?? {}),
  writePost: async (post) => void (await redis.hset(POSTS_KEY, { [post.id]: post })),
  removePost: async (id) => void (await redis.hdel(POSTS_KEY, id)),
});

const redisCredentials = () => {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
};

const backend = (): Backend => {
  const credentials = redisCredentials();
  return credentials ? redisBackend(new Redis(credentials)) : fileBackend;
};

export const usesHostedStore = () => redisCredentials() !== null;

export const getSettings = async (): Promise<SiteSettings> => withExpiredSignalOff(await backend().readSettings());

const withExpiredSignalOff = (settings: SiteSettings): SiteSettings => {
  const { endsOn } = settings.signal;
  if (!endsOn) return settings;
  const today = new Date().toISOString().slice(0, 10);
  if (endsOn >= today) return settings;
  return { ...settings, signal: { ...settings.signal, mode: "off" } };
};

export const getRawSettings = () => backend().readSettings();

export const saveSettings = (settings: SiteSettings) =>
  backend().writeSettings({ ...settings, updatedAt: new Date().toISOString() });

const byNewest = (a: Post, b: Post) => b.date.localeCompare(a.date);

export const listAllPosts = async () => (await backend().readPosts()).sort(byNewest);

export const listPublishedPosts = async () => (await listAllPosts()).filter((p) => p.published);

export const getPostBySlug = async (slug: string) =>
  (await listPublishedPosts()).find((p) => p.slug === slug) ?? null;

export const getPostById = async (id: string) => (await listAllPosts()).find((p) => p.id === id) ?? null;

export const savePost = (post: Post) => backend().writePost({ ...post, updatedAt: new Date().toISOString() });

export const deletePost = (id: string) => backend().removePost(id);
