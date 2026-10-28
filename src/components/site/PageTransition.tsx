"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { play } from "@/lib/sound";

/*
 * A curtain in the accent colour wipes up over the page on internal
 * navigation, the route changes underneath, and the curtain lifts away.
 */
/** Fired when an internal link is taken over, so open menus can close. */
export const NAVIGATE = "ri:navigate";

export const PageTransition = () => {
  const curtain = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const covering = useRef(false);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname.startsWith("/admin")) return;
      window.dispatchEvent(new Event(NAVIGATE));
      if (url.pathname === window.location.pathname) {
        const target = url.hash && document.querySelector(url.hash);
        if (target && window.__lenis) {
          e.preventDefault();
          e.stopPropagation();
          window.history.pushState(null, "", url.hash);
          window.__lenis.scrollTo(target as HTMLElement, { offset: -40, duration: 1.6 });
        }
        return;
      }
      if (prefersReducedMotion()) return;

      // Capture phase: take the click before Next's Link handles it.
      e.preventDefault();
      e.stopPropagation();
      covering.current = true;
      window.__pendingHash = url.hash || undefined;
      play("whoosh");
      gsap.fromTo(
        curtain.current,
        { yPercent: 100, display: "block" },
        {
          yPercent: 0,
          duration: 0.6,
          ease: "expo.inOut",
          // Scrolling is handled here, so pins are in place before jumping to a section.
          onComplete: () => router.push(url.pathname + url.search, { scroll: false }),
        },
      );
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router]);

  useEffect(() => {
    const lenis = window.__lenis;
    if (!window.__pendingHash && !window.location.hash) lenis?.scrollTo(0, { immediate: true });
    // Sections set up their pins in effects that run after this one, so wait a frame.
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
      lenis?.resize(); // the new page's height, or Lenis clamps to the old one
      const hash = window.__pendingHash ?? window.location.hash;
      if (window.__pendingHash) window.history.replaceState(null, "", hash);
      window.__pendingHash = undefined;
      const target = hash && document.querySelector(hash);
      if (target) lenis?.scrollTo(target as HTMLElement, { immediate: true, offset: -40 });
    });
    if (!covering.current) return;
    covering.current = false;
    gsap.to(curtain.current, {
      yPercent: -100,
      duration: 0.7,
      delay: 0.1,
      ease: "expo.inOut",
      onComplete: () => gsap.set(curtain.current, { display: "none" }),
    });
  }, [pathname]);

  return (
    <div ref={curtain} aria-hidden className="fixed inset-0 z-[75] hidden bg-rising">
      <span className="font-display absolute bottom-6 left-5 text-sm italic text-paper/80 md:left-10">Rising Ideas</span>
    </div>
  );
};
