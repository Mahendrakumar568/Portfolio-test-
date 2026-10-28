/*
 * Editable site copy. These are the starting words for the career, work, lens
 * and book sections. Jithendra edits them in the admin; anything he leaves
 * unset falls back to these.
 */

export type ExperienceEntry = {
  year: string;
  when: string;
  role: string;
  org: string;
  note?: string;
  current?: boolean;
};

export type LeadershipItem = { role: string; org: string; when: string };

export type PracticeItem = { title: string; text: string };

export type SiteCopy = {
  career: {
    experience: ExperienceEntry[];
    leadership: LeadershipItem[];
    education: { degree: string; school: string; years: string };
  };
  work: {
    roleLine: string;
    intro: string;
    practice: PracticeItem[];
  };
  /** Titles are fixed: each one links to its essay. Only the lines are editable. */
  lens: { subjects: { title: string; line: string }[] };
  book: { label: string; heading: string; body: string };
};

export const DEFAULT_COPY: SiteCopy = {
  career: {
    experience: [
      { year: "2026", when: "Sep 2026 to now", role: "Founder's Office", org: "openCT", note: "Operations, founder outreach and timelines.", current: true },
      { year: "2026", when: "May to Aug 2026", role: "Operations Intern", org: "openCT" },
      { year: "2025", when: "Jul 2025 to Jan 2026", role: "Operations Intern", org: "HalfBrain Technology", note: "Daily workflows, documentation and process improvement." },
      { year: "2024", when: "Jun 2024 to Jan 2026", role: "Data Analyst Intern, Decision Support", org: "Saurvi", note: "SQL, analysis and reports for non-technical teams." },
      { year: "2024", when: "Oct 2024 to Apr 2025", role: "Extended Reality Intern", org: "Universiti Teknologi MARA, Malaysia" },
      { year: "2024", when: "Jun to Aug 2024", role: "HR Intern", org: "Agumentik Group" },
    ],
    leadership: [
      { role: "Mentor", org: "Smart Tech Club, SRM AP", when: "Apr 2025 to Feb 2026" },
      { role: "Co-Convener", org: "Smart Tech Club, SRM AP", when: "Jan 2024 to Apr 2025" },
      { role: "Treasurer", org: "E-Cell, SRM AP", when: "Apr 2024 to Apr 2025" },
      { role: "International Relations Representative", org: "SRM AP", when: "Dec 2023 to Nov 2025" },
      { role: "CSR Project Intern", org: "SRM AP Directorate of Innovation and Entrepreneurship", when: "May 2024 to Sep 2025" },
      { role: "Convener, Community Service", org: "SRM AP Directorate of Innovation and Entrepreneurship", when: "Jan 2023 to Feb 2024" },
    ],
    education: { degree: "B.E. Computer Science", school: "SRM University, Andhra Pradesh", years: "2022 to 2026" },
  },
  work: {
    roleLine: "Founder's Office, since Sep 2026",
    intro:
      "Jithendra runs Founder's Office operations at openCT, working beside the founder on outreach and timelines. He joined as an operations intern in May 2026 and moved into the Founder's Office four months later.",
    practice: [
      {
        title: "Operations",
        text: "Keeps the company's moving parts in step: the weekly rhythm, the documents, the follow-through.",
      },
      {
        title: "Founder outreach",
        text: "Supports the founder's conversations with partners, customers and the wider ecosystem, from first note to next step.",
      },
      {
        title: "Timelines",
        text: "Turns priorities into dates and holds the plan to them, so decisions land when they need to.",
      },
    ],
  },
  lens: {
    subjects: [
      { title: "Startups", line: "How a founder turns a hunch into something people pay for, and what a headline about a startup really says about the problem underneath." },
      { title: "Business models", line: "Who pays, for what, and why they keep paying. Speed, trust and aggregation, and the markets where each one stops working." },
      { title: "Emerging technology", line: "AI as augmentation, not replacement. Search, security and the systems that decide what reaches us, explained from the inside." },
      { title: "Strategy and geopolitics", line: "Tariffs, energy and alliances. Why India will not be cornered into choosing between powers, and what that means for business." },
    ],
  },
  book: {
    label: "Work in progress",
    heading: "Something longer is being written.",
    body: "Not ready to show yet. When it is, it will be the first thing to read here.",
  },
};
