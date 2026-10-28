"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { formatDate } from "@/lib/format";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Item = {
  slug: string;
  kind: "edition" | "essay";
  title: string;
  date: string;
  topic: string;
  excerpt: string;
  editionNumber?: number;
  source?: string;
};

const KINDS = [
  { value: "all", label: "Everything" },
  { value: "edition", label: "Rising Ideas" },
  { value: "essay", label: "Essays" },
] as const;

export const WritingIndex = ({ items, topics }: { items: Item[]; topics: string[] }) => {
  const [kind, setKind] = useState<(typeof KINDS)[number]["value"]>("all");
  const [topic, setTopic] = useState<string>("all");
  const list = useRef<HTMLUListElement>(null);

  const visible = useMemo(
    () => items.filter((i) => (kind === "all" || i.kind === kind) && (topic === "all" || i.topic === topic)),
    [items, kind, topic],
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from("[data-row]", { y: 30, opacity: 0, stagger: 0.04, duration: 0.7, ease: "power3.out" });
    },
    { scope: list, dependencies: [kind, topic], revertOnUpdate: true },
  );

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-1.5 text-sm transition-colors ${
      active ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"
    }`;

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-ink/20 pb-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by kind">
          {KINDS.map((k) => (
            <button key={k.value} type="button" aria-pressed={kind === k.value} className={chip(kind === k.value)} onClick={() => setKind(k.value)}>
              {k.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {["all", ...topics].map((t) => (
            <button key={t} type="button" aria-pressed={topic === t} className={chip(topic === t)} onClick={() => setTopic(t)}>
              {t === "all" ? "All topics" : t === "Geopolitics" ? "Geopolitics and politics" : t}
            </button>
          ))}
        </div>
      </div>

      <ul ref={list}>
        {visible.map((item) => (
          <li key={item.slug} data-row className="border-b border-ink/15">
            <Link
              href={`/writing/${item.slug}`}
              data-cursor="Read"
              className="group grid gap-3 py-9 md:grid-cols-12 md:gap-6"
            >
              <div className="text-sm text-ink-soft md:col-span-2">
                <p className="tabular">{formatDate(item.date)}</p>
                <p className="mt-1">
                  {item.kind === "edition" ? (
                    <span className="font-display italic text-rising-ink">Rising Ideas{item.editionNumber ? ` No. ${item.editionNumber}` : ""}</span>
                  ) : (
                    item.topic
                  )}
                </p>
              </div>
              <div className="md:col-span-8">
                <h2 className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.1] tracking-[-0.015em] transition-colors group-hover:text-rising">
                  {item.title}
                </h2>
                <p className="mt-3 max-w-[64ch] text-ink-soft">{item.excerpt}</p>
              </div>
              {item.source && <p className="text-sm text-ink-soft md:col-span-2 md:text-right">First on {item.source}</p>}
            </Link>
          </li>
        ))}
        {visible.length === 0 && (
          <li className="py-16 text-lg text-ink-soft">Nothing here under that filter yet. Try another topic.</li>
        )}
      </ul>
    </>
  );
};
