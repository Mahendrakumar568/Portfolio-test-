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

/** Where each subject's beam leaves the prism, and where it lands. */
const RAY_ENDS = [
  { x: 460, y: 42 },
  { x: 460, y: 108 },
  { x: 460, y: 176 },
  { x: 460, y: 244 },
];
const EXIT = { x: 226, y: 138 };

/** Draws every stroke in a container from nothing to full, once. */
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
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const panel = PANELS[active];
  const essay = essayLinks[panel.title];

  // The beam is drawn by scrolling: it fills in as the lens comes into view.
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

  // Changing subject lights its beam and redraws its figure.
  useEffect(() => {
    if (!prism.current) return;
    gsap.to(prism.current.querySelectorAll("[data-ray]"), {
      opacity: (i) => (i === active ? 1 : 0.22),
      strokeWidth: (i) => (i === active ? 3 : 1),
      duration: 0.6,
      ease: "power3.out",
    });
    if (prefersReducedMotion() || !detail.current) return;
    gsap.fromTo(
      detail.current.querySelectorAll("[data-text]"),
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.07, ease: "power3.out" },
    );
    drawStrokes(detail.current);
  }, [active]);

  const onTabKey = (event: KeyboardEvent<HTMLElement>) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key];
    if (!step) return;
    event.preventDefault();
    const next = (active + step + PANELS.length) % PANELS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section ref={root} data-chapter="The lens" aria-labelledby="lens-title" className="relative overflow-hidden bg-paper-deep px-5 py-28 md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <Folio n="i." label="The lens" />
        <h2 id="lens-title" className="font-display mt-4 max-w-[18ch] text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.02] tracking-[-0.02em]">
          Four subjects, read for the logic underneath.
        </h2>

        <div className="mt-16 grid items-center gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <svg ref={prism} viewBox="0 0 480 290" className="h-auto w-full" aria-hidden>
              <path data-beam d="M16 138 L146 138" {...stroke} stroke="#161513" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
              <path data-beam d="M190 52 L268 196 L112 196 Z" {...stroke} stroke="#161513" strokeWidth={1.4} vectorEffect="non-scaling-stroke" />
              {RAY_ENDS.map((end, i) => (
                <path
                  key={i}
                  data-ray
                  data-beam
                  d={`M${EXIT.x} ${EXIT.y} L${end.x} ${end.y}`}
                  fill="none"
                  stroke={i === active ? "#e8772e" : "#c2410c"}
                  strokeWidth={i === active ? 3 : 1}
                  opacity={i === active ? 1 : 0.22}
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>
          </div>

          <div role="tablist" aria-label="Subjects" onKeyDown={onTabKey} className="md:col-span-5 md:col-start-8">
            {PANELS.map((item, i) => {
              const selected = i === active;
              return (
                <button
                  key={item.title}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`lens-tab-${i}`}
                  aria-selected={selected}
                  aria-controls="lens-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`group flex w-full items-baseline gap-5 border-t border-ink/15 py-5 text-left transition-colors last:border-b ${
                    selected ? "text-ink" : "text-ink-soft hover:text-ink"
                  }`}
                >
                  <span className="tabular text-sm text-rising-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-display text-2xl leading-tight tracking-[-0.01em] md:text-[1.9rem]">{item.title}</span>
                  <span
                    aria-hidden
                    className={`ml-auto h-px self-center transition-all duration-500 ${selected ? "w-12 bg-ember" : "w-4 bg-ink/30"}`}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div
          ref={detail}
          id="lens-panel"
          role="tabpanel"
          aria-labelledby={`lens-tab-${active}`}
          className="mt-16 grid gap-10 border-t border-ink/15 pt-12 md:grid-cols-12 md:gap-16"
        >
          <div data-text className="md:col-span-7">
            <h3 className="font-display text-[clamp(2.4rem,5vw,5rem)] leading-[0.95] tracking-[-0.03em]">{panel.title}</h3>
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
          <div data-text className="aspect-square w-full max-w-[280px] justify-self-start text-ink md:col-span-4 md:col-start-9 md:justify-self-end">
            {panel.figure}
          </div>
        </div>
      </div>
    </section>
  );
};
