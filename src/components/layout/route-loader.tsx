export function RouteLoader() {
  return (
    <div className="grid min-h-[50vh] place-items-center bg-paper text-paper-ink">
      <div className="flex flex-col items-center gap-3">
        <div className="relative grid h-12 w-12 place-items-center">
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-ink/10 border-t-ink" />
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-serif text-base text-accent">L</span>
        </div>
        <p className="text-[11px] tracking-[0.2em] text-paper-muted uppercase">Chargement</p>
      </div>
    </div>
  );
}
