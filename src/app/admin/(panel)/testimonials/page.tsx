import { Plus, Save, Trash2 } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminBadge,
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
import { deleteTestimonial, saveTestimonial } from "@/server/cms";

export default async function TestimonialsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.testimonial.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Témoignages" description="Citations clients affichées sur le site public." />

      <AdminCard className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium">Ajouter un témoignage</p>
        <form action={saveTestimonial} className="grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nom" className={adminFieldClass} />
          <input name="company" required placeholder="Entreprise" className={adminFieldClass} />
          <input name="role" placeholder="Poste" className={adminFieldClass} />
          <input name="photoUrl" placeholder="URL photo" className={adminFieldClass} />
          <textarea name="quote" required placeholder="Témoignage" rows={3} className={`${adminTextareaClass} md:col-span-2`} />
          <input name="rating" defaultValue="5" placeholder="Note" className={adminFieldClass} />
          <input name="sortOrder" defaultValue="0" placeholder="Ordre" className={adminFieldClass} />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="published" defaultChecked /> Publié
          </label>
          <AdminButton type="submit" variant="primary" className="w-fit">
            <Plus className="h-4 w-4" />
            Ajouter
          </AdminButton>
        </form>
      </AdminCard>

      {total === 0 ? (
        <AdminEmpty title="Aucun témoignage" text="Ajoutez une citation client." />
      ) : (
        <>
        <div className="space-y-3">
          {rows.map((row) => (
            <AdminCard key={row.id} className="p-5">
              <div className="mb-3 flex items-center gap-2">
                <AdminBadge tone={row.published ? "success" : "warn"}>{row.published ? "Publié" : "Masqué"}</AdminBadge>
              </div>
              <form action={saveTestimonial} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="name" defaultValue={row.name} className={adminFieldClass} />
                <input name="company" defaultValue={row.company} className={adminFieldClass} />
                <input name="role" defaultValue={row.role || ""} className={adminFieldClass} />
                <input name="photoUrl" defaultValue={row.photoUrl || ""} className={adminFieldClass} />
                <textarea name="quote" defaultValue={row.quote} rows={3} className={`${adminTextareaClass} md:col-span-2`} />
                <input name="rating" defaultValue={String(row.rating ?? 5)} className={adminFieldClass} />
                <input name="sortOrder" defaultValue={String(row.sortOrder)} className={adminFieldClass} />
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input type="checkbox" name="published" defaultChecked={row.published} /> Publié
                </label>
                <AdminButton type="submit" variant="secondary" className="w-fit">
                  <Save className="h-3.5 w-3.5" />
                  Modifier
                </AdminButton>
              </form>
              <form action={deleteTestimonial} className="mt-3">
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
          basePath="/admin/testimonials"
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
