import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "grid h-8 w-8 shrink-0 place-items-center rounded-[7px]",
          light ? "bg-ink text-accent" : "bg-accent text-accent-ink",
        )}
      >
        <Mark />
      </span>
      <span
        className={cn(
          "text-[15px] leading-none font-semibold tracking-[-0.045em]",
          light ? "text-paper-ink" : "text-ivory",
        )}
      >
        agence
        <span className={light ? "text-paper-ink" : "text-accent"}>mark</span>
      </span>
    </span>
  );
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-[17px] w-[17px]", className)} aria-hidden>
      <path fill="currentColor" d="M3.6 19.4V5.4l8.4 7.4 8.4-7.4v14h-2.8v-8.1L12 16.2l-5.6-4.9v8.1H3.6Z" />
    </svg>
  );
}
