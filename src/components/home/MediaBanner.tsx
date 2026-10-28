import type { MediaItem } from "@/lib/copy";

/** Press and features as a slow strip: logos where there is one, otherwise a quoted snippet. */
export const MediaBanner = ({ items }: { items: MediaItem[] }) => {
  if (items.length === 0) return null;
  // Two copies side by side let the strip loop without a jump.
  const loop = [...items, ...items];
  return (
    <section aria-label="Featured in" className="overflow-hidden border-y border-ink/15 py-9">
      <div className="media-track flex w-max items-center gap-16 pr-16">
        {loop.map((item, i) => {
          const copy = (
            <>
              {item.logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.logo} alt={i < items.length ? item.label : ""} className="h-9 w-auto object-contain opacity-75 transition-opacity group-hover:opacity-100" />
              ) : (
                <span className="flex items-baseline gap-3 whitespace-nowrap">
                  {item.snippet && <span className="font-display text-2xl italic text-ink">&ldquo;{item.snippet}&rdquo;</span>}
                  <span className="text-sm text-ink-soft">{item.label}</span>
                </span>
              )}
            </>
          );
          return (
            <div key={i} aria-hidden={i >= items.length || undefined} className="group flex shrink-0 items-center">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  {copy}
                </a>
              ) : (
                copy
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
