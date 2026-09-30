import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/shared/page-hero";
import { site } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  return pageMetadata({ locale: safe, path: "/mentions-legales", title: "Mentions légales", description: "Informations légales de LYNE." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <PageHero eyebrow="Légal" title="Mentions légales" />
      <section className="bg-paper py-16 text-paper-ink">
        <Container className="prose-article max-w-3xl">
          <p>Le site {site.url} est édité par {site.legalName}, studio de marketing digital international (activité remote-first).</p>
          <p>Email : {site.email}. Téléphone : {site.phone}.</p>
          <p>Identifiants d&apos;entreprise et adresse légale : à compléter avant la mise en production. Cette page est un modèle de démonstration.</p>
          <p>Directeur de la publication : direction de {site.name}. Hébergement : à préciser selon l&apos;hébergeur retenu.</p>
          <p>Les contenus de démonstration, dont les projets et témoignages, illustrent le niveau du site. Remplacez-les par vos réalisations réelles avant toute communication publique.</p>
        </Container>
      </section>
    </>
  );
}
