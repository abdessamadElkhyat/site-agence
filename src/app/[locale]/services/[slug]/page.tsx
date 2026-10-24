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
    title: service.name,
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
      <section className="bg-ink pt-32 text-ivory md:pt-40">
        <Container>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">{t("eyebrow")}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.95] md:text-7xl">{service.name}</h1>
          <p className="mt-6 max-w-xl text-lg text-ivory/75">{service.summary}</p>
          <Link href="/contact" className="mt-8 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink">
            {t("cta")}
          </Link>
        </Container>
        {service.image ? (
          <div className="relative mt-14 aspect-[21/8] w-full bg-ink-soft">
            <Image src={service.image} alt="" fill className="object-cover" priority sizes="100vw" />
          </div>
        ) : null}
      </section>
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-20">
          <div>
            <p className="text-xs tracking-[0.18em] text-paper-muted uppercase">{t("problem")}</p>
            <p className="mt-4 font-serif text-3xl leading-snug md:text-4xl">{service.problem}</p>
          </div>
          <div className="md:pt-8">
            <p className="text-xs tracking-[0.18em] text-paper-muted uppercase">{t("solution")}</p>
            <p className="mt-4 leading-7 text-paper-muted">{service.solution}</p>
            <p className="mt-4 leading-7">{service.description}</p>
          </div>
        </Container>
        <Container className="mt-20 max-w-3xl">
          <h2 className="font-serif text-3xl">{t("benefits")}</h2>
          <ol className="mt-8">
            {service.benefits.map((benefit, index) => (
              <li key={benefit} className="grid grid-cols-[3.5rem_1fr] gap-4 border-t border-paper-ink/10 py-5">
                <span className="font-serif text-lg text-paper-ink underline decoration-accent decoration-2 underline-offset-4">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="leading-7">{benefit}</span>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="bg-ink py-16 text-ivory md:py-24">
        <Container>
          <h2 className="font-serif text-3xl">{t("process")}</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4">
            {service.process.map((step, index) => (
              <li key={step.title}>
                <span className="font-serif text-2xl text-accent">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 text-lg">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ivory/65">{step.text}</p>
              </li>
            ))}
          </ol>
          {service.tools.length ? (
            <p className="mt-12 text-sm text-ivory/70">
              <span className="tracking-[0.16em] text-brass uppercase">{t("tools")}</span>
              <span className="mx-3 text-ivory/30">·</span>
              {service.tools.join(" · ")}
            </p>
          ) : null}
        </Container>
      </section>
      <section className="bg-paper py-16 text-paper-ink md:py-24">
        <Container className="max-w-2xl">
          {service.faq.length ? (
            <>
              <h2 className="font-serif text-3xl">{t("faq")}</h2>
              <div className="mt-6 divide-y divide-paper-ink/10">
                {service.faq.map((item) => (
                  <details key={item.q} className="py-4">
                    <summary className="cursor-pointer text-lg">{item.q}</summary>
                    <p className="mt-2 leading-7 text-paper-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </>
          ) : null}
          <div className={service.faq.length ? "mt-14 border-t border-paper-ink/10 pt-8" : ""}>
            <p className="text-xs tracking-[0.16em] text-paper-muted uppercase">{t("related")}</p>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {related.map((item) => (
                <li key={item.slug}>
                  <Link href={`/services/${item.slug}`} className="underline decoration-accent decoration-2 underline-offset-4">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </>
  );
}
