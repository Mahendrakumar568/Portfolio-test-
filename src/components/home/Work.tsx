"use client";

import { useRef } from "react";
import type { StealthVenture } from "@/lib/types";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { Folio } from "./Folio";
import { Gem } from "./Gem";

const PRACTICE = [
  {
    title: "Operations",
    text: "Keeps the company's moving parts in step: the weekly rhythm, the documents, the follow-through.",
  },
  {
    title: "Founder outreach",
    text: "Supports the founder's conversations with partners, customers and the wider ecosystem, from first note to next step.",
  },
  {
    title: "Timelines",
    text: "Turns priorities into dates and holds the plan to them, so decisions land when they need to.",
  },
];

export const Work = ({ stealth }: { stealth: StealthVenture }) => {
  const root = useRef<HTMLElement>(null);

  useDeferredGSAP(
    () => {
      gsap.from("[data-practice]", {
        y: 50,
        opacity: 0,
        stagger: 0.12,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-practices]", start: "top 80%" },
      });
      gsap.fromTo(
        "[data-jewel]",
        { clipPath: "inset(12% 12% 12% 12% round 6px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 6px)",
          ease: "none",
          scrollTrigger: { trigger: "[data-jewel]", start: "top 95%", end: "top 40%", scrub: true },
        },
      );
    },
    root,
  );

  return (
    <section ref={root} data-chapter="The work" id="work" aria-labelledby="work-title" className="px-5 pb-20 pt-28 md:px-10 md:pb-28 md:pt-40">
      <div className="mx-auto max-w-[1440px]">
        <Folio n="iv." label="The work" />

        <div className="mt-10 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="text-sm text-ink-soft">
              Founder&rsquo;s Office, <span className="tabular">since Sep 2026</span>
            </p>
            <h2 id="work-title" className="font-display mt-3 text-[clamp(3.2rem,9vw,9rem)] leading-[0.88] tracking-[-0.04em]">
              openCT
            </h2>
          </div>
          <p className="self-end text-xl leading-relaxed md:col-span-5">
            Jithendra runs Founder&rsquo;s Office operations at openCT, working beside the founder on outreach and
            timelines. He joined as an operations intern in May 2026 and moved into the Founder&rsquo;s Office four
            months later.
          </p>
        </div>

        <ol data-practices className="mt-16 grid gap-px overflow-hidden rounded-[2px] bg-rule md:grid-cols-3">
          {PRACTICE.map((item) => (
            <li key={item.title} data-practice className="bg-paper p-8 md:p-10">
              <h3 className="font-display text-3xl tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-4 text-ink-soft">{item.text}</p>
            </li>
          ))}
        </ol>

        <article
          data-jewel
          aria-labelledby="jewel-title"
          className="relative mt-24 grid overflow-hidden rounded-md bg-night text-night-ink md:grid-cols-2"
        >
          <div className="relative flex flex-col justify-between gap-12 p-8 md:p-14">
            <div>
              <p className="text-sm text-night-soft">
                {stealth.sector}, {stealth.revealed ? "now public" : "in stealth"}
              </p>
              {stealth.revealed ? (
                <>
                  <h3 id="jewel-title" className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
                    {stealth.name}
                  </h3>
                  <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-night-ink/80">{stealth.summary}</p>
                  {stealth.url && (
                    <a href={stealth.url} target="_blank" rel="noreferrer" className="mt-8 inline-block text-ember underline underline-offset-4">
                      Visit {stealth.name}
                    </a>
                  )}
                </>
              ) : (
                <>
                  <h3 id="jewel-title" className="font-display mt-4 text-[clamp(2.4rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.03em]">
                    The precious jewel
                  </h3>
                  <p className="mt-6 max-w-[40ch] text-lg leading-relaxed text-night-ink/80">{stealth.teaser}</p>
                  <div aria-hidden className="mt-10 space-y-3 select-none">
                    {["92%", "78%", "64%"].map((w) => (
                      <div key={w} className="h-3 rounded-sm bg-night-ink/15 blur-[1.5px]" style={{ width: w }} />
                    ))}
                  </div>
                  <p className="sr-only">Details of this venture are not public yet.</p>
                </>
              )}
            </div>
            {!stealth.revealed && (
              <p className="text-sm text-night-soft">
                Background research is under way. Details will be shared when it&rsquo;s ready.
              </p>
            )}
          </div>
          <div className="relative min-h-[320px] md:min-h-[520px]" data-cursor={stealth.revealed ? undefined : "Sealed"}>
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(circle at 50% 55%, rgba(194,65,12,.28), transparent 60%)" }}
            />
            <Gem />
          </div>
        </article>
      </div>
    </section>
  );
};
