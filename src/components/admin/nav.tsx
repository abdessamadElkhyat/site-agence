"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  FileText,
  FolderOpen,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Tag,
  Users,
  Briefcase,
  Layers,
  PenLine,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/reservations", label: "Réservations", icon: CalendarDays },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/articles", label: "Articles", icon: FileText },
  { href: "/admin/categories", label: "Catégories", icon: FolderOpen },
  { href: "/admin/tags", label: "Tags", icon: Tag },
  { href: "/admin/authors", label: "Auteurs", icon: PenLine },
  { href: "/admin/projects", label: "Portfolio", icon: Briefcase },
  { href: "/admin/services", label: "Services", icon: Layers },
  { href: "/admin/testimonials", label: "Témoignages", icon: MessageSquareQuote },
  { href: "/admin/team", label: "Équipe", icon: Users },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto px-3 pb-4 md:block md:space-y-0.5 md:overflow-visible md:px-3">
      {links.map((link) => {
        const active = link.exact ? pathname === link.href : pathname === link.href || pathname.startsWith(`${link.href}/`);
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm transition",
              active ? "bg-accent text-accent-ink" : "text-ivory/70 hover:bg-white/5 hover:text-ivory",
            )}
          >
            <Icon className="h-4 w-4 shrink-0 opacity-80" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
