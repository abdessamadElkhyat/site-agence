import { AdminCard } from "@/components/admin/ui";

export function DbMissing() {
  return (
    <AdminCard className="max-w-xl border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
      <p className="font-medium">MySQL n&apos;est pas connecté</p>
      <p className="mt-2 leading-6">
        Démarrez MySQL (XAMPP), vérifiez <code className="rounded bg-white/70 px-1.5 py-0.5">DATABASE_URL</code> dans{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5">.env</code>, puis lancez{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5">npm run db:setup</code>.
      </p>
    </AdminCard>
  );
}
