import { Mail, Trash2 } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
  adminFieldClass,
  statusTone,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { getPagination, parsePage } from "@/lib/pagination";
import { formatDate } from "@/lib/utils";
import { deleteMessage, updateMessage } from "@/server/cms";

const statuses = ["NEW", "READ", "IN_PROGRESS", "DONE"] as const;

export default async function MessagesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const total = await db.contactMessage.count();
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.take,
  });

  return (
    <div>
      <AdminPageHeader title="Messages" description="Demandes reçues via le formulaire de contact." />

      {total === 0 ? (
        <AdminEmpty title="Aucun message" text="Les nouvelles demandes apparaîtront ici." />
      ) : (
        <>
        <div className="space-y-3">
          {rows.map((row) => (
            <AdminCard key={row.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <AdminBadge tone={statusTone(row.status)}>{row.status}</AdminBadge>
                    <span className="text-xs text-paper-muted">{formatDate(row.createdAt, "fr")}</span>
                  </div>
                  <p className="mt-2 font-medium">
                    {row.firstName} {row.lastName}
                    <span className="font-normal text-paper-muted"> · {row.company || "Particulier"}</span>
                  </p>
                  <p className="mt-1 text-sm text-paper-muted">
                    {row.email}
                    {row.phone ? ` · ${row.phone}` : ""}
                    {row.service ? ` · ${row.service}` : ""}
                    {row.budget ? ` · ${row.budget}` : ""}
                  </p>
                </div>
                <a
                  href={`mailto:${row.email}?subject=LYNE`}
                  className="inline-flex items-center gap-2 rounded-full border border-paper-ink/15 bg-white px-4 py-2 text-sm hover:bg-paper"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Répondre
                </a>
              </div>
              <p className="mt-4 whitespace-pre-wrap rounded-xl bg-paper/70 px-4 py-3 text-sm leading-6">{row.message}</p>
              {row.source ? <p className="mt-2 text-xs text-paper-muted">Source : {row.source}</p> : null}
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <form action={updateMessage} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={row.id} />
                  <select name="status" defaultValue={row.status} className={`${adminFieldClass} !h-10 !w-auto`}>
                    {statuses.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <AdminButton type="submit" variant="secondary">
                    Modifier le statut
                  </AdminButton>
                </form>
                <form action={deleteMessage}>
                  <input type="hidden" name="id" value={row.id} />
                  <AdminButton type="submit" variant="danger">
                    <Trash2 className="h-3.5 w-3.5" />
                    Supprimer
                  </AdminButton>
                </form>
              </div>
            </AdminCard>
          ))}
        </div>
        <AdminPagination
          basePath="/admin/messages"
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
