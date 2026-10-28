import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import { isSignedIn } from "@/lib/auth";

const ALLOWED = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);
const MAX_BYTES = 8 * 1024 * 1024;

/** Saves an uploaded image to /content/uploads; it is served from /media. */
export const POST = async (request: Request) => {
  if (!(await isSignedIn())) return Response.json({ error: "Sign in again to upload." }, { status: 401 });
  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return Response.json({ error: "Choose an image to upload." }, { status: 400 });
  const ext = ALLOWED.get(file.type);
  if (!ext) return Response.json({ error: "Use a JPG, PNG or WebP image." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "Images must be under 8 MB." }, { status: 400 });

  const name = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), "content", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return Response.json({ path: `/media/${name}` });
};
