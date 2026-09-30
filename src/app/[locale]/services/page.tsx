import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { routing, type Locale } from "@/i18n/routing";
import { getServices } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const t = await getTranslations({ locale: safe, namespace: "services" });
  return pageMetadata({ locale: safe, path: "/services", title: t("title"), description: t("title") });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const services = await getServices(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container className="grid gap-10">
          {services.map((service, index) => (
            <Link key={service.slug} href={`/services/${service.slug}`} className="grid items-center gap-6 border-t border-paper-ink/10 pt-8 md:grid-cols-[0.8fr_1.2fr]">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink">
                {service.image ? <Image src={service.image} alt="" fill className="object-cover" sizes="40vw" /> : null}
              </div>
              <div>
                <p className="text-xs tracking-[0.16em] text-paper-muted">0{index + 1}</p>
                <h2 className="mt-2 font-serif text-4xl">{service.name}</h2>
                <p className="mt-3 max-w-xl text-paper-muted">{service.summary}</p>
              </div>
            </Link>
          ))}
        </Container>
      </section>
    </>
  );
}
