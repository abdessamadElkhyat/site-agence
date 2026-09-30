import { notFound } from "next/navigation";
import { ArticleEditor } from "@/components/admin/article-editor";
import { DbMissing } from "@/components/admin/db-missing";
import { getPrisma } from "@/lib/db";

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const [article, categories, authors, tags, articles, services] = await Promise.all([
    db.article.findUnique({ where: { id }, include: { tags: true } }),
    db.category.findMany(),
    db.author.findMany(),
    db.tag.findMany(),
    db.article.findMany({ select: { id: true, title: true, slug: true, locale: true }, orderBy: { title: "asc" } }),
    db.service.findMany({ select: { name: true, slug: true, locale: true }, orderBy: { name: "asc" } }),
  ]);
  if (!article) notFound();
  const linkItems = [
    ...articles
      .filter((item) => item.id !== article.id)
      .map((item) => ({ title: item.title, href: `/${item.locale}/blog/${item.slug}` })),
    ...services.map((item) => ({ title: `Service · ${item.name}`, href: `/${item.locale}/services/${item.slug}` })),
  ];
  return (
    <ArticleEditor
      initial={{
        id: article.id,
        locale: article.locale,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        contentHtml: article.contentHtml,
        coverUrl: article.coverUrl,
        coverAlt: article.coverAlt,
        categoryId: article.categoryId,
        authorId: article.authorId,
        tagIds: article.tags.map((tag) => tag.id),
        status: article.status,
        publishedAt: article.publishedAt ? article.publishedAt.toISOString().slice(0, 16) : "",
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        focusKeyword: article.focusKeyword,
        canonicalUrl: article.canonicalUrl,
        ogTitle: article.ogTitle,
        ogDescription: article.ogDescription,
        ogImage: article.ogImage,
      }}
      categories={categories}
      authors={authors}
      tags={tags}
      linkItems={linkItems}
    />
  );
}
