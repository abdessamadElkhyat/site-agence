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
import { deleteTeamMember, saveTeamMember } from "@/server/cms";

export default async function TeamPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.teamMember.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Équipe" description="Membres affichés sur la page À propos." />

      <AdminCard className="mb-6 p-5">
        <p className="mb-3 text-sm font-medium">Ajouter un membre</p>
        <form action={saveTeamMember} className="grid gap-3 md:grid-cols-2">
          <input name="name" required placeholder="Nom" className={adminFieldClass} />
          <input name="role" required placeholder="Poste" className={adminFieldClass} />
          <textarea name="bio" placeholder="Description" rows={3} className={`${adminTextareaClass} md:col-span-2`} />
          <input name="photoUrl" placeholder="URL photo" className={adminFieldClass} />
          <input name="linkedin" placeholder="LinkedIn" className={adminFieldClass} />
          <input name="instagram" placeholder="Instagram" className={adminFieldClass} />
          <input name="sortOrder" defaultValue="0" className={adminFieldClass} />
          <label className="flex items-center gap-2 text-sm md:col-span-2">
            <input type="checkbox" name="active" defaultChecked /> Actif
          </label>
          <AdminButton type="submit" variant="primary" className="w-fit">
            <Plus className="h-4 w-4" />
            Ajouter
          </AdminButton>
        </form>
      </AdminCard>

      {total === 0 ? (
        <AdminEmpty title="Aucun membre" text="Ajoutez l'équipe du studio." />
      ) : (
        <>
        <div className="space-y-3">
          {rows.map((row) => (
            <AdminCard key={row.id} className="p-5">
              <div className="mb-3">
                <AdminBadge tone={row.active ? "success" : "warn"}>{row.active ? "Actif" : "Inactif"}</AdminBadge>
              </div>
              <form action={saveTeamMember} className="grid gap-3 md:grid-cols-2">
                <input type="hidden" name="id" value={row.id} />
                <input name="name" defaultValue={row.name} className={adminFieldClass} />
                <input name="role" defaultValue={row.role} className={adminFieldClass} />
                <textarea name="bio" defaultValue={row.bio || ""} rows={3} className={`${adminTextareaClass} md:col-span-2`} />
                <input name="photoUrl" defaultValue={row.photoUrl || ""} className={adminFieldClass} />
                <input name="linkedin" defaultValue={row.linkedin || ""} className={adminFieldClass} />
                <input name="instagram" defaultValue={row.instagram || ""} className={adminFieldClass} />
                <input name="sortOrder" defaultValue={String(row.sortOrder)} className={adminFieldClass} />
                <label className="flex items-center gap-2 text-sm md:col-span-2">
                  <input type="checkbox" name="active" defaultChecked={row.active} /> Actif
                </label>
                <AdminButton type="submit" variant="secondary" className="w-fit">
                  <Save className="h-3.5 w-3.5" />
                  Modifier
                </AdminButton>
              </form>
              <form action={deleteTeamMember} className="mt-3">
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
          basePath="/admin/team"
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
