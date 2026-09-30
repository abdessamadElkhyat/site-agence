import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  return pageMetadata({ locale: safe, path: "/politique-confidentialite", title: "Politique de confidentialité", description: "Comment LYNE traite les données envoyées via le site." });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return (
    <>
      <PageHero eyebrow="Légal" title="Politique de confidentialité" />
      <section className="bg-paper py-16 text-paper-ink">
        <Container className="prose-article max-w-3xl">
          <p>Les formulaires de contact, de rendez-vous et d'inscription collectent les informations que vous saisissez : identité, coordonnées, entreprise et message. Elles servent uniquement à répondre à votre demande.</p>
          <p>Base : l'intérêt de traiter une demande que vous avez envoyée. Durée : le temps du suivi commercial, puis archivage limité si une obligation l'exige.</p>
          <p>Destinataire : l'équipe de {site.legalName}. Les données ne sont pas vendues. L'hébergement de la base MySQL dépend de la configuration de production.</p>
          <p>La mesure d'audience ne se charge qu'après votre accord, via le bandeau cookies. Vous pouvez écrire à {site.email} pour accéder à vos données ou demander leur suppression.</p>
          <p>Ce texte est un cadre de départ. Faites-le relire avant la mise en ligne, notamment si vous ajoutez Google Analytics, Meta Pixel ou une newsletter automatisée.</p>
        </Container>
      </section>
    </>
  );
}
