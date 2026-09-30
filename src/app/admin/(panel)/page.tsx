import { CalendarDays, Eye, FileText, Mail, PenLine } from "lucide-react";
import { DbMissing } from "@/components/admin/db-missing";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";

export default async function DashboardPage() {
  const db = getPrisma();
  if (!db) return <DbMissing />;
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const since = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const [today, month, messages, published, drafts, settings, reservations, allMessages] = await Promise.all([
    db.reservation.count({ where: { createdAt: { gte: startOfDay } } }),
    db.reservation.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.contactMessage.count({ where: { status: "NEW" } }),
    db.article.count({ where: { status: "PUBLISHED" } }),
    db.article.count({ where: { status: "DRAFT" } }),
    db.siteSetting.findUnique({ where: { id: "default" } }),
    db.reservation.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    db.contactMessage.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true, source: true } }),
  ]);
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    return {
      label: date.toLocaleDateString("fr-MA", { month: "short" }),
      reservations: reservations.filter((item) => `${item.createdAt.getFullYear()}-${item.createdAt.getMonth()}` === key).length,
      messages: allMessages.filter((item) => `${item.createdAt.getFullYear()}-${item.createdAt.getMonth()}` === key).length,
    };
  });
  const max = Math.max(1, ...months.map((item) => Math.max(item.reservations, item.messages)));
  const cards = [
    { label: "Réservations aujourd'hui", value: today, icon: CalendarDays },
    { label: "Réservations ce mois", value: month, icon: CalendarDays },
    { label: "Nouveaux messages", value: messages, icon: Mail },
    { label: "Articles publiés", value: published, icon: FileText },
    { label: "Brouillons", value: drafts, icon: PenLine },
    { label: "Visites consenties", value: settings?.visits ?? 0, icon: Eye },
  ];

  return (
    <div>
      <AdminPageHeader title="Tableau de bord" description="Vue d'ensemble de l'activité du studio." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <AdminCard key={card.label} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-paper-muted">{card.label}</p>
                  <p className="mt-2 font-serif text-4xl tracking-tight">{card.value}</p>
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-paper text-paper-ink">
                  <Icon className="h-4 w-4" />
                </span>
              </div>
            </AdminCard>
          );
        })}
      </div>
      <AdminCard className="mt-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-medium">Réservations et messages, six derniers mois</p>
          <div className="flex items-center gap-4 text-xs text-paper-muted">
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-ink" /> Réservations</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent" /> Messages</span>
          </div>
        </div>
        <div className="mt-6 flex h-44 items-end gap-3">
          {months.map((item) => (
            <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
              <div className="flex h-32 w-full items-end justify-center gap-1">
                <span
                  className="w-1/2 min-h-[4px] rounded-t-md bg-ink"
                  style={{ height: `${Math.max(4, (item.reservations / max) * 100)}%` }}
                  title={`${item.reservations} réservations`}
                />
                <span
                  className="w-1/2 min-h-[4px] rounded-t-md bg-accent"
                  style={{ height: `${Math.max(4, (item.messages / max) * 100)}%` }}
                  title={`${item.messages} messages`}
                />
              </div>
              <span className="text-xs text-paper-muted">{item.label}</span>
            </div>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
