"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, useDeferredGSAP } from "@/lib/gsap";
import { formatDate } from "@/lib/format";
import { RisingCover } from "./RisingCover";
import { Folio } from "./Folio";

type Item = { slug: string; title: string; date: string; topic: string; editionNumber?: number; excerpt: string };

type Props = {
  subscribers: number;
  editions: number;
  newsletterUrl: string;
  items: Item[];
  showingEditions: boolean;
};

export const RisingIdeas = ({ subscribers, editions, newsletterUrl, items, showingEditions }: Props) => {
  const root = useRef<HTMLElement>(null);
  const cover = useRef<HTMLDivElement>(null);

  useDeferredGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-count-to]").forEach((el) => {
        const target = Number(el.dataset.countTo);
        const state = { value: 0 };
        gsap.to(state, {
          value: target,
          duration: 2.2,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
          onUpdate: () => {
            const next = Math.round(state.value);
            el.textContent = next.toLocaleString("en-IN");
          },
        });
      });
      gsap.from("[data-cover]", {
        rotateX: 18,
        rotateY: -24,
        y: 80,
        opacity: 0,
        duration: 1.6,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-cover]", start: "top 80%" },
      });
      gsap.from("[data-issue]", {
        y: 40,
        opacity: 0,
        stagger: 0.09,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-issues]", start: "top 80%" },
      });
    },
    root,
  );

  const tilt = (e: React.PointerEvent) => {
    const rect = cover.current!.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cover.current, { rotateY: dx * 18, rotateX: -dy * 14, duration: 0.6, ease: "power3.out" });
    gsap.to("[data-cover-shine]", { x: dx * 120, y: dy * 120, opacity: 0.5, duration: 0.6 });
  };
  const untilt = () => {
    gsap.to(cover.current, { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1, 0.5)" });
    gsap.to("[data-cover-shine]", { opacity: 0, duration: 0.6 });
  };

  return (
    <section ref={root} data-chapter="Rising Ideas" id="rising-ideas" aria-labelledby="ri-title" className="relative bg-night px-5 py-28 text-night-ink md:px-10 md:py-40">
      <div className="mx-auto max-w-[1440px]">
        <Folio n="ii." label="The newsletter" tone="night" />
        <div className="mt-10 grid items-center gap-14 md:grid-cols-12">
          <div className="[perspective:1200px] md:col-span-5">
            <div
              ref={cover}
              data-cover
              data-cursor="Subscribe"
              onPointerMove={tilt}
              onPointerLeave={untilt}
              className="relative mx-auto aspect-square w-full max-w-[460px] overflow-hidden rounded-[3px] shadow-[0_40px_80px_-20px_rgba(0,0,0,.7),0_0_0_1px_rgba(255,255,255,.04)] [transform-style:preserve-3d]"
            >
              <a href={newsletterUrl} target="_blank" rel="noreferrer" aria-label="Subscribe to Rising Ideas on LinkedIn">
                <RisingCover className="h-full w-full" />
              </a>
              <span
                data-cover-shine
                aria-hidden
                className="pointer-events-none absolute -inset-1/4 opacity-0 mix-blend-soft-light"
                style={{ background: "radial-gradient(circle at center, rgba(255,255,255,.9), transparent 45%)" }}
              />
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <h2 id="ri-title" className="font-display text-[clamp(3rem,7.5vw,7.5rem)] leading-[0.9] tracking-[-0.035em]">
              Rising Ideas
            </h2>
            <p className="mt-6 max-w-[44ch] text-lg leading-relaxed text-night-ink/75">
              A weekly newsletter on LinkedIn: insight and analysis at the intersection of technology, business,
              geopolitics and the forces shaping what comes next.
            </p>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-y border-night-ink/15 py-8">
              <div>
                <dt className="text-sm text-night-soft">Subscribers</dt>
                <dd data-count-to={subscribers} className="tabular mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-none text-night-ink">
                  {subscribers.toLocaleString("en-IN")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-night-soft">Editions</dt>
                <dd data-count-to={editions} className="tabular mt-2 text-[clamp(2rem,4vw,3.5rem)] leading-none text-night-ink">
                  {editions}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-night-soft">Published</dt>
                <dd className="font-display mt-2 text-[clamp(2rem,4vw,3.5rem)] italic leading-none text-ember">weekly</dd>
              </div>
            </dl>
            <a
              href={newsletterUrl}
              target="_blank"
              rel="noreferrer"
              
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-ember px-7 py-4 text-base font-medium text-night transition-transform duration-300 hover:scale-[1.03]"
            >
              Subscribe on LinkedIn
            </a>
          </div>
        </div>

        {items.length > 0 && (
          <div data-issues className="mt-28">
            <h3 className="text-sm text-night-soft">{showingEditions ? "Latest editions" : "From the archive"}</h3>
            <ul className="mt-6 divide-y divide-night-ink/10 border-y border-night-ink/10">
              {items.map((item) => (
                <li key={item.slug} data-issue>
                  <Link
                    href={`/writing/${item.slug}`}
                    data-cursor="Read"
                    
                    className="group grid gap-2 py-7 md:grid-cols-12 md:items-baseline md:gap-6"
                  >
                    <span className="tabular text-sm text-night-soft md:col-span-2">
                      {item.editionNumber ? `No. ${item.editionNumber}` : formatDate(item.date)}
                    </span>
                    <span className="font-display text-[clamp(1.4rem,2.4vw,2.2rem)] leading-tight tracking-[-0.01em] transition-colors duration-300 group-hover:text-ember md:col-span-7">
                      {item.title}
                    </span>
                    <span className="text-sm text-night-soft md:col-span-3 md:text-right">{item.topic}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
