"use client";

import { useActionState, useState } from "react";
import { saveSignalAction, type FormState } from "@/app/admin/actions";
import type { Signal, SignalMode } from "@/lib/types";
import { Field, Panel, SaveBar, inputClass } from "./ui";

const MODES: { value: SignalMode; title: string; text: string }[] = [
  { value: "off", title: "Off", text: "Nothing shows. The site reads as it always does." },
  { value: "subtle", title: "Sun beside your name", text: "A small glowing sun in the navigation. Hovering it shows your line." },
  { value: "featured", title: "Sunrise banner", text: "An editor's note across the top of every page, with a sun rising over the horizon and a button." },
];

export const SignalForm = ({ signal }: { signal: Signal }) => {
  const [state, action] = useActionState<FormState, FormData>(saveSignalAction, {});
  const [mode, setMode] = useState<SignalMode>(signal.mode);
  const [message, setMessage] = useState(signal.message);
  const [cta, setCta] = useState(signal.ctaLabel);

  return (
    <form action={action} className="mt-8 max-w-4xl space-y-6">
      <fieldset className="grid gap-4 md:grid-cols-3">
        <legend className="sr-only">How the signal appears</legend>
        {MODES.map((m) => (
          <label
            key={m.value}
            className={`cursor-pointer overflow-hidden rounded-lg border bg-white/50 transition-all ${mode === m.value ? "border-rising ring-2 ring-rising/20" : "border-ink/10 hover:border-ink/30"}`}
          >
            <input type="radio" name="mode" value={m.value} checked={mode === m.value} onChange={() => setMode(m.value)} className="sr-only" />
            <Preview mode={m.value} message={message} cta={cta} />
            <span className="block p-4">
              <span className="block font-medium">{m.title}</span>
              <span className="mt-1 block text-[13px] text-ink-soft">{m.text}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <Panel title="Your words" description="Write it the way you would say it. The site never shows the phrase “open to”.">
        <Field label="Message" hint="For example: Taking new conversations on operations and strategy.">
          <input name="message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={90} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Button label" hint="Used on the sunrise banner and in the contact section.">
            <input name="ctaLabel" value={cta} onChange={(e) => setCta(e.target.value)} maxLength={28} className={inputClass} />
          </Field>
          <Field label="Switch off after" hint="Optional. The signal turns itself off after this day.">
            <input name="endsOn" type="date" defaultValue={signal.endsOn} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <SaveBar state={state} label="Save signal" />
    </form>
  );
};

/** A miniature of the site's navigation showing each mode. */
const Preview = ({ mode, message, cta }: { mode: SignalMode; message: string; cta: string }) => (
  <span className="relative block h-36 overflow-hidden bg-paper" aria-hidden>
    {mode === "featured" && (
      <span className="absolute inset-x-0 top-0 flex h-6 items-center justify-between gap-2 bg-ink px-2.5 text-[8px] text-paper">
        <span className="truncate">
          <span className="font-display italic text-ember">Editor&rsquo;s note </span>
          {message}
        </span>
        <span className="shrink-0 rounded-full border border-paper/30 px-1.5">{cta}</span>
        <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-ember to-transparent" />
        <span className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-ember shadow-[0_0_10px_3px_rgba(232,119,46,.5)]" />
      </span>
    )}
    <span className={`absolute inset-x-0 flex items-center justify-between px-2.5 ${mode === "featured" ? "top-8" : "top-2.5"}`}>
      <span className="flex items-center gap-1.5">
        <span className="font-display text-[10px]">Jithendra Sai Kilaru</span>
        {mode === "subtle" && <span className="h-1.5 w-1.5 rounded-full bg-ember shadow-[0_0_6px_2px_rgba(232,119,46,.6)]" />}
      </span>
      <span className="flex gap-2 text-[7px] text-ink-soft">
        <span>Work</span>
        <span>Writing</span>
      </span>
    </span>
    {mode === "subtle" && (
      <span className="absolute left-14 top-7 w-36 rounded bg-ink px-2 py-1.5 text-[8px] leading-snug text-paper">{message}</span>
    )}
    <span className="font-display absolute bottom-3 left-2.5 text-[22px] leading-none tracking-[-0.04em]">Ideas become</span>
  </span>
);
