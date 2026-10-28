"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Folio } from "./Folio";

const STATEMENTS = [
  "An idea is a hypothesis about people. It becomes real only when it survives contact with a market.",
  "Most breakthroughs are borrowed: a solution mastered in one place, carried to where nobody expected it.",
  "Strategy is choosing which promises to make. Execution is keeping them, on time.",
];

export const Thesis = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.set(words, { opacity: 0.14 });
      gsap.to(words, {
        opacity: 1,
        stagger: 0.12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2.2}`,
          scrub: 0.6,
          pin: true,
        },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="thesis-title" className="relative flex min-h-[100svh] items-center px-5 py-24 md:px-10">
      <div className="mx-auto grid w-full max-w-[1440px] gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <Folio n="i." label="What I believe" />
          <h2 id="thesis-title" className="sr-only">
            What I believe
          </h2>
        </div>
        <div className="space-y-10 md:col-span-9">
          {STATEMENTS.map((statement, i) => (
            <p key={i} className="font-display max-w-[24ch] text-[clamp(1.9rem,4.4vw,4.4rem)] leading-[1.06] tracking-[-0.02em]">
              {statement.split(" ").map((word, w) => (
                <span key={w} data-word className="inline-block pr-[0.25em]">
                  {word}
                </span>
              ))}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
