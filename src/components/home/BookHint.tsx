"use client";

import { useRef } from "react";
import { gsap, useDeferredGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Folio } from "./Folio";

/*
 * A book is being written. It stands on a pedestal under a draped cloth, and
 * nothing of it shows. The pedestal turns slowly, the cloth breathes, and the
 * scene tilts toward the reader's pointer. Anticipation, not reveal.
 */
export const BookHint = () => {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<HTMLDivElement>(null);
  const cloth = useRef<SVGGElement>(null);

  useDeferredGSAP(
    () => {
      if (!scene.current || !cloth.current) return;
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        scene.current,
        { y: 70, rotateX: 18, opacity: 0 },
        {
          y: 0,
          rotateX: 0,
          opacity: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 80%", end: "center 50%", scrub: 0.8 },
        },
      );
      gsap.to(scene.current, { rotateY: 14, duration: 7, yoyo: true, repeat: -1, ease: "sine.inOut" });
      gsap.to(cloth.current, { scaleY: 1.02, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
      gsap.to("[data-spot]", { opacity: 0.85, duration: 2.6, yoyo: true, repeat: -1, ease: "sine.inOut" });

      const tilt = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        gsap.to(scene.current, { x: dx * 26, rotateX: -dy * 8, duration: 1.4, ease: "power3.out" });
      };
      window.addEventListener("pointermove", tilt);
      return () => window.removeEventListener("pointermove", tilt);
    },
    root,
  );

  return (
    <section
      ref={root}
      aria-labelledby="book-title"
      className="relative overflow-hidden border-t border-ink/15 bg-ink px-5 py-28 text-paper md:px-10 md:py-40"
    >
      <p aria-hidden className="pointer-events-none absolute -bottom-[6vw] -left-[1vw] select-none font-display text-[26vw] leading-none tracking-[-0.04em] text-paper/[0.035]">
        Draft
      </p>
      <div className="mx-auto grid max-w-[1440px] items-center gap-16 md:grid-cols-12">
        <div className="md:col-span-6">
          <Folio n="ii." label="Work in progress" tone="night" />
          <h2 id="book-title" className="font-display mt-6 text-[clamp(2.6rem,5.6vw,5.4rem)] leading-[0.98] tracking-[-0.03em]">
            Something longer is being written.
          </h2>
          <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-night-soft">
            Not ready to show yet. When it is, it will be the first thing to read here.
          </p>
        </div>

        <div className="relative mx-auto h-[min(92vw,520px)] w-[min(92vw,470px)] md:col-span-5 md:col-start-8" style={{ perspective: 1200 }}>
          {/* Spotlight from above */}
          <div
            data-spot
            aria-hidden
            className="pointer-events-none absolute inset-x-[10%] top-[-6%] h-[70%] rounded-full opacity-60 blur-2xl"
            style={{ background: "radial-gradient(closest-side, rgba(232,119,46,.45), transparent 70%)" }}
          />

          <div ref={scene} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            <svg viewBox="0 0 300 380" className="h-full w-full overflow-visible" aria-hidden>
              <defs>
                <linearGradient id="book-column" x1="0" x2="1">
                  <stop offset="0" stopColor="#1d1b18" />
                  <stop offset="0.35" stopColor="#4a443c" />
                  <stop offset="0.6" stopColor="#5d554a" />
                  <stop offset="1" stopColor="#1d1b18" />
                </linearGradient>
                <linearGradient id="book-cap" x1="0" x2="1">
                  <stop offset="0" stopColor="#3a352f" />
                  <stop offset="0.45" stopColor="#7a7165" />
                  <stop offset="1" stopColor="#2b2823" />
                </linearGradient>
                <linearGradient id="book-cloth" x1="0" x2="1">
                  <stop offset="0" stopColor="#3d0a07" />
                  <stop offset="0.2" stopColor="#8f1d15" />
                  <stop offset="0.45" stopColor="#d4453a" />
                  <stop offset="0.7" stopColor="#9a2118" />
                  <stop offset="1" stopColor="#3d0a07" />
                </linearGradient>
                <filter id="book-soft" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.5" />
                </filter>
              </defs>

              {/* Floor shadow */}
              <ellipse cx="150" cy="356" rx="128" ry="14" fill="#000" opacity="0.7" filter="url(#book-soft)" />

              {/* Pedestal */}
              <path d="M96 300 L204 300 L214 352 L86 352 Z" fill="url(#book-column)" />
              <rect x="84" y="346" width="132" height="10" rx="2" fill="#2b2823" />
              <rect x="74" y="284" width="152" height="18" rx="4" fill="url(#book-cap)" />
              <ellipse cx="150" cy="284" rx="76" ry="5" fill="#8a8073" opacity="0.6" />

              {/* Cloth draped over an unseen book */}
              <g ref={cloth}>
                <path
                  d="M62 292 C 68 252, 74 200, 82 176 Q 88 150 118 146 Q 150 140 182 146 Q 212 150 218 176 C 226 200, 232 252, 238 292 Q 222 280 208 294 Q 192 282 150 296 Q 108 282 92 294 Q 78 280 62 292 Z"
                                  fill="url(#book-cloth)"
                />
                {/* Creases where the cloth pulls tight over the book's edges */}
                <g fill="none" strokeLinecap="round">
                  <path d="M92 150 C 90 200, 92 250, 92 286" stroke="#2a0503" strokeWidth="6" opacity="0.6" filter="url(#book-soft)" />
                  <path d="M100 152 C 98 200, 100 250, 100 282" stroke="#ffb1a0" strokeWidth="1.6" opacity="0.3" />
                  <path d="M150 140 C 149 170, 151 200, 150 236" stroke="#2a0503" strokeWidth="4" opacity="0.35" filter="url(#book-soft)" />
                  <path d="M208 150 C 210 200, 208 250, 208 286" stroke="#2a0503" strokeWidth="6" opacity="0.6" filter="url(#book-soft)" />
                  <path d="M200 152 C 202 200, 200 250, 200 282" stroke="#ffb1a0" strokeWidth="1.6" opacity="0.28" />
                  <path d="M84 186 Q 118 194 150 186 Q 182 194 216 186" stroke="#2a0503" strokeWidth="3" opacity="0.35" filter="url(#book-soft)" />
                </g>
                {/* Top edge catches the light */}
                <path d="M96 150 Q 150 140 204 150" fill="none" stroke="#ffd9cc" strokeWidth="2" opacity="0.3" filter="url(#book-soft)" />
                {/* Light catching the crown of the cloth */}
                <ellipse cx="150" cy="136" rx="46" ry="12" fill="#ffd9cc" opacity="0.16" filter="url(#book-soft)" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
