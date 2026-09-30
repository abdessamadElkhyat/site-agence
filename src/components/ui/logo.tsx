import { cn } from "@/lib/utils";

export function Logo({ className, light = false }: { className?: string; light?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 text-[15px] font-semibold tracking-[0.22em]", className)}>
      <span
        className={cn(
          "grid h-7 w-7 place-items-center text-[13px] font-bold",
          light ? "bg-ink text-accent" : "bg-accent text-accent-ink",
        )}
      >
        L
      </span>
      LYNE
    </span>
  );
}
