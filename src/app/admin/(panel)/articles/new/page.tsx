import { ArticleEditor } from "@/components/admin/article-editor";
import { DbMissing } from "@/components/admin/db-missing";
import { getPrisma } from "@/lib/db";

export default async function NewArticlePage() {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const [categories, authors, tags, articles, services] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.author.findMany({ orderBy: { name: "asc" } }),
    db.tag.findMany({ orderBy: { name: "asc" } }),
    db.article.findMany({ select: { title: true, slug: true, locale: true }, orderBy: { title: "asc" } }),
    db.service.findMany({ select: { name: true, slug: true, locale: true }, orderBy: { name: "asc" } }),
  ]);
  const linkItems = [
    ...articles.map((item) => ({ title: item.title, href: `/${item.locale}/blog/${item.slug}` })),
    ...services.map((item) => ({ title: `Service · ${item.name}`, href: `/${item.locale}/services/${item.slug}` })),
  ];
  return (
    <ArticleEditor
      initial={{ title: "", slug: "", excerpt: "", contentHtml: "<p></p>", status: "DRAFT", tagIds: [] }}
      categories={categories}
      authors={authors}
      tags={tags}
      linkItems={linkItems}
    />
  );
}
