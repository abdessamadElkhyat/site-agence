import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { clientKey, sameOrigin } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { newsletterSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
  if (!rateLimit(`news:${clientKey(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives" }, { status: 429 });
  }
  const parsed = newsletterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  const db = getPrisma();
  if (!db) return NextResponse.json({ ok: true, stored: false });
  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data.email.toLowerCase() },
    update: { locale: parsed.data.locale },
    create: { email: parsed.data.email.toLowerCase(), locale: parsed.data.locale },
  });
  return NextResponse.json({ ok: true, stored: true });
}
