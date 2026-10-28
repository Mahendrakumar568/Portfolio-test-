import { getRawSettings } from "@/lib/store";
import { TopicsForm } from "@/components/admin/TopicsForm";

export const dynamic = "force-dynamic";

export default async function TopicsPage() {
  const settings = await getRawSettings();
  return (
    <div>
      <h1 className="font-display text-4xl tracking-[-0.02em]">Writing topics</h1>
      <TopicsForm topics={settings.topics} />
    </div>
  );
}
