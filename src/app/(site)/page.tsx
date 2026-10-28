import { getSettings, listPublishedPosts } from "@/lib/store";
import { Hero } from "@/components/home/Hero";
import { Thesis } from "@/components/home/Thesis";
import { Lens } from "@/components/home/Lens";
import { RisingIdeas } from "@/components/home/RisingIdeas";
import { Work } from "@/components/home/Work";
import { Timeline } from "@/components/home/Timeline";
import { SelectedWriting } from "@/components/home/SelectedWriting";
import { Contact } from "@/components/home/Contact";
import type { Post } from "@/lib/types";

// Re-render hourly so a signal with an end date switches itself off on time.
export const revalidate = 3600;

/** The essay each lens panel points to, matched by a phrase in its slug. */
const LENS_ESSAY: Record<string, string> = {
  Startups: "founders-mindset",
  "Business models": "simple-idea-is-transforming",
  "Emerging technology": "wand-and-block-max",
  "Strategy and geopolitics": "putin-in-delhi",
};

const toLink = (post?: Post) => (post ? { title: post.title, href: `/writing/${post.slug}` } : undefined);

export default async function Home() {
  const [settings, posts] = await Promise.all([getSettings(), listPublishedPosts()]);
  const editions = posts.filter((p) => p.kind === "edition");
  const essays = posts.filter((p) => p.kind === "essay");
  const featured = posts.filter((p) => p.featured);

  const essayLinks = Object.fromEntries(
    Object.entries(LENS_ESSAY).map(([panel, phrase]) => [panel, toLink(posts.find((p) => p.slug.includes(phrase)))]),
  );

  const newsletterItems = (editions.length > 0 ? editions : essays.filter((p) => p.date >= "2026-01-01")).slice(0, 4);

  return (
    <>
      <PersonSchema linkedinUrl={settings.linkedinUrl} mediumUrl={settings.mediumUrl} />
      <Hero headline={settings.headline} thesis={settings.thesis} portrait={settings.portrait} />
      <Thesis />
      <Lens essayLinks={essayLinks} />
      <RisingIdeas
        subscribers={settings.subscribers}
        editions={settings.editions}
        newsletterUrl={settings.newsletterUrl}
        items={newsletterItems}
        showingEditions={editions.length > 0}
      />
      <Work stealth={settings.stealth} />
      <Timeline />
      <SelectedWriting essays={featured.slice(0, 6)} />
      <Contact
        signal={settings.signal}
        email={settings.email}
        linkedinUrl={settings.linkedinUrl}
        newsletterUrl={settings.newsletterUrl}
      />
    </>
  );
}

const PersonSchema = ({ linkedinUrl, mediumUrl }: { linkedinUrl: string; mediumUrl: string }) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Jithendra Sai Kilaru",
        jobTitle: "Founder's Office",
        worksFor: { "@type": "Organization", name: "openCT" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "SRM University AP" },
        sameAs: [linkedinUrl, mediumUrl],
      }),
    }}
  />
);
