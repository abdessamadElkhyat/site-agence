import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { clientKey, sameOrigin } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";
import { reservationSchema } from "@/lib/validators";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ error: "Origine refusée" }, { status: 403 });
  if (!rateLimit(`booking:${clientKey(request)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Trop de tentatives" }, { status: 429 });
  }
  const parsed = reservationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const db = getPrisma();
  if (!db) return NextResponse.json({ error: "Base indisponible" }, { status: 503 });
  const data = parsed.data;
  await db.reservation.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      company: data.company || null,
      type: data.type,
      date: new Date(`${data.date}T00:00:00`),
      time: data.time,
      message: data.message || null,
    },
  });
  return NextResponse.json({ ok: true });
}
