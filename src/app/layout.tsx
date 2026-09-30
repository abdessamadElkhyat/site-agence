import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { headers } from "next/headers";
import { getLocale } from "next-intl/server";
import { Toaster } from "sonner";
import { site } from "@/config/site";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.tagline,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  let locale = headerList.get("x-lyne-locale") || "fr";
  if (!headerList.get("x-lyne-locale")) {
    try {
      locale = await getLocale();
    } catch {
      locale = "fr";
    }
  }

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"} className={`${geist.variable} ${instrument.variable}`}>
      <body className="min-h-screen bg-ink font-sans text-ivory antialiased">
        {children}
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
