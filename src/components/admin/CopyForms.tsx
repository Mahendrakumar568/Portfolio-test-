"use client";

import { useActionState } from "react";
import { saveBookAction, saveCareerAction, saveHomeAction, saveLensAction, saveMediaAction, saveWorkAction, type FormState } from "@/app/admin/actions";
import type { SiteCopy } from "@/lib/copy";
import { Field, Panel, SaveBar, Switch, inputClass } from "./ui";
import { ImageField } from "./ImageField";

const EXPERIENCE_SLOTS = 12;
const LEADERSHIP_SLOTS = 12;

const useSave = (action: (state: FormState, form: FormData) => Promise<FormState>) => useActionState<FormState, FormData>(action, {});

export const CareerForm = ({ career }: { career: SiteCopy["career"] }) => {
  const [state, action] = useSave(saveCareerAction);
  const experience = [...career.experience, ...Array(EXPERIENCE_SLOTS).fill(undefined)].slice(0, EXPERIENCE_SLOTS);
  const leadership = [...career.leadership, ...Array(LEADERSHIP_SLOTS).fill(undefined)].slice(0, LEADERSHIP_SLOTS);
  return (
    <form action={action} className="space-y-6">
      <Panel
        title="Experience"
        description="Newest first. Each row is one role. Leave a row empty to remove it. Entries with the same year are grouped under that year. Tick Current for the role you hold now."
      >
        <div className="space-y-4">
          {experience.map((entry, i) => (
            <div key={i} className="grid gap-3 rounded-md border border-ink/10 p-4 md:grid-cols-12">
              <Field label="Year" className="md:col-span-2">
                <input name={`exp${i}_year`} defaultValue={entry?.year} className={inputClass} />
              </Field>
              <Field label="When" className="md:col-span-3">
                <input name={`exp${i}_when`} defaultValue={entry?.when} className={inputClass} />
              </Field>
              <Field label="Role" className="md:col-span-4">
                <input name={`exp${i}_role`} defaultValue={entry?.role} className={inputClass} />
              </Field>
              <Field label="Organisation" className="md:col-span-3">
                <input name={`exp${i}_org`} defaultValue={entry?.org} className={inputClass} />
              </Field>
              <Field label="Note (optional)" className="md:col-span-9">
                <input name={`exp${i}_note`} defaultValue={entry?.note} className={inputClass} />
              </Field>
              <div className="flex items-end md:col-span-3">
                <Switch name={`exp${i}_current`} defaultChecked={entry?.current} label="Current role" />
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Campus leadership" description="Shown beside the degree. Leave a row empty to remove it.">
        <div className="space-y-3">
          {leadership.map((item, i) => (
            <div key={i} className="grid gap-3 md:grid-cols-12">
              <Field label="Role" className="md:col-span-4">
                <input name={`lead${i}_role`} defaultValue={item?.role} className={inputClass} />
              </Field>
              <Field label="Organisation" className="md:col-span-4">
                <input name={`lead${i}_org`} defaultValue={item?.org} className={inputClass} />
              </Field>
              <Field label="When" className="md:col-span-4">
                <input name={`lead${i}_when`} defaultValue={item?.when} className={inputClass} />
              </Field>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Degree">
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Degree">
            <input name="edu_degree" defaultValue={career.education.degree} className={inputClass} />
          </Field>
          <Field label="School">
            <input name="edu_school" defaultValue={career.education.school} className={inputClass} />
          </Field>
          <Field label="Years">
            <input name="edu_years" defaultValue={career.education.years} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <SaveBar state={state} label="Save career" />
    </form>
  );
};

export const WorkForm = ({ work }: { work: SiteCopy["work"] }) => {
  const [state, action] = useSave(saveWorkAction);
  return (
    <form action={action} className="space-y-6">
      <Panel title="openCT section">
        <Field label="Role line" hint="The small line above the company name.">
          <input name="roleLine" defaultValue={work.roleLine} className={inputClass} />
        </Field>
        <Field label="Introduction">
          <textarea name="intro" defaultValue={work.intro} rows={4} className={inputClass} />
        </Field>
      </Panel>
      <Panel title="Practice areas" description="Three cards. Leave a title empty to remove that card.">
        <div className="grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 rounded-md border border-ink/10 p-4">
              <Field label={`Card ${i + 1} title`}>
                <input name={`practice${i}_title`} defaultValue={work.practice[i]?.title} className={inputClass} />
              </Field>
              <Field label="Text">
                <textarea name={`practice${i}_text`} defaultValue={work.practice[i]?.text} rows={4} className={inputClass} />
              </Field>
            </div>
          ))}
        </div>
      </Panel>
      <SaveBar state={state} label="Save work" />
    </form>
  );
};

export const LensForm = ({ subjects }: { subjects: SiteCopy["lens"]["subjects"] }) => {
  const [state, action] = useSave(saveLensAction);
  return (
    <form action={action} className="space-y-6">
      <Panel
        title="Lens subjects"
        description="Each subject's title is fixed, because it links to its essay. Edit the line under it."
      >
        {subjects.map((subject, i) => (
          <Field key={subject.title} label={subject.title}>
            <textarea name={`line${i}`} defaultValue={subject.line} rows={3} className={inputClass} />
          </Field>
        ))}
      </Panel>
      <SaveBar state={state} label="Save lens" />
    </form>
  );
};

export const BookForm = ({ book }: { book: SiteCopy["book"] }) => {
  const [state, action] = useSave(saveBookAction);
  return (
    <form action={action} className="space-y-6">
      <Panel title="Book in progress" description="The cover stays hidden. Only the words around the cloth are shown.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Small label">
            <input name="label" defaultValue={book.label} className={inputClass} />
          </Field>
          <Field label="Heading">
            <input name="heading" defaultValue={book.heading} className={inputClass + " font-display text-xl"} />
          </Field>
        </div>
        <Field label="Line under the heading">
          <textarea name="body" defaultValue={book.body} rows={3} className={inputClass} />
        </Field>
      </Panel>
      <SaveBar state={state} label="Save book" />
    </form>
  );
};

export const HomeForm = ({ home }: { home: SiteCopy["home"] }) => {
  const [state, action] = useSave(saveHomeAction);
  return (
    <form action={action} className="space-y-6">
      <Panel title="Opening" description="The headline and thesis are set on the Profile page. These are the lines beside them.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Editor line">
            <input name="heroEditor" defaultValue={home.heroEditor} className={inputClass} />
          </Field>
          <Field label="Role line">
            <input name="heroRole" defaultValue={home.heroRole} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <Panel title="What I believe" description="Three statements, shown one after another as the reader scrolls.">
        {[0, 1, 2].map((i) => (
          <Field key={i} label={`Statement ${i + 1}`}>
            <textarea name={`statement${i}`} defaultValue={home.statements[i]} rows={2} className={inputClass} />
          </Field>
        ))}
      </Panel>
      <Panel title="Rising Ideas">
        <Field label="Introduction">
          <textarea name="risingIntro" defaultValue={home.risingIntro} rows={3} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Publishing rhythm" hint="Shown in the third figure, e.g. weekly or fortnightly.">
            <input name="risingFrequency" defaultValue={home.risingFrequency} className={inputClass} />
          </Field>
          <Field label="Subscribe button">
            <input name="subscribeLabel" defaultValue={home.subscribeLabel} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <Panel title="Conversation" description="The closing section. Its headline changes when the availability signal is on.">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Headline">
            <input name="contactHeadline" defaultValue={home.contactHeadline} className={inputClass + " font-display text-xl"} />
          </Field>
          <Field label="Headline while the signal is on">
            <input name="contactHeadlineSignal" defaultValue={home.contactHeadlineSignal} className={inputClass + " font-display text-xl"} />
          </Field>
        </div>
        <Field label="Line under the headline" hint="Hidden while the availability signal is on, which shows its own message instead.">
          <textarea name="contactLine" defaultValue={home.contactLine} rows={3} className={inputClass} />
        </Field>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Write button">
            <input name="writeLabel" defaultValue={home.writeLabel} className={inputClass} />
          </Field>
          <Field label="LinkedIn button" hint="Used when no email is set.">
            <input name="linkedinLabel" defaultValue={home.linkedinLabel} className={inputClass} />
          </Field>
          <Field label="Rising Ideas button">
            <input name="readLabel" defaultValue={home.readLabel} className={inputClass} />
          </Field>
        </div>
      </Panel>
      <SaveBar state={state} label="Save home" />
    </form>
  );
};

const MEDIA_SLOTS = 12;

export const MediaForm = ({ media }: { media: SiteCopy["media"] }) => {
  const [state, action] = useSave(saveMediaAction);
  const slots = [...media, ...Array(MEDIA_SLOTS).fill(undefined)].slice(0, MEDIA_SLOTS);
  return (
    <form action={action} className="space-y-6">
      <Panel
        title="Featured in"
        description="The strip on the home page. Add a logo, a quoted snippet, or both. Add a link to make an item clickable. Leave the name empty to remove a row. The strip stays hidden while it is empty."
      >
        <div className="space-y-4">
          {slots.map((item, i) => (
            <div key={i} className="grid gap-4 rounded-md border border-ink/10 p-4 md:grid-cols-2">
              <Field label="Name" hint="Publication or event. Used as the label and the image alt text.">
                <input name={`media${i}_label`} defaultValue={item?.label} className={inputClass} />
              </Field>
              <Field label="Link (optional)">
                <input name={`media${i}_url`} type="url" defaultValue={item?.url} className={inputClass} placeholder="https://" />
              </Field>
              <Field label="Quoted snippet (optional)" className="md:col-span-2">
                <textarea name={`media${i}_snippet`} defaultValue={item?.snippet} rows={2} className={inputClass} />
              </Field>
              <div className="md:col-span-2">
                <ImageField name={`media${i}_logo`} label="Logo (optional)" defaultValue={item?.logo} hint="A transparent PNG or a plain logo works best. When a logo is set, it shows instead of the snippet." />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <SaveBar state={state} label="Save featured" />
    </form>
  );
};
