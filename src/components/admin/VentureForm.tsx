"use client";

import { useActionState, useState } from "react";
import { saveVentureAction, type FormState } from "@/app/admin/actions";
import type { StealthVenture } from "@/lib/types";
import { Field, Panel, SaveBar, inputClass } from "./ui";

export const VentureForm = ({ venture }: { venture: StealthVenture }) => {
  const [state, action] = useActionState<FormState, FormData>(saveVentureAction, {});
  const [revealed, setRevealed] = useState(venture.revealed);

  return (
    <form action={action} className="mt-8 max-w-4xl space-y-6">
      <div className={`relative overflow-hidden rounded-lg p-8 transition-colors duration-700 ${revealed ? "bg-rising text-paper" : "bg-night text-night-ink"}`}>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm opacity-70">The site currently shows</p>
            <p className="font-display mt-1 text-3xl">{revealed ? "The full venture card" : "The sealed precious jewel"}</p>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <span className="text-sm">{revealed ? "Revealed" : "Sealed"}</span>
            <input type="checkbox" name="revealed" checked={revealed} onChange={(e) => setRevealed(e.target.checked)} className="peer sr-only" />
            <span className="relative h-8 w-14 rounded-full bg-white/20 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-ember">
              <span className={`absolute top-1 h-6 w-6 rotate-45 rounded-[3px] bg-gradient-to-br from-[#ffe2c4] to-ember shadow transition-transform duration-500 ${revealed ? "translate-x-7" : "translate-x-1"}`} />
            </span>
          </label>
        </div>
        <p className="mt-4 max-w-xl text-sm opacity-80">
          {revealed
            ? "Visitors see the venture's name, summary and link. Switch back to seal it again."
            : "Visitors see only the sector, the line below and a turning gem. Nothing else about the venture is shown."}
        </p>
      </div>

      <Panel title="While sealed">
        <div className="grid gap-5 md:grid-cols-[200px_1fr]">
          <Field label="Sector">
            <input name="sector" defaultValue={venture.sector} className={inputClass} />
          </Field>
          <Field label="Line on the card">
            <input name="teaser" defaultValue={venture.teaser} className={inputClass} />
          </Field>
        </div>
      </Panel>

      <Panel title="When revealed" description="Fill these in ahead of launch day. They stay private until you reveal.">
        <Field label="Venture name">
          <input name="name" defaultValue={venture.name} className={inputClass} />
        </Field>
        <Field label="Summary">
          <textarea name="summary" defaultValue={venture.summary} rows={4} className={inputClass} />
        </Field>
        <Field label="Website">
          <input name="url" type="url" defaultValue={venture.url} className={inputClass} placeholder="https://" />
        </Field>
      </Panel>
      <SaveBar state={state} label={revealed && !venture.revealed ? "Reveal now" : "Save"} />
    </form>
  );
};
