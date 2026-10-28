"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { INTRO_DONE } from "@/components/site/Preloader";
import { scrollToTarget } from "@/components/site/SmoothScroll";

type Props = { headline: string; thesis: string; portrait?: string; editor: string; role: string };

const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

const STARS = Array.from({ length: 48 }, (_, i) => ({
  left: `${(seeded(i) * 100).toFixed(2)}%`,
  top: `${(seeded(i + 31) * 78).toFixed(2)}%`,
  size: seeded(i + 57) > 0.8 ? 2 : 1,
}));

/*
 * Dawn. The page opens on night: a sky of stars and a sun below the horizon.
 * The sun climbs, the sky lifts away upward, the words are revealed in the
 * first light, and the outcome is underlined in ember.
 */
export const Hero = ({ headline, thesis, portrait, editor, role }: Props) => {
  const root = useRef<HTMLElement>(null);
  const lines = splitHeadline(headline);

  useGSAP(
    () => {
      const sky = gsap.utils.toArray<HTMLElement>("[data-dawn-sky]");
      const edge = gsap.utils.toArray<HTMLElement>("[data-dawn-edge]");
      const stars = gsap.utils.toArray<HTMLElement>("[data-dawn-star]");
      const sun = gsap.utils.toArray<HTMLElement>("[data-hero-sun]");
      const lineEls = gsap.utils.toArray<HTMLElement>("[data-hero-line]");
      const underline = gsap.utils.toArray<HTMLElement>("[data-hero-underline]");

      if (prefersReducedMotion()) {
        gsap.set(sky, { display: "none" });
        gsap.set(underline, { scaleX: 1 });
        return;
      }

      // Resolved now, inside the scope: the intro can finish after this setup has returned.
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      const frame = gsap.utils.toArray<HTMLElement>("[data-hero-portrait]");

      gsap.set(sun, { yPercent: 170 });
      gsap.set(lineEls, { clipPath: "inset(0% 100% 0% 0%)" });
      gsap.set(underline, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(edge, { yPercent: 0 });
      gsap.set(fades, { opacity: 0, y: 24 });
      gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });

      const assemble = () => {
        const tl = gsap.timeline();
        tl.to(stars, { opacity: 0.85, duration: 0.8, stagger: { each: 0.012, from: "random" } }, 0)
          .to(sun, { yPercent: 0, duration: 2.6, ease: "power3.out" }, 0.2)
          .to(sky, { clipPath: "inset(0% 0% 100% 0%)", duration: 2.4, ease: "expo.inOut" }, 1.0)
          .to(edge, { y: () => -(root.current?.offsetHeight ?? window.innerHeight), duration: 2.4, ease: "expo.inOut" }, 1.0)
          .to(stars, { opacity: 0, duration: 0.9, stagger: { each: 0.01, from: "random" } }, 1.6)
          .to(lineEls[0], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", clearProps: "clipPath" }, 1.9)
          .to(lineEls[1], { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut", clearProps: "clipPath" }, 2.4)
          .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" }, 2.8)
          .to(fades, { opacity: 1, y: 0, duration: 1, stagger: 0.1, ease: "power3.out" }, 3.0)
          .to(edge, { opacity: 0, duration: 0.5 }, 3.1)
          .to(underline, { scaleX: 1, duration: 1.2, ease: "expo.inOut" }, 3.6);

        // Once risen, the sun breathes slowly so the page never feels frozen.
        gsap.to(sun, { scale: 1.03, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 4.4 });
      };

      if ((window as unknown as { __introDone?: boolean }).__introDone) assemble();
      else window.addEventListener(INTRO_DONE, assemble, { once: true });

      // The sun keeps rising as the reader scrolls on.
      gsap.to("[data-hero-sun-wrap]", {
        yPercent: -55,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to("[data-hero-headline]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true },
      });

      // Scroll: the two lines drift apart, so the headline opens up as you read on.
      const scrollOpts = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(lineEls[0], { x: "6vw", ease: "none", scrollTrigger: scrollOpts });
      gsap.to(lineEls[1], { x: "-8vw", ease: "none", scrollTrigger: scrollOpts });

      // Pointer: letters are gently pushed away from the cursor, like light bending around them.
      const glyphs = gsap.utils.toArray<HTMLElement>("[data-letter]");
      let pointer = { x: -1e4, y: -1e4 };
      let pending = 0;
      const push = () => {
        pending = 0;
        for (const glyph of glyphs) {
          const r = glyph.getBoundingClientRect();
          const dx = r.left + r.width / 2 - pointer.x;
          const dy = r.top + r.height / 2 - pointer.y;
          const d = Math.hypot(dx, dy) || 1;
          const force = Math.max(0, 1 - d / 180);
          gsap.to(glyph, {
            x: (dx / d) * force * 28,
            y: (dy / d) * force * 18,
            rotate: force * (dx > 0 ? 4 : -4),
            duration: 0.6,
            ease: "power3.out",
            overwrite: "auto",
          });
        }
      };
      const onMove = (e: PointerEvent) => {
        pointer = { x: e.clientX, y: e.clientY };
        if (!pending) pending = requestAnimationFrame(push);
      };

      // Pointer: the portrait tilts toward the reader.
      const tiltPortrait = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        gsap.to(frame, { rotateY: dx * 14, rotateX: -dy * 10, transformPerspective: 900, duration: 0.9, ease: "power3.out" });
      };

      // A slight lean toward the pointer.
      const lean = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        gsap.to("[data-hero-lean]", { x: dx * 18, y: dy * 10, duration: 1.2, ease: "power3.out" });
        gsap.to(sun, { x: dx * -30, y: dy * -18, duration: 1.6, ease: "power3.out" });
      };
      window.addEventListener("pointermove", lean);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointermove", tiltPortrait);
      return () => {
        window.removeEventListener("pointermove", lean);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointermove", tiltPortrait);
        if (pending) cancelAnimationFrame(pending);
        window.removeEventListener(INTRO_DONE, assemble);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} data-chapter="Opening" className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-32">
      <div data-dawn-sky aria-hidden className="absolute inset-0 bg-night [clip-path:inset(0%_0%_0%_0%)]">
        {STARS.map((star, i) => (
          <span
            key={i}
            data-dawn-star
            className="absolute rounded-full bg-night-ink opacity-0"
            style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          />
        ))}
      </div>
      <div
        data-dawn-edge
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[2px] bg-ember shadow-[0_0_40px_12px_rgba(232,119,46,.55)]"
      />

      <div data-hero-sun-wrap aria-hidden className="pointer-events-none absolute right-[8%] top-[18%] z-[1] md:right-[16%]">
        <div
          data-hero-sun
          className="h-[46vw] w-[46vw] rounded-full md:h-[30vw] md:w-[30vw]"
          style={{
            background: "radial-gradient(circle at 50% 40%, #ef8a3c 0%, #c2410c 55%, #9a330a 100%)",
            boxShadow: "0 0 160px 40px rgba(232,119,46,.25)",
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <p data-hero-fade className="max-w-xs text-sm text-ink-soft">
          {editor}
          <br />
          {role}
        </p>

        <h1
          data-hero-headline
          aria-label={headline}
          className="font-display relative mt-[5vh] text-[17vw] leading-[0.86] tracking-[-0.045em] md:mt-[3vh] md:text-[min(11.6vw,21vh)]"
        >
          <span data-hero-lean className="block">
            {lines.map((line, li) => (
              <span
                key={li}
                data-hero-line
                aria-hidden
                className={`block whitespace-nowrap ${li === 1 ? "md:pl-[14vw]" : ""}`}
              >
                {li === 1 ? (
                  <span className="relative inline-block">
                    {line.map(({ char, index }) => glyph(char, index))}
                    <span data-hero-underline className="absolute inset-x-0 -bottom-[0.07em] h-[0.035em] bg-ember" />
                  </span>
                ) : (
                  line.map(({ char, index }) => glyph(char, index))
                )}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-auto grid grid-cols-1 items-end gap-8 pt-10 md:grid-cols-12">
          <p className="max-w-[34ch] text-lg leading-relaxed md:col-span-5 md:text-xl">
            {thesis}
          </p>
          <button
            type="button"
            data-hero-fade
            onClick={() => scrollToTarget("#thesis")}
            aria-label="Scroll down to begin"
            className="group flex flex-col items-start gap-4 text-left md:col-span-3 md:col-start-7"
          >
            <span className="relative block h-16 w-px overflow-hidden bg-rule">
              <span className="absolute inset-x-0 top-0 h-7 animate-[scrollcue_1.6s_ease-in-out_infinite] bg-ember" />
            </span>
            <span className="font-display text-2xl italic leading-none text-ink transition-colors group-hover:text-rising md:text-3xl">
              Scroll to begin the day
            </span>
            <span className="animate-[nudge_2.4s_ease-in-out_infinite] text-lg text-rising" aria-hidden>
              &darr;
            </span>
          </button>
          {portrait && (
            <figure className="md:col-span-2 md:col-start-11 md:justify-self-end">
              <div data-hero-portrait className="relative aspect-[4/5] w-36 overflow-hidden rounded-[2px] md:w-[min(15vw,26vh)]">
                <Image
                  src={portrait}
                  alt="Portrait of Jithendra Sai Kilaru"
                  fill
                  priority
                  sizes="(min-width: 768px) 15vw, 144px"
                  className="object-cover"
                />
              </div>
              <figcaption data-hero-fade className="mt-2 text-xs text-ink-soft">
                Jithendra Sai Kilaru
              </figcaption>
            </figure>
          )}
        </div>
      </div>
      <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } } @keyframes nudge { 0%, 100% { transform: translateY(0) } 50% { transform: translateY(8px) } }`}</style>
    </section>
  );
};

/** Words need a real gap, so a space is a fixed-width box rather than a collapsed character. */
const glyph = (char: string, index: number) =>
  char === " " ? (
    <span key={index} className="inline-block w-[0.22em]" />
  ) : (
    <span key={index} data-letter className="inline-block will-change-transform">
      {char}
    </span>
  );

/** "Ideas become outcomes." becomes two lines of indexed characters. */
const splitHeadline = (headline: string) => {
  const words = headline.split(" ");
  const breakAt = Math.ceil(words.length / 2);
  const raw = [words.slice(0, breakAt).join(" "), words.slice(breakAt).join(" ")].filter(Boolean);
  let index = 0;
  return raw.map((line) => [...line].map((char) => ({ char, index: index++ })));
};
