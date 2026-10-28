import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80svh] flex-col items-start justify-center px-5 md:px-10">
      <p className="tabular text-sm text-ink-soft">404</p>
      <h1 className="font-display mt-4 text-[clamp(2.5rem,7vw,6rem)] leading-none tracking-[-0.03em]">This page hasn&rsquo;t been written yet.</h1>
      <Link href="/writing" className="mt-8 text-lg underline decoration-rising underline-offset-4">
        Browse the writing
      </Link>
    </div>
  );
}
