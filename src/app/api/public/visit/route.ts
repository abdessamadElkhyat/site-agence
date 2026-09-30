import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db";
import { clientKey, sameOrigin } from "@/lib/request";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return NextResponse.json({ ok: false }, { status: 403 });
  if (!rateLimit(`visit:${clientKey(request)}`, 30, 60 * 60 * 1000)) return NextResponse.json({ ok: true });
  const db = getPrisma();
  if (!db) return NextResponse.json({ ok: true });
  await db.siteSetting.upsert({
    where: { id: "default" },
    update: { visits: { increment: 1 } },
    create: { id: "default", visits: 1 },
  });
  return NextResponse.json({ ok: true });
}
