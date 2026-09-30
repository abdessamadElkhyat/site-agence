import Link from "next/link";
import { Eye, Trash2 } from "lucide-react";
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
import { deleteReservation, updateReservation } from "@/server/cms";

const statuses = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

export default async function ReservationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const query = await searchParams;
  const where = query.status ? { status: query.status as (typeof statuses)[number] } : undefined;
  const total = await db.reservation.count({ where });
  const pagination = getPagination(total, parsePage(query.page));
  const rows = await db.reservation.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: pagination.skip,
    take: pagination.take,
  });
  const filterParams = { status: query.status };

  return (
    <div>
      <AdminPageHeader title="Réservations" description="Demandes de rendez-vous reçues depuis le site." />

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterChip href="/admin/reservations" active={!query.status} label="Toutes" />
        {statuses.map((status) => (
          <FilterChip key={status} href={`/admin/reservations?status=${status}`} active={query.status === status} label={status} />
        ))}
      </div>

      {total === 0 ? (
        <AdminEmpty title="Aucune réservation" text="Les demandes de créneau apparaîtront ici." />
      ) : (
        <>
        <AdminCard className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="border-b border-paper-ink/8 text-xs uppercase tracking-wide text-paper-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Client</th>
                <th className="px-4 py-3 font-medium">Entreprise</th>
                <th className="px-4 py-3 font-medium">Créneau</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-paper-ink/8">
              {rows.map((row) => (
                <tr key={row.id} className="align-top">
                  <td className="px-4 py-4">
                    <Link href={`/admin/reservations/${row.id}`} className="font-medium hover:underline">
                      {row.firstName} {row.lastName}
                    </Link>
                    <p className="text-xs text-paper-muted">{row.email}</p>
                    <p className="text-xs text-paper-muted">{row.phone}</p>
                  </td>
                  <td className="px-4 py-4 text-paper-muted">{row.company || "—"}</td>
                  <td className="px-4 py-4">
                    {row.date.toISOString().slice(0, 10)}
                    <span className="block text-xs text-paper-muted">{row.time}</span>
                  </td>
                  <td className="px-4 py-4">{row.type}</td>
                  <td className="px-4 py-4">
                    <form action={updateReservation} className="flex flex-col gap-2">
                      <input type="hidden" name="id" value={row.id} />
                      <AdminBadge tone={statusTone(row.status)}>{row.status}</AdminBadge>
                      <select name="status" defaultValue={row.status} className={`${adminFieldClass} !h-9`}>
                        {statuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                      <AdminButton type="submit" variant="secondary" className="!px-3 !py-1.5 text-xs">
                        Modifier
                      </AdminButton>
                    </form>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-2">
                      <AdminButton href={`/admin/reservations/${row.id}`} variant="secondary" className="!px-3 !py-1.5 text-xs">
                        <Eye className="h-3.5 w-3.5" />
                        Voir
                      </AdminButton>
                      <form action={deleteReservation}>
                        <input type="hidden" name="id" value={row.id} />
                        <AdminButton type="submit" variant="danger" className="!px-3 !py-1.5 text-xs">
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </AdminButton>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AdminCard>
        <AdminPagination
          basePath="/admin/reservations"
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          from={pagination.from}
          to={pagination.to}
          params={filterParams}
        />
        </>
      )}
    </div>
  );
}

function FilterChip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active ? "bg-ink text-ivory" : "border border-paper-ink/12 bg-white text-paper-muted hover:text-paper-ink"
      }`}
    >
      {label}
    </Link>
  );
}
