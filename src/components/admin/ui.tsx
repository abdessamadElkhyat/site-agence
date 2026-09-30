import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { pageHref } from "@/lib/pagination";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-serif text-3xl tracking-tight text-paper-ink md:text-4xl">{title}</h1>
        {description ? <p className="mt-1.5 max-w-xl text-sm text-paper-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-paper-ink/8 bg-white shadow-[0_1px_2px_rgba(22,21,19,0.04)]", className)}>
      {children}
    </div>
  );
}

export function AdminButton({
  href,
  variant = "primary",
  className,
  children,
  type = "button",
  ...props
}: {
  href?: string;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "accent";
  className?: string;
  children: React.ReactNode;
  type?: "button" | "submit";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles = {
    primary: "bg-ink text-ivory hover:bg-ink/90",
    secondary: "border border-paper-ink/15 bg-white text-paper-ink hover:bg-paper",
    ghost: "text-paper-muted hover:bg-paper-ink/5 hover:text-paper-ink",
    danger: "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100",
    accent: "bg-accent text-accent-ink hover:brightness-95",
  }[variant];

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
    styles,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}

export function AdminBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warn" | "danger" | "accent";
}) {
  const styles = {
    neutral: "bg-paper-ink/6 text-paper-muted",
    success: "bg-emerald-100 text-emerald-800",
    warn: "bg-amber-100 text-amber-900",
    danger: "bg-red-100 text-red-800",
    accent: "bg-accent/40 text-accent-ink",
  }[tone];

  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase", styles)}>{children}</span>;
}

export const adminFieldClass =
  "h-11 w-full rounded-xl border border-paper-ink/12 bg-white px-3 text-sm text-paper-ink outline-none transition placeholder:text-paper-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/10";

export const adminTextareaClass =
  "w-full rounded-xl border border-paper-ink/12 bg-white px-3 py-2.5 text-sm text-paper-ink outline-none transition placeholder:text-paper-muted/70 focus:border-ink focus:ring-2 focus:ring-ink/10";

export function AdminEmpty({ title, text }: { title: string; text: string }) {
  return (
    <AdminCard className="px-6 py-14 text-center">
      <p className="font-medium text-paper-ink">{title}</p>
      <p className="mt-1 text-sm text-paper-muted">{text}</p>
    </AdminCard>
  );
}

export function statusTone(status: string): "success" | "warn" | "danger" | "neutral" | "accent" {
  if (status === "PUBLISHED" || status === "CONFIRMED" || status === "DONE" || status === "COMPLETED") return "success";
  if (status === "DRAFT" || status === "SCHEDULED" || status === "CONTACTED" || status === "IN_PROGRESS" || status === "READ") return "warn";
  if (status === "CANCELLED") return "danger";
  if (status === "NEW") return "accent";
  return "neutral";
}

export function AdminPagination({
  basePath,
  page,
  totalPages,
  total,
  from,
  to,
  params,
}: {
  basePath: string;
  page: number;
  totalPages: number;
  total: number;
  from: number;
  to: number;
  params?: Record<string, string | undefined>;
}) {
  if (total === 0) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1).filter((item) => {
    if (totalPages <= 7) return true;
    return item === 1 || item === totalPages || Math.abs(item - page) <= 1;
  });

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-paper-muted">
        Affichage {from}–{to} sur {total}
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <Link
          href={pageHref(basePath, Math.max(1, page - 1), params)}
          aria-disabled={page <= 1}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full border border-paper-ink/12 bg-white px-3 text-sm transition",
            page <= 1 ? "pointer-events-none opacity-40" : "hover:bg-paper",
          )}
        >
          <ChevronLeft className="h-4 w-4" />
          Préc.
        </Link>
        {pages.map((item, index) => {
          const prev = pages[index - 1];
          const showEllipsis = prev !== undefined && item - prev > 1;
          return (
            <span key={item} className="contents">
              {showEllipsis ? <span className="px-1 text-paper-muted">…</span> : null}
              <Link
                href={pageHref(basePath, item, params)}
                className={cn(
                  "inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm transition",
                  item === page ? "bg-ink text-ivory" : "border border-paper-ink/12 bg-white hover:bg-paper",
                )}
              >
                {item}
              </Link>
            </span>
          );
        })}
        <Link
          href={pageHref(basePath, Math.min(totalPages, page + 1), params)}
          aria-disabled={page >= totalPages}
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-full border border-paper-ink/12 bg-white px-3 text-sm transition",
            page >= totalPages ? "pointer-events-none opacity-40" : "hover:bg-paper",
          )}
        >
          Suiv.
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
