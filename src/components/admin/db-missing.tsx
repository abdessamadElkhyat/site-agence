export function DbMissing() {
  return (
    <div className="max-w-xl border border-amber-300 bg-amber-50 p-4 text-sm text-paper-ink">
      <p className="font-medium">Base Postgres non connectée</p>
      <p className="mt-2 text-paper-muted">
        Vérifiez <code className="rounded bg-white/70 px-1.5 py-0.5">DATABASE_URL</code> et{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5">DIRECT_URL</code> (Supabase), puis lancez{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5">npx prisma db push</code> et{" "}
        <code className="rounded bg-white/70 px-1.5 py-0.5">npx prisma db seed</code>.
      </p>
    </div>
  );
}
