"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { Folio } from "./Folio";

type Panel = { title: string; line: string; essay?: { title: string; href: string }; figure: React.ReactNode };

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

const PANELS: Panel[] = [
  {
    title: "Startups",
    line: "How a founder turns a hunch into something people pay for, and what a headline about a startup really says about the problem underneath.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle data-draw cx="100" cy="150" r="6" {...stroke} />
        <path data-draw d="M100 144 C 100 110, 70 90, 60 50" {...stroke} />
        <path data-draw d="M100 144 C 100 100, 130 80, 150 30" {...stroke} />
        <path data-draw d="M100 144 C 100 120, 100 80, 100 20" {...stroke} />
        <path data-draw d="M40 170 H160" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Business models",
    line: "Who pays, for what, and why they keep paying. Speed, trust and aggregation, and the markets where each one stops working.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle data-draw cx="78" cy="88" r="44" {...stroke} />
        <circle data-draw cx="122" cy="88" r="44" {...stroke} />
        <circle data-draw cx="100" cy="126" r="44" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Emerging technology",
    line: "AI as augmentation, not replacement. Search, security and the systems that decide what reaches us, explained from the inside.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        {[40, 80, 120, 160].map((x) =>
          [40, 80, 120, 160].map((y) => <circle key={`${x}-${y}`} data-draw cx={x} cy={y} r="3" {...stroke} />),
        )}
        <path data-draw d="M40 160 L80 120 L120 120 L160 40 M80 120 L80 40 L120 80 L160 80" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Strategy and geopolitics",
    line: "Tariffs, energy and alliances. Why India will not be cornered into choosing between powers, and what that means for business.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full">
        <circle data-draw cx="100" cy="100" r="70" {...stroke} />
        <ellipse data-draw cx="100" cy="100" rx="30" ry="70" {...stroke} />
        <ellipse data-draw cx="100" cy="100" rx="56" ry="70" {...stroke} />
        <path data-draw d="M30 100 H170 M40 66 H160 M40 134 H160" {...stroke} />
      </svg>
    ),
  },
];

export const Lens = ({ essayLinks }: { essayLinks: Record<string, { title: string; href: string } | undefined> }) => {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        let active = -1;
        const scroll = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const next = Math.min(panels.length - 1, Math.round(self.progress * (panels.length - 1)));
              if (next !== active) {
                active = next;
              }
            },
          },
        });
        panels.forEach((panel) => {
          const paths = panel.querySelectorAll<SVGGeometryElement>("[data-draw]");
          paths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
          });
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            stagger: 0.08,
            ease: "power2.inOut",
            scrollTrigger: { trigger: panel, containerAnimation: scroll, start: "left 70%" },
          });
        });
      });
      return () => mm.revert();
    },
    root,
  );

  return (
    <section ref={root} aria-labelledby="lens-title" className="relative overflow-hidden bg-paper-deep">
      <div className="flex min-h-[100svh] flex-col justify-center py-24">
        <div className="mx-auto mb-12 w-full max-w-[1440px] px-5 md:px-10">
          <Folio n="ii." label="The lens" />
          <h2 id="lens-title" className="font-display mt-4 max-w-[18ch] text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] tracking-[-0.02em]">
            Four subjects, read for the logic underneath.
          </h2>
        </div>
        <div ref={track} className="flex flex-col gap-16 px-5 md:w-max md:flex-row md:gap-0 md:px-10">
          {PANELS.map((panel, i) => {
            const essay = essayLinks[panel.title];
            return (
              <article
                key={panel.title}
                data-panel
                className="grid gap-8 md:h-[56vh] md:w-[min(78vw,1100px)] md:grid-cols-[1fr_1.1fr] md:border-l md:border-ink/15 md:pl-12 md:pr-16"
              >
                <div className="flex flex-col">
                  <span className="tabular text-sm text-ink-soft">{String(i + 1).padStart(2, "0")} / 04</span>
                  <h3 className="font-display mt-6 text-[clamp(2.4rem,5.6vw,5.6rem)] leading-[0.95] tracking-[-0.03em]">
                    {panel.title}
                  </h3>
                  <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-ink-soft">{panel.line}</p>
                  {essay && (
                    <Link href={essay.href} data-cursor="Read" className="mt-auto pt-8 text-base">
                      <span className="text-ink-soft">Read </span>
                      <span className="font-display italic underline decoration-rising decoration-1 underline-offset-4">
                        {essay.title}
                      </span>
                    </Link>
                  )}
                </div>
                <div className="aspect-square max-h-[56vh] text-ink/80 max-md:w-2/3">{panel.figure}</div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

