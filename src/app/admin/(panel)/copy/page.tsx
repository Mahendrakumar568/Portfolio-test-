import { getRawSettings } from "@/lib/store";
import { BookForm, CareerForm, HomeForm, LensForm, WorkForm } from "@/components/admin/CopyForms";

export const dynamic = "force-dynamic";

export default async function CopyPage() {
  const { copy } = await getRawSettings();
  return (
    <div>
      <h1 className="font-display text-4xl tracking-[-0.02em]">Site copy</h1>
      <p className="mt-3 max-w-2xl text-ink-soft">
        Every section below saves on its own. Changes go live as soon as you save.
      </p>
      <div className="mt-8 max-w-4xl space-y-12">
        <div id="home">
          <h2 className="mb-4 text-xl font-semibold">Home page</h2>
          <HomeForm home={copy.home} />
        </div>
        <div id="career">
          <h2 className="mb-4 text-xl font-semibold">Career and path</h2>
          <CareerForm career={copy.career} />
        </div>
        <div id="work">
          <h2 className="mb-4 text-xl font-semibold">Work</h2>
          <WorkForm work={copy.work} />
        </div>
        <div id="lens">
          <h2 className="mb-4 text-xl font-semibold">About: the lens</h2>
          <LensForm subjects={copy.lens.subjects} />
        </div>
        <div id="book">
          <h2 className="mb-4 text-xl font-semibold">About: the book</h2>
          <BookForm book={copy.book} />
        </div>
      </div>
    </div>
  );
}
