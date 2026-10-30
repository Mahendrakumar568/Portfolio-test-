import type { MediaItem } from "@/lib/copy";

/** Press and features as a bold strip on a dark band: logos on paper chips, or big quoted snippets. */
export const MediaBanner = ({ items }: { items: MediaItem[] }) => {
  if (items.length === 0) return null;
  // Two copies side by side let the strip loop without a jump.
  const loop = [...items, ...items];
  return (
    <section aria-label="Featured in" className="relative overflow-hidden bg-night py-16 text-night-ink md:py-20">
      <p className="mx-auto mb-10 flex max-w-[1440px] items-center gap-3 px-5 text-sm text-ember md:px-10">
        <span aria-hidden className="inline-block h-2 w-2 animate-pulse rounded-full bg-ember" />
        Featured in
      </p>
      <div className="media-track flex w-max items-center gap-14 pr-14">
        {loop.map((item, i) => {
          const text = (
            <span className="flex items-baseline gap-5 whitespace-nowrap">
              {item.snippet && (
                <span className="font-display text-[clamp(1.75rem,3.2vw,2.9rem)] italic leading-tight tracking-[-0.02em] transition-colors group-hover:text-ember">
                  &ldquo;{item.snippet}&rdquo;
                </span>
              )}
              <span className="text-base tracking-wide text-night-ink/70">{item.label}</span>
            </span>
          );
          // A logo sits in a fixed chip beside its name and quote, so no item loses its words.
          const content = item.logo ? (
            <span className="flex items-center gap-6 whitespace-nowrap">
              <span className="flex h-24 w-56 shrink-0 items-center justify-center rounded-xl bg-paper p-5 transition-transform duration-300 group-hover:scale-105">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.logo} alt={i < items.length ? item.label : ""} className="max-h-full max-w-full object-contain" />
              </span>
              {text}
            </span>
          ) : (
            text
          );
          return (
            <div key={i} aria-hidden={i >= items.length || undefined} className="group flex shrink-0 items-center gap-14">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="inline-block">
                  {content}
                </a>
              ) : (
                content
              )}
              <span aria-hidden className="inline-block h-3 w-3 rotate-45 bg-ember" />
            </div>
          );
        })}
      </div>
    </section>
  );
};
