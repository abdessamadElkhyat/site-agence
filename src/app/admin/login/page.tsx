import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { signIn } from "@/auth";
import { rateLimit } from "@/lib/rate-limit";

async function login(formData: FormData) {
  "use server";
  const headerList = await headers();
  const ip = headerList.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)) {
    redirect("/admin/login?error=rate");
  }
  try {
    await signIn("credentials", {
      email: String(formData.get("email") || ""),
      password: String(formData.get("password") || ""),
      redirectTo: "/admin",
    });
  } catch (error) {
    const isAuthError =
      error instanceof AuthError ||
      (typeof error === "object" &&
        error !== null &&
        "type" in error &&
        (error as { type?: string }).type === "CredentialsSignin");
    if (isAuthError) redirect("/admin/login?error=1");
    throw error;
  }
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const query = await searchParams;
  return (
    <main className="grid min-h-screen place-items-center bg-[#efebe3] px-5 text-paper-ink">
      <form action={login} className="w-full max-w-sm rounded-3xl border border-paper-ink/8 bg-white p-8 shadow-[0_20px_60px_rgba(22,21,19,0.08)]">
        <p className="text-[11px] tracking-[0.22em] text-paper-muted uppercase">Administration</p>
        <h1 className="mt-2 font-serif text-4xl tracking-tight">LYNE</h1>
        <p className="mt-2 text-sm text-paper-muted">Espace réservé à l&apos;équipe. Les identifiants viennent du seed.</p>
        <label className="mt-6 block text-sm">
          Email
          <input
            name="email"
            type="email"
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-paper-ink/12 px-3 outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </label>
        <label className="mt-4 block text-sm">
          Mot de passe
          <input
            name="password"
            type="password"
            required
            minLength={8}
            className="mt-1.5 h-11 w-full rounded-xl border border-paper-ink/12 px-3 outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          />
        </label>
        {query.error === "1" ? <p className="mt-3 text-sm text-red-700">Identifiants invalides, ou base non connectée.</p> : null}
        {query.error === "rate" ? <p className="mt-3 text-sm text-red-700">Trop de tentatives. Réessayez plus tard.</p> : null}
        <button className="mt-6 h-11 w-full rounded-full bg-ink text-sm font-medium text-ivory transition hover:bg-ink/90">
          Entrer
        </button>
      </form>
    </main>
  );
}
