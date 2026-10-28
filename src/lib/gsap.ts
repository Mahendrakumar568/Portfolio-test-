"use client";

import type React from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, useGSAP };

type Scope = React.RefObject<HTMLElement | null>;

declare global {
  interface Window {
    /** Set while navigating to a section link on another page. */
    __pendingHash?: string;
  }
}

/**
 * Sets up a section's scroll motion once the browser is idle, so below-the-fold
 * sections don't compete with the opening animation for the main thread.
 */
export const useDeferredGSAP = (setup: () => void | (() => void), scope: Scope) =>
  useGSAP(
    (context) => {
      if (prefersReducedMotion()) return;
      const run = () => context.add(setup);
      // Arriving at a section link needs every pin in place before scrolling to it.
      if (window.location.hash || window.__pendingHash) return void run();
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(run, { timeout: 2500 });
        return () => window.cancelIdleCallback(id);
      }
      const id = setTimeout(run, 400);
      return () => clearTimeout(id);
    },
    { scope },
  );
