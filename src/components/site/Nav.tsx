"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { Signal } from "@/lib/types";
import { NAVIGATE } from "./PageTransition";

const LINKS = [
  { href: "/#rising-ideas", label: "Rising Ideas" },
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export const Nav = ({ signal }: { signal: Signal }) => {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const last = useRef(0);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 240 && y > last.current);
      setSolid(y > 40);
      last.current = y;
    };
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener(NAVIGATE, closeMenu);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener(NAVIGATE, closeMenu);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 z-50 transition-[transform,background-color] duration-500 ${
        signal.mode === "featured" ? "top-10" : "top-0"
      } ${hidden ? "-translate-y-[180%]" : "translate-y-0"} ${solid || menuOpen ? "bg-paper/95 backdrop-blur-md" : ""}`}
    >
      <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-5 py-4 md:px-10">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-display text-lg leading-none tracking-tight" data-cursor="Home">
            Jithendra Sai Kilaru
          </Link>
          {signal.mode === "subtle" && <SunDot message={signal.message} />}
        </div>
        <div className="flex items-center gap-6 md:gap-8">
          <ul className="hidden items-center gap-7 text-sm md:flex">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:origin-left hover:after:scale-x-100 ${
                    pathname.startsWith("/writing") && link.href === "/writing" ? "after:scale-x-100" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="text-sm md:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>
      {menuOpen && (
        <div id="mobile-menu" className="fixed inset-x-0 top-full h-[100svh] bg-paper px-5 pt-6 md:hidden">
          <ul className="space-y-2">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMenuOpen(false)} className="font-display block text-5xl leading-tight tracking-[-0.03em]">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

/** The subtle availability signal: a small sun that glows beside his name. */
const SunDot = ({ message }: { message: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        aria-label={message}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="relative flex h-4 w-4 items-center justify-center"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-ember/40 [animation-duration:2.4s]" />
        <span className="h-2.5 w-2.5 rounded-full bg-gradient-to-b from-ember to-rising shadow-[0_0_14px_3px_rgba(232,119,46,.55)]" />
      </button>
      <span
        role="status"
        className={`absolute left-1/2 top-7 w-64 -translate-x-1/2 rounded-md bg-ink px-4 py-3 text-sm leading-snug text-paper shadow-xl transition-all duration-300 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        {message}{" "}
        <Link href="/#contact" className="text-ember underline underline-offset-2">
          Say hello
        </Link>
      </span>
    </span>
  );
};
