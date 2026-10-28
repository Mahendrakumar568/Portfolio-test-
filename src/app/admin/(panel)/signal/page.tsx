import { getRawSettings } from "@/lib/store";
import { SignalForm } from "@/components/admin/SignalForm";

export const dynamic = "force-dynamic";

export default async function SignalPage() {
  const { signal } = await getRawSettings();
  return (
    <div>
      <h1 className="font-display text-4xl tracking-[-0.02em]">Availability signal</h1>
      <p className="mt-2 max-w-2xl text-ink-soft">
        A quiet way to show you&rsquo;re taking new conversations, borrowed from the sunrise on the Rising Ideas cover. Choose how
        loudly it appears, or switch it off.
      </p>
      <SignalForm signal={signal} />
    </div>
  );
}
