import Image from "next/image";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { ArticleSidebar } from "@/components/blog/article-sidebar";
import { RelatedSlider } from "@/components/blog/related-slider";
import { JsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { articleSlugs } from "@/content/articles";
import { site } from "@/config/site";
import { prepareArticleHtml } from "@/lib/article-html";
import { routing, type Locale } from "@/i18n/routing";
import { getArticle, getArticles } from "@/lib/queries";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export async function generateStaticParams() {
  const articles = await getArticles("fr");
  const slugs = articles.length ? articles.map((item) => item.slug) : articleSlugs;
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const safe = (hasLocale(routing.locales, locale) ? locale : "fr") as Locale;
  const article = await getArticle(safe, slug);
  if (!article) return {};
  return pageMetadata({
    locale: safe,
    path: `/blog/${slug}`,
    title: article.seoTitle,
    description: article.seoDescription,
    image: article.ogImage || article.cover,
    canonical: article.canonicalUrl,
    ogTitle: article.ogTitle || article.seoTitle,
    ogDescription: article.ogDescription || article.seoDescription,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt || article.publishedAt,
    authors: [article.author],
  });
}

export default async function ArticlePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const article = await getArticle(locale, slug);
  if (!article) notFound();
  const t = await getTranslations("blog");
  const nav = await getTranslations("common");
  const related = (await getArticles(locale)).filter((item) => item.slug !== slug).slice(0, 8);
  const { html, headings } = prepareArticleHtml(article.html);
  const relatedCards = related.map((item) => ({
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    cover: item.cover,
    category: item.category,
    publishedAt: item.publishedAt,
    readingMinutes: item.readingMinutes,
  }));

  return (
    <article className="bg-paper text-paper-ink">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.seoDescription,
          image: absoluteUrl(article.ogImage || article.cover || "/opengraph-image"),
          mainEntityOfPage: absoluteUrl(locale === "fr" ? `/blog/${slug}` : `/${locale}/blog/${slug}`),
          datePublished: article.publishedAt,
          dateModified: article.updatedAt || article.publishedAt,
          author: { "@type": "Organization", name: article.author },
          publisher: {
            "@type": "Organization",
            name: site.name,
            logo: { "@type": "ImageObject", url: absoluteUrl("/opengraph-image") },
          },
          inLanguage: locale,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: nav("home"), item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
            {
              "@type": "ListItem",
              position: 3,
              name: article.title,
              item: absoluteUrl(locale === "fr" ? `/blog/${slug}` : `/${locale}/blog/${slug}`),
            },
          ],
        }}
      />

      <header className="relative isolate min-h-[72vh] overflow-hidden bg-ink text-ivory md:min-h-[78vh]">
        {article.cover ? (
          <Image
            src={article.cover}
            alt={article.coverAlt}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25" />
        <Container className="relative flex min-h-[72vh] flex-col justify-end pb-12 pt-32 md:min-h-[78vh] md:pb-16">
          <Link href="/blog" className="text-xs tracking-[0.18em] text-ivory/70 uppercase transition hover:text-ivory">
            ← {t("back")}
          </Link>
          <p className="mt-6 text-xs tracking-[0.18em] text-brass uppercase">
            {article.category} · {formatDate(article.publishedAt, locale)} · {article.readingMinutes} {t("reading")}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.05] md:text-6xl lg:text-7xl">{article.title}</h1>
          <p className="mt-5 max-w-2xl text-base text-ivory/80 md:text-lg">{article.excerpt}</p>
          <p className="mt-6 text-sm text-ivory/55">{article.author}</p>
        </Container>
      </header>

      <Container className="py-12 md:py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">
          <div className="min-w-0">
            <div className="prose-article max-w-3xl" dangerouslySetInnerHTML={{ __html: html }} />
            {article.faq.length ? (
              <div className="mt-14 max-w-3xl border-t border-paper-ink/10 pt-10">
                <h2 className="font-serif text-3xl">FAQ</h2>
                {article.faq.map((item) => (
                  <details key={item.q} className="mt-4 border-t border-paper-ink/10 pt-4">
                    <summary className="cursor-pointer font-medium">{item.q}</summary>
                    <p className="mt-2 text-paper-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            ) : null}
          </div>

          <ArticleSidebar
            headings={headings}
            related={relatedCards}
            labels={{
              toc: t("toc"),
              related: t("related"),
              ctaTitle: t("ctaTitle"),
              ctaText: t("ctaText"),
              ctaButton: t("ctaButton"),
            }}
          />
        </div>
      </Container>

      <RelatedSlider
        items={relatedCards}
        locale={locale}
        label={t("related")}
        title={t("relatedTitle")}
        readingLabel={t("reading")}
      />
    </article>
  );
}
