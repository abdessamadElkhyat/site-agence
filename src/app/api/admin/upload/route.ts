import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import sharp from "sharp";
import { requireAdmin } from "@/lib/admin";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Image uniquement" }, { status: 400 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const directory = path.join(process.cwd(), "public", "uploads");
  await mkdir(directory, { recursive: true });

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "").slice(0, 60) || "image";
  const base = `${Date.now()}-${safeName}`.replace(/\.[^.]+$/, "");
  const image = sharp(bytes).rotate();
  const meta = await image.metadata();
  const output = await image.resize({ width: 2000, withoutEnlargement: true }).webp({ quality: 80 }).toBuffer();
  const filename = `${base}.webp`;

  await writeFile(path.join(directory, filename), output);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    filename,
    mimeType: "image/webp",
    size: output.length,
    width: Math.min(meta.width || 2000, 2000),
    height: meta.height ?? null,
    alt: String(form.get("alt") || ""),
  });
}
