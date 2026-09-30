import { Plus, Save, Trash2 } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  adminFieldClass,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { getPagination, parsePage } from "@/lib/pagination";
import { deleteTag, saveTag } from "@/server/cms";

export default async function TagsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.tag.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.tag.findMany({
    orderBy: { name: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Tags" description="Mots-clés associés aux articles. Modifiez puis validez chaque ligne." />

      <AdminCard className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium">Ajouter un tag</p>
        <form action={saveTag} className="flex flex-col gap-3 sm:flex-row">
          <input name="name" required placeholder="Nom" className={adminFieldClass} />
          <input name="slug" placeholder="Slug (optionnel)" className={adminFieldClass} />
          <AdminButton type="submit" variant="primary" className="shrink-0">
            <Plus className="h-4 w-4" />
            Ajouter
          </AdminButton>
        </form>
      </AdminCard>

      {total === 0 ? (
        <AdminEmpty title="Aucun tag" text="Ajoutez des tags pour enrichir le classement des articles." />
      ) : (
        <>
          <AdminCard className="divide-y divide-paper-ink/8 overflow-hidden">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                <form action={saveTag} className="grid flex-1 gap-3 sm:grid-cols-[1fr_1fr_auto]">
                  <input type="hidden" name="id" value={row.id} />
                  <input name="name" defaultValue={row.name} className={adminFieldClass} aria-label="Nom" />
                  <input name="slug" defaultValue={row.slug} className={adminFieldClass} aria-label="Slug" />
                  <AdminButton type="submit" variant="secondary">
                    <Save className="h-3.5 w-3.5" />
                    Modifier
                  </AdminButton>
                </form>
                <form action={deleteTag}>
                  <input type="hidden" name="id" value={row.id} />
                  <AdminButton type="submit" variant="danger">
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </AdminButton>
                </form>
              </div>
            ))}
          </AdminCard>
          <AdminPagination
            basePath="/admin/tags"
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
