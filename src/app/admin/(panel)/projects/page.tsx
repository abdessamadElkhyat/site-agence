import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { deleteProject } from "@/server/cms";

export default async function ProjectsAdminPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.project.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.project.findMany({
    orderBy: { sortOrder: "asc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader
        title="Portfolio"
        description="Projets publiés sur /realisations."
        action={
          <AdminButton href="/admin/projects/new" variant="primary">
            <Plus className="h-4 w-4" />
            Nouveau projet
          </AdminButton>
        }
      />

      {total === 0 ? (
        <AdminEmpty title="Aucun projet" text="Ajoutez une réalisation pour enrichir le portfolio." />
      ) : (
        <>
          <AdminCard className="overflow-hidden">
            <ul className="divide-y divide-paper-ink/8">
              {rows.map((row) => (
                <li key={row.id} className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <AdminBadge tone={statusTone(row.status)}>{row.status}</AdminBadge>
                      <span className="text-xs uppercase tracking-wide text-paper-muted">{row.locale} · {row.category}</span>
                    </div>
                    <p className="mt-2 font-medium">{row.title}</p>
                    <p className="text-sm text-paper-muted">{row.client}</p>
                  </div>
                  <div className="flex gap-2">
                    <AdminButton href={`/admin/projects/${row.id}`} variant="secondary">
                      <Pencil className="h-3.5 w-3.5" />
                      Modifier
                    </AdminButton>
                    <form action={deleteProject}>
                      <input type="hidden" name="id" value={row.id} />
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
            basePath="/admin/projects"
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
