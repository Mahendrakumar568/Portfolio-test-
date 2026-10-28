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
  const cloth = useRef<HTMLDivElement>(null);

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
      gsap.to(cloth.current, { scaleY: 1.025, scaleX: 0.99, duration: 3.4, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "50% 100%" });
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
            {/* Pedestal */}
            <div className="absolute bottom-[4%] left-1/2 h-[44%] w-[70%] -translate-x-1/2 rounded-b-[4px]" style={{ background: "linear-gradient(90deg, #2a2723 0%, #46403a 35%, #5b5349 55%, #2a2723 100%)", boxShadow: "0 40px 60px -20px rgba(0,0,0,.8)" }}>
              <div className="absolute -top-[14px] left-[-6%] h-[28px] w-[112%] rounded-[50%]" style={{ background: "radial-gradient(ellipse at 50% 40%, #6a6258 0%, #3c3730 75%)" }} />
            </div>

            {/* Cloth, draped over an unseen book */}
            <div
              ref={cloth}
              className="absolute bottom-[40%] left-1/2 h-[62%] w-[66%] -translate-x-1/2 overflow-hidden"
              style={{
                borderRadius: "46% 46% 6% 6% / 34% 34% 4% 4%",
                background:
                  "linear-gradient(100deg, #4a0c08 0%, #9c1f17 16%, #d9473d 34%, #a8231a 50%, #6b1310 68%, #c0382c 84%, #4a0c08 100%)",
                clipPath: "polygon(0% 0%, 100% 0%, 100% 86%, 93% 100%, 80% 90%, 66% 100%, 52% 88%, 38% 100%, 22% 90%, 10% 100%, 0% 88%)",
                boxShadow: "0 30px 50px -18px rgba(0,0,0,.75), inset 0 0 40px rgba(0,0,0,.35)",
              }}
            >
              {/* Folds */}
              <span
                aria-hidden
                className="absolute inset-0 mix-blend-multiply"
                style={{
                  background:
                    "repeating-linear-gradient(94deg, rgba(0,0,0,.32) 0 5px, rgba(255,255,255,.12) 9px 14px, transparent 18px 34px)",
                }}
              />
              {/* Soft highlight on the crown of the cloth */}
              <span
                aria-hidden
                className="absolute left-[18%] top-[6%] h-[40%] w-[46%] rounded-full opacity-70 blur-xl"
                style={{ background: "radial-gradient(closest-side, rgba(255,220,200,.45), transparent 75%)" }}
              />
            </div>

            {/* Floor shadow */}
            <div
              aria-hidden
              className="absolute bottom-[-2%] left-1/2 h-[7%] w-[84%] -translate-x-1/2 rounded-[50%] blur-md"
              style={{ background: "rgba(0,0,0,.6)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
