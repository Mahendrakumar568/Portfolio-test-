import "server-only";
import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

export const renderMarkdown = (markdown: string) =>
  sanitizeHtml(marked.parse(markdown, { async: false }) as string, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "figure", "figcaption"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt", "title", "loading"],
      a: ["href", "title", "target", "rel"],
    },
  });

export const estimateReadMinutes = (markdown: string) =>
  Math.max(1, Math.round(markdown.trim().split(/\s+/).length / 220));
