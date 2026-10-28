import type { Metadata, Viewport } from "next";
import { Fraunces, Inter_Tight, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
});

const sans = Inter_Tight({ variable: "--font-sans", subsets: ["latin"] });

const mono = JetBrains_Mono({ variable: "--font-mono", subsets: ["latin"], weight: ["400", "500"] });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Jithendra Sai Kilaru: technology, strategy and Rising Ideas",
    template: "%s | Jithendra Sai Kilaru",
  },
  description:
    "Jithendra Sai Kilaru works where technology meets business strategy, and writes Rising Ideas, a weekly newsletter on technology, business and geopolitics.",
  openGraph: { type: "website", siteName: "Jithendra Sai Kilaru" },
};

export const viewport: Viewport = { themeColor: "#F3EFE7" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
