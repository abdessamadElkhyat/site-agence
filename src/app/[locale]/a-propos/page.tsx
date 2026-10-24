import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { site } from "@/config/site";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

const values = {
  fr: [
    { title: "Clarté", text: "On dit ce que l'on fait, et ce que l'on ne fera pas." },
    { title: "Marché", text: "Chaque marché a ses habitudes. On part des vrais parcours d'achat." },
    { title: "Mesure", text: "Un joli écran ne suffit pas s'il n'amène pas de demande." },
    { title: "Tenue", text: "Peu de personnes, un suivi lisible, pas de théâtre." },
  ],
  en: [
    { title: "Clarity", text: "We say what we will do, and what we will not." },
    { title: "Market", text: "Every market has habits. We start from real buying journeys." },
    { title: "Measure", text: "A pretty screen is not enough if it brings no enquiry." },
    { title: "Care", text: "Few people, a readable follow-up, no theatre." },
  ],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const nav = await getTranslations({ locale: safe, namespace: "nav" });
  const t = await getTranslations({ locale: safe, namespace: "about" });
  return pageMetadata({ locale: safe, path: "/a-propos", title: nav("about"), description: t("text") });
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const story = values[locale];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} text={t("text")} />
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container className="grid gap-10 md:grid-cols-2">
          <p className="font-serif text-3xl leading-snug">
            {locale === "en"
              ? "The studio was founded to give companies and brands an international standard of work, without useless layers."
              : "Le studio est né pour offrir aux entreprises et aux marques un niveau de travail international, sans couches inutiles."}
          </p>
          <p className="leading-7 text-paper-muted">
            {locale === "en"
              ? "We work on websites, visibility, advertising and content. The team stays small on purpose: the person who speaks with you follows the file."
              : "Nous travaillons les sites, la visibilité, la publicité et les contenus. L'équipe reste petite exprès : la personne qui vous parle suit le dossier."}
          </p>
        </Container>
        <Container className="mt-14 grid gap-6 md:grid-cols-4">
          {story.map((item) => (
            <article key={item.title} className="border-t border-paper-ink/15 pt-4">
              <h2 className="font-serif text-2xl">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-paper-muted">{item.text}</p>
            </article>
          ))}
        </Container>
        <Container className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-4">
          {site.stats.map((stat) => (
            <p key={stat.id}>
              <span className="font-serif text-4xl">{stat.value}{stat.suffix}</span>
              <span className="mt-1 block text-sm text-paper-muted">{stat.label}</span>
            </p>
          ))}
        </Container>
      </section>
    </>
  );
}
