"use client";

import Image from "next/image";
import { useRef } from "react";
import type { Signal } from "@/lib/types";
import type { SiteCopy } from "@/lib/copy";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { Folio } from "./Folio";

type Props = {
  copy: SiteCopy["home"];
  signal: Signal;
  email: string;
  linkedinUrl: string;
  newsletterUrl: string;
};

export const Contact = ({ copy, signal, email, linkedinUrl, newsletterUrl }: Props) => {
  const root = useRef<HTMLElement>(null);
  const signalOn = signal.mode !== "off";
  const headline = signalOn ? copy.contactHeadlineSignal : copy.contactHeadline;

  useDeferredGSAP(
    () => {
      gsap.fromTo(
        "[data-contact-headline]",
        { scale: 0.55, transformOrigin: "left bottom" },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 20%", scrub: true },
        },
      );
      gsap.from("[data-contact-photo]", {
        clipPath: "inset(0 100% 0 0)",
        duration: 1.4,
        ease: "expo.inOut",
        scrollTrigger: { trigger: "[data-contact-photo]", start: "top 85%" },
      });
    },
    root,
  );

  // Opens a new Gmail message to the address; without an address, the LinkedIn profile.
  const writeHref = email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}` : linkedinUrl;

  return (
    <section ref={root} data-chapter="Conversation" id="contact" aria-labelledby="contact-title" className="overflow-hidden px-5 pb-20 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1440px]">
        <Folio n="iii." label="Conversation" />
        <h2
          id="contact-title"
          data-contact-headline
          className="font-display mt-6 whitespace-nowrap text-[clamp(3rem,11.5vw,12rem)] leading-[0.9] tracking-[-0.045em]"
        >
          {headline}
        </h2>

        <div className="mt-16 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-[40ch] text-xl leading-relaxed">
              {signalOn ? signal.message : copy.contactLine}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <a
                  href={writeHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full bg-ink px-8 py-4 text-base text-paper transition-colors hover:bg-rising"
                >
                  {signalOn ? signal.ctaLabel : email ? copy.writeLabel : copy.linkedinLabel}
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href={newsletterUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-full border border-ink/30 px-8 py-4 text-base transition-colors hover:border-ink"
                >
                  {copy.readLabel}
                </a>
              </Magnetic>
            </div>
          </div>
          <figure className="md:col-span-6 md:col-start-7">
            <div data-contact-photo className="relative aspect-[4/3] overflow-hidden rounded-[2px]">
              <Image
                src="/images/portrait-standing.jpg"
                alt="Jithendra Sai Kilaru, arms crossed, outdoors"
                fill
                sizes="(min-width: 768px) 46vw, 90vw"
                className="object-cover object-[60%_30%]"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
};

/** Buttons that lean toward the pointer and spring back. */
const Magnetic = ({ children }: { children: React.ReactNode }) => {
  const el = useRef<HTMLSpanElement>(null);
  const move = (e: React.PointerEvent) => {
    const rect = el.current!.getBoundingClientRect();
    gsap.to(el.current, {
      x: (e.clientX - rect.left - rect.width / 2) * 0.3,
      y: (e.clientY - rect.top - rect.height / 2) * 0.4,
      duration: 0.5,
      ease: "power3.out",
    });
  };
  const reset = () => gsap.to(el.current, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
  return (
    <span ref={el} onPointerMove={move} onPointerLeave={reset} className="inline-block">
      {children}
    </span>
  );
};
