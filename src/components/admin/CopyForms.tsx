"use client";

import { useActionState } from "react";
import { saveBookAction, saveCareerAction, saveLensAction, saveWorkAction, type FormState } from "@/app/admin/actions";
import type { SiteCopy } from "@/lib/copy";
import { Field, Panel, SaveBar, Switch, inputClass } from "./ui";

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
