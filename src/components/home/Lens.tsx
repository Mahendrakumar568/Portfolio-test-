"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { gsap, useDeferredGSAP, prefersReducedMotion } from "@/lib/gsap";
import { Folio } from "./Folio";

type Panel = { title: string; line: string; figure: React.ReactNode };
type EssayLink = { title: string; href: string } | undefined;

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, vectorEffect: "non-scaling-stroke" as const };

const PANELS: Panel[] = [
  {
    title: "Startups",
    line: "How a founder turns a hunch into something people pay for, and what a headline about a startup really says about the problem underneath.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <circle data-draw cx="100" cy="150" r="6" {...stroke} />
        <path data-draw d="M100 144 C 100 110, 70 90, 60 50" {...stroke} />
        <path data-draw d="M100 144 C 100 100, 130 80, 150 30" {...stroke} />
        <path data-draw d="M100 144 C 100 120, 100 80, 100 20" {...stroke} />
        <path data-draw d="M40 170 H160" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Business models",
    line: "Who pays, for what, and why they keep paying. Speed, trust and aggregation, and the markets where each one stops working.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <circle data-draw cx="78" cy="88" r="44" {...stroke} />
        <circle data-draw cx="122" cy="88" r="44" {...stroke} />
        <circle data-draw cx="100" cy="126" r="44" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Emerging technology",
    line: "AI as augmentation, not replacement. Search, security and the systems that decide what reaches us, explained from the inside.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        {[40, 80, 120, 160].map((x) =>
          [40, 80, 120, 160].map((y) => <circle key={`${x}-${y}`} data-draw cx={x} cy={y} r="3" {...stroke} />),
        )}
        <path data-draw d="M40 160 L80 120 L120 120 L160 40 M80 120 L80 40 L120 80 L160 80" {...stroke} />
      </svg>
    ),
  },
  {
    title: "Strategy and geopolitics",
    line: "Tariffs, energy and alliances. Why India will not be cornered into choosing between powers, and what that means for business.",
    figure: (
      <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
        <circle data-draw cx="100" cy="100" r="70" {...stroke} />
        <ellipse data-draw cx="100" cy="100" rx="30" ry="70" {...stroke} />
        <ellipse data-draw cx="100" cy="100" rx="56" ry="70" {...stroke} />
        <path data-draw d="M30 100 H170 M40 66 H160 M40 134 H160" {...stroke} />
      </svg>
    ),
  },
];

/** Prism geometry in a 480 x 290 box. Rays end at the right, where each label sits. */
const VIEW = { width: 480, height: 290 };
const EXIT = { x: 226, y: 138 };
const RAY_ENDS = [
  { x: 372, y: 42 },
  { x: 372, y: 108 },
  { x: 372, y: 176 },
  { x: 372, y: 244 },
];
/** One colour per subject, so the split light reads as a spectrum. */
const RAY_COLORS = ["#5ee6ff", "#d4f25c", "#b48cff", "#ff9d4d"];
const AUTOPLAY_MS = 5200;

/** Draws every stroke in a container from nothing to full. */
const drawStrokes = (root: ParentNode, duration = 1.2) =>
  root.querySelectorAll<SVGGeometryElement>("[data-draw]").forEach((path) => {
    const length = path.getTotalLength();
    gsap.fromTo(
      path,
      { strokeDasharray: length, strokeDashoffset: length },
      { strokeDashoffset: 0, duration, ease: "power2.inOut" },
    );
  });

export const Lens = ({ essayLinks }: { essayLinks: Record<string, EssayLink> }) => {
  const root = useRef<HTMLElement>(null);
  const prism = useRef<SVGSVGElement>(null);
  const detail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  // Once a reader takes control, the lens stops moving on its own.
  const [paused, setPaused] = useState(false);
  const panel = PANELS[active];
  const essay = essayLinks[panel.title];

  // The beam is drawn as the reader scrolls down to it.
  useDeferredGSAP(
    () => {
      if (!prism.current) return;
      gsap.from(prism.current.querySelectorAll("[data-beam]"), {
        strokeDashoffset: (i, el) => (el as SVGGeometryElement).getTotalLength(),
        strokeDasharray: (i, el) => (el as SVGGeometryElement).getTotalLength(),
        ease: "none",
        scrollTrigger: { trigger: prism.current, start: "top 95%", end: "top 35%", scrub: true },
      });
    },
    root,
  );

  // Gentle autoplay invites the reader to try the subjects, then gives way to them.
  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setActive((a) => (a + 1) % PANELS.length), AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  // Changing subject lights its ray and redraws its figure.
  useEffect(() => {
    if (prism.current) {
      gsap.to(prism.current.querySelectorAll("[data-ray]"), {
        opacity: (i) => (i === active ? 1 : 0.2),
        strokeWidth: (i) => (i === active ? 3.2 : 1),
        duration: 0.6,
        ease: "power3.out",
      });
    }
    if (prefersReducedMotion() || !detail.current) return;
    gsap.fromTo(
      detail.current.querySelectorAll("[data-text]"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
    );
    drawStrokes(detail.current);
  }, [active]);

  const choose = (index: number) => {
    setPaused(true);
    setActive((index + PANELS.length) % PANELS.length);
  };

  const onKey = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      choose(active + 1);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      choose(active - 1);
    }
  };

  return (
    <>
      <section
        ref={root}
        data-chapter="The lens"
        aria-labelledby="lens-title"
        onKeyDown={onKey}
        className="relative overflow-hidden bg-paper-deep px-5 pb-24 pt-28 md:px-10 md:pb-32 md:pt-36"
      >
        <div className="mx-auto max-w-[1440px]">
          <Folio n="i." label="The lens" />
          <h2
            id="lens-title"
            className="font-display mt-4 max-w-[20ch] text-[clamp(2.6rem,6vw,6rem)] leading-[0.98] tracking-[-0.03em]"
          >
            Four subjects, one way of reading.
          </h2>
          <p className="mt-6 flex items-center gap-3 text-sm uppercase tracking-[0.2em] text-rising-ink">
            <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember" />
            {paused ? "Choose a subject" : "Tap a subject, or use the arrow keys"}
          </p>

          <div className="relative mx-auto mt-14 w-full max-w-[1100px]">
            <div
              className="relative overflow-hidden rounded-[2rem] bg-night"
              style={{
                background:
                  "radial-gradient(ellipse 70% 80% at 40% 55%, rgba(31,169,214,.38), transparent 70%), radial-gradient(ellipse 40% 30% at 50% 100%, rgba(200,243,90,.22), transparent 70%), #0e0f12",
              }}
            >
              <svg
                ref={prism}
                viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                className="block h-auto w-full"
                aria-hidden
              >
                <defs>
                  <linearGradient id="lens-body" x1="0" y1="0" x2="0.5" y2="1">
                    <stop offset="0" stopColor="#e9fdff" stopOpacity="0.85" />
                    <stop offset="0.45" stopColor="#4fd3ff" stopOpacity="0.6" />
                    <stop offset="1" stopColor="#c8f35a" stopOpacity="0.55" />
                  </linearGradient>
                  <radialGradient id="lens-core">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
                    <stop offset="0.4" stopColor="#8ff0ff" stopOpacity="0.8" />
                    <stop offset="1" stopColor="#8ff0ff" stopOpacity="0" />
                  </radialGradient>
                  <filter id="lens-glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter id="lens-bloom" x="-100%" y="-100%" width="300%" height="300%">
                    <feGaussianBlur stdDeviation="14" />
                  </filter>
                </defs>

                <ellipse cx="205" cy="208" rx="120" ry="18" fill="#c8f35a" opacity="0.4" filter="url(#lens-bloom)" />
                <path d="M190 52 L268 196 L112 196 Z" fill="url(#lens-body)" />
                <ellipse cx="200" cy="168" rx="46" ry="30" fill="url(#lens-core)" filter="url(#lens-bloom)" />

                <g filter="url(#lens-glow)">
                  <path data-beam d="M16 138 L146 138" fill="none" stroke="#bff6ff" strokeWidth={1.8} vectorEffect="non-scaling-stroke" />
                  <path data-beam d="M190 52 L268 196 L112 196 Z" fill="none" stroke="#9fe9ff" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
                  {RAY_ENDS.map((end, i) => (
                    <path
                      key={i}
                      data-ray
                      data-beam
                      d={`M${EXIT.x} ${EXIT.y} L${end.x} ${end.y}`}
                      fill="none"
                      stroke={RAY_COLORS[i]}
                      strokeWidth={i === active ? 3.2 : 1}
                      opacity={i === active ? 1 : 0.2}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </g>
              </svg>
            </div>

            <div role="tablist" aria-label="Subjects" className="mt-8 grid gap-2 md:absolute md:inset-0 md:mt-0 md:block">
              {PANELS.map((item, i) => {
                const selected = i === active;
                const top = `${(RAY_ENDS[i].y / VIEW.height) * 100}%`;
                return (
                  <button
                    key={item.title}
                    type="button"
                    role="tab"
                    id={`lens-tab-${i}`}
                    aria-selected={selected}
                    aria-controls="lens-panel"
                    tabIndex={selected ? 0 : -1}
                    onClick={() => choose(i)}
                    style={{ ["--y" as string]: top }}
                    className={`group flex w-full items-center gap-4 rounded-full border px-5 py-3 text-left transition-all duration-500 md:absolute md:left-[80%] md:w-[20%] md:-translate-y-1/2 md:[top:var(--y)] md:py-2.5 ${
                      selected
                        ? "border-ember bg-ember text-paper shadow-[0_10px_30px_-10px_rgba(194,65,12,.6)]"
                        : "border-ink/20 bg-paper/60 text-ink hover:border-ember hover:bg-paper"
                    }`}
                  >
                    <span className={`tabular text-xs ${selected ? "text-paper/80" : "text-rising-ink"}`}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl leading-tight md:text-[1.35rem]">{item.title}</span>
                    <span aria-hidden className={`ml-auto text-lg transition-transform duration-300 ${selected ? "translate-x-0" : "-translate-x-1 group-hover:translate-x-0"}`}>
                      &rarr;
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-12 flex items-center justify-between gap-6">
            <div className="flex items-center gap-2" aria-hidden>
              {PANELS.map((item, i) => (
                <span key={item.title} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-10 bg-ember" : "w-3 bg-ink/25"}`} />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => choose(active - 1)}
                aria-label="Previous subject"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-ink/25 text-xl transition-colors hover:border-ember hover:text-rising"
              >
                &larr;
              </button>
              <button
                type="button"
                onClick={() => choose(active + 1)}
                aria-label="Next subject"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-xl text-paper transition-colors hover:bg-rising"
              >
                &rarr;
              </button>
            </div>
          </div>

          <div
            ref={detail}
            id="lens-panel"
            role="tabpanel"
            aria-labelledby={`lens-tab-${active}`}
            className="mt-14 grid gap-10 border-t border-ink/15 pt-12 md:grid-cols-12 md:gap-16"
          >
            <div data-text className="md:col-span-7">
              <p className="tabular text-sm text-rising-ink">{String(active + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}</p>
              <h3 className="font-display mt-3 text-[clamp(2.6rem,5.4vw,5.4rem)] leading-[0.95] tracking-[-0.03em]">{panel.title}</h3>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-ink-soft md:text-xl">{panel.line}</p>
              {essay && (
                <Link href={essay.href} data-cursor="Read" className="group mt-10 inline-block text-base">
                  <span className="text-ink-soft">Read </span>
                  <span className="font-display italic underline decoration-rising decoration-1 underline-offset-4 transition-colors group-hover:text-rising">
                    {essay.title}
                  </span>
                </Link>
              )}
            </div>
            <div data-text className="aspect-square w-full max-w-[280px] text-ink md:col-span-4 md:col-start-9 md:justify-self-end">
              {panel.figure}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="lens-close" className="border-t border-ink/15 bg-paper px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-12 md:grid-cols-12">
          <h3 id="lens-close" className="font-display text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.02] tracking-[-0.02em] md:col-span-7">
            All four ask the same question: how does an idea become an outcome?
          </h3>
          <div className="flex flex-col gap-4 md:col-span-4 md:col-start-9 md:justify-end">
            <Link href="/writing" className="group flex items-center justify-between border-t border-ink/20 py-5 text-lg transition-colors hover:text-rising">
              Read the essays <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
            <Link href="/#contact" className="group flex items-center justify-between border-t border-b border-ink/20 py-5 text-lg transition-colors hover:text-rising">
              Start a conversation <span aria-hidden className="transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
