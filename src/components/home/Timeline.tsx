"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { Folio } from "./Folio";

type Entry = { when: string; role: string; org: string; note?: string };

const YEARS: { year: string; entries: Entry[] }[] = [
  {
    year: "2026",
    entries: [
      { when: "Sep 2026 to now", role: "Founder's Office", org: "openCT", note: "Operations, founder outreach and timelines." },
      { when: "May to Aug 2026", role: "Operations Intern", org: "openCT" },
      { when: "2026", role: "Bachelor of Engineering, Computer Science", org: "SRM University AP" },
    ],
  },
  {
    year: "2025",
    entries: [
      { when: "Jul 2025 to Jan 2026", role: "Operations Intern", org: "HalfBrain Technology", note: "Daily workflows, documentation and process improvement." },
      { when: "Apr 2025 to Feb 2026", role: "Mentor", org: "Smart Tech Club, SRM AP", note: "Guided student teams applying AI, security, IoT and cloud to real problems." },
    ],
  },
  {
    year: "2024",
    entries: [
      { when: "Oct 2024 to Apr 2025", role: "Extended Reality Intern", org: "Universiti Teknologi MARA, Malaysia" },
      { when: "Jun 2024 to Jan 2026", role: "Data Analyst Intern, Decision Support", org: "Saurvi", note: "SQL, analysis and reports for non-technical teams." },
      { when: "May 2024 to Sep 2025", role: "CSR Project Intern", org: "SRM AP Directorate of Innovation and Entrepreneurship" },
      { when: "Apr 2024 to Apr 2025", role: "Treasurer", org: "E-Cell, SRM AP", note: "Budgets, fundraising and sponsorships." },
      { when: "Jun to Aug 2024", role: "HR Intern", org: "Agumentik Group" },
      { when: "Jan 2024 to Apr 2025", role: "Co-Convener", org: "Smart Tech Club, SRM AP", note: "Ran programs, workshops and innovation initiatives." },
    ],
  },
  {
    year: "2023",
    entries: [
      { when: "Dec 2023 to Nov 2025", role: "International Relations Representative", org: "SRM AP" },
      { when: "Jan 2023 to Feb 2024", role: "Convener, Community Service", org: "SRM AP Directorate of Innovation and Entrepreneurship" },
    ],
  },
  { year: "2022", entries: [{ when: "2022", role: "Began computer science", org: "SRM University AP" }] },
];

export const Timeline = () => {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      gsap.from("[data-spine]", {
        scaleY: 0,
        transformOrigin: "top",
        ease: "none",
        scrollTrigger: { trigger: "[data-years]", start: "top 70%", end: "bottom 70%", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((el) => {
        gsap.from(el, {
          x: -24,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 82%" },
        });
        gsap.to(el.querySelector("[data-node]"), {
          backgroundColor: "#c2410c",
          borderColor: "#c2410c",
          scrollTrigger: { trigger: el, start: "top 70%", toggleActions: "play none none reverse" },
        });
      });
      gsap.from("[data-event-photo]", {
        clipPath: "inset(0 0 100% 0)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-event-photo]", start: "top 80%" },
      });
    },
    root,
  );

  return (
    <section ref={root} data-chapter="The path" aria-labelledby="timeline-title" className="border-t border-rule px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-[1440px] gap-16 md:grid-cols-12">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <Folio n="v." label="The path so far" />
            <h2 id="timeline-title" className="font-display mt-4 max-w-[14ch] text-[clamp(2.2rem,4vw,3.8rem)] leading-[1] tracking-[-0.025em]">
              Four years inside the ecosystem, then a startup.
            </h2>
            <figure className="mt-10 max-w-sm">
              <div data-event-photo className="relative aspect-[4/5] overflow-hidden rounded-[2px]">
                <Image
                  src="/images/event-quantum.jpg"
                  alt="Jithendra with the CEO of Ratan Tata Innovation Hub at a quantum technology conference"
                  fill
                  sizes="(min-width: 768px) 28vw, 90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-3 text-sm text-ink-soft">
                With the CEO of Ratan Tata Innovation Hub at a quantum technology conference in Amaravati.
              </figcaption>
            </figure>
          </div>
        </div>

        <div data-years className="relative md:col-span-7 md:col-start-6">
          <span aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-rule" />
          <span data-spine aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px bg-rising" />
          {YEARS.map(({ year, entries }) => (
            <div key={year} className="relative pb-14 pl-10">
              <h3 className="tabular text-sm text-ink-soft">{year}</h3>
              <ul className="mt-4 space-y-8">
                {entries.map((entry) => (
                  <li key={`${entry.role}-${entry.org}-${entry.when}`} data-milestone className="relative">
                    <span
                      data-node
                      aria-hidden
                      className="absolute -left-10 top-[0.6em] h-[11px] w-[11px] rounded-full border border-ink/40 bg-paper"
                    />
                    <p className="font-display text-2xl leading-snug tracking-[-0.01em] md:text-[1.75rem]">
                      {entry.role}
                      <span className="text-ink-soft">, {entry.org}</span>
                    </p>
                    <p className="tabular mt-1 text-sm text-ink-soft">{entry.when}</p>
                    {entry.note && <p className="mt-2 max-w-[52ch] text-ink-soft">{entry.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
