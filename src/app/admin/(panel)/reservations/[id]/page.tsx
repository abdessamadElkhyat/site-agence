import { notFound } from "next/navigation";
import { Save } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminPageHeader,
  adminFieldClass,
  statusTone,
} from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";
import { updateReservation } from "@/server/cms";

const statuses = ["NEW", "CONTACTED", "CONFIRMED", "CANCELLED", "COMPLETED"] as const;

export default async function ReservationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const row = await db.reservation.findUnique({ where: { id } });
  if (!row) notFound();

  return (
    <div>
      <AdminPageHeader
        title={`${row.firstName} ${row.lastName}`}
        description="Détail de la demande de rendez-vous."
        action={<AdminBadge tone={statusTone(row.status)}>{row.status}</AdminBadge>}
      />
      <AdminCard className="max-w-xl p-6">
        <dl className="space-y-3 text-sm">
          <div><dt className="text-xs text-paper-muted">Email</dt><dd className="mt-1">{row.email}</dd></div>
          <div><dt className="text-xs text-paper-muted">Téléphone</dt><dd className="mt-1">{row.phone}</dd></div>
          <div><dt className="text-xs text-paper-muted">Entreprise</dt><dd className="mt-1">{row.company || "—"}</dd></div>
          <div><dt className="text-xs text-paper-muted">Type</dt><dd className="mt-1">{row.type}</dd></div>
          <div><dt className="text-xs text-paper-muted">Créneau</dt><dd className="mt-1">{row.date.toISOString().slice(0, 10)} à {row.time}</dd></div>
          <div><dt className="text-xs text-paper-muted">Message</dt><dd className="mt-1 whitespace-pre-wrap rounded-xl bg-paper/70 px-4 py-3">{row.message || "—"}</dd></div>
        </dl>
        <form action={updateReservation} className="mt-6 flex flex-wrap items-center gap-2">
          <input type="hidden" name="id" value={row.id} />
          <select name="status" defaultValue={row.status} className={`${adminFieldClass} !w-auto`}>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <AdminButton type="submit" variant="primary">
            <Save className="h-4 w-4" />
            Modifier le statut
          </AdminButton>
        </form>
      </AdminCard>
    </div>
  );
}
