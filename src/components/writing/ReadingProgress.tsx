"use client";

import { useEffect, useRef } from "react";

/** A hairline across the top that fills as the article is read. */
export const ReadingProgress = () => {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.current!.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-rising" />;
};
