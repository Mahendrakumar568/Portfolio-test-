import "server-only";
import { promises as fs } from "fs";
import path from "path";
import { Redis } from "@upstash/redis";
import { DEFAULT_TOPICS, type Post, type SiteSettings } from "./types";

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

const HOSTED_STORE_MISSING =
  "Saving needs online storage on Vercel. Connect Upstash Redis to the project in the Vercel dashboard, then redeploy.";

const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");
const SETTINGS_FILE = path.join(CONTENT_DIR, "settings.json");

const readJson = async <T>(file: string): Promise<T> => JSON.parse(await fs.readFile(file, "utf8")) as T;

const writeJson = async (file: string, data: unknown) => {
  if (process.env.VERCEL) throw new Error(HOSTED_STORE_MISSING);
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

// An empty Redis starts from the content bundled with the site, so connecting
// storage needs no separate import step. The first post write copies the
// bundled posts across, after which Redis is the only source.
const redisBackend = (redis: Redis): Backend => {
  const storedPosts = async () => (await redis.hgetall<Record<string, Post>>(POSTS_KEY)) ?? {};
  const seedPostsIfEmpty = async () => {
    if (Object.keys(await storedPosts()).length > 0) return;
    const bundled = await fileBackend.readPosts();
    if (bundled.length > 0) await redis.hset(POSTS_KEY, Object.fromEntries(bundled.map((p) => [p.id, p])));
  };

  return {
    readSettings: async () => (await redis.get<SiteSettings>(SETTINGS_KEY)) ?? fileBackend.readSettings(),
    writeSettings: async (settings) => void (await redis.set(SETTINGS_KEY, settings)),
    readPosts: async () => {
      const posts = Object.values(await storedPosts());
      return posts.length > 0 ? posts : fileBackend.readPosts();
    },
    writePost: async (post) => {
      await seedPostsIfEmpty();
      await redis.hset(POSTS_KEY, { [post.id]: post });
    },
    removePost: async (id) => {
      await seedPostsIfEmpty();
      await redis.hdel(POSTS_KEY, id);
    },
  };
};

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

// On Vercel the deployed files are read-only, so edits only stick with Redis connected.
export const canSave = () => usesHostedStore() || !process.env.VERCEL;

const withDefaults = (settings: SiteSettings): SiteSettings => ({
  ...settings,
  topics: settings.topics?.length ? settings.topics : DEFAULT_TOPICS,
});

export const getSettings = async (): Promise<SiteSettings> =>
  withExpiredSignalOff(withDefaults(await backend().readSettings()));

const withExpiredSignalOff = (settings: SiteSettings): SiteSettings => {
  const { endsOn } = settings.signal;
  if (!endsOn) return settings;
  const today = new Date().toISOString().slice(0, 10);
  if (endsOn >= today) return settings;
  return { ...settings, signal: { ...settings.signal, mode: "off" } };
};

export const getRawSettings = async () => withDefaults(await backend().readSettings());

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
