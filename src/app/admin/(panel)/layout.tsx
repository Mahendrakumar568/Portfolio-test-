import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { canSave, getSettings } from "@/lib/store";
import { signOut } from "../actions";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function PanelLayout({ children }: LayoutProps<"/admin">) {
  await requireAdmin();
  const settings = await getSettings();
  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[248px_1fr]">
      <aside className="flex flex-col bg-ink px-5 py-6 text-paper md:sticky md:top-0 md:h-screen">
        <Link href="/admin" className="font-display text-xl">
          Rising Ideas
          <span className="block font-sans text-xs text-paper/50">Site admin</span>
        </Link>
        <AdminNav signalOn={settings.signal.mode !== "off"} revealed={settings.stealth.revealed} />
        <div className="mt-auto hidden space-y-3 text-sm md:block">
          <Link href="/" target="_blank" className="block text-paper/70 hover:text-paper">
            View the site
          </Link>
          <form action={signOut}>
            <button className="text-paper/70 hover:text-paper">Sign out</button>
          </form>
        </div>
      </aside>
      <main className="px-6 py-8 md:px-10 md:py-10">
        {!canSave() && (
          <p role="status" className="mb-8 border-l-2 border-rising bg-rising/10 px-4 py-3 text-sm text-ink">
            Changes can&apos;t be saved yet. This site runs on Vercel, where files are read-only. Connect Upstash
            Redis (for posts and settings) and a Blob store (for images) under Storage in the Vercel project, then
            redeploy.
          </p>
        )}
        {children}
      </main>
    </div>
  );
}
