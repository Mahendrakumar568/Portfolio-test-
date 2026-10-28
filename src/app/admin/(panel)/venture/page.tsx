import { getRawSettings } from "@/lib/store";
import { VentureForm } from "@/components/admin/VentureForm";

export const dynamic = "force-dynamic";

export default async function VenturePage() {
  const { stealth } = await getRawSettings();
  return (
    <div>
      <h1 className="font-display text-4xl tracking-[-0.02em]">Stealth venture</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">The healthcare venture stays sealed on the site until you reveal it here.</p>
      <VentureForm venture={stealth} />
    </div>
  );
}
