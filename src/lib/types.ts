export const TOPICS = ["Technology", "Business", "Startups", "Geopolitics"] as const;
export type Topic = (typeof TOPICS)[number];

export type PostKind = "edition" | "essay";

export type Post = {
  id: string;
  slug: string;
  kind: PostKind;
  title: string;
  /** Rising Ideas edition number; editions only. */
  editionNumber?: number;
  date: string; // ISO date, yyyy-mm-dd
  topic: Topic;
  excerpt: string;
  /** Markdown. Empty when the full text lives elsewhere. */
  body: string;
  pullQuote?: string;
  coverImage?: string;
  /** Where the piece was first published (LinkedIn, Medium, DEV). */
  externalUrl?: string;
  externalLabel?: string;
  featured: boolean;
  published: boolean;
  readMinutes?: number;
  updatedAt: string;
};

export type SignalMode = "off" | "subtle" | "featured";

export type Signal = {
  mode: SignalMode;
  /** His own line, e.g. "Taking new conversations on operations and strategy". */
  message: string;
  ctaLabel: string;
  /** ISO date; the signal switches itself off after this day. */
  endsOn?: string;
};

export type StealthVenture = {
  revealed: boolean;
  sector: string;
  teaser: string;
  /** Only shown once revealed. */
  name: string;
  summary: string;
  url?: string;
};

export type SiteSettings = {
  headline: string;
  thesis: string;
  bio: string;
  portrait?: string;
  location: string;
  email: string;
  linkedinUrl: string;
  newsletterUrl: string;
  mediumUrl: string;
  subscribers: number;
  editions: number;
  signal: Signal;
  stealth: StealthVenture;
  updatedAt: string;
};
