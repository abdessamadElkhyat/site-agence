import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ProjectGrid } from "@/components/portfolio/project-grid";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { routing, type Locale } from "@/i18n/routing";
import { getProjects } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const t = await getTranslations({ locale: safe, namespace: "work" });
  return pageMetadata({ locale: safe, path: "/realisations", title: t("title"), description: t("title") });
}

export default async function WorkPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const projects = await getProjects(locale);

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container>
          <ProjectGrid projects={projects} locale={locale} empty={t("empty")} />
        </Container>
      </section>
    </>
  );
}
