"use client";

import { useActionState } from "react";
import { saveTopicsAction, type FormState } from "@/app/admin/actions";
import { Field, Panel, SaveBar, inputClass } from "./ui";

export const TopicsForm = ({ topics }: { topics: string[] }) => {
  const [state, action] = useActionState<FormState, FormData>(saveTopicsAction, {});
  return (
    <form action={action} className="mt-8 max-w-3xl space-y-6">
      <Panel
        title="Writing topics"
        description="These become the filter buttons on the Writing page and the choices in the post editor."
      >
        <Field label="Topics" hint="One per line. Add as many as you need; order here is the order on the site.">
          <textarea name="topics" rows={Math.max(6, topics.length + 2)} defaultValue={topics.join("\n")} className={inputClass} />
        </Field>
        <p className="mt-4 text-sm text-ink-soft">
          If you remove a topic, its posts stay published. They just lose their filter button until you add the topic back.
        </p>
      </Panel>
      <SaveBar state={state} />
    </form>
  );
};
