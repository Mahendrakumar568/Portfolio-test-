"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export const INTRO_DONE = "ri:intro-done";

/** A short count to 100 while the spine line draws. Runs once per visit. */
export const Preloader = () => {
  const root = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useGSAP(
    () => {
      const finish = () => {
        (window as unknown as { __introDone?: boolean }).__introDone = true;
        window.dispatchEvent(new Event(INTRO_DONE));
        setGone(true);
      };
      let seen = false;
      try {
        seen = sessionStorage.getItem("ri-intro") === "1";
        sessionStorage.setItem("ri-intro", "1");
      } catch {}
      if (seen || prefersReducedMotion()) return finish();

      const counter = { value: 0 };
      const number = root.current!.querySelector<HTMLElement>("[data-count]")!;
      gsap
        .timeline({ onComplete: finish })
        .to(counter, {
          value: 100,
          duration: 1.15,
          ease: "power2.inOut",
          onUpdate: () => (number.textContent = String(Math.round(counter.value)).padStart(3, "0")),
        })
        .from("[data-preload-line]", { scaleY: 0, duration: 1.15, ease: "power2.inOut" }, 0)
        .to(root.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "+=0.05");
    },
    { scope: root },
  );

  if (gone) return null;
  return (
    <div ref={root} aria-hidden className="fixed inset-0 z-[80] flex items-end justify-between bg-ink px-5 pb-6 text-paper md:px-10">
      <span data-preload-line className="absolute left-1/2 top-0 h-full w-px origin-top bg-ember" />
      <span className="font-display text-sm italic text-paper/60">Rising Ideas</span>
      <span data-count className="tabular text-sm text-paper/60">
        000
      </span>
    </div>
  );
};
