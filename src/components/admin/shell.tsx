import { signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin/nav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-main-scroll min-h-screen bg-[#efebe3] text-paper-ink md:grid md:grid-cols-[260px_1fr]">
      <aside className="border-b border-white/5 bg-ink text-ivory md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-e md:border-white/5">
        <div className="px-5 py-6">
          <p className="text-[11px] tracking-[0.22em] text-brass uppercase">Studio</p>
          <p className="mt-1 font-serif text-3xl tracking-tight">LYNE</p>
          <p className="mt-1 text-xs text-muted">Administration</p>
        </div>
        <div className="admin-scroll min-h-0 flex-1 md:overflow-y-auto">
          <AdminNav />
        </div>
        <form
          className="border-t border-white/5 px-3 py-4"
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/admin/login" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition hover:bg-white/5 hover:text-ivory"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </form>
      </aside>
      <div className="admin-main-scroll min-w-0 px-4 py-6 md:px-8 md:py-10 lg:px-10">{children}</div>
    </div>
  );
}
