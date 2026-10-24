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
  { source: "/realisations/riad-zellige", destination: "/realisations" },
  { source: "/realisations/atlas-marche", destination: "/realisations" },
  { source: "/realisations/ecole-al-amal", destination: "/realisations" },
  { source: "/realisations/nord-logistique", destination: "/realisations" },
  { source: "/realisations/clinique-nahda", destination: "/realisations" },
  { source: "/realisations/maison-noor", destination: "/realisations" },
  { source: "/realisations/velora-hotel", destination: "/realisations" },
  { source: "/realisations/harvest-pantry", destination: "/realisations" },
  { source: "/realisations/brightpath-academy", destination: "/realisations" },
  { source: "/realisations/craftform-studio", destination: "/realisations" },
  { source: "/realisations/clearview-clinic", destination: "/realisations" },
  { source: "/realisations/lumina-interiors", destination: "/realisations" },
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
      { source: `/ar${source}`, destination, permanent: true },
    ]);
  },
};

export default withNextIntl(nextConfig);
