"use client";

import { useEffect, useState } from "react";

/** Newest first, matching the order the reader meets them while scrolling down. */
const YEARS = ["2026", "2025", "2024"];

/**
 * A fixed ruler that follows the reader down the path. It fills with the scroll
 * through the experience list and marks the year currently in view.
 */
export const CareerRuler = () => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string>(YEARS[0]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const groups = Array.from(document.querySelectorAll<HTMLElement>("[data-year-group]"));
    if (groups.length === 0) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const first = groups[0].getBoundingClientRect();
      const last = groups[groups.length - 1].getBoundingClientRect();
      const span = last.bottom - first.top;
      const inView = first.top < window.innerHeight * 0.85 && last.bottom > window.innerHeight * 0.15;
      setVisible(inView);
      setProgress(span > 0 ? Math.min(1, Math.max(0, (window.innerHeight * 0.5 - first.top) / span)) : 0);

      const passed = groups.filter((g) => g.getBoundingClientRect().top <= window.innerHeight * 0.5);
      const current = passed[passed.length - 1] ?? groups[0];
      setActive(current.dataset.yearGroup ?? YEARS[0]);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed bottom-7 left-1/2 z-40 hidden -translate-x-1/2 transition-all duration-500 md:block ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="relative flex w-[min(60vw,560px)] items-end justify-between rounded-full border border-ink/15 bg-paper/90 px-6 pb-3 pt-4 shadow-[0_12px_30px_-18px_rgba(20,20,20,.5)] backdrop-blur">
        <span className="absolute inset-x-6 bottom-3 h-px bg-rule" />
        <span
          className="absolute bottom-[11px] left-6 h-[2px] origin-left bg-rising transition-transform duration-300"
          style={{ width: "calc(100% - 3rem)", transform: `scaleX(${progress})` }}
        />
        {YEARS.map((year) => {
          const selected = year === active;
          return (
            <div key={year} className="relative flex flex-col items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
                  selected ? "border-rising bg-rising" : "border-ink/40 bg-paper"
                }`}
              />
              <span className={`tabular text-xs transition-colors duration-300 ${selected ? "text-ink" : "text-ink-soft"}`}>{year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
