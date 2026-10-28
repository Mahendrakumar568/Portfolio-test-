import { getRawSettings } from "@/lib/store";
import { ProfileForm } from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const settings = await getRawSettings();
  return (
    <div>
      <h1 className="font-display text-4xl tracking-[-0.02em]">Profile and numbers</h1>
      <ProfileForm settings={settings} />
    </div>
  );
}
