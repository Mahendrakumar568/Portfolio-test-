"use client";

import { useActionState, useMemo, useState } from "react";
import { marked } from "marked";
import { deletePostAction, savePostAction, type FormState } from "@/app/admin/actions";
import { TOPICS, type Post } from "@/lib/types";
import { Field, Panel, SaveBar, Switch, inputClass } from "./ui";
import { ImageField } from "./ImageField";

export const PostEditor = ({ post }: { post: Post }) => {
  const [state, action] = useActionState<FormState, FormData>(savePostAction, {});
  const [kind, setKind] = useState(post.kind);
  const [body, setBody] = useState(post.body);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const preview = useMemo(() => (tab === "preview" ? (marked.parse(body, { async: false }) as string) : ""), [tab, body]);
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <>
      <form action={action} className="mt-8">
        <input type="hidden" name="id" value={post.id} />
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <Panel title="The piece">
              <Field label="Title">
                <input name="title" defaultValue={post.title} required className={inputClass + " font-display text-xl"} />
              </Field>
              <Field label="Summary" hint="One or two sentences. Shown in lists and when the piece is shared.">
                <textarea name="excerpt" defaultValue={post.excerpt} rows={3} className={inputClass} />
              </Field>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Full text</span>
                  <div className="flex gap-1 rounded-full bg-ink/5 p-1 text-xs">
                    {(["write", "preview"] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-full px-3 py-1 capitalize ${tab === t ? "bg-white shadow-sm" : "text-ink-soft"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  name="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={22}
                  className={`${inputClass} font-mono text-[13.5px] leading-relaxed ${tab === "write" ? "" : "hidden"}`}
                  placeholder="Paste or write the piece. Markdown works: ## headings, **bold**, *italic*, > quotes, - lists, [links](https://...)."
                />
                {tab === "preview" && (
                  <div className="prose-journal mt-2 min-h-[300px] rounded-md border border-ink/10 bg-paper p-6 text-[17px]" dangerouslySetInnerHTML={{ __html: preview || "<p>Nothing written yet.</p>" }} />
                )}
                <p className="mt-1.5 text-[13px] text-ink-soft">
                  {words} words. Leave empty to show the summary with a link to where it was first published.
                </p>
              </div>
              <Field label="Pull quote" hint="Optional. A line from the piece, shown large on the home page.">
                <input name="pullQuote" defaultValue={post.pullQuote} className={inputClass} />
              </Field>
            </Panel>
          </div>

          <div className="space-y-6">
            <Panel title="Publishing">
              <Switch name="published" defaultChecked={post.published} label="Published" hint="Off keeps it as a private draft." />
              <Switch name="featured" defaultChecked={post.featured} label="Featured" hint="Shows it in Selected writing on the home page." />
            </Panel>
            <Panel title="Details">
              <Field label="Type">
                <select name="kind" value={kind} onChange={(e) => setKind(e.target.value as Post["kind"])} className={inputClass}>
                  <option value="edition">Rising Ideas edition</option>
                  <option value="essay">Essay or blog post</option>
                </select>
              </Field>
              {kind === "edition" && (
                <Field label="Edition number">
                  <input name="editionNumber" type="number" min={1} defaultValue={post.editionNumber} className={inputClass} />
                </Field>
              )}
              <Field label="Date">
                <input name="date" type="date" defaultValue={post.date} className={inputClass} />
              </Field>
              <Field label="Topic">
                <select name="topic" defaultValue={post.topic} className={inputClass}>
                  {TOPICS.map((t) => (
                    <option key={t} value={t}>
                      {t === "Geopolitics" ? "Geopolitics and politics" : t}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Address" hint="The end of the link, e.g. founders-mindset. Leave empty to make one from the title.">
                <input name="slug" defaultValue={post.slug} className={inputClass} />
              </Field>
              <ImageField name="coverImage" label="Cover image" defaultValue={post.coverImage} />
            </Panel>
            <Panel title="Original link" description={kind === "edition" ? "The edition on LinkedIn." : "Where it was first published, if anywhere."}>
              <Field label="Link">
                <input name="externalUrl" type="url" defaultValue={post.externalUrl} className={inputClass} placeholder="https://" />
              </Field>
              <Field label="Site name">
                <input name="externalLabel" defaultValue={post.externalLabel} className={inputClass} placeholder="LinkedIn, Medium, DEV" />
              </Field>
            </Panel>
          </div>
        </div>
        <SaveBar state={state} label={post.id ? "Save" : "Create"} />
      </form>

      {post.id && (
        <form
          action={deletePostAction}
          onSubmit={(e) => {
            if (!window.confirm("Delete this piece? This can't be undone.")) e.preventDefault();
          }}
          className="mt-6"
        >
          <input type="hidden" name="id" value={post.id} />
          <button className="text-sm text-rising underline underline-offset-2">Delete this piece</button>
        </form>
      )}
    </>
  );
};
