import { redirect } from "next/navigation";
import { isSignedIn } from "@/lib/auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  if (await isSignedIn()) redirect("/admin");
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-night md:block">
        <div
          aria-hidden
          className="absolute -bottom-[30%] left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
          style={{ background: "radial-gradient(circle at 50% 40%, #ef8a3c 0%, #c2410c 55%, #9a330a 100%)", boxShadow: "0 0 200px 60px rgba(232,119,46,.25)" }}
        />
        <p className="font-display absolute left-10 top-10 text-2xl text-night-ink">Rising Ideas</p>
        <p className="font-display absolute bottom-10 left-10 max-w-sm text-lg italic text-night-ink/80">
          &ldquo;Rise above the storm and you will find the sunshine.&rdquo;
        </p>
      </div>
      <div className="flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-4xl tracking-[-0.02em]">Sign in to your site</h1>
          <p className="mt-3 text-ink-soft">Publish editions and essays, and manage what the site shows.</p>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
