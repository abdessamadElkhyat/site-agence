import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { WhatsappButton } from "@/components/layout/whatsapp";
import { routing, type Locale } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("contact");

  return (
    <NextIntlClientProvider messages={messages}>
      <NavigationProgress />
      <Header />
      <main>{children}</main>
      <Footer locale={locale as Locale} />
      <WhatsappButton label={t("whatsapp")} />
      <CookieBanner />
    </NextIntlClientProvider>
  );
}
