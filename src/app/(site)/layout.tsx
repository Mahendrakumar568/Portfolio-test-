import { getSettings } from "@/lib/store";
import { Nav } from "@/components/site/Nav";
import { HorizonBanner } from "@/components/site/HorizonBanner";
import { Footer } from "@/components/site/Footer";
import { SmoothScroll } from "@/components/site/SmoothScroll";
import { Cursor } from "@/components/site/Cursor";
import { Preloader } from "@/components/site/Preloader";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const settings = await getSettings();
  return (
    <>
      <Preloader />
      <SmoothScroll />
      <Cursor />
      {settings.signal.mode === "featured" && <HorizonBanner signal={settings.signal} />}
      <Nav signal={settings.signal} />
      <main>{children}</main>
      <Footer settings={settings} />
      <div className="grain" aria-hidden />
    </>
  );
}
