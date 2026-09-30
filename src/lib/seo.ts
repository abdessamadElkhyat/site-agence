import type { Metadata } from "next";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/routing";

export const DEFAULT_OG_IMAGE = "/opengraph-image";

export function absoluteUrl(path = "/") {
  const base = site.url.replace(/\/$/, "");
  if (!path || path === "/") return base;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function localizedPath(path: string, locale: Locale) {
  const suffix = path === "/" ? "" : path;
  return locale === "fr" ? suffix || "/" : `/${locale}${suffix}`;
}

export function alternatesFor(path: string, locale: Locale): Metadata["alternates"] {
  const suffix = path === "/" ? "" : path;
  const fr = suffix || "/";
  return {
    canonical: locale === "fr" ? fr : `/${locale}${suffix}`,
    languages: {
      fr,
      en: `/en${suffix}`,
      ar: `/ar${suffix}`,
      "x-default": fr,
    },
  };
}

export function pageMetadata({
  locale,
  path,
  title,
  description,
  image,
  canonical,
  ogTitle,
  ogDescription,
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  canonical?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  type?: "website" | "article";
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authors?: string[];
}): Metadata {
  const resolvedImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
  const pageUrl = localizedPath(path, locale);
  const alternates = {
    ...alternatesFor(path, locale),
    ...(canonical
      ? { canonical: canonical.startsWith("http") ? canonical : absoluteUrl(canonical) }
      : {}),
  };

  return {
    title,
    description,
    alternates,
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url: pageUrl,
      siteName: site.name,
      locale: locale === "ar" ? "ar" : locale === "en" ? "en_US" : "fr_FR",
      type,
      images: [{ url: resolvedImage, width: 1200, height: 630, alt: ogTitle || title }],
      ...(type === "article"
        ? {
            publishedTime: publishedTime || undefined,
            modifiedTime: modifiedTime || publishedTime || undefined,
            authors: authors?.length ? authors : [site.name],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle || title,
      description: ogDescription || description,
      images: [resolvedImage],
    },
  };
}

export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.legalName,
    url: site.url,
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    telephone: site.phone,
    email: site.email,
    areaServed: "Worldwide",
    priceRange: "$$",
  };
}
