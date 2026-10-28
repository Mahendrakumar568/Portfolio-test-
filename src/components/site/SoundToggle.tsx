"use client";

import { useEffect, useState } from "react";
import { onSoundChange, restoreSoundPreference, setSound, isSoundOn } from "@/lib/sound";

export const SoundToggle = ({ tone = "ink" }: { tone?: "ink" | "night" }) => {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const off = onSoundChange(setOn);
    if (restoreSoundPreference() && !isSoundOn()) {
      const resume = () => setSound(true);
      window.addEventListener("pointerdown", resume, { once: true });
      return () => {
        off();
        window.removeEventListener("pointerdown", resume);
      };
    }
    return () => void off();
  }, []);

  return (
    <button
      type="button"
      onClick={() => setSound(!on)}
      aria-pressed={on}
      data-cursor={on ? "Mute" : "Listen"}
      className={`group flex items-center gap-2 text-sm ${tone === "night" ? "text-night-ink" : "text-ink"}`}
    >
      <span className="flex h-4 items-end gap-[2px]" aria-hidden>
        {[0.45, 1, 0.7, 0.85].map((h, i) => (
          <span
            key={i}
            className="w-[2px] origin-bottom rounded-full bg-current transition-transform duration-500"
            style={{
              height: "100%",
              transform: `scaleY(${on ? h : 0.2})`,
              animation: on ? `sound-bar 1.${i + 1}s ease-in-out ${i * 0.12}s infinite alternate` : undefined,
            }}
          />
        ))}
      </span>
      <span className="hidden sm:inline">{on ? "Sound on" : "Sound off"}</span>
      <style>{`@keyframes sound-bar { from { transform: scaleY(.25) } to { transform: scaleY(1) } }`}</style>
    </button>
  );
};
