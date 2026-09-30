import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { routing } from "@/i18n/routing";
import { getSitemapPaths } from "@/lib/sitemap-data";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await getSitemapPaths();

  return paths.flatMap((entry) =>
    routing.locales.map((locale) => ({
      url: `${site.url.replace(/\/$/, "")}${locale === "fr" ? "" : `/${locale}`}${entry.path}`,
      lastModified: entry.lastModified || new Date(),
      changeFrequency: entry.changeFrequency || "monthly",
      priority: entry.priority ?? 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((item) => [
            item,
            `${site.url.replace(/\/$/, "")}${item === "fr" ? "" : `/${item}`}${entry.path}`,
          ]),
        ),
      },
    })),
  );
}
