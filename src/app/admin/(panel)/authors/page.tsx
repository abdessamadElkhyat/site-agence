import { Plus, Save, Trash2 } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  adminFieldClass,
  adminTextareaClass,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { getPagination, parsePage } from "@/lib/pagination";
import { deleteAuthor, saveAuthor } from "@/server/cms";

export default async function AuthorsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.author.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.author.findMany({
    orderBy: { name: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Auteurs" description="Profils affichés sur les articles du journal." />

      <AdminCard className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium">Ajouter un auteur</p>
        <form action={saveAuthor} className="grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nom" className={adminFieldClass} />
          <input name="role" placeholder="Rôle" className={adminFieldClass} />
          <textarea name="bio" placeholder="Bio" rows={3} className={`${adminTextareaClass} md:col-span-2`} />
          <AdminButton type="submit" variant="primary" className="w-fit">
            <Plus className="h-4 w-4" />
            Ajouter
          </AdminButton>
        </form>
      </AdminCard>

      {total === 0 ? (
        <AdminEmpty title="Aucun auteur" text="Ajoutez un auteur pour signer vos articles." />
      ) : (
        <>
          <div className="grid gap-3">
            {rows.map((row) => (
              <AdminCard key={row.id} className="p-5">
                <form action={saveAuthor} className="grid gap-3 md:grid-cols-2">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="text-xs text-paper-muted">
                    Nom
                    <input name="name" defaultValue={row.name} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <label className="text-xs text-paper-muted">
                    Slug
                    <input name="slug" defaultValue={row.slug} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <label className="text-xs text-paper-muted">
                    Rôle
                    <input name="role" defaultValue={row.role || ""} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <label className="text-xs text-paper-muted md:col-span-2">
                    Bio
                    <textarea name="bio" defaultValue={row.bio || ""} rows={3} className={`${adminTextareaClass} mt-1`} />
                  </label>
                  <div className="flex flex-wrap gap-2 md:col-span-2">
                    <AdminButton type="submit" variant="secondary">
                      <Save className="h-3.5 w-3.5" />
                      Modifier
                    </AdminButton>
                  </div>
                </form>
                <form action={deleteAuthor} className="mt-3">
                  <input type="hidden" name="id" value={row.id} />
                  <AdminButton type="submit" variant="danger" className="!px-3 !py-1.5 text-xs">
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </AdminButton>
                </form>
              </AdminCard>
            ))}
          </div>
          <AdminPagination
            basePath="/admin/authors"
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
