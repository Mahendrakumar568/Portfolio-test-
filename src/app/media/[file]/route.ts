import { promises as fs } from "fs";
import path from "path";

const TYPES: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

/** Serves images uploaded through the admin panel. */
export const GET = async (_: Request, { params }: RouteContext<"/media/[file]">) => {
  const { file } = await params;
  const name = path.basename(file);
  const type = TYPES[name.split(".").pop() ?? ""];
  if (!type) return new Response("Not found", { status: 404 });
  try {
    const data = await fs.readFile(path.join(process.cwd(), "content", "uploads", name));
    return new Response(data, { headers: { "Content-Type": type, "Cache-Control": "public, max-age=31536000, immutable" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
};
