import { staticArticles } from "@/content/articles";
import { staticProjects } from "@/content/projects";
import { staticServices } from "@/content/services";
import { staticTeam, staticTestimonials } from "@/content/people";
import type { Locale } from "@/i18n/routing";
import { blocksToHtml, plainTextFromHtml } from "@/lib/blocks";
import { asFaq, asResults, asSteps, asStringArray, getPrisma } from "@/lib/db";
import { sanitizeContent } from "@/lib/sanitize";
import { readingMinutes } from "@/lib/utils";
import type { Article, Project, Service, TeamMember, Testimonial } from "@/types/content";

export type ArticleView = Omit<Article, "blocks"> & {
  html: string;
  readingMinutes: number;
};

function articleFromStatic(article: Article): ArticleView {
  const html = sanitizeContent(blocksToHtml(article.blocks));
  const { blocks: _blocks, ...rest } = article;
  return { ...rest, html, readingMinutes: readingMinutes(plainTextFromHtml(html)) };
}

export async function getServices(locale: Locale) {
  const fallback = staticServices(locale);
  const db = getPrisma();
  if (!db) return fallback;
  try {
    const rows = await db.service.findMany({
      where: { status: "PUBLISHED", locale },
      orderBy: { sortOrder: "asc" },
    });
    const source = rows.length
      ? rows
      : await db.service.findMany({ where: { status: "PUBLISHED", locale: "fr" }, orderBy: { sortOrder: "asc" } });
    if (!source.length) return fallback;
    return source.map(mapService);
  } catch {
    return fallback;
  }
}

export async function getService(locale: Locale, slug: string) {
  const services = await getServices(locale);
  return services.find((service) => service.slug === slug) ?? null;
}

export async function getProjects(locale: Locale) {
  const fallback = staticProjects(locale);
  const db = getPrisma();
  if (!db) return fallback;
  try {
    const rows = await db.project.findMany({
      where: { status: "PUBLISHED", locale },
      orderBy: { sortOrder: "asc" },
    });
    const source = rows.length
      ? rows
      : await db.project.findMany({ where: { status: "PUBLISHED", locale: "fr" }, orderBy: { sortOrder: "asc" } });
    if (!source.length) return fallback;
    return source.map(mapProject);
  } catch {
    return fallback;
  }
}

export async function getProject(locale: Locale, slug: string) {
  const projects = await getProjects(locale);
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getArticles(locale: Locale): Promise<ArticleView[]> {
  const fallback = staticArticles.map(articleFromStatic);
  const db = getPrisma();
  if (!db) return fallback;
  try {
    const now = new Date();
    const rows = await db.article.findMany({
      where: {
        locale: "fr",
        OR: [{ status: "PUBLISHED" }, { status: "SCHEDULED", publishedAt: { lte: now } }],
      },
      include: { category: true, author: true, tags: true },
      orderBy: { publishedAt: "desc" },
    });
    if (!rows.length) return fallback;
    void locale;
    return rows.map((row) => ({
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      cover: row.coverUrl || fallback[0]?.cover || "",
      coverAlt: row.coverAlt || row.title,
      category: row.category?.name || "Journal",
      tags: row.tags.map((tag) => tag.name),
      author: row.author?.name || "LYNE",
      publishedAt: (row.publishedAt ?? row.createdAt).toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      seoTitle: row.seoTitle || row.title,
      seoDescription: row.seoDescription || row.excerpt,
      focusKeyword: row.focusKeyword || "",
      canonicalUrl: row.canonicalUrl || "",
      ogTitle: row.ogTitle || "",
      ogDescription: row.ogDescription || "",
      ogImage: row.ogImage || "",
      faq: asFaq(row.faq),
      html: sanitizeContent(row.contentHtml),
      readingMinutes: row.readingMinutes,
    }));
  } catch {
    return fallback;
  }
}

export async function getArticle(locale: Locale, slug: string) {
  const articles = await getArticles(locale);
  return articles.find((article) => article.slug === slug) ?? null;
}

export async function getTestimonials() {
  const db = getPrisma();
  if (!db) return staticTestimonials;
  try {
    const rows = await db.testimonial.findMany({ where: { published: true }, orderBy: { sortOrder: "asc" } });
    if (!rows.length) return staticTestimonials;
    return rows.map(
      (row): Testimonial => ({
        name: row.name,
        company: row.company,
        role: row.role || "",
        quote: row.quote,
        photo: row.photoUrl || staticTestimonials[0].photo,
        rating: row.rating || 5,
      }),
    );
  } catch {
    return staticTestimonials;
  }
}

export async function getTeam() {
  const db = getPrisma();
  if (!db) return staticTeam;
  try {
    const rows = await db.teamMember.findMany({ where: { active: true }, orderBy: { sortOrder: "asc" } });
    if (!rows.length) return staticTeam;
    return rows.map(
      (row): TeamMember => ({
        name: row.name,
        role: row.role,
        bio: row.bio || "",
        photo: row.photoUrl || staticTeam[0].photo,
        linkedin: row.linkedin || undefined,
      }),
    );
  } catch {
    return staticTeam;
  }
}

function mapService(row: {
  slug: string;
  icon: string;
  imageUrl: string | null;
  tools: unknown;
  name: string;
  summary: string;
  description: string;
  problem: string;
  solution: string;
  benefits: unknown;
  process: unknown;
  faq: unknown;
  seoTitle: string | null;
  seoDescription: string | null;
}): Service {
  return {
    slug: row.slug,
    icon: row.icon,
    image: row.imageUrl || "",
    tools: asStringArray(row.tools),
    name: row.name,
    summary: row.summary,
    description: row.description,
    problem: row.problem,
    solution: row.solution,
    benefits: asStringArray(row.benefits),
    process: asSteps(row.process),
    faq: asFaq(row.faq),
    seoTitle: row.seoTitle || row.name,
    seoDescription: row.seoDescription || row.summary,
  };
}

function mapProject(row: {
  slug: string;
  category: string;
  coverUrl: string | null;
  gallery: unknown;
  technologies: unknown;
  websiteUrl: string | null;
  title: string;
  client: string;
  excerpt: string;
  description: string;
  objectives: unknown;
  results: unknown;
  testimonial: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}): Project {
  return {
    slug: row.slug,
    category: row.category,
    cover: row.coverUrl || "",
    gallery: asStringArray(row.gallery),
    technologies: asStringArray(row.technologies),
    websiteUrl: row.websiteUrl || undefined,
    title: row.title,
    client: row.client,
    excerpt: row.excerpt,
    description: row.description,
    objectives: asStringArray(row.objectives),
    results: asResults(row.results),
    testimonial: row.testimonial || undefined,
    seoTitle: row.seoTitle || row.title,
    seoDescription: row.seoDescription || row.excerpt,
  };
}
