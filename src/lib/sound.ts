"use client";

/*
 * Every sound on the site is synthesised with the Web Audio API, so there are
 * no audio files to download. Nothing plays until the visitor turns sound on.
 */

type Cue = "tick" | "press" | "whoosh" | "page" | "chime" | "crystal" | "tone";

const STORAGE_KEY = "ri-sound";
const listeners = new Set<(on: boolean) => void>();

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ambient: { stop: () => void } | null = null;
let enabled = false;
let lastPlayed: Partial<Record<Cue, number>> = {};

const audio = () => {
  if (!ctx) {
    ctx = new AudioContext();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  return { ctx, out: master! };
};

const noiseBuffer = (c: AudioContext, seconds: number) => {
  const buffer = c.createBuffer(1, c.sampleRate * seconds, c.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buffer;
};

const envelope = (c: AudioContext, peak: number, attack: number, release: number) => {
  const gain = c.createGain();
  const now = c.currentTime;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + attack + release);
  return gain;
};

const tone = (freq: number, type: OscillatorType, peak: number, attack: number, release: number, detune = 0) => {
  const { ctx: c, out } = audio();
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.value = freq;
  osc.detune.value = detune;
  const env = envelope(c, peak, attack, release);
  osc.connect(env).connect(out);
  osc.start();
  osc.stop(c.currentTime + attack + release + 0.05);
};

const noise = (seconds: number, filterType: BiquadFilterType, from: number, to: number, peak: number, q = 0.8) => {
  const { ctx: c, out } = audio();
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c, seconds);
  const filter = c.createBiquadFilter();
  filter.type = filterType;
  filter.Q.value = q;
  filter.frequency.setValueAtTime(from, c.currentTime);
  filter.frequency.exponentialRampToValueAtTime(to, c.currentTime + seconds);
  const env = envelope(c, peak, seconds * 0.35, seconds * 0.65);
  src.connect(filter).connect(env).connect(out);
  src.start();
};

const cues: Record<Cue, () => void> = {
  // Typewriter-like press as a letter locks into place.
  press: () => {
    noise(0.05, "bandpass", 2400 + Math.random() * 900, 1400, 0.22, 3);
    tone(140 + Math.random() * 30, "sine", 0.08, 0.002, 0.05);
  },
  tick: () => tone(1800, "square", 0.025, 0.001, 0.03),
  whoosh: () => noise(0.55, "bandpass", 320, 2600, 0.12, 0.7),
  page: () => noise(0.32, "highpass", 5200, 1800, 0.07, 0.5),
  chime: () => {
    [523.25, 783.99, 1046.5].forEach((f, i) => setTimeout(() => tone(f, "sine", 0.07, 0.01, 1.4), i * 70));
  },
  crystal: () => {
    [1567.98, 2093, 2637, 3135.96].forEach((f, i) =>
      setTimeout(() => tone(f, "triangle", 0.035, 0.004, 1.8, Math.random() * 8), i * 45),
    );
  },
  tone: () => {
    tone(98, "sine", 0.18, 0.4, 2.2);
    tone(147, "sine", 0.08, 0.6, 2.0, 4);
  },
};

const MIN_GAP_MS: Partial<Record<Cue, number>> = { press: 28, tick: 40, whoosh: 300, page: 160, crystal: 900 };

export const play = (cue: Cue) => {
  if (!enabled) return;
  const now = performance.now();
  const gap = MIN_GAP_MS[cue] ?? 0;
  if (now - (lastPlayed[cue] ?? 0) < gap) return;
  lastPlayed = { ...lastPlayed, [cue]: now };
  cues[cue]();
};

/** A quiet two-note drone, about 15 percent of full volume. */
const startAmbient = () => {
  const { ctx: c, out } = audio();
  const bed = c.createGain();
  bed.gain.setValueAtTime(0.0001, c.currentTime);
  bed.gain.exponentialRampToValueAtTime(0.05, c.currentTime + 3);
  const filter = c.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 520;
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.06;
  lfoGain.gain.value = 180;
  lfo.connect(lfoGain).connect(filter.frequency);
  const voices = [73.42, 110, 164.81].map((f, i) => {
    const osc = c.createOscillator();
    osc.type = i === 0 ? "sine" : "triangle";
    osc.frequency.value = f;
    osc.detune.value = (i - 1) * 6;
    osc.connect(filter);
    osc.start();
    return osc;
  });
  filter.connect(bed).connect(out);
  lfo.start();
  return {
    stop: () => {
      bed.gain.cancelScheduledValues(c.currentTime);
      bed.gain.setValueAtTime(bed.gain.value, c.currentTime);
      bed.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 0.8);
      setTimeout(() => [...voices, lfo].forEach((o) => o.stop()), 900);
    },
  };
};

export const isSoundOn = () => enabled;

export const setSound = (on: boolean) => {
  enabled = on;
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {}
  if (on) {
    const { ctx: c } = audio();
    void c.resume();
    ambient ??= startAmbient();
    cues.tone();
  } else {
    ambient?.stop();
    ambient = null;
  }
  listeners.forEach((fn) => fn(on));
};

/** Browsers only allow audio after a gesture, so a remembered "on" waits for the first click. */
export const restoreSoundPreference = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
};

export const onSoundChange = (fn: (on: boolean) => void) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
