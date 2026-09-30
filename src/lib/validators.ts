import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(10).max(4000),
  source: z.string().trim().max(80).optional().or(z.literal("")),
});

export const reservationSchema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(160),
  phone: z.string().trim().min(6).max(40),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  type: z.string().trim().min(1).max(80),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export const newsletterSchema = z.object({
  email: z.string().trim().email().max(160),
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
});

const optionalText = (max: number) =>
  z
    .union([z.string().max(max), z.null(), z.undefined()])
    .transform((value) => value ?? "")
    .optional();

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(180),
  slug: z.string().trim().min(2).max(120),
  excerpt: z.string().trim().min(10).max(400),
  contentJson: z.unknown(),
  contentHtml: z.string().max(200_000),
  coverUrl: optionalText(1000),
  coverAlt: optionalText(180),
  categoryId: optionalText(64),
  tagIds: z.array(z.string()).default([]),
  authorId: optionalText(64),
  status: z.enum(["DRAFT", "PUBLISHED", "SCHEDULED"]),
  publishedAt: optionalText(40),
  seoTitle: optionalText(180),
  seoDescription: optionalText(320),
  focusKeyword: optionalText(80),
  canonicalUrl: optionalText(1000),
  ogTitle: optionalText(180),
  ogDescription: optionalText(320),
  ogImage: optionalText(1000),
  locale: z.enum(["fr", "en", "ar"]).default("fr"),
});
