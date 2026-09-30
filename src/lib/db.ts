import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export function getPrisma() {
  if (!process.env.DATABASE_URL) return null;
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient();
  }
  return globalForPrisma.prisma;
}

export function asStringArray(value: unknown) {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

export function asSteps(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const step = item as { title?: unknown; text?: unknown };
    if (typeof step.title !== "string" || typeof step.text !== "string") return [];
    return [{ title: step.title, text: step.text }];
  });
}

export function asFaq(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const faq = item as { q?: unknown; a?: unknown };
    if (typeof faq.q !== "string" || typeof faq.a !== "string") return [];
    return [{ q: faq.q, a: faq.a }];
  });
}

export function asResults(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const result = item as { label?: unknown; value?: unknown };
    if (typeof result.label !== "string" || typeof result.value !== "string") return [];
    return [{ label: result.label, value: result.value }];
  });
}
