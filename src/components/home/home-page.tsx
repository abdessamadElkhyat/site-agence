import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { site } from "@/config/site";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { ServiceIndex } from "@/components/home/service-index";
import { StatsBand } from "@/components/home/stats-band";
import type { Project, Service, Testimonial } from "@/types/content";
import type { Locale } from "@/i18n/routing";

export async function HomePage({
  locale,
  services,
  projects,
  articles,
  testimonial,
}: {
  locale: Locale;
  services: Service[];
  projects: Project[];
  articles: { slug: string; title: string; category: string; cover: string }[];
  testimonial: Testimonial;
}) {
  const t = await getTranslations("hero");
  const s = await getTranslations("sections");
  const method = await getTranslations("method");
  const featured = projects.slice(0, 3);
  const names = services.map((service) => service.name);

  return (
    <>
      <section className="relative min-h-[100svh] overflow-hidden bg-ink pt-28 text-ivory md:pt-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="glow-drift absolute -start-24 top-16 h-[28rem] w-[28rem] rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute end-0 top-0 h-full w-1/2 bg-[radial-gradient(ellipse_at_top_right,rgba(214,255,63,0.14),transparent_55%)]" />
        </div>
        <Container className="relative grid min-h-[calc(100svh-8rem)] content-end pb-10">
          <p className="text-xs tracking-[0.22em] text-brass uppercase">{t("eyebrow")}</p>
          <h1 className="mt-5 max-w-5xl font-serif text-[clamp(2.7rem,7.4vw,6.6rem)] leading-[0.92] tracking-[-0.03em]">
            {t("title")} <em className="text-accent not-italic">{t("emphasis")}</em>.
          </h1>
          <div className="mt-8 grid items-end gap-8 md:grid-cols-[1.2fr_0.8fr]">
            <p className="max-w-xl text-base leading-7 text-ivory/75 md:text-lg">{t("subtitle")}</p>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link href="/contact" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-ink">
                {t("primary")}
              </Link>
              <Link href="/services" className="rounded-full border border-line px-5 py-3 text-sm">
                {t("secondary")}
              </Link>
            </div>
          </div>
          <div className="mt-12 grid grid-cols-3 gap-3 md:gap-5">
            {featured.map((project) => (
              <Link key={project.slug} href={`/realisations/${project.slug}`} className="group relative aspect-[4/5] overflow-hidden bg-ink-soft md:aspect-[16/10]">
                <Image src={project.cover} alt={project.title} fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 30vw, 33vw" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent p-3 text-sm">{project.title}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <div className="overflow-hidden border-y border-line bg-ink py-4 text-ivory" dir="ltr">
        <div className="marquee-track flex w-max gap-10">
          {[...names, ...names].map((name, index) => (
            <span key={`${name}-${index}`} className="font-serif text-3xl text-ivory/80 md:text-5xl">
              {name} <span className="text-accent">/</span>
            </span>
          ))}
        </div>
      </div>

      <section className="bg-ink py-20 text-ivory md:py-28">
        <Container>
          <Reveal>
            <p className="text-xs tracking-[0.2em] text-brass uppercase">{s("workEyebrow")}</p>
            <div className="mt-4 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <h2 className="max-w-xl font-serif text-4xl leading-none md:text-6xl">{s("workTitle")}</h2>
              <Link href="/realisations" className="text-sm text-accent">{s("workAll")}</Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {featured.map((project, index) => (
              <Link key={project.slug} href={`/realisations/${project.slug}`} className={index === 0 ? "md:col-span-2" : ""}>
                <article className="group">
                  <div className={`relative overflow-hidden bg-ink-soft ${index === 0 ? "aspect-[16/8]" : "aspect-[4/3]"}`}>
                    <Image src={project.cover} alt="" fill className="object-cover transition duration-700 group-hover:scale-[1.03]" sizes="(min-width: 768px) 70vw, 100vw" />
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4">
                    <h3 className="font-serif text-3xl">{project.title}</h3>
                    <p className="text-sm text-muted">{project.client}</p>
                  </div>
                  <p className="mt-2 max-w-2xl text-ivory/70">{project.excerpt}</p>
                </article>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-paper py-20 text-paper-ink md:py-28">
        <Container>
          <div className="mb-12 max-w-xl">
            <p className="text-xs tracking-[0.2em] text-paper-muted uppercase">{s("servicesEyebrow")}</p>
            <h2 className="mt-3 font-serif text-4xl md:text-6xl">{s("servicesTitle")}</h2>
            <p className="mt-4 text-paper-muted">{s("servicesText")}</p>
          </div>
          <ServiceIndex services={services} />
        </Container>
      </section>

      <section className="bg-ink py-20 text-ivory md:py-28">
        <Container>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">{s("methodEyebrow")}</p>
          <h2 className="mt-3 max-w-lg font-serif text-4xl md:text-6xl">{s("methodTitle")}</h2>
          <ol className="mt-12 grid gap-px bg-line md:grid-cols-4">
            {(["1", "2", "3", "4"] as const).map((step) => (
              <li key={step} className="bg-ink p-6 md:min-h-64">
                <span className="font-serif text-4xl text-accent">0{step}</span>
                <h3 className="mt-8 text-xl">{method(`${step}.title`)}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{method(`${step}.text`)}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <StatsBand />

      <section className="bg-ink py-24 text-ivory">
        <Container>
          <blockquote>
            <p className="max-w-4xl font-serif text-3xl leading-tight md:text-5xl">“{testimonial.quote}”</p>
            <footer className="mt-8 text-sm text-brass">
              {testimonial.name} — {testimonial.role}, {testimonial.company}
            </footer>
          </blockquote>
        </Container>
      </section>

      <section className="bg-paper py-20 text-paper-ink md:py-28">
        <Container>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.2em] text-paper-muted uppercase">{s("journalEyebrow")}</p>
              <h2 className="mt-3 font-serif text-4xl md:text-6xl">{s("journalTitle")}</h2>
            </div>
            <Link href="/blog" className="text-sm underline underline-offset-4">{s("journalAll")}</Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {articles.slice(0, 3).map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                <div className="relative aspect-[4/3] overflow-hidden bg-ink">
                  <Image src={article.cover} alt="" fill className="object-cover transition duration-700 group-hover:scale-105" sizes="(min-width: 768px) 30vw, 100vw" />
                </div>
                <p className="mt-4 text-xs tracking-[0.16em] uppercase text-paper-muted">{article.category}</p>
                <h3 className="mt-2 font-serif text-2xl leading-tight">{article.title}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-accent text-accent-ink">
        <Container className="grid gap-8 py-20 md:grid-cols-[1.4fr_0.6fr] md:items-end md:py-28">
          <div>
            <h2 className="max-w-3xl font-serif text-4xl leading-none md:text-6xl">{s("closingTitle")}</h2>
            <p className="mt-5 max-w-xl text-base">{s("closingText")}</p>
          </div>
          <div className="flex flex-col gap-3 md:items-start">
            <Link href="/contact" className="rounded-full bg-ink px-5 py-3 text-sm text-ivory">{t("primary")}</Link>
            <a href={`https://wa.me/${site.whatsapp}`} className="text-sm underline underline-offset-4">WhatsApp · {site.phone}</a>
          </div>
        </Container>
      </section>
    </>
  );
}
