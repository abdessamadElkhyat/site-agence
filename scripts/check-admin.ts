import { PrismaClient } from "@prisma/client";

const url = process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
const direct = process.env.DIRECT_URL || process.env.POSTGRES_URL_NON_POOLING || url;

if (!url) {
  console.error("Missing DATABASE_URL / POSTGRES_PRISMA_URL");
  process.exit(1);
}

process.env.DATABASE_URL = url.replace(/^postgres:\/\//i, "postgresql://");
if (direct) process.env.DIRECT_URL = direct.replace(/^postgres:\/\//i, "postgresql://");

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.adminUser.count();
  const users = await prisma.adminUser.findMany({ select: { email: true, name: true, createdAt: true } });
  const articles = await prisma.article.count();
  console.log(JSON.stringify({ adminCount: count, users, articleCount: articles, dbHost: process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
