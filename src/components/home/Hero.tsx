"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { INTRO_DONE } from "@/components/site/Preloader";

type Props = { headline: string; thesis: string; portrait?: string };

/*
 * The opening is one sentence told in motion:
 * an idea appears as a spark (seed), the horizon draws in, the sun rises out of
 * haze, the words settle on the horizon, and the outcome is underlined in ember.
 */
export const Hero = ({ headline, thesis, portrait }: Props) => {
  const root = useRef<HTMLElement>(null);
  const lines = splitHeadline(headline);

  useGSAP(
    () => {
      const letters = gsap.utils.toArray<HTMLElement>("[data-letter]");
      const sun = gsap.utils.toArray<HTMLElement>("[data-hero-sun]");
      const seed = gsap.utils.toArray<HTMLElement>("[data-hero-seed]");
      const horizon = gsap.utils.toArray<HTMLElement>("[data-hero-horizon]");
      const underline = gsap.utils.toArray<HTMLElement>("[data-hero-underline]");

      if (prefersReducedMotion()) {
        gsap.set(seed, { opacity: 0 });
        gsap.set([...horizon, ...underline], { scaleX: 1 });
        return;
      }

      // Resolved now, inside the scope: the intro can finish after this setup has returned.
      const fades = gsap.utils.toArray<HTMLElement>("[data-hero-fade]");
      const frame = gsap.utils.toArray<HTMLElement>("[data-hero-portrait]");

      gsap.set(letters, {
        y: "0.9em",
        rotateX: -70,
        opacity: 0,
        filter: "blur(10px)",
        transformOrigin: "50% 100%",
      });
      gsap.set(seed, { scale: 0, opacity: 1 });
      gsap.set(horizon, { scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(underline, { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(sun, { clipPath: "inset(100% 0% 0% 0%)", filter: "blur(28px)", scale: 0.92 });
      gsap.set(fades, { opacity: 0, y: 24 });
      gsap.set(frame, { clipPath: "inset(100% 0% 0% 0%)" });

      const assemble = () => {
        const tl = gsap.timeline();
        tl.fromTo(seed, { scale: 0 }, { scale: 1, duration: 0.5, ease: "back.out(2.4)" }, 0)
          .to(seed, { scale: 0, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.9)
          .to(horizon, { scaleX: 1, duration: 1.4, ease: "expo.inOut" }, 0.3)
          .to(
            sun,
            {
              clipPath: "inset(0% 0% 0% 0%)",
              filter: "blur(0px)",
              scale: 1,
              duration: 2.2,
              ease: "power3.out",
              // Clipping would also cut the glow into a box, so release it once risen.
              clearProps: "clipPath,filter",
            },
            0.6,
          )
          .to(
            letters,
            {
              y: 0,
              rotateX: 0,
              opacity: 1,
              filter: "blur(0px)",
              duration: 1.2,
              ease: "expo.out",
              stagger: 0.028,
            },
            1.0,
          )
          .to(frame, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "expo.inOut" }, 1.4)
          .to(fades, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power3.out" }, 1.6)
          .to(underline, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 2.4);

        // Once risen, the sun keeps a slow breath, so the page never feels frozen.
        gsap.to(sun, { scale: 1.035, duration: 3.6, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 2.8 });
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
        <span
          data-hero-seed
          className="absolute left-1/2 top-1/2 block h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ember shadow-[0_0_24px_10px_rgba(232,119,46,.55)]"
        />
        <div data-hero-horizon className="absolute top-full left-[-60vw] right-[-60vw] h-px bg-ink/30" />
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
          <span data-hero-lean className="block [perspective:900px]">
            {lines.map((line, li) => {
              const glyphs = line.map(({ char, index }) =>
                char === " " ? (
                  <span key={index} className="inline-block w-[0.22em]" />
                ) : (
                  <span key={index} data-letter className="inline-block will-change-transform">
                    {char}
                  </span>
                ),
              );
              return (
                <span key={li} aria-hidden className={`block whitespace-nowrap ${li === 1 ? "md:pl-[14vw]" : ""}`}>
                  {li === 1 ? (
                    <span className="relative inline-block">
                      {glyphs}
                      <span data-hero-underline className="absolute inset-x-0 -bottom-[0.07em] h-[0.035em] bg-ember" />
                    </span>
                  ) : (
                    glyphs
                  )}
                </span>
              );
            })}
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
