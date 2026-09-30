import { setRequestLocale } from "next-intl/server";
import { HomePage } from "@/components/home/home-page";
import { JsonLd } from "@/components/seo/json-ld";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { getArticles, getProjects, getServices, getTestimonials } from "@/lib/queries";
import { localBusinessJsonLd, pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
  return pageMetadata({
    locale: safe,
    path: "/",
    title: `${site.name} — ${site.tagline}`,
    description:
      safe === "ar"
        ? "استوديو تسويق رقمي دولي: مواقع، SEO، إعلانات ومحتوى للشركات والعلامات الطموحة."
        : safe === "en"
          ? "An international digital marketing studio: websites, SEO, advertising and content for ambitious brands."
          : "Studio de marketing digital international : sites, SEO, publicité et contenus pour les marques ambitieuses.",
  });
}

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [services, projects, articles, testimonials] = await Promise.all([
    getServices(locale),
    getProjects(locale),
    getArticles(locale),
    getTestimonials(),
  ]);

  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <HomePage
        locale={locale}
        services={services}
        projects={projects}
        articles={articles}
        testimonial={testimonials[0] ?? { name: site.name, company: "LYNE", role: "", quote: site.tagline, photo: "", rating: 5 }}
      />
    </>
  );
}
