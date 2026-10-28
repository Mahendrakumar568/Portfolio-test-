"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { formatDate } from "@/lib/format";
import { Folio } from "./Folio";

type Essay = { slug: string; title: string; date: string; topic: string; excerpt: string; pullQuote?: string };

export const SelectedWriting = ({ essays }: { essays: Essay[] }) => {
  const root = useRef<HTMLElement>(null);
  const preview = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<Essay | null>(null);

  useDeferredGSAP(
    () => {
      gsap.from("[data-essay]", {
        yPercent: 60,
        opacity: 0,
        stagger: 0.08,
        duration: 1.1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-essays]", start: "top 80%" },
      });
    },
    root,
  );

  const follow = (e: React.PointerEvent) => {
    gsap.to(preview.current, { x: e.clientX + 24, y: e.clientY + 24, duration: 0.6, ease: "power3.out" });
  };

  return (
    <section ref={root} data-chapter="Writing" aria-labelledby="writing-title" className="px-5 py-28 md:px-10 md:py-40" onPointerMove={follow}>
      <div className="mx-auto max-w-[1440px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Folio n="vi." label="Selected writing" />
            <h2 id="writing-title" className="font-display mt-4 text-[clamp(2.2rem,4vw,3.8rem)] leading-[1] tracking-[-0.025em]">
              Essays worth starting with
            </h2>
          </div>
          <Link href="/writing" className="text-base underline decoration-rising underline-offset-4" data-cursor="Open">
            All writing
          </Link>
        </div>

        <ul data-essays className="mt-14 border-t border-ink/20" onPointerLeave={() => setActive(null)}>
          {essays.map((essay) => (
            <li key={essay.slug} className="overflow-hidden border-b border-ink/20">
              <Link
                href={`/writing/${essay.slug}`}
                data-essay
                data-cursor="Read"
                onPointerEnter={() => {
                  setActive(essay);
                }}
                className="group grid gap-2 py-8 md:grid-cols-12 md:items-baseline md:gap-6"
              >
                <span className="text-sm text-ink-soft md:col-span-2">{essay.topic}</span>
                <span className="font-display text-[clamp(1.6rem,3vw,2.8rem)] leading-[1.08] tracking-[-0.02em] transition-transform duration-500 ease-out group-hover:translate-x-3 md:col-span-8">
                  {essay.title}
                </span>
                <span className="tabular text-sm text-ink-soft md:col-span-2 md:text-right">{formatDate(essay.date)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        ref={preview}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-40 hidden w-80 rounded-[3px] bg-ink p-6 text-paper shadow-2xl transition-[opacity,scale] duration-300 md:block ${
          active ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        {active && (
          <p className="font-display text-lg italic leading-snug">
            {active.pullQuote ? `“${active.pullQuote}”` : active.excerpt}
          </p>
        )}
      </div>
    </section>
  );
};
