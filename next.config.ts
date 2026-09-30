import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** Anciens slugs Maroc/Fès → contenus globaux (301). */
const slugRedirects: Array<{ source: string; destination: string }> = [
  {
    source: "/blog/comment-choisir-agence-marketing-digital-fes",
    destination: "/blog/comment-choisir-agence-marketing-digital",
  },
  { source: "/blog/prix-creation-site-web-maroc", destination: "/blog/prix-creation-site-web" },
  {
    source: "/blog/pourquoi-le-seo-est-important-entreprise-marocaine",
    destination: "/blog/pourquoi-le-seo-est-important",
  },
  { source: "/blog/agence-seo-maroc-guide", destination: "/blog/agence-seo-guide" },
  {
    source: "/blog/attirer-plus-de-clients-grace-au-digital",
    destination: "/blog/attirer-clients-digital",
  },
  { source: "/realisations/riad-zellige", destination: "/realisations/velora-hotel" },
  { source: "/realisations/atlas-marche", destination: "/realisations/harvest-pantry" },
  { source: "/realisations/ecole-al-amal", destination: "/realisations/brightpath-academy" },
  { source: "/realisations/nord-logistique", destination: "/realisations/craftform-studio" },
  { source: "/realisations/clinique-nahda", destination: "/realisations/clearview-clinic" },
  { source: "/realisations/maison-noor", destination: "/realisations/lumina-interiors" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async redirects() {
    return slugRedirects.flatMap(({ source, destination }) => [
      { source, destination, permanent: true },
      { source: `/en${source}`, destination: `/en${destination}`, permanent: true },
      { source: `/ar${source}`, destination: `/ar${destination}`, permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
