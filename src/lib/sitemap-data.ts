import { articleSlugs } from "@/content/articles";
import { projectSlugs } from "@/content/projects";
import { serviceSlugs } from "@/content/services";
import { getPrisma } from "@/lib/db";

export type SitemapPath = {
  path: string;
  lastModified?: Date;
  changeFrequency?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
};

const staticPaths: SitemapPath[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/services", priority: 0.9, changeFrequency: "monthly" },
  { path: "/realisations", priority: 0.9, changeFrequency: "monthly" },
  { path: "/a-propos", priority: 0.6, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politique-confidentialite", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politique-cookies", priority: 0.2, changeFrequency: "yearly" },
];

export async function getSitemapPaths(): Promise<SitemapPath[]> {
  const now = new Date();
  const db = getPrisma();

  let services = serviceSlugs.map((slug) => ({
    path: `/services/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  let projects = projectSlugs.map((slug) => ({
    path: `/realisations/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));
  let articles = articleSlugs.map((slug) => ({
    path: `/blog/${slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  if (db) {
    try {
      const [serviceRows, projectRows, articleRows] = await Promise.all([
        db.service.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true, locale: true },
          orderBy: { updatedAt: "desc" },
        }),
        db.project.findMany({
          where: { status: "PUBLISHED" },
          select: { slug: true, updatedAt: true, locale: true },
          orderBy: { updatedAt: "desc" },
        }),
        db.article.findMany({
          where: {
            OR: [{ status: "PUBLISHED" }, { status: "SCHEDULED", publishedAt: { lte: now } }],
          },
          select: { slug: true, updatedAt: true, publishedAt: true, locale: true },
          orderBy: { updatedAt: "desc" },
        }),
      ]);

      if (serviceRows.length) {
        const bySlug = new Map<string, Date>();
        for (const row of serviceRows) {
          const prev = bySlug.get(row.slug);
          if (!prev || row.updatedAt > prev) bySlug.set(row.slug, row.updatedAt);
        }
        services = [...bySlug.entries()].map(([slug, lastModified]) => ({
          path: `/services/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.8,
        }));
      }

      if (projectRows.length) {
        const bySlug = new Map<string, Date>();
        for (const row of projectRows) {
          const prev = bySlug.get(row.slug);
          if (!prev || row.updatedAt > prev) bySlug.set(row.slug, row.updatedAt);
        }
        projects = [...bySlug.entries()].map(([slug, lastModified]) => ({
          path: `/realisations/${slug}`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.75,
        }));
      }

      if (articleRows.length) {
        const bySlug = new Map<string, Date>();
        for (const row of articleRows) {
          const stamp = row.updatedAt || row.publishedAt || now;
          const prev = bySlug.get(row.slug);
          if (!prev || stamp > prev) bySlug.set(row.slug, stamp);
        }
        articles = [...bySlug.entries()].map(([slug, lastModified]) => ({
          path: `/blog/${slug}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
      }
    } catch {
      /* keep static fallbacks */
    }
  }

  return [...staticPaths, ...services, ...projects, ...articles];
}
