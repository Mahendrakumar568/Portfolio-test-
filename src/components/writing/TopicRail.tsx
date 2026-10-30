"use client";

import { useEffect, useState } from "react";

/**
 * A slim rail on the left edge of the writing list. It names the topic of the
 * essay at the reader's eye line, and a click jumps to that topic's first essay.
 */
export const TopicRail = ({ topics }: { topics: string[] }) => {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const rows = Array.from(document.querySelectorAll<HTMLElement>("[data-topic]"));
      const eyeLine = window.innerHeight * 0.4;
      const passed = rows.filter((row) => row.getBoundingClientRect().top <= eyeLine);
      const row = passed[passed.length - 1] ?? rows[0];
      setCurrent(row?.dataset.topic ?? null);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [topics]);

  const jump = (topic: string) => {
    const row = Array.from(document.querySelectorAll<HTMLElement>("[data-topic]")).find((r) => r.dataset.topic === topic);
    row?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (topics.length === 0) return null;

  return (
    <nav aria-label="Jump to topic" className="fixed left-3 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <ol className="relative flex flex-col gap-4">
        <span aria-hidden className="absolute bottom-1 left-[5px] top-1 w-px bg-rule" />
        {topics.map((topic) => {
          const selected = topic === current;
          const label = topic === "Geopolitics" ? "Geopolitics and politics" : topic;
          return (
            <li key={topic} className="relative">
              <button
                type="button"
                onClick={() => jump(topic)}
                aria-label={label}
                title={label}
                aria-current={selected ? "true" : undefined}
                className="group flex h-3 w-3 items-center justify-center"
              >
                <span
                  aria-hidden
                  className={`h-2.5 w-2.5 rounded-full border transition-all duration-300 ${
                    selected ? "scale-110 border-rising bg-rising" : "border-ink/40 bg-paper group-hover:border-ink"
                  }`}
                />
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
