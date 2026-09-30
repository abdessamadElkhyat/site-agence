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
import { deleteCategory, saveCategory } from "@/server/cms";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.category.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.category.findMany({
    orderBy: { name: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader
        title="Catégories"
        description="Organisez les articles par thèmes. Modifiez une ligne puis enregistrez."
      />

      <AdminCard className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium">Ajouter une catégorie</p>
        <form action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
          <input name="name" required placeholder="Nom" className={adminFieldClass} />
          <input name="slug" placeholder="Slug (optionnel)" className={adminFieldClass} />
          <input name="description" placeholder="Description" className={adminFieldClass} />
          <AdminButton type="submit" variant="primary">
            <Plus className="h-4 w-4" />
            Ajouter
          </AdminButton>
        </form>
      </AdminCard>

      {total === 0 ? (
        <AdminEmpty title="Aucune catégorie" text="Ajoutez une catégorie pour classer vos articles." />
      ) : (
        <>
          <div className="space-y-3">
            {rows.map((row) => (
              <AdminCard key={row.id} className="p-4">
                <form action={saveCategory} className="grid gap-3 md:grid-cols-[1fr_1fr_1.4fr_auto]">
                  <input type="hidden" name="id" value={row.id} />
                  <label className="block text-xs text-paper-muted">
                    Nom
                    <input name="name" defaultValue={row.name} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <label className="block text-xs text-paper-muted">
                    Slug
                    <input name="slug" defaultValue={row.slug} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <label className="block text-xs text-paper-muted">
                    Description
                    <input name="description" defaultValue={row.description || ""} className={`${adminFieldClass} mt-1`} />
                  </label>
                  <div className="flex items-end gap-2">
                    <AdminButton type="submit" variant="secondary">
                      <Save className="h-3.5 w-3.5" />
                      Modifier
                    </AdminButton>
                  </div>
                </form>
                <form action={deleteCategory} className="mt-3">
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
            basePath="/admin/categories"
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
