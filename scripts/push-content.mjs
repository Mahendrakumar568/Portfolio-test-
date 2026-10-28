// Copies /content (settings and posts) into Redis, for the first deploy.
// Needs KV_REST_API_URL and KV_REST_API_TOKEN (or the UPSTASH_REDIS_REST_* pair) in the environment.
// Run: node --env-file=.env.local scripts/push-content.mjs
import { readFileSync, readdirSync } from "fs";
import { Redis } from "@upstash/redis";

const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
if (!url || !token) {
  console.error("Set KV_REST_API_URL and KV_REST_API_TOKEN first.");
  process.exit(1);
}

const redis = new Redis({ url, token });
const settings = JSON.parse(readFileSync("content/settings.json", "utf8"));
await redis.set("site:settings", settings);

const posts = readdirSync("content/posts")
  .filter((f) => f.endsWith(".json"))
  .map((f) => JSON.parse(readFileSync(`content/posts/${f}`, "utf8")));
if (posts.length) await redis.hset("site:posts", Object.fromEntries(posts.map((p) => [p.id, p])));

console.log(`Pushed settings and ${posts.length} posts to Redis.`);
