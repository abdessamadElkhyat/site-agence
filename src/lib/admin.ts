import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/db";

type AdminGate =
  | { ok: true; db: PrismaClient }
  | { ok: false; response: NextResponse };

export async function requireAdmin(): Promise<AdminGate> {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, response: NextResponse.json({ error: "Non autorisé" }, { status: 401 }) };
  }
  const db = getPrisma();
  if (!db) {
    return { ok: false, response: NextResponse.json({ error: "Base indisponible" }, { status: 503 }) };
  }
  return { ok: true, db };
}
