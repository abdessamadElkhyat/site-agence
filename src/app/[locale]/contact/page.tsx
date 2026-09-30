import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ContactPanel } from "@/components/forms/contact-panel";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { getServices } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const t = await getTranslations({ locale: safe, namespace: "contact" });
  return pageMetadata({ locale: safe, path: "/contact", title: t("title"), description: t("text") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const services = await getServices(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />
      <section className="bg-paper py-16 text-paper-ink">
        <Container className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <aside className="space-y-4 text-sm">
            <p>
              <a href={site.phoneHref}>{site.phone}</a>
            </p>
            <p>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p>{site.hours}</p>
            <p className="text-paper-muted">Remote-first · Worldwide</p>
            <a className="inline-block underline" href={`https://wa.me/${site.whatsapp}`}>
              {t("whatsapp")}
            </a>
          </aside>
          <ContactPanel services={services.map((service) => service.name)} />
        </Container>
      </section>
    </>
  );
}
