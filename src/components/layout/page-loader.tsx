import { Mark } from "@/components/ui/logo";

export function PageLoader({ label = "Chargement" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative grid h-14 w-14 place-items-center">
        <span className="absolute inset-0 animate-spin rounded-full border-2 border-ivory/15 border-t-accent" />
        <span className="grid h-9 w-9 place-items-center rounded-[8px] bg-accent text-accent-ink">
          <Mark />
        </span>
      </div>
      <p className="text-[15px] font-semibold tracking-[-0.045em] text-ivory">
        agence<span className="text-accent">mark</span>
      </p>
      <p className="text-[11px] tracking-[0.18em] text-muted uppercase">{label}</p>
    </div>
  );
}
