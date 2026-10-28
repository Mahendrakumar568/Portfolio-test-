"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { INTRO_DONE } from "@/components/site/Preloader";

type Props = { headline: string; thesis: string; portrait?: string };

const seeded = (i: number) => {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
};

export const Hero = ({ headline, thesis, portrait }: Props) => {
  const root = useRef<HTMLElement>(null);
  const lines = splitHeadline(headline);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
      if (prefersReducedMotion()) return;
      // Resolved now, inside the scope: the intro can finish after this setup has returned.
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      const frame = gsap.utils.toArray<HTMLElement>("[data-hero-portrait]");
      const sun = gsap.utils.toArray<HTMLElement>("[data-hero-sun]");

      gsap.set(letters, {
        x: (i) => (seeded(i) - 0.5) * window.innerWidth * 0.9,
        y: (i) => (seeded(i + 99) - 0.5) * window.innerHeight * 0.8,
        rotate: (i) => (seeded(i + 7) - 0.5) * 140,
        opacity: 0,
        scale: (i) => 0.6 + seeded(i + 3) * 1.2,
      });
      gsap.set(fades, { opacity: 0, y: 24 });
      gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(sun, { yPercent: 60, opacity: 0 });

      const assemble = () => {
        const tl = gsap.timeline();
        tl.to(sun, { yPercent: 0, opacity: 1, duration: 2.2, ease: "power3.out" }, 0)
          .to(
            letters,
            {
              x: 0,
              y: 0,
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 1.5,
              ease: "expo.out",
              stagger: { each: 0.035, from: "random" },
            },
            0.1,
          )
          .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 0.7)
          .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 1.0);
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

      // A slight lean toward the pointer.
      const lean = (e: PointerEvent) => {
        const dx = e.clientX / window.innerWidth - 0.5;
        const dy = e.clientY / window.innerHeight - 0.5;
        gsap.to("[data-hero-lean]", { x: dx * 18, y: dy * 10, duration: 1.2, ease: "power3.out" });
        gsap.to(sun, { x: dx * -30, y: dy * -18, duration: 1.6, ease: "power3.out" });
      };
      window.addEventListener("pointermove", lean);
      return () => {
        window.removeEventListener("pointermove", lean);
        window.removeEventListener(INTRO_DONE, assemble);
      };
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative flex min-h-[100svh] flex-col overflow-hidden px-5 pb-10 pt-28 md:px-10 md:pt-32">
      <div data-hero-sun-wrap aria-hidden className="pointer-events-none absolute right-[8%] top-[18%] md:right-[16%]">
        <div
          data-hero-sun
          className="h-[46vw] w-[46vw] rounded-full md:h-[30vw] md:w-[30vw]"
          style={{
            background: "radial-gradient(circle at 50% 40%, #ef8a3c 0%, #c2410c 55%, #9a330a 100%)",
            boxShadow: "0 0 160px 40px rgba(232,119,46,.25)",
          }}
        />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col">
        <p data-hero-fade className="max-w-xs text-sm text-ink-soft">
          Editor of <span className="font-display italic text-ink">Rising Ideas</span>.
          <br />
          Founder&rsquo;s Office at openCT.
        </p>

        <h1
          data-hero-headline
          aria-label={headline}
          className="font-display relative mt-[5vh] text-[17vw] leading-[0.86] tracking-[-0.045em] md:mt-[3vh] md:text-[min(11.6vw,21vh)]"
        >
          <span data-hero-lean className="block">
            {lines.map((line, li) => (
              <span key={li} aria-hidden className={`block whitespace-nowrap ${li === 1 ? "md:pl-[14vw]" : ""}`}>
                {line.map(({ char, index }) =>
                  char === " " ? (
                    <span key={index} className="inline-block w-[0.22em]" />
                  ) : (
                    <span key={index} data-letter className="inline-block will-change-transform">
                      {char}
                    </span>
                  ),
                )}
              </span>
            ))}
          </span>
        </h1>

        <div className="mt-auto grid grid-cols-1 items-end gap-8 pt-10 md:grid-cols-12">
          <p className="max-w-[34ch] text-lg leading-relaxed md:col-span-5 md:text-xl">
            {thesis}
          </p>
          <div data-hero-fade className="hidden items-center gap-3 text-sm text-ink-soft md:col-span-3 md:col-start-7 md:flex">
            <span className="relative block h-10 w-px overflow-hidden bg-rule">
              <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_1.8s_ease-in-out_infinite] bg-ink" />
            </span>
            Scroll to read
          </div>
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
      <style>{`@keyframes scrollcue { 0% { transform: translateY(-100%) } 100% { transform: translateY(200%) } }`}</style>
    </section>
  );
};

/** "Ideas become outcomes." becomes two lines of indexed characters. */
const splitHeadline = (headline: string) => {
  const words = headline.split(" ");
  const breakAt = Math.ceil(words.length / 2);
  const raw = [words.slice(0, breakAt).join(" "), words.slice(breakAt).join(" ")].filter(Boolean);
  let index = 0;
  return raw.map((line) => [...line].map((char) => ({ char, index: index++ })));
};
