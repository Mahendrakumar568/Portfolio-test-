"use client";

import { useActionState } from "react";
import { saveProfileAction, type FormState } from "@/app/admin/actions";
import type { SiteSettings } from "@/lib/types";
import { Field, Panel, SaveBar, inputClass } from "./ui";
import { ImageField } from "./ImageField";

const PORTRAITS = [
  { path: "/images/portrait-smile.jpg", label: "Smiling" },
  { path: "/images/portrait-calm.jpg", label: "Calm" },
];

export const ProfileForm = ({ settings }: { settings: SiteSettings }) => {
  const [state, action] = useActionState<FormState, FormData>(saveProfileAction, {});
  return (
    <form action={action} className="mt-8 max-w-4xl space-y-6">
      <Panel title="Rising Ideas numbers" description="Update these from LinkedIn now and then. They count up on the home page.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Subscribers">
            <input name="subscribers" type="number" min={0} defaultValue={settings.subscribers} className={inputClass} />
          </Field>
          <Field label="Editions">
            <input name="editions" type="number" min={0} defaultValue={settings.editions} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <Panel title="Opening of the home page">
        <Field label="Headline" hint="Short works best. The letters assemble one by one.">
          <input name="headline" defaultValue={settings.headline} maxLength={40} className={inputClass + " font-display text-xl"} />
        </Field>
        <Field label="One-line thesis">
          <textarea name="thesis" defaultValue={settings.thesis} rows={3} className={inputClass} />
        </Field>
        <ImageField name="portrait" label="Portrait" defaultValue={settings.portrait} choices={PORTRAITS} />
      </Panel>
      <Panel title="About">
        <Field label="Short bio" hint="Used when the site is shared and in search results.">
          <textarea name="bio" defaultValue={settings.bio} rows={5} className={inputClass} />
        </Field>
        <Field label="Location">
          <input name="location" defaultValue={settings.location} className={inputClass} />
        </Field>
      </Panel>
      <Panel title="Links" description="Leave email empty to send visitors to LinkedIn instead.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Email">
            <input name="email" type="email" defaultValue={settings.email} className={inputClass} />
          </Field>
          <Field label="LinkedIn">
            <input name="linkedinUrl" type="url" defaultValue={settings.linkedinUrl} className={inputClass} />
          </Field>
          <Field label="Rising Ideas subscribe link">
            <input name="newsletterUrl" type="url" defaultValue={settings.newsletterUrl} className={inputClass} />
          </Field>
          <Field label="Medium">
            <input name="mediumUrl" type="url" defaultValue={settings.mediumUrl} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <SaveBar state={state} />
    </form>
  );
};
