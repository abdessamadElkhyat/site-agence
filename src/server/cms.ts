"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getPrisma } from "@/lib/db";
import { slugify } from "@/lib/utils";

async function db() {
  const session = await auth();
  if (!session?.user) throw new Error("Non autorisé");
  const prisma = getPrisma();
  if (!prisma) throw new Error("Base indisponible");
  return prisma;
}

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function lines(formData: FormData, key: string) {
  return text(formData, key).split("\n").map((line) => line.trim()).filter(Boolean);
}

function pairs(formData: FormData, key: string) {
  return lines(formData, key).map((line) => {
    const [left, ...rest] = line.split("|");
    return { title: (left || "").trim(), text: rest.join("|").trim() };
  }).filter((item) => item.title && item.text);
}

export async function saveCategory(formData: FormData) {
  const prisma = await db();
  const name = text(formData, "name");
  const id = text(formData, "id");
  const data = { name, slug: text(formData, "slug") || slugify(name), description: text(formData, "description") || null };
  if (id) await prisma.category.update({ where: { id }, data });
  else await prisma.category.create({ data });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(formData: FormData) {
  const prisma = await db();
  await prisma.category.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/categories");
}

export async function saveTag(formData: FormData) {
  const prisma = await db();
  const name = text(formData, "name");
  const id = text(formData, "id");
  const data = { name, slug: text(formData, "slug") || slugify(name) };
  if (id) await prisma.tag.update({ where: { id }, data });
  else await prisma.tag.create({ data });
  revalidatePath("/admin/tags");
}

export async function deleteTag(formData: FormData) {
  const prisma = await db();
  await prisma.tag.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/tags");
}

export async function saveAuthor(formData: FormData) {
  const prisma = await db();
  const name = text(formData, "name");
  const id = text(formData, "id");
  const data = { name, slug: text(formData, "slug") || slugify(name), role: text(formData, "role") || null, bio: text(formData, "bio") || null };
  if (id) await prisma.author.update({ where: { id }, data });
  else await prisma.author.create({ data });
  revalidatePath("/admin/authors");
}

export async function deleteAuthor(formData: FormData) {
  const prisma = await db();
  await prisma.author.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/authors");
}

export async function updateReservation(formData: FormData) {
  const prisma = await db();
  await prisma.reservation.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status") as "NEW" | "CONTACTED" | "CONFIRMED" | "CANCELLED" | "COMPLETED" },
  });
  revalidatePath("/admin/reservations");
}

export async function deleteReservation(formData: FormData) {
  const prisma = await db();
  await prisma.reservation.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/reservations");
}

export async function updateMessage(formData: FormData) {
  const prisma = await db();
  await prisma.contactMessage.update({
    where: { id: text(formData, "id") },
    data: { status: text(formData, "status") as "NEW" | "READ" | "IN_PROGRESS" | "DONE" },
  });
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  const prisma = await db();
  await prisma.contactMessage.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/messages");
}

export async function saveTestimonial(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const data = {
    name: text(formData, "name"),
    company: text(formData, "company"),
    role: text(formData, "role") || null,
    quote: text(formData, "quote"),
    photoUrl: text(formData, "photoUrl") || null,
    rating: Number(text(formData, "rating") || 5),
    published: formData.get("published") === "on",
    sortOrder: Number(text(formData, "sortOrder") || 0),
  };
  if (id) await prisma.testimonial.update({ where: { id }, data });
  else await prisma.testimonial.create({ data });
  revalidatePath("/admin/testimonials");
}

export async function deleteTestimonial(formData: FormData) {
  const prisma = await db();
  await prisma.testimonial.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/testimonials");
}

export async function saveTeamMember(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const data = {
    name: text(formData, "name"),
    role: text(formData, "role"),
    bio: text(formData, "bio") || null,
    photoUrl: text(formData, "photoUrl") || null,
    linkedin: text(formData, "linkedin") || null,
    instagram: text(formData, "instagram") || null,
    sortOrder: Number(text(formData, "sortOrder") || 0),
    active: formData.get("active") === "on",
  };
  if (id) await prisma.teamMember.update({ where: { id }, data });
  else await prisma.teamMember.create({ data });
  revalidatePath("/admin/team");
}

export async function deleteTeamMember(formData: FormData) {
  const prisma = await db();
  await prisma.teamMember.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/team");
}

export async function saveService(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const name = text(formData, "name");
  const data = {
    locale: text(formData, "locale") || "fr",
    name,
    slug: text(formData, "slug") || slugify(name),
    summary: text(formData, "summary"),
    description: text(formData, "description"),
    icon: text(formData, "icon") || "Monitor",
    imageUrl: text(formData, "imageUrl") || null,
    problem: text(formData, "problem"),
    solution: text(formData, "solution"),
    benefits: lines(formData, "benefits"),
    tools: lines(formData, "tools"),
    process: pairs(formData, "process"),
    faq: pairs(formData, "faq").map((item) => ({ q: item.title, a: item.text })),
    sortOrder: Number(text(formData, "sortOrder") || 0),
    status: (text(formData, "status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "SCHEDULED",
    seoTitle: text(formData, "seoTitle") || null,
    seoDescription: text(formData, "seoDescription") || null,
  };
  if (id) await prisma.service.update({ where: { id }, data });
  else await prisma.service.create({ data });
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function deleteService(formData: FormData) {
  const prisma = await db();
  await prisma.service.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/services");
}

export async function saveProject(formData: FormData) {
  const prisma = await db();
  const id = text(formData, "id");
  const title = text(formData, "title");
  const data = {
    locale: text(formData, "locale") || "fr",
    title,
    slug: text(formData, "slug") || slugify(title),
    client: text(formData, "client"),
    category: text(formData, "category") || "site-web",
    excerpt: text(formData, "excerpt"),
    description: text(formData, "description"),
    coverUrl: text(formData, "coverUrl") || null,
    gallery: lines(formData, "gallery"),
    technologies: lines(formData, "technologies"),
    objectives: lines(formData, "objectives"),
    results: pairs(formData, "results").map((item) => ({ label: item.title, value: item.text })),
    websiteUrl: text(formData, "websiteUrl") || null,
    testimonial: text(formData, "testimonial") || null,
    featured: formData.get("featured") === "on",
    sortOrder: Number(text(formData, "sortOrder") || 0),
    status: (text(formData, "status") || "PUBLISHED") as "DRAFT" | "PUBLISHED" | "SCHEDULED",
    seoTitle: text(formData, "seoTitle") || null,
    seoDescription: text(formData, "seoDescription") || null,
  };
  if (id) await prisma.project.update({ where: { id }, data });
  else await prisma.project.create({ data });
  revalidatePath("/admin/projects");
  revalidatePath("/realisations");
}

export async function deleteProject(formData: FormData) {
  const prisma = await db();
  await prisma.project.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/projects");
}

export async function deleteArticle(formData: FormData) {
  const prisma = await db();
  await prisma.article.delete({ where: { id: text(formData, "id") } });
  revalidatePath("/admin/articles");
}
