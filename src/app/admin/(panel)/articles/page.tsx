import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  statusTone,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { getPagination, parsePage } from "@/lib/pagination";
import { formatDate } from "@/lib/utils";
import { deleteArticle } from "@/server/cms";

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.article.count();
  const pagination = getPagination(total, parsePage(query.page));
  const articles = await db.article.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader
        title="Articles"
        description="Rédigez, publiez et organisez le journal SEO du site."
        action={
          <AdminButton href="/admin/articles/new" variant="primary">
            <Plus className="h-4 w-4" />
            Nouvel article
          </AdminButton>
        }
      />

      {total === 0 ? (
        <AdminEmpty title="Aucun article" text="Créez votre premier article pour alimenter le blog." />
      ) : (
        <>
          <AdminCard className="overflow-hidden">
            <ul className="divide-y divide-paper-ink/8">
              {articles.map((article) => (
                <li key={article.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminBadge tone={statusTone(article.status)}>{article.status}</AdminBadge>
                      <span className="text-xs text-paper-muted">{article.category?.name || "Sans catégorie"}</span>
                    </div>
                    <Link href={`/admin/articles/${article.id}`} className="mt-2 block truncate font-medium text-paper-ink hover:underline">
                      {article.title}
                    </Link>
                    <p className="mt-1 text-xs text-paper-muted">
                      Mis à jour le {formatDate(article.updatedAt, "fr")}
                      {article.publishedAt ? ` · Publié le ${formatDate(article.publishedAt, "fr")}` : null}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <a
                      href={`/${article.locale || "fr"}/blog/${article.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-paper-muted transition hover:bg-paper-ink/5 hover:text-paper-ink"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      Voir
                    </a>
                    <AdminButton href={`/admin/articles/${article.id}`} variant="secondary">
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </AdminButton>
                    <form action={deleteArticle}>
                      <input type="hidden" name="id" value={article.id} />
                      <AdminButton type="submit" variant="danger">
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </AdminButton>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </AdminCard>
          <AdminPagination
            basePath="/admin/articles"
            page={pagination.page}
            totalPages={pagination.totalPages}
            total={pagination.total}
            from={pagination.from}
            to={pagination.to}
          />
        </>
      )}
    </div>
  );
}
