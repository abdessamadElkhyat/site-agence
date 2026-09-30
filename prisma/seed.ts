import { hash } from "bcryptjs";
import { Prisma, PrismaClient } from "@prisma/client";
import { staticArticles } from "../src/content/articles";
import { categories, staticTeam, staticTestimonials, tags } from "../src/content/people";
import { staticProjects } from "../src/content/projects";
import { staticServices } from "../src/content/services";
import { blocksToDoc, blocksToHtml, plainTextFromHtml } from "../src/lib/blocks";
import { readingMinutes } from "../src/lib/utils";
import type { Locale } from "../src/i18n/routing";

const prisma = new PrismaClient();
const locales: Locale[] = ["fr", "en", "ar"];

const obsoleteArticleSlugs = [
  "comment-choisir-agence-marketing-digital-fes",
  "prix-creation-site-web-maroc",
  "pourquoi-le-seo-est-important-entreprise-marocaine",
  "agence-seo-maroc-guide",
  "attirer-plus-de-clients-grace-au-digital",
];

const obsoleteProjectSlugs = [
  "riad-zellige",
  "atlas-marche",
  "ecole-al-amal",
  "clinique-nahda",
  "maison-noor",
  "nord-logistique",
];

async function main() {
  const email = (process.env.ADMIN_EMAIL || "admin@lyne.studio").toLowerCase();
  const password = process.env.ADMIN_PASSWORD || "ChangeMe-LYNE-2026";
  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: { email, name: "Admin LYNE", passwordHash: await hash(password, 12) },
  });

  await prisma.article.deleteMany({ where: { slug: { in: obsoleteArticleSlugs } } });
  await prisma.project.deleteMany({ where: { slug: { in: obsoleteProjectSlugs } } });
  await prisma.tag.deleteMany({ where: { slug: { in: ["fes", "maroc"] } } });

  const keepProjectSlugs = staticProjects("fr").map((item) => item.slug);
  await prisma.project.deleteMany({ where: { slug: { notIn: keepProjectSlugs } } });
  const keepArticleSlugs = staticArticles.map((item) => item.slug);
  await prisma.article.deleteMany({ where: { slug: { notIn: keepArticleSlugs } } });

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
  }
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: tag,
    });
  }
  const author = await prisma.author.upsert({
    where: { slug: "equipe-lyne" },
    update: { name: "Équipe LYNE", role: "Studio", bio: "Les notes publiées par le studio." },
    create: { name: "Équipe LYNE", slug: "equipe-lyne", role: "Studio", bio: "Les notes publiées par le studio." },
  });

  for (const locale of locales) {
    for (const [index, service] of staticServices(locale).entries()) {
      const data = {
        name: service.name,
        summary: service.summary,
        description: service.description,
        icon: service.icon,
        imageUrl: service.image,
        problem: service.problem,
        solution: service.solution,
        benefits: service.benefits as Prisma.InputJsonValue,
        process: service.process as Prisma.InputJsonValue,
        tools: service.tools as Prisma.InputJsonValue,
        faq: service.faq as Prisma.InputJsonValue,
        sortOrder: index,
        status: "PUBLISHED" as const,
        seoTitle: service.seoTitle,
        seoDescription: service.seoDescription,
      };
      await prisma.service.upsert({
        where: { locale_slug: { locale, slug: service.slug } },
        update: data,
        create: { locale, slug: service.slug, ...data },
      });
    }
    for (const [index, project] of staticProjects(locale).entries()) {
      const data = {
        title: project.title,
        client: project.client,
        category: project.category,
        excerpt: project.excerpt,
        description: project.description,
        coverUrl: project.cover,
        gallery: project.gallery as Prisma.InputJsonValue,
        technologies: project.technologies as Prisma.InputJsonValue,
        objectives: project.objectives as Prisma.InputJsonValue,
        results: project.results as Prisma.InputJsonValue,
        websiteUrl: project.websiteUrl,
        testimonial: project.testimonial,
        status: "PUBLISHED" as const,
        featured: index < 3,
        sortOrder: index,
        seoTitle: project.seoTitle,
        seoDescription: project.seoDescription,
      };
      await prisma.project.upsert({
        where: { locale_slug: { locale, slug: project.slug } },
        update: data,
        create: { locale, slug: project.slug, ...data },
      });
    }
  }

  for (const article of staticArticles) {
    const html = blocksToHtml(article.blocks);
    const category = await prisma.category.findUnique({ where: { slug: categorySlug(article.category) } });
    const tagRecords = await prisma.tag.findMany({ where: { name: { in: article.tags } } });
    const data = {
      title: article.title,
      excerpt: article.excerpt,
      contentJson: blocksToDoc(article.blocks) as Prisma.InputJsonValue,
      contentHtml: html,
      coverUrl: article.cover,
      coverAlt: article.coverAlt,
      categoryId: category?.id,
      authorId: author.id,
      publishedAt: new Date(article.publishedAt),
      readingMinutes: readingMinutes(plainTextFromHtml(html)),
      status: "PUBLISHED" as const,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      focusKeyword: article.focusKeyword,
      faq: article.faq as Prisma.InputJsonValue,
    };
    await prisma.article.upsert({
      where: { locale_slug: { locale: "fr", slug: article.slug } },
      update: { ...data, tags: { set: tagRecords.map((tag) => ({ id: tag.id })) } },
      create: {
        locale: "fr",
        slug: article.slug,
        ...data,
        tags: { connect: tagRecords.map((tag) => ({ id: tag.id })) },
      },
    });
  }

  await prisma.testimonial.deleteMany({});
  for (const [index, item] of staticTestimonials.entries()) {
    await prisma.testimonial.create({
      data: {
        name: item.name,
        company: item.company,
        role: item.role,
        quote: item.quote,
        photoUrl: item.photo,
        rating: item.rating,
        sortOrder: index,
        published: true,
      },
    });
  }

  for (const [index, member] of staticTeam.entries()) {
    const existing = await prisma.teamMember.findFirst({ where: { name: member.name } });
    if (existing) {
      await prisma.teamMember.update({
        where: { id: existing.id },
        data: { role: member.role, bio: member.bio, photoUrl: member.photo, linkedin: member.linkedin, sortOrder: index, active: true },
      });
    } else {
      await prisma.teamMember.create({
        data: {
          name: member.name,
          role: member.role,
          bio: member.bio,
          photoUrl: member.photo,
          linkedin: member.linkedin,
          sortOrder: index,
          active: true,
        },
      });
    }
  }

  await prisma.siteSetting.upsert({ where: { id: "default" }, update: {}, create: { id: "default", visits: 0 } });
}

function categorySlug(name: string) {
  if (name === "Sites web") return "sites-web";
  if (name === "Stratégie") return "strategie";
  if (name === "Guides") return "guides";
  if (name === "SEO") return "seo";
  return name.toLowerCase().replace(/\s+/g, "-");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
