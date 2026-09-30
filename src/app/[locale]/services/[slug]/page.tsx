import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { serviceSlugs } from "@/content/services";
import { routing, type Locale } from "@/i18n/routing";
import { getService, getServices } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => serviceSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const service = await getService(safe, slug);
  if (!service) return {};
  return pageMetadata({
    locale: safe,
    path: `/services/${slug}`,
    title: service.seoTitle,
    description: service.seoDescription,
    image: service.image,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const service = await getService(locale, slug);
  if (!service) notFound();
  const t = await getTranslations("services");
  const related = (await getServices(locale)).filter((item) => item.slug !== slug).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.name,
          description: service.seoDescription,
          provider: { "@type": "Organization", name: site.name, url: site.url },
          areaServed: "MA",
        }}
      />
      {service.faq.length ? (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: service.faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }}
        />
      ) : null}
      <section className="bg-ink pb-16 pt-32 text-ivory md:pt-40">
        <Container className="grid items-end gap-8 md:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">{t("eyebrow")}</p>
            <h1 className="mt-4 font-serif text-5xl leading-none md:text-7xl">{service.name}</h1>
            <p className="mt-6 max-w-xl text-lg text-ivory/75">{service.summary}</p>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden">
            {service.image ? <Image src={service.image} alt="" fill className="object-cover" priority sizes="50vw" /> : null}
          </div>
        </Container>
      </section>
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl">{t("problem")}</h2>
            <p className="mt-4 leading-7 text-paper-muted">{service.problem}</p>
          </div>
          <div>
            <h2 className="font-serif text-3xl">{t("solution")}</h2>
            <p className="mt-4 leading-7 text-paper-muted">{service.solution}</p>
          </div>
          <div className="md:col-span-2">
            <p className="max-w-3xl text-lg leading-8">{service.description}</p>
          </div>
        </Container>
        <Container className="mt-16">
          <h2 className="font-serif text-4xl">{t("benefits")}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {service.benefits.map((benefit) => (
              <li key={benefit} className="border-t border-paper-ink/15 pt-4">{benefit}</li>
            ))}
          </ul>
        </Container>
        <Container className="mt-16">
          <h2 className="font-serif text-4xl">{t("process")}</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-4">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span className="font-serif text-3xl text-paper-muted">0{index + 1}</span>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-paper-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </Container>
        <Container className="mt-16">
          <h2 className="font-serif text-3xl">{t("tools")}</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {service.tools.map((tool) => (
              <li key={tool} className="rounded-full border border-paper-ink/15 px-3 py-1 text-sm">{tool}</li>
            ))}
          </ul>
        </Container>
        <Container className="mt-16 max-w-3xl">
          <h2 className="font-serif text-4xl">{t("faq")}</h2>
          <div className="mt-6 divide-y divide-paper-ink/10">
            {service.faq.map((item) => (
              <details key={item.q} className="py-4">
                <summary className="cursor-pointer text-lg">{item.q}</summary>
                <p className="mt-2 text-paper-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </Container>
        <Container className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-paper-ink/10 pt-8">
          <div>
            <p className="text-xs tracking-[0.16em] uppercase text-paper-muted">{t("related")}</p>
            <ul className="mt-3 flex flex-wrap gap-4">
              {related.map((item) => (
                <li key={item.slug}><Link href={`/services/${item.slug}`} className="underline underline-offset-4">{item.name}</Link></li>
              ))}
            </ul>
          </div>
          <Link href="/contact" className="rounded-full bg-ink px-5 py-3 text-sm text-ivory">{t("cta")}</Link>
        </Container>
      </section>
    </>
  );
}
