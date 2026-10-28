"use client";

import { useRef } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { Folio } from "./Folio";

const CLOTH_PANELS = [0, 1, 2, 3, 4];

/*
 * A book is being written. Its cover is still under cloth, and the cloth falls
 * away as the reader scrolls. Only the fact that it exists is shown, no details.
 */
export const BookHint = () => {
  const root = useRef<HTMLElement>(null);
  const book = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      const cloth = gsap.utils.toArray<HTMLElement>("[data-cloth]");
      gsap.set(book.current, { rotateY: -18, rotateX: 8, y: 30 });
      gsap.to(cloth, {
        yPercent: (i) => 110 + i * 6,
        rotateZ: (i) => (i % 2 === 0 ? -9 : 7),
        rotateX: 26,
        skewX: (i) => (i % 2 === 0 ? -6 : 5),
        ease: "power2.in",
        stagger: { each: 0.08, from: "start" },
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 45%", scrub: 0.9 },
      });
      gsap.to(book.current, {
        rotateY: 0,
        rotateX: 0,
        y: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: root.current, start: "top 75%", end: "center 40%", scrub: 0.9 },
      });
      gsap.to("[data-book-float]", {
        y: -10,
        duration: 2.8,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      const tilt = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        gsap.to(book.current, { rotateY: dx * 22, rotateX: -dy * 14, duration: 1.1, ease: "power3.out" });
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

        <div className="relative mx-auto h-[min(70vw,520px)] w-[min(70vw,400px)] md:col-span-5 md:col-start-8" style={{ perspective: 1400 }}>
          <div data-book-float className="absolute inset-0">
            <div ref={book} className="relative h-full w-full" style={{ transformStyle: "preserve-3d" }}>
              {/* Pages */}
              <div
                className="absolute inset-y-[3%] right-[2%] w-[92%] rounded-[2px] bg-paper"
                style={{ transform: "translateZ(-18px)", boxShadow: "inset 0 0 0 1px rgba(22,21,19,.12)" }}
              />
              {/* Cover */}
              <div
                className="absolute inset-0 flex flex-col justify-between rounded-[3px] bg-rising p-8 md:p-10"
                style={{ transform: "translateZ(14px)", boxShadow: "0 40px 80px -24px rgba(0,0,0,.7)" }}
              >
                <span className="text-[11px] uppercase tracking-[0.24em] text-paper/80">In progress</span>
                <span className="font-display text-4xl italic leading-none text-paper/90 md:text-5xl">&hellip;</span>
              </div>
              {/* Spine */}
              <div
                className="absolute inset-y-0 left-0 w-[28px] origin-left rounded-l-[3px] bg-rising-ink"
                style={{ transform: "rotateY(-90deg) translateZ(0px)" }}
              />
              {/* Cloth, falling away as the reader scrolls */}
              <div className="absolute inset-0" style={{ transform: "translateZ(40px)", transformStyle: "preserve-3d" }}>
                {CLOTH_PANELS.map((i) => (
                  <div
                    key={i}
                    data-cloth
                    className="absolute inset-y-0 origin-top"
                    style={{
                      left: `${i * 20}%`,
                      width: "21%",
                      background: `linear-gradient(${100 + i * 12}deg, #d6cfc1 0%, #e9e3d7 35%, #b9b1a2 60%, #e9e3d7 85%, #cfc7b6 100%)`,
                      boxShadow: "0 0 30px rgba(0,0,0,.35)",
                      borderRadius: "2px",
                    }}
                  >
                    <span
                      aria-hidden
                      className="absolute inset-0 opacity-40 mix-blend-multiply"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(90deg, rgba(22,21,19,.08) 0 2px, transparent 2px 9px), repeating-linear-gradient(0deg, rgba(22,21,19,.05) 0 1px, transparent 1px 14px)",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
