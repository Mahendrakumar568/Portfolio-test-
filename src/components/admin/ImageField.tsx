"use client";

import { useState } from "react";
import { inputClass } from "./ui";

/** An image path with an upload button. The chosen path is submitted with the form. */
export const ImageField = ({ name, defaultValue = "", label, hint, choices = [] }: {
  name: string;
  defaultValue?: string;
  label: string;
  hint?: string;
  choices?: { path: string; label: string }[];
}) => {
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState("");

  const upload = async (file: File) => {
    setStatus("Uploading");
    const body = new FormData();
    body.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body });
    const json = (await res.json()) as { path?: string; error?: string };
    if (json.path) {
      setValue(json.path);
      setStatus("Uploaded. Save to keep it.");
    } else setStatus(json.error ?? "Upload failed. Try again.");
  };

  return (
    <div>
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-2 flex items-start gap-4">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-paper-deep">
          {value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          )}
        </div>
        <div className="min-w-0 flex-1 space-y-2">
          <input name={name} value={value} onChange={(e) => setValue(e.target.value)} className={inputClass + " mt-0"} placeholder="/images/..." />
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <label className="cursor-pointer rounded-full border border-ink/20 px-3 py-1 hover:border-ink">
              Upload image
              <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
            </label>
            {choices.map((c) => (
              <button key={c.path} type="button" onClick={() => setValue(c.path)} className={`rounded-full border px-3 py-1 ${value === c.path ? "border-ink bg-ink text-paper" : "border-ink/20 hover:border-ink"}`}>
                {c.label}
              </button>
            ))}
            {value && (
              <button type="button" onClick={() => setValue("")} className="text-ink-soft underline underline-offset-2">
                Remove
              </button>
            )}
            {status && <span className="text-ink-soft">{status}</span>}
          </div>
          {hint && <p className="text-[13px] text-ink-soft">{hint}</p>}
        </div>
      </div>
    </div>
  );
};
