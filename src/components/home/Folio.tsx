/** A small chapter mark. The home page reads as one sequence, from idea to outcome. */
export const Folio = ({ n, label, tone = "ink" }: { n: string; label: string; tone?: "ink" | "night" }) => (
  <p className={`flex items-baseline gap-3 text-sm ${tone === "night" ? "text-night-soft" : "text-ink-soft"}`}>
    <span className="font-display italic text-rising">{n}</span>
    <span>{label}</span>
  </p>
);
