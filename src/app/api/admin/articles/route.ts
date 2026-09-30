import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { plainTextFromHtml } from "@/lib/blocks";
import { sanitizeContent } from "@/lib/sanitize";
import { readingMinutes } from "@/lib/utils";
import { articleSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;
  const { db } = gate;
  const parsed = articleSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Données invalides" }, { status: 400 });
  const data = parsed.data;
  const html = sanitizeContent(data.contentHtml);
  const article = await db.article.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      contentJson: data.contentJson ?? {},
      contentHtml: html,
      coverUrl: data.coverUrl || null,
      coverAlt: data.coverAlt || null,
      categoryId: data.categoryId || null,
      authorId: data.authorId || null,
      tags: { connect: data.tagIds.map((id) => ({ id })) },
      status: data.status,
      publishedAt: data.publishedAt ? new Date(data.publishedAt) : data.status === "PUBLISHED" ? new Date() : null,
      readingMinutes: readingMinutes(plainTextFromHtml(html)),
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      focusKeyword: data.focusKeyword || null,
      canonicalUrl: data.canonicalUrl || null,
      ogTitle: data.ogTitle || null,
      ogDescription: data.ogDescription || null,
      ogImage: data.ogImage || null,
      locale: data.locale,
    },
  });
  return NextResponse.json({ id: article.id });
}
