import { site } from "@/config/site";
import { AdminBadge, AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getPrisma } from "@/lib/db";

export default async function SettingsPage() {
  const db = getPrisma();
  const settings = db ? await db.siteSetting.findUnique({ where: { id: "default" } }) : null;

  return (
    <div>
      <AdminPageHeader
        title="Paramètres"
        description="Identité du site et état de la connexion base de données."
      />
      <AdminCard className="max-w-2xl p-6">
        <div className="mb-4">
          <AdminBadge tone={db ? "success" : "danger"}>{db ? "MySQL connectée" : "Base absente"}</AdminBadge>
        </div>
        <p className="text-sm leading-6 text-paper-muted">
          L&apos;identité affichée sur le site public se change dans <code className="rounded bg-paper px-1.5 py-0.5 text-paper-ink">src/config/site.ts</code> :
          nom, téléphone, email et chiffres. Les contenus se modifient dans les menus de gauche.
        </p>
        <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-xl bg-paper/70 px-4 py-3"><dt className="text-xs text-paper-muted">Nom</dt><dd className="mt-1 font-medium">{site.name}</dd></div>
          <div className="rounded-xl bg-paper/70 px-4 py-3"><dt className="text-xs text-paper-muted">Email</dt><dd className="mt-1 font-medium">{site.email}</dd></div>
          <div className="rounded-xl bg-paper/70 px-4 py-3"><dt className="text-xs text-paper-muted">Téléphone</dt><dd className="mt-1 font-medium">{site.phone}</dd></div>
          <div className="rounded-xl bg-paper/70 px-4 py-3"><dt className="text-xs text-paper-muted">Portée</dt><dd className="mt-1 font-medium">International · remote-first</dd></div>
          <div className="rounded-xl bg-paper/70 px-4 py-3 sm:col-span-2"><dt className="text-xs text-paper-muted">Visites consenties</dt><dd className="mt-1 font-medium">{settings?.visits ?? 0}</dd></div>
        </dl>
        <p className="mt-6 text-sm text-paper-muted">
          Google Analytics, Tag Manager et Meta Pixel ne sont pas chargés. Ajoutez-les seulement après le consentement cookies.
        </p>
      </AdminCard>
    </div>
  );
}
