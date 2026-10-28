import type { Metadata } from "next";
import { getSettings } from "@/lib/store";
import { Work } from "@/components/home/Work";
import { Timeline } from "@/components/home/Timeline";
import { CareerRuler } from "@/components/work/CareerRuler";

// Re-render hourly so a signal with an end date switches itself off on time.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Work",
  description: "Founder's Office operations at openCT, and the path from SRM University to founding and operating roles.",
};

export default async function WorkPage() {
  const settings = await getSettings();
  return (
    <>
      <Work stealth={settings.stealth} work={settings.copy.work} />
      <Timeline career={settings.copy.career} />
      <CareerRuler />
    </>
  );
}
