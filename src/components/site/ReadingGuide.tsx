"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const START = { x: 12, y: 58 };
const CONTROL = { x: 90, y: -6 };
const END = { x: 168, y: 58 };
const ESTIMATED_MINUTES = 4;

/** Point on the quadratic arc the sun travels, for progress t between 0 and 1. */
const pointOnArc = (t: number) => {
  const u = 1 - t;
  return {
    x: u * u * START.x + 2 * u * t * CONTROL.x + t * t * END.x,
    y: u * u * START.y + 2 * u * t * CONTROL.y + t * t * END.y,
  };
};

/*
 * A sun that travels across the page as the reader scrolls. It shows how far
 * they have come, names the chapter they are in and the next one, and counts
 * down the minutes left. Near the end it becomes an invitation to get in touch.
 */
export const ReadingGuide = () => {
  const [chapters, setChapters] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [minutes, setMinutes] = useState(ESTIMATED_MINUTES);
  const [done, setDone] = useState(false);
  const sun = useRef<SVGCircleElement>(null);
  const glow = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main section[data-chapter]"));
    if (sections.length === 0) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      setChapters(sections.map((section) => section.dataset.chapter ?? ""));
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, window.scrollY / scrollable);

      const { x, y } = pointOnArc(progress);
      sun.current?.setAttribute("cx", String(x));
      sun.current?.setAttribute("cy", String(y));
      glow.current?.setAttribute("cx", String(x));
      glow.current?.setAttribute("cy", String(y));

      const line = window.innerHeight * 0.4;
      let index = 0;
      sections.forEach((section, i) => {
        if (section.getBoundingClientRect().top <= line) index = i;
      });
      setCurrent(index);
      setMinutes(Math.max(1, Math.ceil((1 - progress) * ESTIMATED_MINUTES)));
      setDone(progress > 0.96);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  if (chapters.length === 0) return null;
  const next = chapters[current + 1];

  return (
    <aside
      aria-label="Reading progress"
      className="fixed bottom-4 right-4 z-40 w-[min(23rem,calc(100vw-2rem))] rounded-[3px] border border-rule bg-paper/90 px-4 py-3 text-ink shadow-[0_12px_40px_-12px_rgba(22,21,19,.3)] backdrop-blur md:bottom-6 md:right-6"
    >
      <div className="flex items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-soft">
            {done ? "You made it" : `Now · ${chapters[current]}`}
          </p>
          <p className="mt-0.5 truncate text-sm">
            {done ? "Let's talk ideas." : next ? `Up next: ${next} · about ${minutes} min left` : `About ${minutes} min left`}
          </p>
        </div>
        <svg viewBox="0 0 180 70" className="h-12 w-[120px] shrink-0" aria-hidden>
          <line x1="0" x2="180" y1="58" y2="58" stroke="currentColor" strokeOpacity=".25" />
          <path
            d="M12 58 Q90 -6 168 58"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".3"
            strokeDasharray="2 4"
          />
          <circle ref={glow} r={done ? 13 : 9} cx={START.x} cy={START.y} fill="#e8772e" opacity=".35" />
          <circle ref={sun} r={done ? 7 : 5} cx={START.x} cy={START.y} fill="#c2410c" />
        </svg>
      </div>
      {done && (
        <Link
          href="/#contact"
          className="mt-3 inline-flex rounded-full bg-ink px-4 py-2 text-sm text-paper transition-colors hover:bg-rising"
        >
          Start a conversation &rarr;
        </Link>
      )}
    </aside>
  );
};
