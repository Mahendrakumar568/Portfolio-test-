"use client";

import Link from "next/link";
import { useRef } from "react";
import type { Signal } from "@/lib/types";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { play } from "@/lib/sound";

/** The featured availability signal: a horizon line with a sun rising over it. */
export const HorizonBanner = ({ signal }: { signal: Signal }) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const tl = gsap.timeline({ delay: 2.2 });
      tl.from("[data-horizon-line]", { scaleX: 0, transformOrigin: "left", duration: 1.4, ease: "expo.inOut" })
        .from("[data-horizon-sun]", { yPercent: 100, duration: 1.2, ease: "power3.out" }, "-=0.6")
        .from("[data-horizon-copy] > *", { y: 14, opacity: 0, stagger: 0.08, duration: 0.7, ease: "power3.out" }, "-=0.8");
    },
    { scope: root },
  );

  return (
    <div ref={root} className="fixed inset-x-0 top-0 z-[55] h-10 overflow-hidden bg-ink text-paper">
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center justify-between gap-4 px-5 md:px-10">
        <div data-horizon-copy className="flex min-w-0 items-center gap-3 text-[13px]">
          <span className="font-display italic text-ember">Editor&rsquo;s note</span>
          <span className="truncate text-paper/85">{signal.message}</span>
        </div>
        <Link
          href="/#contact"
          onClick={() => play("chime")}
          className="shrink-0 rounded-full border border-paper/25 px-3 py-0.5 text-[12px] transition-colors hover:border-ember hover:bg-ember hover:text-ink"
        >
          {signal.ctaLabel}
        </Link>
        <span
          data-horizon-sun
          aria-hidden
          className="pointer-events-none absolute bottom-[-14px] left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-gradient-to-b from-ember to-rising shadow-[0_0_30px_8px_rgba(232,119,46,.45)] max-md:hidden"
        />
      </div>
      <span data-horizon-line aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
    </div>
  );
};
