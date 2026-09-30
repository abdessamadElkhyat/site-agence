import { PrismaClient } from "@prisma/client";
import { staticArticles } from "../src/content/articles";
import { staticProjects } from "../src/content/projects";

const prisma = new PrismaClient();

async function main() {
  const projectSlugs = new Set(staticProjects("fr").map((item) => item.slug));
  const articleSlugs = new Set(staticArticles.map((item) => item.slug));

  const oldProjects = await prisma.project.findMany({ select: { id: true, slug: true, client: true } });
  const deleteProjects = oldProjects.filter((item) => !projectSlugs.has(item.slug));
  if (deleteProjects.length) {
    await prisma.project.deleteMany({ where: { id: { in: deleteProjects.map((item) => item.id) } } });
    console.log(
      "Deleted projects:",
      deleteProjects.map((item) => `${item.slug} (${item.client})`).join(", "),
    );
  }

  const oldArticles = await prisma.article.findMany({ select: { id: true, slug: true, title: true } });
  const deleteArticles = oldArticles.filter((item) => !articleSlugs.has(item.slug));
  if (deleteArticles.length) {
    await prisma.article.deleteMany({ where: { id: { in: deleteArticles.map((item) => item.id) } } });
    console.log(
      "Deleted articles:",
      deleteArticles.map((item) => item.slug).join(", "),
    );
  }

  console.log("Done. Projects kept:", [...projectSlugs].join(", "));
  console.log("Articles kept:", [...articleSlugs].join(", "));
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
