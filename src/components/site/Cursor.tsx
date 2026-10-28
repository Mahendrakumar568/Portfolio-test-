"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/*
 * A small ink dot that follows the pointer and opens into a labelled disc over
 * anything marked with data-cursor="Read" (or any other verb).
 */
export const Cursor = () => {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = dot.current!;
    gsap.set(el, { xPercent: -50, yPercent: -50, opacity: 0 });
    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let current = "";

    const move = (e: PointerEvent) => {
      gsap.to(el, { opacity: 1, duration: 0.3, overwrite: "auto" });
      x(e.clientX);
      y(e.clientY);
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button");
      const next = target?.dataset.cursor ?? (target ? "" : null);
      const key = next === null ? "none" : next;
      if (key === current) return;
      current = key;
      setLabel(next ?? "");
      const size = next ? 84 : next === "" ? 36 : 10;
      gsap.to(el, { width: size, height: size, duration: 0.45, ease: "expo.out" });
    };
    const leave = () => gsap.to(el, { opacity: 0, duration: 0.3 });
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={dot}
      aria-hidden
      className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] flex h-[10px] w-[10px] items-center justify-center rounded-full bg-rising text-[11px] font-medium text-paper mix-blend-multiply"
    >
      <span className={label ? "opacity-100 transition-opacity delay-150" : "opacity-0"}>{label}</span>
    </div>
  );
};
