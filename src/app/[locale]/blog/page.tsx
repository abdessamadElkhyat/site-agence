import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { PageHero } from "@/components/shared/page-hero";
import { Container } from "@/components/ui/container";
import { routing, type Locale } from "@/i18n/routing";
import { getArticles } from "@/lib/queries";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const t = await getTranslations({ locale: safe, namespace: "blog" });
  return pageMetadata({ locale: safe, path: "/blog", title: t("title"), description: t("title") });
}

export default async function BlogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const articles = await getArticles(locale);
  const [featured, ...rest] = articles;

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} />
      <section className="bg-paper py-16 text-paper-ink md:py-20">
        <Container>
          {articles.length === 0 ? <p>{t("empty")}</p> : null}

          {featured ? (
            <Link href={`/blog/${featured.slug}`} className="group grid gap-8 border-b border-paper-ink/10 pb-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div className="relative aspect-[16/10] overflow-hidden bg-ink lg:aspect-[16/11]">
                {featured.cover ? (
                  <Image
                    src={featured.cover}
                    alt=""
                    fill
                    priority
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(min-width: 1024px) 55vw, 100vw"
                  />
                ) : null}
              </div>
              <div>
                <p className="text-xs tracking-[0.16em] uppercase text-paper-muted">
                  {featured.category} · {formatDate(featured.publishedAt, locale)} · {featured.readingMinutes} {t("reading")}
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{featured.title}</h2>
                <p className="mt-4 max-w-xl text-paper-muted">{featured.excerpt}</p>
              </div>
            </Link>
          ) : null}

          {rest.length ? (
            <div className="mt-12 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {rest.map((article) => (
                <Link key={article.slug} href={`/blog/${article.slug}`} className="group">
                  <div className="relative aspect-[16/11] overflow-hidden bg-ink">
                    {article.cover ? (
                      <Image
                        src={article.cover}
                        alt=""
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                      />
                    ) : null}
                  </div>
                  <p className="mt-4 text-[11px] tracking-[0.16em] uppercase text-paper-muted">
                    {article.category} · {formatDate(article.publishedAt, locale)} · {article.readingMinutes} {t("reading")}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight md:text-3xl">{article.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-paper-muted">{article.excerpt}</p>
                </Link>
              ))}
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
