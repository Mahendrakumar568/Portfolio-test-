/*
 * A vector redraw of the Rising Ideas cover: a bare tree on parchment with
 * birds lifting off, and the motto. Drawn in code so it stays sharp at any size.
 */

type Branch = { d: string; w: number };

const rand = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const grow = (x: number, y: number, angle: number, length: number, width: number, depth: number, seed: number, out: Branch[]) => {
  if (depth === 0 || length < 4) return;
  const bend = (rand(seed) - 0.5) * 0.5;
  const x2 = x + Math.cos(angle) * length;
  const y2 = y + Math.sin(angle) * length;
  const cx = x + Math.cos(angle + bend) * length * 0.5;
  const cy = y + Math.sin(angle + bend) * length * 0.5;
  out.push({ d: `M${x.toFixed(1)} ${y.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`, w: width });
  const spread = 0.38 + rand(seed + 1) * 0.3;
  grow(x2, y2, angle - spread, length * (0.7 + rand(seed + 2) * 0.12), width * 0.68, depth - 1, seed * 2 + 1, out);
  grow(x2, y2, angle + spread, length * (0.66 + rand(seed + 3) * 0.12), width * 0.68, depth - 1, seed * 2 + 2, out);
  if (rand(seed + 4) > 0.6) grow(x2, y2, angle + (rand(seed + 5) - 0.5) * 0.4, length * 0.5, width * 0.5, depth - 2, seed * 3, out);
};

const branches: Branch[] = [];
grow(212, 300, -Math.PI / 2, 62, 9, 8, 7, branches);

const BIRDS = [
  [250, 70, 1],
  [272, 52, 0.8],
  [292, 38, 0.65],
  [262, 30, 0.55],
  [232, 48, 0.7],
] as const;

export const RisingCover = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 320 320" className={className} role="img" aria-label="Rising Ideas cover: a bare tree with birds rising">
    <defs>
      <radialGradient id="parchment" cx="45%" cy="40%" r="75%">
        <stop offset="0%" stopColor="#f3e3c3" />
        <stop offset="70%" stopColor="#e2c99c" />
        <stop offset="100%" stopColor="#b98e57" />
      </radialGradient>
      <filter id="rough">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="n" />
        <feColorMatrix in="n" values="0 0 0 0 0.45  0 0 0 0 0.3  0 0 0 0 0.15  0 0 0 0.18 0" />
        <feComposite in2="SourceGraphic" operator="in" />
        <feBlend in="SourceGraphic" mode="multiply" />
      </filter>
    </defs>
    <rect width="320" height="320" fill="url(#parchment)" filter="url(#rough)" />
    <rect x="10" y="10" width="300" height="300" fill="none" stroke="#6b4a22" strokeOpacity=".35" />
    <g stroke="#3b2a17" strokeLinecap="round" fill="none">
      {branches.map((b, i) => (
        <path key={i} d={b.d} strokeWidth={b.w} />
      ))}
    </g>
    <path d="M150 300 Q212 286 290 300" stroke="#3b2a17" strokeWidth="2" fill="none" />
    <g fill="#c2410c">
      {BIRDS.map(([x, y, s], i) => (
        <path
          key={i}
          transform={`translate(${x} ${y}) scale(${s})`}
          d="M-10 0 Q-5 -6 0 0 Q5 -6 10 0 Q5 -3 0 2 Q-5 -3 -10 0Z"
        />
      ))}
    </g>
    <text x="28" y="74" fontFamily="var(--font-display), Georgia, serif" fontWeight="800" fontSize="44" fill="#2a1d10" letterSpacing="-1">
      RISING
    </text>
    <text x="40" y="112" fontFamily="var(--font-display), Georgia, serif" fontStyle="italic" fontSize="38" fill="#2a1d10">
      Ideas
    </text>
    <text fontFamily="var(--font-display), Georgia, serif" fontSize="11.5" fill="#3b2a17">
      <tspan x="28" y="150">Rise above the storm</tspan>
      <tspan x="28" y="166">and you will find</tspan>
      <tspan x="28" y="182">the sunshine.</tspan>
    </text>
  </svg>
);
