import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  return pageMetadata({ locale: safe, path: "/politique-cookies", title: "Politique cookies", description: "Cookies essentiels et mesure d'audience sur le site LYNE." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <PageHero eyebrow="Légal" title="Politique cookies" />
      <section className="bg-paper py-16 text-paper-ink">
        <Container className="prose-article max-w-3xl">
          <p>Un cookie essentiel mémorise votre choix d'accepter ou de refuser la mesure d'audience. Il n'est pas utilisé pour de la publicité.</p>
          <p>Si vous acceptez, un compteur de visites agrégé peut être incrémenté. Aucun outil tiers (Google Analytics, Tag Manager, Meta Pixel) n'est chargé dans cette version. L'emplacement est prêt : branchez-les seulement après consentement.</p>
          <p>Vous pouvez effacer le stockage local du navigateur pour revoir le bandeau et changer d'avis.</p>
        </Container>
      </section>
    </>
  );
}
