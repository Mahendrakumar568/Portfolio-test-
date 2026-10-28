import { getSettings, listPublishedPosts } from "@/lib/store";
import { Hero } from "@/components/home/Hero";
import { Thesis } from "@/components/home/Thesis";
import { RisingIdeas } from "@/components/home/RisingIdeas";
import { Work } from "@/components/home/Work";
import { SelectedWriting } from "@/components/home/SelectedWriting";
import { Contact } from "@/components/home/Contact";

// Re-render hourly so a signal with an end date switches itself off on time.
export const revalidate = 3600;


export default async function Home() {
  const [settings, posts] = await Promise.all([getSettings(), listPublishedPosts()]);
  const editions = posts.filter((p) => p.kind === "edition");
  const essays = posts.filter((p) => p.kind === "essay");
  const featured = posts.filter((p) => p.featured);

  const newsletterItems = (editions.length > 0 ? editions : essays.filter((p) => p.date >= "2026-01-01")).slice(0, 4);

  return (
    <>
      <PersonSchema linkedinUrl={settings.linkedinUrl} mediumUrl={settings.mediumUrl} />
      <Hero headline={settings.headline} thesis={settings.thesis} portrait={settings.portrait} />
      <Thesis />
      <RisingIdeas
        subscribers={settings.subscribers}
        editions={settings.editions}
        newsletterUrl={settings.newsletterUrl}
        items={newsletterItems}
        showingEditions={editions.length > 0}
      />
      <Work stealth={settings.stealth} />
      <SelectedWriting essays={featured.slice(0, 3)} />
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
