import Link from "next/link";
import type { SiteSettings } from "@/lib/types";

export const Footer = ({ settings }: { settings: SiteSettings }) => (
  <footer className="border-t border-rule">
    <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-10 text-sm text-ink-soft md:grid-cols-[1fr_auto] md:px-10">
      <p className="max-w-md">
        <span className="font-display text-base text-ink">Jithendra Sai Kilaru</span> writes from {settings.location}.
        <br />
        &ldquo;Rise above the storm and you will find the sunshine.&rdquo;
      </p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 md:justify-end">
        <li>
          <a href={settings.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={settings.newsletterUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
            Rising Ideas
          </a>
        </li>
        <li>
          <a href={settings.mediumUrl} target="_blank" rel="noreferrer" className="hover:text-ink">
            Medium
          </a>
        </li>
        <li>
          <Link href="/writing" className="hover:text-ink">
            Writing
          </Link>
        </li>
        <li className="tabular">&copy; {new Date().getFullYear()}</li>
      </ul>
    </div>
  </footer>
);
