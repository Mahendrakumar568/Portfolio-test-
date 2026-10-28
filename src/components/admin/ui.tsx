"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import type { FormState } from "@/app/admin/actions";

export const inputClass =
  "mt-2 w-full rounded-md border border-ink/15 bg-white/70 px-3.5 py-2.5 text-[15px] outline-none transition-colors focus:border-ink";

type FieldProps = { label: string; hint?: string; children: React.ReactNode; className?: string };

export const Field = ({ label, hint, children, className = "" }: FieldProps) => (
  <label className={`block ${className}`}>
    <span className="text-sm font-medium">{label}</span>
    {children}
    {hint && <span className="mt-1.5 block text-[13px] text-ink-soft">{hint}</span>}
  </label>
);

export const Panel = ({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) => (
  <section className="rounded-lg border border-ink/10 bg-white/50 p-6 md:p-8">
    <h2 className="text-lg font-semibold tracking-[-0.01em]">{title}</h2>
    {description && <p className="mt-1 text-sm text-ink-soft">{description}</p>}
    <div className="mt-6 space-y-5">{children}</div>
  </section>
);

export const Switch = ({ name, defaultChecked, label, hint }: { name: string; defaultChecked?: boolean; label: string; hint?: string }) => {
  const [on, setOn] = useState(!!defaultChecked);
  return (
    <label className="flex cursor-pointer items-start justify-between gap-6">
      <span>
        <span className="block text-sm font-medium">{label}</span>
        {hint && <span className="mt-1 block text-[13px] text-ink-soft">{hint}</span>}
      </span>
      <input type="checkbox" name={name} checked={on} onChange={(e) => setOn(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-rising ${
          on ? "bg-rising" : "bg-ink/20"
        }`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
      </span>
    </label>
  );
};

const SubmitButton = ({ label }: { label: string }) => {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className="rounded-full bg-ink px-6 py-2.5 text-sm text-paper transition-colors hover:bg-rising disabled:opacity-60">
      {pending ? "Saving" : label}
    </button>
  );
};

/** Sticky footer with the save button and the result of the last save. */
export const SaveBar = ({ state, label = "Save changes", extra }: { state: FormState; label?: string; extra?: React.ReactNode }) => {
  const [dismissed, setDismissed] = useState<FormState | null>(null);
  const visible = !!state.message && dismissed !== state;
  useEffect(() => {
    if (!state.message) return;
    const t = setTimeout(() => setDismissed(state), 5000);
    return () => clearTimeout(t);
  }, [state]);
  return (
    <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex items-center justify-between gap-4 border-t border-ink/10 bg-paper/90 px-6 py-4 backdrop-blur md:-mx-10 md:px-10">
      <p role="status" className={`text-sm transition-opacity ${visible ? "opacity-100" : "opacity-0"} ${state.ok ? "text-emerald-700" : "text-rising"}`}>
        {state.message}
      </p>
      <div className="flex items-center gap-3">
        {extra}
        <SubmitButton label={label} />
      </div>
    </div>
  );
};
