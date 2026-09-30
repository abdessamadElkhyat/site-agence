import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/container";
import { projectSlugs } from "@/content/projects";
import { routing, type Locale } from "@/i18n/routing";
import { getProject, getProjects } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  const projects = await getProjects("fr");
  const slugs = projects.length ? projects.map((item) => item.slug) : projectSlugs;
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const project = await getProject(safe, slug);
  if (!project) return {};
  return pageMetadata({
    locale: safe,
    path: `/realisations/${slug}`,
    title: project.seoTitle,
    description: project.seoDescription,
    image: project.cover,
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const project = await getProject(locale, slug);
  if (!project) notFound();
  const t = await getTranslations("work");

  return (
    <>
      <section className="bg-ink pb-10 pt-28 text-ivory">
        <Container>
          <p className="text-xs tracking-[0.2em] text-brass uppercase">{project.client}</p>
          <h1 className="mt-3 font-serif text-5xl md:text-7xl">{project.title}</h1>
        </Container>
        <div className="relative mt-8 aspect-[16/8] w-full bg-ink-soft">
          {project.cover ? <Image src={project.cover} alt="" fill priority className="object-cover" sizes="100vw" /> : null}
        </div>
      </section>
      <section className="bg-paper py-16 text-paper-ink">
        <Container className="grid gap-12 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <p className="text-lg leading-8">{project.description}</p>
            {project.testimonial ? <blockquote className="mt-8 border-s-2 border-accent ps-4 font-serif text-2xl">“{project.testimonial}”</blockquote> : null}
          </div>
          <aside className="space-y-6 text-sm">
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-paper-muted">{t("goals")}</p>
              <ul className="mt-2 space-y-1">{project.objectives.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div>
              <p className="text-xs tracking-[0.16em] uppercase text-paper-muted">{t("stack")}</p>
              <p className="mt-2">{project.technologies.join(" · ")}</p>
            </div>
            {project.websiteUrl ? <a className="inline-block underline" href={project.websiteUrl}>{t("visit")}</a> : null}
          </aside>
        </Container>
        <Container className="mt-12 grid grid-cols-3 gap-4">
          {project.results.map((result) => (
            <p key={result.label} className="border-t border-paper-ink/15 pt-4">
              <span className="block font-serif text-3xl">{result.value}</span>
              <span className="text-sm text-paper-muted">{result.label}</span>
            </p>
          ))}
        </Container>
        <Container className="mt-12 grid gap-4 md:grid-cols-3">
          {project.gallery.map((src) => (
            <div key={src} className="relative aspect-[4/3] overflow-hidden bg-ink">
              <Image src={src} alt="" fill className="object-cover" sizes="30vw" />
            </div>
          ))}
        </Container>
      </section>
    </>
  );
}
